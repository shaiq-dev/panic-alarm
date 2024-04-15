import {
  CipherGCMTypes,
  randomBytes,
  createCipheriv,
  createDecipheriv,
} from "crypto";

export class Cypher {
  private blockCipher: CipherGCMTypes = "aes-256-gcm";
  private encryptionKey: Buffer;

  private AUTH_TAG_BYTE_LEN = 16;
  private IV_BYTE_LEN = 12;

  constructor(encryptionKey: string) {
    if (!encryptionKey || encryptionKey.length != 65) {
      throw new Error("[pa/cypher] Invalid encryption key");
    }

    this.encryptionKey = Buffer.from(encryptionKey, "hex");
  }

  private getIv() {
    return randomBytes(this.IV_BYTE_LEN);
  }

  encrypt(value: string) {
    try {
      const iv = this.getIv();
      const cipher = createCipheriv(this.blockCipher, this.encryptionKey, iv, {
        authTagLength: this.AUTH_TAG_BYTE_LEN,
      });
      const encryptedValue = cipher.update(value);
      const encryptedValueBuffer = Buffer.concat([
        encryptedValue,
        cipher.final(),
      ]);

      return Buffer.concat([
        iv,
        encryptedValueBuffer,
        cipher.getAuthTag(),
      ]).toString("hex");
    } catch (error) {
      console.log("[pa/cypher] Error encrypting", error);
      return null;
    }
  }

  decrypt(encryptedValue: string) {
    try {
      const authTag = Buffer.from(
        encryptedValue.slice(-(this.AUTH_TAG_BYTE_LEN * 2)),
        "hex"
      );
      const iv = Buffer.from(
        encryptedValue.slice(0, this.IV_BYTE_LEN * 2),
        "hex"
      );
      const encryptedValueDataPart = encryptedValue.slice(
        this.IV_BYTE_LEN * 2,
        -(this.AUTH_TAG_BYTE_LEN * 2)
      );

      const decipher = createDecipheriv(
        this.blockCipher,
        this.encryptionKey,
        iv,
        {
          authTagLength: this.AUTH_TAG_BYTE_LEN,
        }
      );
      decipher.setAuthTag(authTag);
      const value = decipher.update(encryptedValueDataPart, "hex");

      return Buffer.concat([value, decipher.final()]).toString();
    } catch {
      return null;
    }
  }
}

/* Export as singelton */
const getCypherSingelton = () => {
  return new Cypher(process.env.CYPHER_ENCRYPTION_KEY as string);
};

declare global {
  var cypherGlobal: undefined | ReturnType<typeof getCypherSingelton>;
}

const cypher = globalThis.cypherGlobal ?? getCypherSingelton();

export default cypher;

if (process.env.NODE_ENV !== "production") globalThis.cypherGlobal = cypher;
