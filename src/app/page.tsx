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
            Key Exchange Simulator
          </h1>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            An interactive tool to visualize the Diffie-Hellman key exchange algorithm and explore its vulnerabilities with AI-powered insights.
          </p>
        </header>
        <main>
          <Tabs defaultValue="simulation" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-lg mx-auto bg-card border">
              <TabsTrigger value="simulation">
                <Shield className="mr-2 h-4 w-4" />
                DH Simulation
              </TabsTrigger>
              <TabsTrigger value="attack">
                <Bot className="mr-2 h-4 w-4" />
                MitM Attack AI
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
