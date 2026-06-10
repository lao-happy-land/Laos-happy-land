/**
 * Regression checks for JWT decode (auth.service.ts + middleware.ts logic)
 * Run: node scripts/verify-jwt-decode.mjs
 */

import crypto from "crypto";

function signJwt(payload) {
  const header = Buffer.from(
    JSON.stringify({ alg: "HS256", typ: "JWT" }),
  ).toString("base64url");
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${header}.${body}.fakesignature`;
}

function decodeAuthService(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) throw new Error("Invalid JWT format");

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const binary = atob(padded);
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
    const payload = JSON.parse(new TextDecoder().decode(bytes));

    return {
      ok: true,
      user: {
        id: payload.sub ?? payload.id ?? "",
        email: payload.email ?? "",
        phone: payload.phone ?? "",
        fullName: payload.fullName ?? payload.name ?? "User",
        role: payload.role ?? "user",
      },
    };
  } catch (error) {
    return { ok: false, error: error.message };
  }
}

function decodeMiddleware(token) {
  try {
    const parts = token.split(".");
    if (parts.length !== 3 || !parts[1]) return { ok: false };

    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64 + "=".repeat((4 - (base64.length % 4)) % 4);
    const payload = JSON.parse(atob(padded));
    return { ok: true, payload };
  } catch {
    return { ok: false };
  }
}

const cases = [
  {
    name: "Latin name",
    payload: {
      sub: crypto.randomUUID(),
      email: "john@test.com",
      fullName: "John Smith",
      role: "User",
      phone: "02012345678",
    },
  },
  {
    name: "Vietnamese name",
    payload: {
      sub: crypto.randomUUID(),
      email: "nguyen@test.com",
      fullName: "Nguyễn Văn A",
      role: "User",
      phone: "0912345678",
    },
  },
  {
    name: "Lao name",
    payload: {
      sub: crypto.randomUUID(),
      email: "lao@test.com",
      fullName: "ສົມຊາຍ ວົງສະຫວັນ",
      role: "Admin",
      phone: null,
    },
  },
  {
    name: "Admin role",
    payload: {
      sub: crypto.randomUUID(),
      email: "admin@test.com",
      fullName: "Admin User",
      role: "Admin",
      phone: "02099999999",
    },
  },
  {
    name: "Missing fullName",
    payload: {
      sub: crypto.randomUUID(),
      email: "noname@test.com",
      fullName: null,
      role: "User",
    },
  },
];

let passed = 0;
let failed = 0;

for (const { name, payload } of cases) {
  const token = signJwt(payload);
  const auth = decodeAuthService(token);
  const mid = decodeMiddleware(token);
  const b64 = token.split(".")[1];

  const ok =
    auth.ok &&
    mid.ok &&
    auth.user.id === payload.sub &&
    auth.user.email === payload.email &&
    auth.user.role === payload.role &&
    (payload.fullName == null
      ? auth.user.fullName === "User"
      : auth.user.fullName === payload.fullName);

  if (ok) {
    passed++;
    console.log(`✅ ${name}${/[-_]/.test(b64) ? " (base64url -/_)" : ""}`);
  } else {
    failed++;
    console.log(`❌ ${name}`, { auth, mid, expected: payload });
  }
}

// Invalid token should fail gracefully (returns null in app)
const invalid = decodeAuthService("not-a-jwt");
if (!invalid.ok) {
  passed++;
  console.log("✅ Invalid token rejected");
} else {
  failed++;
  console.log("❌ Invalid token should fail");
}

// Stress: random accounts that previously failed with old decoder
let stressPass = 0;
let stressFail = 0;
for (let i = 0; i < 500; i++) {
  const payload = {
    sub: crypto.randomUUID(),
    email: `user${i}@mail${i % 13}.com`,
    fullName: ["Nguyễn", "ສົມຊາຍ", "John", "ທົດສອບ"][i % 4] + " " + i,
    role: i % 5 === 0 ? "Admin" : "User",
    phone: i % 3 === 0 ? null : "020" + i,
  };
  const token = signJwt(payload);
  const auth = decodeAuthService(token);
  const mid = decodeMiddleware(token);
  if (auth.ok && mid.ok && auth.user.id === payload.sub) stressPass++;
  else stressFail++;
}

console.log(`\nStress test: ${stressPass}/500 passed`);
if (stressFail > 0) failed++;

console.log(`\nTotal: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
