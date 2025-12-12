"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, Users } from "lucide-react";

export default function ExchangeRoom() {
  const [roomId, setRoomId] = useState("");
  const [joinedRoom, setJoinedRoom] = useState<string | null>(null);

  const handleCreateRoom = async () => {
    // Lógica para crear sala en Firebase
    const newRoomId = Math.random().toString(36).substring(2, 8).toUpperCase();
    setJoinedRoom(newRoomId);
  };

  const handleJoinRoom = async () => {
    if (roomId) {
        // Lógica para unirse a sala en Firebase
        setJoinedRoom(roomId);
    }
  };

  if (joinedRoom) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Sala de Intercambio: {joinedRoom}</CardTitle>
                <CardDescription>
                    Comparte esta ID con otro usuario para comenzar el intercambio.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>El simulador de intercambio en tiempo real aparecerá aquí.</p>
            </CardContent>
        </Card>
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
                <Button onClick={handleCreateRoom} className="w-full">Crear Sala</Button>
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
                />
                <Button onClick={handleJoinRoom}>Unirse</Button>
            </CardContent>
        </Card>
    </div>
  );
}
