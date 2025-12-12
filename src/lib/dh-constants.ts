// Pre-defined Diffie-Hellman parameters for different security levels
// For educational purposes, these are smaller than production-grade parameters.

export type DHParams = {
  name: string;
  bits: number;
  p: bigint;
  g: bigint;
};

export const DH_PARAMS: DHParams[] = [
  {
    name: 'Toy (Very Fast)',
    bits: 8,
    p: BigInt('23'),
    g: BigInt('5'),
  },
  {
    name: 'Simple (Fast)',
    bits: 64,
    p: BigInt('0xB10B8F96A080E01DDE92DE5EAE5D54EC52C99FBCFB06A3C69A6A9DCA52D23B61'),
    g: BigInt('0xA4D1CBD5C3FD34126765A442EFB99905F8104DD258AC507FD6406CFF14266D31'),
  },
  {
    name: 'Medium (512-bit)',
    bits: 512,
    p: BigInt('0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA237327FFFFFFFFFFFFFFFF'),
    g: BigInt(2),
  },
  {
    name: 'Strong (1024-bit)',
    bits: 1024,
    p: BigInt('0xFFFFFFFFFFFFFFFFC90FDAA22168C234C4C6628B80DC1CD129024E088A67CC74020BBEA63B139B22514A08798E3404DDEF9519B3CD3A431B302B0A6DF25F14374FE1356D6D51C245E485B576625E7EC6F44C42E9A637ED6B0BFF5CB6F406B7EDEE386BFB5A899FA5AE9F24117C4B1FE649286651ECE45B3DC2007CB8A163BF0598DA48361C55D39A69163FA8FD24CF5F83655D23DCA3AD961C62F356208552BB9ED529077096966D670C354E4ABC9804F1746C08CA18217C32905E462E36CE3BE39E772C180E86039B2783A2EC07A28FB5C55DF06F4C52C9DE2BCBF6955817183995497CEA956AE515D2261898FA051015728E5A8AAAC42DAD33170D04507A33A85521ABDF1CBA64ECFB850458DBEF0A8AEA71575D060C7DB3970F85A6E1E4C7ABF5AE8CDB0933D71E8C94E04A25619DCEE3D2261AD2EE6BF12FFA06D98A0864D87602733EC86A64521F2B18177B200CBBE117577A615D6C770988C0BAD946E208E24FA074E5AB3143DB5BFCE0FD108E4B82D120A93AD2CAFFFFFFFFFFFFFFFF'),
    g: BigInt(2),
  },
];

/**
 * Calculates (base^exp) % mod using modular exponentiation.
 * Handles BigInt values for cryptographic operations.
 */
export const power = (base: bigint, exp: bigint, mod: bigint): bigint => {
  if (mod === BigInt(0)) throw new Error("Modulo cannot be zero.");
  
  let res = BigInt(1);
  base %= mod;
  while (exp > 0) {
    if (exp % BigInt(2) === BigInt(1)) res = (res * base) % mod;
    base = (base * base) % mod;
    exp /= BigInt(2);
  }
  return res;
};

/**
 * Generates a random private key.
 * NOTE: This uses Math.random() and is NOT cryptographically secure.
 * It is suitable only for educational/simulation purposes.
 */
export const generatePrivateKey = (p: bigint): bigint => {
    // Generate a random private key up to p-2 for simplicity.
    const max = p - BigInt(2);
    // A real implementation would use crypto.getRandomValues.
    const randomBigInt = BigInt(Math.floor(Math.random() * Number.MAX_SAFE_INTEGER));
    return (randomBigInt % max) + BigInt(1);
};
