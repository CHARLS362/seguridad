"use client";

import { useState, useEffect } from "react";
import { useFirestore } from "@/firebase/provider";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Users, Loader2 } from "lucide-react";
import RealtimeSimulator from "./realtime-simulator";
import { useToast } from "@/hooks/use-toast";

export default function ExchangeRoom() {
  const { toast } = useToast();
  const firestore = useFirestore();
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);
  const [role, setRole] = useState<"creator" | "joiner" | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // Generate a simple, anonymous user ID for the session.
    if (!userId) {
      setUserId(`user_${Math.random().toString(36).substring(2, 10)}`);
    }
  }, [userId]);

  const handleCreateRoom = async () => {
    if (!firestore || !userId) return;
    setIsLoading(true);
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    try {
      const roomRef = doc(firestore, "rooms", newRoomId);
      await setDoc(roomRef, {
        id: newRoomId,
        creatorId: userId,
        joinerId: null,
        step: 0,
        params: null,
        alice: { id: userId, privateKey: null, publicKey: null, sharedKey: null },
        bob: { id: null, privateKey: null, publicKey: null, sharedKey: null },
        createdAt: new Date(),
      });
      setRole("creator");
      setJoinedRoom(newRoomId);
    } catch (error) {
      console.error("Error creating room:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo crear la sala. Por favor, inténtalo de nuevo.",
      });
    } finally {
        setIsLoading(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!roomId || !firestore || !userId) return;
    setIsLoading(true);
    try {
      const roomRef = doc(firestore, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);

      if (roomSnap.exists()) {
        const roomData = roomSnap.data();
        // Prevent original creator from re-joining as joiner
        if (roomData.creatorId === userId) {
             toast({
                variant: "destructive",
                title: "Error",
                description: "Ya eres el creador de esta sala.",
            });
            setIsLoading(false);
            return;
        }

        // Assign the joiner ID if the spot is open
        if (!roomData.joinerId) {
            await setDoc(roomRef, { 
                joinerId: userId,
                'bob.id': userId
            }, { merge: true });
        } else if (roomData.joinerId !== userId) {
            toast({
                variant: "destructive",
                title: "Sala Llena",
                description: "Esta sala de intercambio ya está ocupada.",
            });
            setIsLoading(false);
            return;
        }
        
        setRole("joiner");
        setJoinedRoom(roomId);
      } else {
        toast({
            variant: "destructive",
            title: "Error",
            description: "La sala no existe. Verifica la ID e inténtalo de nuevo.",
        });
      }
    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "No se pudo unir a la sala. Por favor, inténtalo de nuevo.",
      });
    } finally {
        setIsLoading(false);
    }
  };
  
  const handleLeaveRoom = () => {
    setJoinedRoom(null);
    setRole(null);
    setRoomId("");
  }


  if (joinedRoom && role && userId) {
    return (
        <RealtimeSimulator 
            roomId={joinedRoom} 
            role={role}
            userId={userId}
            onLeave={handleLeaveRoom}
        />
    );
  }


  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><KeyRound/> Crear Sala Nueva</CardTitle>
                <CardDescription>Genera una nueva sala e invita a alguien a unirse.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button onClick={handleCreateRoom} className="w-full" disabled={isLoading}>
                    {isLoading ? <Loader2 className="animate-spin"/> : "Crear Sala"}
                </Button>
            </CardContent>
        </Card>
         <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><Users/> Unirse a una Sala</CardTitle>
                <CardDescription>Ingresa la ID de una sala existente para unirte.</CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
                <Input 
                    placeholder="ID de la Sala" 
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value.toUpperCase())}
                    disabled={isLoading}
                />
                <Button onClick={handleJoinRoom} disabled={isLoading || !roomId}>
                    {isLoading ? <Loader2 className="animate-spin"/> : "Unirse"}
                </Button>
            </CardContent>
        </Card>
    </div>
  );
}
