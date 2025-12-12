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
  prompt: `You are an expert in cybersecurity, specializing in Man-in-the-Middle (MitM) attacks on Diffie-Hellman key exchange.

Given the following Diffie-Hellman parameters and potential attacker knowledge, describe how a MitM attack can be executed and suggest mitigation strategies.

Diffie-Hellman Parameters:
Prime (p): {{{p}}}
Generator (g): {{{g}}}
Alice's Private Key (a): {{{alicePrivateKey}}}
Bob's Private Key (b): {{{bobPrivateKey}}}
Attacker Knowledge (if any): {{{attackerKnowledge}}}

Provide a detailed attack description, including the steps an attacker would take to intercept and manipulate the key exchange. Also, suggest strategies to prevent such an attack, such as using digital signatures or authenticated key exchange protocols.

Attack Description:

Mitigation Strategies:
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
