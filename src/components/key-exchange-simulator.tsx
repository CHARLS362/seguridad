"use client";

import React, { useReducer } from "react";
import { DH_PARAMS, DHParams, generatePrivateKey, power } from "@/lib/dh-constants";
import UserPanel from "./user-panel";
import TimelineAnimation from "./timeline-animation";
import { Button } from "./ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Copy, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type UserState = {
  privateKey: bigint | null;
  publicKey: bigint | null;
  sharedKey: bigint | null;
};

type State = {
  params: DHParams | null;
  alice: UserState;
  bob: UserState;
  step: number;
};

type Action =
  | { type: "SET_PARAMS"; payload: DHParams }
  | { type: "GENERATE_ALICE_PRIVATE_KEY" }
  | { type: "GENERATE_BOB_PRIVATE_KEY" }
  | { type: "CALCULATE_PUBLIC_KEYS" }
  | { type: "CALCULATE_SHARED_KEYS" }
  | { type: "RESET" };

const initialState: State = {
  params: null,
  alice: { privateKey: null, publicKey: null, sharedKey: null },
  bob: { privateKey: null, publicKey: null, sharedKey: null },
  step: 0,
};

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PARAMS":
      return { ...initialState, params: action.payload, step: 1 };
    case "GENERATE_ALICE_PRIVATE_KEY":
      if (!state.params) return state;
      const alicePrivKey = generatePrivateKey(state.params.p);
      return { ...state, alice: { ...state.alice, privateKey: alicePrivKey }, step: Math.max(state.step, 2) };
    case "GENERATE_BOB_PRIVATE_KEY":
      if (!state.params) return state;
      const bobPrivKey = generatePrivateKey(state.params.p);
      return { ...state, bob: { ...state.bob, privateKey: bobPrivKey }, step: Math.max(state.step, 2) };
    case "CALCULATE_PUBLIC_KEYS":
        if (!state.params || !state.alice.privateKey || !state.bob.privateKey) return state;
        const alicePubKey = power(state.params.g, state.alice.privateKey, state.params.p);
        const bobPubKey = power(state.params.g, state.bob.privateKey, state.params.p);
        return { ...state, alice: {...state.alice, publicKey: alicePubKey}, bob: {...state.bob, publicKey: bobPubKey}, step: 3 };
    case "CALCULATE_SHARED_KEYS":
        if (!state.params || !state.alice.privateKey || !state.bob.publicKey || !state.bob.privateKey || !state.alice.publicKey) return state;
        const aliceSharedKey = power(state.bob.publicKey, state.alice.privateKey, state.params.p);
        const bobSharedKey = power(state.alice.publicKey, state.bob.privateKey, state.params.p);
        return { ...state, alice: {...state.alice, sharedKey: aliceSharedKey}, bob: {...state.bob, sharedKey: bobSharedKey}, step: 4 };
    case "RESET":
      return initialState;
    default:
      return state;
  }
}

export default function KeyExchangeSimulator() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const { toast } = useToast();

  const handleSetParams = (paramName: string) => {
    const params = DH_PARAMS.find(p => p.name === paramName);
    if (params) {
      dispatch({ type: "SET_PARAMS", payload: params });
    }
  };
  
  const handleGenerateAlice = () => dispatch({ type: 'GENERATE_ALICE_PRIVATE_KEY' });
  const handleGenerateBob = () => dispatch({ type: 'GENERATE_BOB_PRIVATE_KEY' });
  const handleExchange = () => {
    dispatch({ type: 'CALCULATE_PUBLIC_KEYS' });
    setTimeout(() => dispatch({ type: 'CALCULATE_SHARED_KEYS' }), 100);
  };
  const handleReset = () => dispatch({ type: 'RESET' });

  const handleCopyLog = () => {
    const replacer = (key: any, value: any) =>
      typeof value === 'bigint' ? value.toString() : value;
    const log = JSON.stringify(state, replacer, 2);
    navigator.clipboard.writeText(log);
    toast({
      title: "Registro Copiado",
      description: "El registro de la simulación ha sido copiado a tu portapapeles.",
    });
  }

  const canGenerate = state.step >= 1;
  const canExchange = !!state.alice.privateKey && !!state.bob.privateKey;
  const isFinished = state.step >= 4;
  const keysMatch = isFinished && state.alice.sharedKey === state.bob.sharedKey;

  return (
    <div className="space-y-8">
      <Card className="border-primary/20">
        <CardHeader>
          <CardTitle>1. Configuración</CardTitle>
          <CardDescription>Selecciona los parámetros públicos (p y g) para comenzar la simulación.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col sm:flex-row items-center gap-4">
            <Select onValueChange={handleSetParams} value={state.params?.name}>
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
            <Button onClick={handleReset} variant="destructive">
                <RefreshCw className="mr-2 h-4 w-4" /> Reiniciar
            </Button>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <UserPanel
            name="Alice"
            params={state.params}
            userState={state.alice}
            onGenerate={handleGenerateAlice}
            canGenerate={canGenerate}
            receivedPublicKey={state.bob.publicKey}
            step={state.step}
        />
        <UserPanel
            name="Bob"
            params={state.params}
            userState={state.bob}
            onGenerate={handleGenerateBob}
            canGenerate={canGenerate}
            receivedPublicKey={state.alice.publicKey}
            step={state.step}
        />
      </div>

      <TimelineAnimation 
        state={state}
        onExchange={handleExchange}
        canExchange={canExchange}
        keysMatch={keysMatch}
      />

    </div>
  );
}
