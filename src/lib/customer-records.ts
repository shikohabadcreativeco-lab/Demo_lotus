import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";
import { connection } from "next/server";
import { getDb } from "@/lib/mongodb";

export type SavedAddress = {
  id: string;
  userId: string;
  label: string;
  addressType: "home" | "work" | "other";
  fullName: string;
  phone: string;
  line: string;
  line2: string;
  city: string;
  state: string;
  pin: string;
  country: string;
  instructions: string;
  isDefault: boolean;
};

export type StoredOrderItem = {
  name: string;
  quantity: number;
  price: number;
  image: string;
  slug: string;
  categorySlug: string;
  watt?: string;
  lightColor?: string;
};

export type OrderDisplayStatus = "Placed" | "Confirmed" | "Processing" | "Shipped" | "Delivered" | "Cancelled";

export type StoredOrder = {
  number: string;
  userId: string;
  placedAt: string;
  status: OrderDisplayStatus;
  items: StoredOrderItem[];
  subtotal: number;
  shipping: number;
  total: number;
  payment: string;
  courier?: string;
  trackingNumber?: string;
  address: {
    fullName: string;
    phone: string;
    line: string;
    city: string;
    state: string;
    pin: string;
  };
};

type FileStore = {
  addresses: SavedAddress[];
  orders: StoredOrder[];
};

const storePath = path.join(process.cwd(), ".data", "customer.json");
let writeChain: Promise<void> = Promise.resolve();

export async function listAddresses(userId: string) {
  const store = await readCustomer();
  return store.addresses
    .filter((address) => address.userId === userId)
    .sort((left, right) => Number(right.isDefault) - Number(left.isDefault));
}

export async function saveAddress(userId: string, input: Omit<SavedAddress, "id" | "userId"> & { id?: string }) {
  const next: SavedAddress = {
    id: input.id || `addr_${randomBytes(8).toString("hex")}`,
    userId,
    label: clip(input.label, 24) || "Home",
    addressType: input.addressType === "work" || input.addressType === "other" ? input.addressType : "home",
    fullName: clip(input.fullName, 80),
    phone: input.phone.replace(/\D/g, "").slice(0, 15),
    line: clip(input.line, 160),
    line2: clip(input.line2 ?? "", 160),
    city: clip(input.city, 60),
    state: clip(input.state, 40),
    pin: input.pin.replace(/\D/g, "").slice(0, 6),
    country: clip(input.country ?? "India", 40) || "India",
    instructions: clip(input.instructions ?? "", 160),
    isDefault: Boolean(input.isDefault),
  };
  if (next.fullName.length < 2 || next.line.length < 5 || next.city.length < 2 || next.pin.length !== 6) {
    return { error: "Enter a complete delivery address." };
  }
  if (next.phone.length < 10) return { error: "Enter a 10-digit phone number." };

  return updateCustomer((store) => {
    const owned = store.addresses.filter((address) => address.userId === userId);
    const exists = owned.some((address) => address.id === next.id);
    if (!exists && owned.length >= 10) return { error: "You can save up to 10 addresses." };
    const previous = owned.find((address) => address.id === next.id);
    if (!exists && owned.length === 0) next.isDefault = true;
    if (exists && !next.isDefault) next.isDefault = Boolean(previous?.isDefault);
    if (next.isDefault) {
      store.addresses = store.addresses.map((address) =>
        address.userId === userId ? { ...address, isDefault: false } : address,
      );
    }
    store.addresses = exists
      ? store.addresses.map((address) =>
          address.userId === userId && address.id === next.id ? next : address,
        )
      : [...store.addresses, next];
    return { address: { ...next } };
  });
}

export async function setDefaultAddress(userId: string, id: string) {
  return updateCustomer((store) => {
    const owned = store.addresses.some((address) => address.userId === userId && address.id === id);
    if (!owned) return { error: "Choose an address." };
    store.addresses = store.addresses.map((address) =>
      address.userId === userId ? { ...address, isDefault: address.id === id } : address,
    );
    return { ok: true };
  });
}

export async function saveInstructions(userId: string, id: string, instructions: string) {
  const note = clip(instructions, 160);
  return updateCustomer((store) => {
    const owned = store.addresses.some((address) => address.userId === userId && address.id === id);
    if (!owned) return { error: "Choose an address." };
    store.addresses = store.addresses.map((address) =>
      address.userId === userId && address.id === id ? { ...address, instructions: note } : address,
    );
    return { ok: true };
  });
}

