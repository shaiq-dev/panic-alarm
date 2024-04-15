import { hkdf } from "@panva/hkdf";
import {
  calculateJwkThumbprint,
  base64url,
  EncryptJWT,
  JWTPayload,
  jwtDecrypt,
} from "jose";

const DEFAULT_MAX_AGE = 172800; // 2 days
const DEFAULT_ENC_ALG = "A256CBC-HS512";

const _getDerivedEncryptionKey = async (
  ikm: string | Uint8Array,
  salt: string | Uint8Array
) => {
  // Key length for A256CBC-HS512 is 64
  return await hkdf("sha256", ikm, salt, `PanicAlarm Enc Key (${salt})`, 64);
};

const _now = () => (Date.now() / 1000) | 0;

export interface JwtEncodeOptions<Payload extends JWTPayload> {
  maxAge?: number;
  salt: string;
  secret: string;
  payload?: Payload;
}

export interface JwtDecodeOptions {
  salt: string;
  secret: string;
  token: string;
}

type Digest = "sha256" | "sha384" | "sha512";

export const encode = async <Payload extends JWTPayload>(
  options: JwtEncodeOptions<Payload>
) => {
  const { maxAge = DEFAULT_MAX_AGE, salt, secret, payload = {} } = options;
  const encSecret = await _getDerivedEncryptionKey(secret, salt);

  const thumbprint = await calculateJwkThumbprint(
    { kty: "oct", k: base64url.encode(encSecret) },
    `sha${encSecret.byteLength << 3}` as Digest
  );

  return await new EncryptJWT(payload)
    .setProtectedHeader({ alg: "dir", enc: DEFAULT_ENC_ALG, kid: thumbprint })
    .setIssuedAt()
    .setExpirationTime(_now() + maxAge)
    .setJti(crypto.randomUUID())
    .encrypt(encSecret);
};

export const decode = async (options: JwtDecodeOptions) => {
  const { token, secret, salt } = options;
  const { payload } = await jwtDecrypt(
    token,
    async ({ kid }) => {
      const encSecret = await _getDerivedEncryptionKey(secret, salt);
      if (kid === undefined) {
        return encSecret;
      }

      const thumbprint = await calculateJwkThumbprint(
        { kty: "oct", k: base64url.encode(encSecret) },
        `sha${encSecret.byteLength << 3}` as Digest
      );

      if (kid === thumbprint) {
        return encSecret;
      }

      throw new Error("Decryption failed with given secret");
    },
    {
      clockTolerance: 15,
      keyManagementAlgorithms: ["dir"],
      contentEncryptionAlgorithms: [DEFAULT_ENC_ALG],
    }
  );

  return payload;
};
