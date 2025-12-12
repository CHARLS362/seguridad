'use server';

/**
 * @fileOverview Simulates a Man-in-the-Middle attack on the Diffie-Hellman key exchange,
 * providing AI-powered guidance on how an attacker might intercept and manipulate the exchange.
 *
 * - simulateManInTheMiddleAttack - A function that simulates the attack and provides AI guidance.
 * - SimulateManInTheMiddleAttackInput - The input type for the simulateManInTheMiddleAttack function.
 * - SimulateManInTheMiddleAttackOutput - The return type for the simulateManInTheMiddleAttack function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SimulateManInTheMiddleAttackInputSchema = z.object({
  p: z.string().describe('The prime number (p) used in Diffie-Hellman.'),
  g: z.string().describe('The generator (g) used in Diffie-Hellman.'),
  alicePrivateKey: z.string().describe('Alice’s private key (a).'),
  bobPrivateKey: z.string().describe('Bob’s private key (b).'),
  attackerKnowledge: z
    .string()
    .optional()
    .describe('Optional information about what the attacker knows.'),
});
export type SimulateManInTheMiddleAttackInput = z.infer<
  typeof SimulateManInTheMiddleAttackInputSchema
>;

const SimulateManInTheMiddleAttackOutputSchema = z.object({
  attackDescription: z
    .string()
    .describe('A detailed description of how the Man-in-the-Middle attack can be performed.'),
  mitigationStrategies: z
    .string()
    .describe('Strategies to mitigate the Man-in-the-Middle attack.'),
});
export type SimulateManInTheMiddleAttackOutput = z.infer<
  typeof SimulateManInTheMiddleAttackOutputSchema
>;

export async function simulateManInTheMiddleAttack(
  input: SimulateManInTheMiddleAttackInput
): Promise<SimulateManInTheMiddleAttackOutput> {
  return simulateManInTheMiddleAttackFlow(input);
}

const simulateManInTheMiddleAttackPrompt = ai.definePrompt({
  name: 'simulateManInTheMiddleAttackPrompt',
  input: {schema: SimulateManInTheMiddleAttackInputSchema},
  output: {schema: SimulateManInTheMiddleAttackOutputSchema},
  prompt: `Eres un experto en ciberseguridad, especializado en ataques Man-in-the-Middle (MitM) en el intercambio de claves de Diffie-Hellman.

Dados los siguientes parámetros de Diffie-Hellman y el conocimiento potencial del atacante, describe cómo se puede ejecutar un ataque MitM y sugiere estrategias de mitigación.

Parámetros de Diffie-Hellman:
Primo (p): {{{p}}}
Generador (g): {{{g}}}
Clave Privada de Alice (a): {{{alicePrivateKey}}}
Clave Privada de Bob (b): {{{bobPrivateKey}}}
Conocimiento del Atacante (si lo hay): {{{attackerKnowledge}}}

Proporciona una descripción detallada del ataque, incluyendo los pasos que un atacante tomaría para interceptar y manipular el intercambio de claves. Además, sugiere estrategias para prevenir dicho ataque, como el uso de firmas digitales o protocolos de intercambio de claves autenticados.

Descripción del Ataque:

Estrategias de Mitigación:
`,
});

const simulateManInTheMiddleAttackFlow = ai.defineFlow(
  {
    name: 'simulateManInTheMiddleAttackFlow',
    inputSchema: SimulateManInTheMiddleAttackInputSchema,
    outputSchema: SimulateManInTheMiddleAttackOutputSchema,
  },
  async input => {
    const {output} = await simulateManInTheMiddleAttackPrompt(input);
    return output!;
  }
);
