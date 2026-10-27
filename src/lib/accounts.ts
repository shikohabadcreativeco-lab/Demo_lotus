import { randomBytes, scryptSync } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { ObjectId, type WithId } from "mongodb";
import { connection } from "next/server";
import { getDb } from "@/lib/mongodb";

export type UserRecord = {
  _id?: ObjectId | string;
  fullName?: string;
  email?: string;
  phoneCountryCode?: string;
  phoneNumber?: string;
  fullPhone?: string;
  termsAccepted?: boolean;
  role?: string;
  status?: string;
  createdAt?: Date | string;
  password?: string;
  passwordHash?: string;
  passwordSalt?: string;
};

type SessionRecord = {
  token: string;
  userId: ObjectId | string;
  role: string;
  fullName: string;
  email: string;
  phone: string;
  createdAt: Date | string;
  expiresAt: Date | string;
};

type FileStore = {
  users: Array<UserRecord & { _id: string }>;
  sessions: SessionRecord[];
};

const storePath = path.join(process.cwd(), ".data", "accounts.json");
let mongoUnavailableUntil = 0;

export async function findAccount(identifier: string) {
  const normalized = identifier.trim().toLowerCase();
  const digits = identifier.replace(/\D/g, "");
  const db = await openMongo();

  if (db) {
    const phoneFilters =
      digits.length >= 10
        ? [{ phoneNumber: digits }, { fullPhone: identifier.trim() }, { phoneNumber: identifier.trim() }]
        : [];
    return db.collection<UserRecord>("users").findOne({
      $or: [{ email: normalized }, { email: identifier.trim() }, ...phoneFilters],
    });
  }

  const store = await readStore();
  return (
    store.users.find((user) => {
      const email = user.email?.toLowerCase();
      const phone = user.phoneNumber?.replace(/\D/g, "");
      return email === normalized || (digits.length >= 10 && phone === digits);
    }) ?? null
  );
}

export async function createAccount(input: {
  fullName: string;
  email: string;
  phoneCountryCode: string;
  phoneNumber: string;
  password: string;
}) {
  const email = input.email.trim().toLowerCase();
  const phoneNumber = input.phoneNumber.replace(/\D/g, "");
  const existing = await findAccount(email);
  if (existing) return { error: "email" as const };
  const existingPhone = await findAccount(phoneNumber);
  if (existingPhone) return { error: "phone" as const };

  const passwordSalt = randomBytes(16).toString("hex");
  const passwordHash = scryptSync(input.password, passwordSalt, 64).toString("hex");
  const createdAt = new Date();
  const user: UserRecord = {
    fullName: input.fullName.trim(),
    email,
    phoneCountryCode: input.phoneCountryCode,
    phoneNumber,
    fullPhone: `${input.phoneCountryCode} ${phoneNumber}`,
    termsAccepted: true,
    role: "customer",
    status: "active",
    createdAt,
    passwordSalt,
    passwordHash,
  };

  const db = await openMongo();
  if (db) {
    const result = await db.collection<UserRecord>("users").insertOne(user);
    return { user: { ...user, _id: result.insertedId } };
  }

  const store = await readStore();
  const saved = { ...user, _id: new ObjectId().toHexString(), createdAt: createdAt.toISOString() };
  store.users.push(saved);
  await writeStore(store);
  return { user: saved };
}

export async function createSession(
  userId: ObjectId | string,
  profile: { role?: string; fullName?: string; email?: string; phone?: string } = {},
) {
  const token = `lotus_${randomBytes(24).toString("hex")}`;
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 7 * 24 * 60 * 60 * 1000);
  const id = userId instanceof ObjectId ? userId.toHexString() : String(userId);
  const role = profile.role === "admin" ? "admin" : "user";
  const fullName = profile.fullName ?? "";
  const email = profile.email ?? "";
  const phone = profile.phone ?? "";
  const db = await openMongo();

  if (db) {
    await db.collection("sessions").insertOne({
      token,
      userId: userId instanceof ObjectId ? userId : new ObjectId(id),
      role,
      fullName,
      email,
      phone,
      createdAt,
      expiresAt,
    });
  } else {
    const store = await readStore();
    store.sessions.push({
      token,
      userId: id,
      role,
      fullName,
      email,
      phone,
      createdAt: createdAt.toISOString(),
      expiresAt: expiresAt.toISOString(),
    });
    await writeStore(store);
  }

  return { token, expiresAt, role };
}

export async function deleteSession(token: string) {
  if (!token.startsWith("lotus_")) return;
  const db = await openMongo();

  if (db) {
    await db.collection("sessions").deleteOne({ token });
    return;
  }

  const store = await readStore();
  store.sessions = store.sessions.filter((item) => item.token !== token);
  await writeStore(store);
}

export async function findUserById(userId: string) {
  if (!ObjectId.isValid(userId)) return null;
  const db = await openMongo();

  if (db) {
    return db.collection<UserRecord & { phone?: string }>("users").findOne({
      _id: new ObjectId(userId),
    });
  }

  const store = await readStore();
  return store.users.find((user) => user._id === userId) ?? null;
}

export async function findSession(token: string) {
  if (!token.startsWith("lotus_")) return null;
  const db = await openMongo();

  if (db) {
    const session = await db.collection<SessionRecord>("sessions").findOne({ token });
    if (!session?.expiresAt) return null;
    const expiresAt =
      session.expiresAt instanceof Date ? session.expiresAt : new Date(String(session.expiresAt));
    if (Number.isNaN(expiresAt.getTime()) || expiresAt.getTime() <= Date.now()) return null;
    return session;
  }

  const store = await readStore();
  const session = store.sessions.find((item) => item.token === token);
  if (!session) return null;
  if (new Date(session.expiresAt).getTime() <= Date.now()) return null;
  return session;
}

export async function listAccounts() {
  const db = await openMongo();
  if (db) {
    const users = await db
      .collection<UserRecord>("users")
      .find({}, { projection: { password: 0, passwordHash: 0, passwordSalt: 0 } })
      .sort({ createdAt: -1 })
      .toArray();
    return users.map((user) => publicUser(user));
  }
  const store = await readStore();
  return store.users.map((user) => publicUser(user));
}

export function publicUser(user: WithId<UserRecord> | (UserRecord & { _id: string })) {
  const createdAt =
    user.createdAt instanceof Date
      ? user.createdAt.toISOString()
      : typeof user.createdAt === "string"
        ? user.createdAt
        : undefined;

  return {
    _id: user._id instanceof ObjectId ? user._id.toHexString() : String(user._id),
    fullName: user.fullName ?? "",
    email: user.email ?? "",
    phoneCountryCode: user.phoneCountryCode ?? "",
    phoneNumber: user.phoneNumber ?? "",
    fullPhone: user.fullPhone ?? "",
    termsAccepted: Boolean(user.termsAccepted),
    role: user.role ?? "customer",
    createdAt,
  };
}

async function openMongo() {
  await connection();
  if (Date.now() < mongoUnavailableUntil) return null;
  try {
    return await getDb();
  } catch {
    mongoUnavailableUntil = Date.now() + 30_000;
    return null;
  }
}

async function readStore(): Promise<FileStore> {
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed = JSON.parse(raw) as FileStore;
    return {
      users: parsed.users ?? [],
      sessions: parsed.sessions ?? [],
    };
  } catch {
    return { users: [], sessions: [] };
  }
}

async function writeStore(store: FileStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}
