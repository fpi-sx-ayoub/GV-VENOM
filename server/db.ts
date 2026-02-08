import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, vipUsers, InsertVipUser, VipUser, adminCredentials, InsertAdminCredential, apiLogs, InsertApiLog } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/**
 * VIP User queries
 */
export async function getVipUserByUsername(username: string): Promise<VipUser | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get VIP user: database not available");
    return undefined;
  }

  const result = await db.select().from(vipUsers).where(eq(vipUsers.username, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function createVipUser(user: InsertVipUser): Promise<VipUser | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create VIP user: database not available");
    return undefined;
  }

  try {
    const result = await db.insert(vipUsers).values(user);
    const insertedUser = await getVipUserByUsername(user.username);
    return insertedUser;
  } catch (error) {
    console.error("[Database] Failed to create VIP user:", error);
    throw error;
  }
}

export async function getAllVipUsers(): Promise<VipUser[]> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get VIP users: database not available");
    return [];
  }

  return await db.select().from(vipUsers);
}

export async function deleteVipUser(id: number): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot delete VIP user: database not available");
    return;
  }

  await db.delete(vipUsers).where(eq(vipUsers.id, id));
}

/**
 * Admin credentials queries
 */
export async function getAdminCredentials(): Promise<InsertAdminCredential | undefined> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get admin credentials: database not available");
    return undefined;
  }

  const result = await db.select().from(adminCredentials).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function initializeAdminCredentials(username: string, passwordHash: string): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot initialize admin credentials: database not available");
    return;
  }

  try {
    const existing = await getAdminCredentials();
    if (!existing) {
      await db.insert(adminCredentials).values({
        username,
        passwordHash,
      });
    }
  } catch (error) {
    console.error("[Database] Failed to initialize admin credentials:", error);
  }
}

/**
 * API Logs queries
 */
export async function createApiLog(log: InsertApiLog): Promise<void> {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot create API log: database not available");
    return;
  }

  try {
    await db.insert(apiLogs).values(log);
  } catch (error) {
    console.error("[Database] Failed to create API log:", error);
  }
}
