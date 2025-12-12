"use client";

import React, { useEffect, useState } from "react";
import { useFirestore } from "@/firebase/provider";
import { doc, onSnapshot, setDoc } from "firebase/firestore";
import { DH_PARAMS, DHParams, generatePrivateKey, power } from "@/lib/dh-constants";
import UserPanel from "./user-panel";
import TimelineAnimation from "./timeline-animation";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Copy, RefreshCw, LogOut, Users, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "./ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "./ui/alert";

type UserState = {
  id: string | null;
  privateKey: bigint | null;
  publicKey: bigint | null;
  sharedKey: bigint | null;
};

type RoomState = {
  id: string;
  creatorId: string;
  joinerId: string | null;
  params: DHParams | null;
  alice: UserState;
  bob: UserState;
  step: number;
};

type RealtimeSimulatorProps = {
  roomId: string;
  role: "creator" | "joiner";
  userId: string;
  onLeave: () => void;
};

function bigintReplacer(key: any, value: any) {  
    if (typeof value === 'bigint') {  
        return value.toString();  
    }  
    return value;  
}

function bigintReviver(key: string, value: any): any {
    if (typeof value === 'string' && /^\d+n$/.test(value)) {
        return BigInt(value.slice(0, -1));
    }
    if (key === 'p' || key === 'g' || key === 'privateKey' || key === 'publicKey' || key === 'sharedKey') {
       if (value && typeof value === 'string' && /^\d+$/.test(value)) {
            try {
                return BigInt(value);
            } catch (e) {
                // Not a bigint, return original value
                return value;
            }
       }
    }
    return value;
}