export async function removeAddress(userId: string, id: string) {
  await updateCustomer((store) => {
    store.addresses = store.addresses.filter(
      (address) => !(address.userId === userId && address.id === id),
    );
    const owned = store.addresses.filter((address) => address.userId === userId);
    if (owned.length > 0 && !owned.some((address) => address.isDefault)) {
      const first = owned[0].id;
      store.addresses = store.addresses.map((address) =>
        address.id === first ? { ...address, isDefault: true } : address,
      );
    }
    return { ok: true };
  });
}

export async function listAllOrders() {
  const store = await readCustomer();
  return [...store.orders].sort((a, b) => b.placedAt.localeCompare(a.placedAt));
}

export async function listOrders(userId: string) {
  const store = await readCustomer();
  const orders = store.orders
    .filter((order) => order.userId === userId)
    .sort((a, b) => b.placedAt.localeCompare(a.placedAt));
  return attachShipping(orders);
}

export async function recordOrder(userId: string, input: Omit<StoredOrder, "userId" | "placedAt" | "status">) {
  const items = input.items
    .slice(0, 20)
    .filter((item) => item.name && item.quantity > 0 && item.price >= 0)
    .map((item) => ({
      name: clip(item.name, 80),
      quantity: Math.min(9, Math.max(1, Math.round(item.quantity))),
      price: Math.round(item.price),
      image: item.image.startsWith("/") ? item.image : "",
      slug: clip(item.slug, 80),
      categorySlug: clip(item.categorySlug, 80),
      ...(item.watt ? { watt: clip(item.watt, 12) } : {}),
      ...(item.lightColor ? { lightColor: clip(item.lightColor, 24) } : {}),
    }));
  if (items.length === 0) return { error: "Add a light to this order." };
  if (!/^LL-\d{6}$/.test(input.number)) return { error: "That order number is not valid." };

  const order: StoredOrder = {
    number: input.number,
    userId,
    placedAt: new Date().toISOString(),
    status: "Placed",
    items,
    subtotal: Math.max(0, Math.round(input.subtotal)),
    shipping: Math.max(0, Math.round(input.shipping)),
    total: Math.max(0, Math.round(input.total)),
    payment: clip(input.payment, 40) || "Cash on delivery",
    address: {
      fullName: clip(input.address.fullName, 80),
      phone: input.address.phone.replace(/\D/g, "").slice(0, 15),
      line: clip(input.address.line, 160),
      city: clip(input.address.city, 60),
      state: clip(input.address.state, 40),
      pin: input.address.pin.replace(/\D/g, "").slice(0, 6),
    },
  };

  const db = await database();
  if (!db) {
    return updateCustomer((store) => {
      const already = store.orders.some((saved) => saved.userId === userId && saved.number === order.number);
      if (!already) store.orders.push(order);
      return { order };
    });
  }

  const already = await db.collection("orders").findOne({ orderNumber: order.number, userId });
  if (!already) {
    const placedAt = new Date(order.placedAt);
    await db.collection("orders").insertOne({
      orderNumber: order.number,
      userId,
      customer: {
        fullName: order.address.fullName,
        email: "",
        phone: order.address.phone,
      },
      items: order.items.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image,
        slug: item.slug,
        categorySlug: item.categorySlug,
        ...(item.watt ? { watt: item.watt } : {}),
        ...(item.lightColor ? { lightColor: item.lightColor } : {}),
      })),
      address: order.address,
      subtotal: order.subtotal,
      shipping: order.shipping,
      discount: 0,
      total: order.total,
      paymentMethod: order.payment,
      orderStatus: "pending",
      paymentStatus: "pending",
      courier: "",
      trackingNumber: "",
      refund: { status: "none", reason: "", initiatedAt: null },
      createdAt: placedAt,
      updatedAt: placedAt,
    });
  }
  return { order };
}

const backendDbUrl = process.env.BACKEND_MONGO_URI ?? "mongodb://127.0.0.1:27017/lotus_light";

