# **App Name**: Key Exchange Simulator

## Core Features:

- User Connection: Allow users to connect to the application using WebSockets via Socket.IO.
- Role Selection: Enable users to select their role in the simulation (Alice, Bob, etc.).
- Key Generation and Exchange: Implement the Diffie-Hellman algorithm for key generation and exchange between users in real-time using WebSockets.
- Shared Key Validation: Provide visual validation to confirm that both users have the same shared key, highlighting successful key exchanges.
- User List and Interaction: Display a list of connected users and allow users to initiate a Diffie-Hellman exchange with another user.
- Visual Representation: An animated timeline showing p, g, private secrets, public keys, and shared key in process
- Security Attack Simulation (AI Powered): Simulate a Man-in-the-Middle attack scenario with guidance of an AI tool suggesting how an attacker might intercept and manipulate the key exchange.

## Style Guidelines:

- Primary color: Cyber blue (#007BFF) to represent technology and security.
- Background color: Dark grey (#222222) for a cybersecurity-themed dark mode.
- Accent color: Neon green (#39FF14) to highlight important information and actions.
- Body and headline font: 'Inter', a sans-serif font providing a modern and objective feel.
- Use distinct icons to represent each user/device in the simulation, enhancing user recognition.
- Design a responsive layout that is usable across various devices like laptops, tablets and mobile phones.
- Implement subtle animations in the timeline, to illustrate the message exchanges. 