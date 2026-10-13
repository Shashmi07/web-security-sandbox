
import bcrypt from "bcryptjs";
import argon2 from "argon2";

export type PasswordAlgorithm = "bcrypt" | "argon2id";

// Hash a password using the selected algorithm.
export async function hashPassword(
  password: string,
  algorithm: PasswordAlgorithm = "argon2id"
): Promise<string> {
  if (!password || password.length > 1024) {
    throw new Error("Password is required and must be within the length limit.");
  }

  if (algorithm === "bcrypt") {
    return bcrypt.hash(password, 12);
  }

  return argon2.hash(password, {
    type: argon2.argon2id,
    memoryCost: 19456,
    timeCost: 2,
    parallelism: 1,
  });
}

// Verify a password against its stored hash.
export async function verifyPassword(
  password: string,
  storedHash: string
): Promise<boolean> {
  try {
    if (storedHash.startsWith("$2")) {
      return await bcrypt.compare(password, storedHash);
    }

    if (storedHash.startsWith("$argon2id$")) {
      return await argon2.verify(storedHash, password);
    }

    return false;
  } catch {
    return false;
  }
}
