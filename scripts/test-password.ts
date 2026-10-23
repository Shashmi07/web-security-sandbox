
import {
  hashPassword,
  verifyPassword,
} from "../lib/password";

async function main() {
  const password = "Sandbox-Test-2026!";

  const bcryptHash = await hashPassword(password, "bcrypt");
  const argonHash = await hashPassword(password, "argon2id");

  console.log("Bcrypt hash generated:", bcryptHash.startsWith("$2"));
  console.log("Argon2id hash generated:", argonHash.startsWith("$argon2id$"));

  console.log(
    "Bcrypt correct password:",
    await verifyPassword(password, bcryptHash)
  );

  console.log(
    "Argon2id correct password:",
    await verifyPassword(password, argonHash)
  );

  console.log(
    "Wrong password rejected:",
    !(await verifyPassword("Wrong-Password!", argonHash))
  );
}

main().catch(console.error);
