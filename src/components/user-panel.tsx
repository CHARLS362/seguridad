"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, KeyRound, Lock, ShieldCheck, SquareArrowOutUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { power } from "@/lib/dh-constants";

const ValueDisplay = ({ label, value, icon, isPrivate, isShared, step, requiredStep }: { label: string, value: string | null, icon: React.ReactNode, isPrivate?: boolean, isShared?: boolean, step: number, requiredStep: number }) => (
    <div className={cn("space-y-1 transition-opacity duration-500", step >= requiredStep ? "opacity-100" : "opacity-30")}>
        <label className="text-sm font-medium text-muted-foreground flex items-center">{icon} {label}</label>
        <div className={cn(
            "w-full p-2 rounded-md font-mono text-xs break-all overflow-x-auto border",
            isPrivate ? "bg-destructive/10 border-destructive/20 text-destructive-foreground" : "bg-muted/50",
            isShared && value ? "bg-accent/10 border-accent/20 text-accent glow-accent" : "",
            !value && "text-muted-foreground italic"
        )}>
            {value || "..."}
        </div>
    </div>
);

type UserPanelProps = {
    name: "Alice" | "Bob";
    params: { p: bigint; g: bigint } | null;
    userState: {
        privateKey: bigint | null;
        publicKey: bigint | null;
        sharedKey: bigint | null;
    };
    onGenerate: () => void;
    canGenerate: boolean;
    receivedPublicKey: bigint | null;
    step: number;
};

export default function UserPanel({ name, params, userState, onGenerate, canGenerate, receivedPublicKey, step }: UserPanelProps) {
    const { privateKey, publicKey, sharedKey } = userState;
    const canCalculatePublic = !!privateKey;
    
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <User className="w-6 h-6 text-primary" />
                    {name}
                </CardTitle>
                <CardDescription>
                    Perspectiva de {name} en el intercambio de claves.
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <Button onClick={onGenerate} disabled={!canGenerate || !!privateKey} className="w-full">
                    <Lock className="mr-2 h-4 w-4" />
                    {privateKey ? "Clave Privada Generada" : "Generar Clave Privada"}
                </Button>

                <div className="space-y-4 pt-4">
                    <ValueDisplay
                        label="Clave Privada"
                        value={privateKey?.toString() ?? null}
                        icon={<Lock className="w-4 h-4 mr-2" />}
                        isPrivate
                        step={step}
                        requiredStep={2}
                    />
                    <ValueDisplay
                        label="Clave Pública (Calculada)"
                        value={canCalculatePublic && params && privateKey ? (power(params.g, privateKey, params.p)).toString() : null}
                        icon={<KeyRound className="w-4 h-4 mr-2" />}
                        step={step}
                        requiredStep={3}
                    />
                     <ValueDisplay
                        label={`Clave Pública Recibida (de ${name === 'Alice' ? 'Bob' : 'Alice'})`}
                        value={receivedPublicKey?.toString() ?? null}
                        icon={<SquareArrowOutUpRight className="w-4 h-4 mr-2" />}
                        step={step}
                        requiredStep={3}
                    />
                    <ValueDisplay
                        label="Secreto Compartido (Calculado)"
                        value={sharedKey?.toString() ?? null}
                        icon={<ShieldCheck className="w-4 h-4 mr-2" />}
                        isShared
                        step={step}
                        requiredStep={4}
                    />
                </div>
            </CardContent>
        </Card>
    );
}
