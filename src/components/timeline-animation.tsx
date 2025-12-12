"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { ArrowRight, CheckCircle, KeyRound, Lock, Send, Users, XCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const TimelineItem = ({ icon, title, description, children, isVisible }: { icon: React.ReactNode, title: string, description?: string, children?: React.ReactNode, isVisible: boolean }) => (
    <div className={cn("flex gap-4 transition-opacity duration-500", isVisible ? "opacity-100" : "opacity-0 h-0 invisible")}>
        <div className="flex flex-col items-center">
            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                {icon}
            </div>
            <div className="flex-grow w-px bg-border my-2"></div>
        </div>
        <div className="pb-8 flex-grow">
            <h3 className="font-semibold">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {children}
        </div>
    </div>
);

const FinalTimelineItem = ({ icon, title, description, children, isVisible }: { icon: React.ReactNode, title: string, description?: string, children?: React.ReactNode, isVisible: boolean }) => (
    <div className={cn("flex gap-4 transition-opacity duration-500", isVisible ? "opacity-100" : "opacity-0 h-0 invisible")}>
        <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            {icon}
        </div>
        <div className="pb-8 flex-grow">
            <h3 className="font-semibold">{title}</h3>
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
            {children}
        </div>
    </div>
);

const KeyPacket = ({ from, to, value }: { from: string, to: string, value: string }) => (
    <div className="mt-2 p-3 rounded-md bg-card border flex items-center gap-3 animate-fade-in-up">
        <div className="w-8 h-8 rounded-full bg-secondary text-secondary-foreground flex items-center justify-center">
            <KeyRound className="w-4 h-4" />
        </div>
        <div className="flex-grow">
            <div className="text-xs text-muted-foreground">{from} a {to}</div>
            <p className="font-mono text-xs break-all">{value}</p>
        </div>
        <Send className="w-5 h-5 text-primary" />
    </div>
);

export default function TimelineAnimation({ state, onExchange, canExchange, keysMatch }: { state: any, onExchange: () => void, canExchange: boolean, keysMatch: boolean | null }) {
    const { step, params, alice, bob } = state;

    return (
        <Card className="border-primary/20">
            <CardHeader>
                <CardTitle>2. Línea de Tiempo del Intercambio</CardTitle>
                <CardDescription>Sigue el proceso de intercambio de claves paso a paso.</CardDescription>
            </CardHeader>
            <CardContent>
                {step === 0 && <p className="text-muted-foreground text-center py-8">Selecciona los parámetros DH para comenzar.</p>}
                
                <div className="relative">
                    <TimelineItem
                        isVisible={step >= 1}
                        icon={<Users className="w-6 h-6" />}
                        title="Acordar Parámetros Públicos"
                        description="Alice y Bob acuerdan públicamente un primo grande (p) y un generador (g)."
                    >
                         <div className="mt-2 space-y-2 font-mono text-xs">
                           <p>p = {params?.p.toString() || '...'}</p>
                           <p>g = {params?.g.toString() || '...'}</p>
                        </div>
                    </TimelineItem>

                     <TimelineItem
                        isVisible={step >= 2}
                        icon={<Lock className="w-6 h-6" />}
                        title="Generar Claves Privadas"
                        description="Cada parte genera en secreto su propio número privado."
                    >
                        <div className="mt-2 text-xs">
                            <p>La clave privada de Alice (a) y la clave privada de Bob (b) se mantienen en secreto.</p>
                        </div>
                    </TimelineItem>

                    <TimelineItem
                        isVisible={step >= 2 && canExchange}
                        icon={<Send className="w-6 h-6" />}
                        title="Intercambiar Claves Públicas"
                        description="Alice y Bob calculan e intercambian sus claves públicas. Haz clic para proceder."
                    >
                        <Button onClick={onExchange} disabled={step >= 3} className="mt-4">
                            Intercambiar Claves <ArrowRight className="ml-2 w-4 h-4" />
                        </Button>
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                            {step >= 3 && alice.publicKey && (
                                <KeyPacket from="Alice" to="Bob" value={alice.publicKey.toString()} />
                            )}
                             {step >= 3 && bob.publicKey && (
                                <KeyPacket from="Bob" to="Alice" value={bob.publicKey.toString()} />
                            )}
                        </div>
                    </TimelineItem>
                    
                    <FinalTimelineItem
                        isVisible={step >= 4}
                        icon={keysMatch ? <CheckCircle className="w-6 h-6 text-green-500" /> : <XCircle className="w-6 h-6 text-red-500" />}
                        title="Calcular Secreto Compartido"
                        description="Cada parte usa la clave pública del otro y su propia clave privada para calcular el mismo secreto compartido."
                    >
                        {keysMatch ? (
                             <div className="mt-2 p-4 rounded-lg bg-green-500/10 text-green-400 border border-green-500/20">
                                <h4 className="font-bold">¡Éxito! Las claves compartidas coinciden.</h4>
                                <p className="text-sm mt-1">Tanto Alice como Bob han calculado independientemente la misma clave secreta sin transmitirla directamente.</p>
                                <p className="font-mono text-xs mt-2 break-all">Clave Compartida = {alice.sharedKey?.toString()}</p>
                            </div>
                        ) : (
                             <div className="mt-2 p-4 rounded-lg bg-red-500/10 text-red-400 border border-red-500/20">
                                <h4 className="font-bold">¡Las claves no coinciden!</h4>
                                <p className="text-sm mt-1">Hubo un error en el cálculo.</p>
                            </div>
                        )}
                    </FinalTimelineItem>
                </div>
            </CardContent>
        </Card>
    );
}
