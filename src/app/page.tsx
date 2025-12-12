import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import KeyExchangeSimulator from "@/components/key-exchange-simulator";
import AttackSimulation from "@/components/attack-simulation";
import { Shield, Bot } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-10">
          <h1 className="text-4xl font-bold tracking-tight text-primary font-headline sm:text-5xl lg:text-6xl glow-primary">
            Simulador de Intercambio de Claves
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Una herramienta interactiva para visualizar el algoritmo de intercambio de claves de Diffie-Hellman y explorar sus vulnerabilidades con información impulsada por IA.
          </p>
        </header>
        <main>
          <Tabs defaultValue="simulation" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto bg-card border">
              <TabsTrigger value="simulation">
                <Shield className="mr-2 h-4 w-4" />
                Simulación DH
              </TabsTrigger>
              <TabsTrigger value="attack">
                <Bot className="mr-2 h-4 w-4" />
                Ataque MitM con IA
              </TabsTrigger>
            </TabsList>
            <TabsContent value="simulation" className="mt-8">
              <KeyExchangeSimulator />
            </TabsContent>
            <TabsContent value="attack" className="mt-8">
              <AttackSimulation />
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}
