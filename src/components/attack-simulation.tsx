"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { simulateManInTheMiddleAttack, SimulateManInTheMiddleAttackOutput } from "@/ai/flows/simulate-man-in-the-middle-attack";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Lightbulb, TriangleAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const formSchema = z.object({
  p: z.string().min(1, "El número primo (p) es obligatorio."),
  g: z.string().min(1, "El generador (g) es obligatorio."),
  alicePrivateKey: z.string().min(1, "La clave privada de Alice es obligatoria."),
  bobPrivateKey: z.string().min(1, "La clave privada de Bob es obligatoria."),
  attackerKnowledge: z.string().optional(),
});

type AttackSimulationForm = z.infer<typeof formSchema>;

export default function AttackSimulation() {
  const [result, setResult] = useState<SimulateManInTheMiddleAttackOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<AttackSimulationForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      p: "23",
      g: "5",
      alicePrivateKey: "",
      bobPrivateKey: "",
      attackerKnowledge: "El atacante puede interceptar y modificar todos los mensajes entre Alice y Bob.",
    },
  });

  async function onSubmit(values: AttackSimulationForm) {
    setIsLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await simulateManInTheMiddleAttack(values);
      setResult(response);
    } catch (e) {
      setError("Ocurrió un error al comunicarse con la IA. Por favor, inténtalo de nuevo.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto border-primary/20">
      <CardHeader>
        <CardTitle>Simulación de Ataque Man-in-the-Middle (MitM)</CardTitle>
        <CardDescription>
          Usa la IA para entender cómo un atacante podría explotar el intercambio Diffie-Hellman sin autenticación.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="p"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Primo (p)</FormLabel>
                    <FormControl>
                      <Input placeholder="ej., 23" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="g"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Generador (g)</FormLabel>
                    <FormControl>
                      <Input placeholder="ej., 5" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="alicePrivateKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clave Privada de Alice (a)</FormLabel>
                    <FormControl>
                      <Input placeholder="ej., 6" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="bobPrivateKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Clave Privada de Bob (b)</FormLabel>
                    <FormControl>
                      <Input placeholder="ej., 15" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="attackerKnowledge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Capacidades del Atacante</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe qué puede hacer el atacante" {...field} />
                    </FormControl>
                     <FormDescription>
                      Proporciona contexto para la IA, ej., "El atacante conoce p y g."
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulando Ataque...
                </>
              ) : (
                "Ejecutar Simulación con IA"
              )}
            </Button>
          </form>
        </Form>

        {error && (
            <Alert variant="destructive" className="mt-6">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Falló la Simulación</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Escenario de Ataque</AlertTitle>
              <AlertDescription className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.attackDescription.replace(/\n/g, '<br />') }}/>
            </Alert>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Estrategias de Mitigación</AlertTitle>
              <AlertDescription className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.mitigationStrategies.replace(/\n/g, '<br />') }} />
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
