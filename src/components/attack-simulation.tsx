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
  p: z.string().min(1, "Prime (p) is required."),
  g: z.string().min(1, "Generator (g) is required."),
  alicePrivateKey: z.string().min(1, "Alice's private key is required."),
  bobPrivateKey: z.string().min(1, "Bob's private key is required."),
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
      attackerKnowledge: "Attacker can intercept and modify all messages between Alice and Bob.",
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
      setError("An error occurred while communicating with the AI. Please try again.");
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card className="max-w-4xl mx-auto border-primary/20">
      <CardHeader>
        <CardTitle>Man-in-the-Middle (MitM) Attack Simulation</CardTitle>
        <CardDescription>
          Use the AI to understand how an attacker could exploit the Diffie-Hellman exchange without authentication.
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
                    <FormLabel>Prime (p)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 23" {...field} />
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
                    <FormLabel>Generator (g)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 5" {...field} />
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
                    <FormLabel>Alice's Private Key (a)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 6" {...field} />
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
                    <FormLabel>Bob's Private Key (b)</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 15" {...field} />
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
                    <FormLabel>Attacker's Capabilities</FormLabel>
                    <FormControl>
                      <Input placeholder="Describe what the attacker can do" {...field} />
                    </FormControl>
                     <FormDescription>
                      Provide context for the AI, e.g., "Attacker knows p and g."
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Simulating Attack...
                </>
              ) : (
                "Run AI Simulation"
              )}
            </Button>
          </form>
        </Form>

        {error && (
            <Alert variant="destructive" className="mt-6">
                <TriangleAlert className="h-4 w-4" />
                <AlertTitle>Simulation Failed</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        )}

        {result && (
          <div className="mt-8 space-y-6">
            <Alert variant="destructive">
              <TriangleAlert className="h-4 w-4" />
              <AlertTitle>Attack Scenario</AlertTitle>
              <AlertDescription className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.attackDescription.replace(/\n/g, '<br />') }}/>
            </Alert>
            <Alert>
              <Lightbulb className="h-4 w-4" />
              <AlertTitle>Mitigation Strategies</AlertTitle>
              <AlertDescription className="prose prose-sm prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: result.mitigationStrategies.replace(/\n/g, '<br />') }} />
            </Alert>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