async function attachShipping(orders: StoredOrder[]) {
  if (orders.length === 0) return orders;
  let client: MongoClient | undefined;
  try {
    client = new MongoClient(backendDbUrl, { serverSelectionTimeoutMS: 800 });
    await client.connect();
    const rows = await client
      .db()
      .collection("orders")
      .find({ orderNumber: { $in: orders.map((order) => order.number) } })
      .project({ orderNumber: 1, courier: 1, trackingNumber: 1, orderStatus: 1 })
      .toArray();
    const saved = new Map(
      rows.map((row) => [
        String(row.orderNumber),
        {
          courier: typeof row.courier === "string" ? row.courier : "",
          trackingNumber: typeof row.trackingNumber === "string" ? row.trackingNumber : "",
          orderStatus: row.orderStatus,
        },
      ]),
    );
    return orders.map((order) => {
      const shipping = saved.get(order.number);
      return {
        ...order,
        status: displayStatus(shipping?.orderStatus ?? order.status),
        courier: shipping?.courier || order.courier || "",
        trackingNumber: shipping?.trackingNumber || order.trackingNumber || "",
      };
    });
  } catch {
    return orders;
  } finally {
    await client?.close();
  }
}

async function readCustomer(): Promise<FileStore> {
  await connection();
  const db = await database();
  if (db) {
    const [addresses, orders] = await Promise.all([
      db.collection<SavedAddress>("addresses").find({}).toArray(),
      db.collection<StoredOrder>("orders").find({}).toArray(),
    ]);
    return {
      addresses: addresses.map((address) => ({
        id: address.id,
        userId: address.userId,
        label: address.label,
        addressType: address.addressType === "work" || address.addressType === "other" ? address.addressType : "home",
        fullName: address.fullName,
        phone: address.phone,
        line: address.line,
        line2: address.line2 ?? "",
        city: address.city,
        state: address.state,
        pin: address.pin,
        country: address.country || "India",
        instructions: address.instructions ?? "",
        isDefault: Boolean(address.isDefault),
      })),
      orders: orders.flatMap((order) => {
        const saved = order as StoredOrder & {
          orderNumber?: string;
          paymentMethod?: string;
          orderStatus?: string;
          createdAt?: Date | string;
        };
        const number = saved.number || saved.orderNumber || "";
        if (!number) return [];
        const placedAt = saved.placedAt || (saved.createdAt ? new Date(saved.createdAt).toISOString() : "");
        return [{
          number,
          userId: String(saved.userId ?? ""),
          placedAt,
          status: displayStatus(saved.orderStatus || saved.status),
          items: (saved.items ?? []).map((item) => ({
            name: item.name,
            quantity: item.quantity,
            price: item.price,
            image: item.image ?? "",
            slug: item.slug ?? "",
            categorySlug: item.categorySlug ?? "",
            ...(item.watt ? { watt: item.watt } : {}),
            ...(item.lightColor ? { lightColor: item.lightColor } : {}),
          })),
          subtotal: saved.subtotal,
          shipping: saved.shipping,
          total: saved.total,
          payment: saved.payment || saved.paymentMethod || "",
          ...(saved.courier ? { courier: saved.courier } : {}),
          ...(saved.trackingNumber ? { trackingNumber: saved.trackingNumber } : {}),
          address: saved.address,
        }];
      }),
    };
  }
  return readFileStore();
}

async function updateCustomer<T>(change: (store: FileStore) => T): Promise<T> {
  const run = writeChain.then(async () => {
    const store = await readCustomer();
    const result = change(store);
    const db = await database();
    if (db) return result;
    await writeFileStore(store);
    return result;
  });
  writeChain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function database() {
  try {
    return await getDb();
  } catch {
    return null;
  }
}

async function readFileStore(): Promise<FileStore> {
  try {
    const parsed = JSON.parse(await readFile(storePath, "utf8")) as FileStore;
    return {
      addresses: Array.isArray(parsed.addresses) ? parsed.addresses : [],
      orders: Array.isArray(parsed.orders) ? parsed.orders : [],
    };
  } catch {
    return { addresses: [], orders: [] };
  }
}

async function writeFileStore(store: FileStore) {
  await mkdir(path.dirname(storePath), { recursive: true });
  await writeFile(storePath, JSON.stringify(store, null, 2));
}

function clip(value: string, max: number) {
  return value.trim().slice(0, max);
}

function displayStatus(value: unknown): OrderDisplayStatus {
  if (value === "confirmed" || value === "Confirmed") return "Confirmed";
  if (value === "processing" || value === "Processing") return "Processing";
  if (value === "shipped" || value === "Shipped") return "Shipped";
  if (value === "delivered" || value === "Delivered") return "Delivered";
  if (value === "cancelled" || value === "Cancelled") return "Cancelled";
  return "Placed";
}