export default function RealtimeSimulator({ roomId, role, userId, onLeave }: RealtimeSimulatorProps) {
  const firestore = useFirestore();
  const [state, setState] = useState<RoomState | null>(null);
  const { toast } = useToast();

  const isCreator = role === "creator";
  const currentUserRole = isCreator ? "alice" : "bob";
  const otherUserRole = isCreator ? "bob" : "alice";

  useEffect(() => {
    if (!firestore || !roomId) return;
    const roomRef = doc(firestore, "rooms", roomId);
    const unsubscribe = onSnapshot(roomRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data();
        // We need to manually revive BigInts from string representation
        const jsonString = JSON.stringify(data, bigintReplacer);
        const revivedData = JSON.parse(jsonString, bigintReviver);
        setState(revivedData as RoomState);
      } else {
        toast({
          variant: "destructive",
          title: "Sala no encontrada",
          description: "La sala de intercambio ha sido eliminada o no existe.",
        });
        onLeave();
      }
    });
    return () => unsubscribe();
  }, [firestore, roomId, onLeave, toast]);

  const updateState = async (newState: Partial<RoomState>) => {
    if (!firestore) return;
    const roomRef = doc(firestore, "rooms", roomId);
    
    const sanitizedState = JSON.parse(JSON.stringify(newState, bigintReplacer));

    await setDoc(roomRef, sanitizedState, { merge: true });
  };

  const handleSetParams = (paramName: string) => {
    const params = DH_PARAMS.find(p => p.name === paramName);
    if (params) {
      updateState({ params, step: 1 });
    }
  };

  const handleGenerateKey = () => {
    if (!state?.params) return;
    const privateKey = generatePrivateKey(state.params.p);
    
    const userUpdate = { privateKey };
    
    if (isCreator) {
        updateState({ alice: { ...state.alice, ...userUpdate }, step: Math.max(state.step, 2) });
    } else {
        updateState({ bob: { ...state.bob, ...userUpdate }, step: Math.max(state.step, 2) });
    }
  };
  
  const handleExchange = () => {
    if (!state?.params || !state.alice.privateKey || !state.bob.privateKey) return;
    
    const alicePubKey = power(state.params.g, state.alice.privateKey, state.params.p);
    const bobPubKey = power(state.params.g, state.bob.privateKey, state.params.p);

    const aliceSharedKey = power(bobPubKey, state.alice.privateKey, state.params.p);
    const bobSharedKey = power(alicePubKey, state.bob.privateKey, state.params.p);
    
    updateState({
        alice: { ...state.alice, publicKey: alicePubKey, sharedKey: aliceSharedKey },
        bob: { ...state.bob, publicKey: bobPubKey, sharedKey: bobSharedKey },
        step: 4
    });
  };

  const handleReset = () => {
    if (!firestore || !userId) return;
    updateState({
        step: 0,
        params: null,
        alice: { id: isCreator ? userId : state?.alice.id ?? null, privateKey: null, publicKey: null, sharedKey: null },
        bob: { id: !isCreator ? userId : state?.bob.id ?? null, privateKey: null, publicKey: null, sharedKey: null },
    });
  };

  const handleCopyLog = () => {
    const log = JSON.stringify(state, bigintReplacer, 2);
    navigator.clipboard.writeText(log);
    toast({
      title: "Registro Copiado",
      description: "El registro de la simulación ha sido copiado a tu portapapeles.",
    });
  };

  if (!state) {
    return (
        <div className="space-y-8">
            <Card>
                <CardHeader><Skeleton className="h-8 w-1/2" /></CardHeader>
                <CardContent><Skeleton className="h-10 w-full" /></CardContent>
            </Card>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
                <Card><CardContent className="p-6"><Skeleton className="h-48 w-full" /></CardContent></Card>
            </div>
        </div>
    );
  }
  
  const canGenerate = state.step >= 1 && state[currentUserRole]?.privateKey === null && state.joinerId !== null;
  const canCreatorSetParams = isCreator && state.step === 0;
  const canExchange = !!state.alice.privateKey && !!state.bob.privateKey && state.step < 3;
  const isFinished = state.step >= 4;
  const keysMatch = isFinished && state.alice.sharedKey === state.bob.sharedKey;
  
  const otherParticipantJoined = state.joinerId !== null;

  return (
    <div className="space-y-8">
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div>
              <CardTitle className="flex items-center gap-3">
                <Users className="text-primary"/> Sala de Intercambio: {roomId}
              </CardTitle>
              <CardDescription>
                El intercambio se sincroniza en tiempo real. Eres {isCreator ? "Alice (Creador)" : "Bob (Invitado)"}.
              </CardDescription>
            </div>
            <Button onClick={onLeave} variant="outline" size="sm"><LogOut className="mr-2"/> Salir</Button>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Select onValueChange={handleSetParams} value={state.params?.name} disabled={!isCreator || state.step > 0}>
                <SelectTrigger className="w-full sm:w-[280px]">
                    <SelectValue placeholder="Seleccionar Parámetros DH (p, g)" />
                </SelectTrigger>
                <SelectContent>
                    {DH_PARAMS.map(p => (
                        <SelectItem key={p.name} value={p.name}>{p.name} ({p.bits}-bit)</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <div className="flex-grow" />
             <Button onClick={handleCopyLog} variant="outline" disabled={state.step === 0}>
                <Copy className="mr-2 h-4 w-4" /> Copiar Registro
            </Button>
            <Button onClick={handleReset} variant="destructive" disabled={!isCreator}>
                <RefreshCw className="mr-2 h-4 w-4" /> Reiniciar
            </Button>
        </CardContent>
         {!otherParticipantJoined && (
            <CardContent>
                 <Alert variant="default" className="bg-primary/10 border-primary/20">
                    <Users className="h-4 w-4" />
                    <AlertTitle>Esperando a otro participante</AlertTitle>
                    <AlertDescription>
                        Comparte la ID de la sala <code className="font-bold text-primary">{roomId}</code> para que alguien se una.
                    </AlertDescription>
                </Alert>
            </CardContent>
        )}
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserPanel
            name="Alice"
            params={state.params}
            userState={state.alice}
            onGenerate={handleGenerateKey}
            canGenerate={isCreator && canGenerate}
            receivedPublicKey={state.bob.publicKey}
            step={state.step}
        />
        <UserPanel
            name="Bob"
            params={state.params}
            userState={state.bob}
            onGenerate={handleGenerateKey}
            canGenerate={!isCreator && canGenerate}
            receivedPublicKey={state.alice.publicKey}
            step={state.step}
        />
      </div>

      <TimelineAnimation 
        state={state}
        onExchange={handleExchange}
        canExchange={isCreator && canExchange}
        keysMatch={keysMatch}
      />
    </div>
  );
}
