/* =========================================================
   DB.JS - IndexedDB
========================================================= */

const DB_NAME = "SOS_DB";
const DB_VERSION = 2;
let dbInstance = null;

function openDB() {
  return new Promise((resolve, reject) => {
    if (dbInstance) return resolve(dbInstance);
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("users")) {
        const store = db.createObjectStore("users", { keyPath: "id" });
        store.createIndex("username", "username", { unique: true });
        store.createIndex("role", "role", { unique: false });
      }
      if (!db.objectStoreNames.contains("sos")) {
        const store = db.createObjectStore("sos", { keyPath: "id" });
        store.createIndex("userId", "userId", { unique: false });
        store.createIndex("status", "status", { unique: false });
        store.createIndex("createdAt", "createdAt", { unique: false });
      }
    };

    req.onsuccess = (e) => { dbInstance = e.target.result; resolve(dbInstance); };
    req.onerror = () => reject(req.error);
  });
}

/* ---------- USERS ---------- */
async function dbGetAllUsers() {
  const db = await openDB();
  return new Promise((r) => {
    const tx = db.transaction("users", "readonly");
    const req = tx.objectStore("users").getAll();
    req.onsuccess = () => r(req.result || []);
    req.onerror = () => r([]);
  });
}

async function dbGetUserByUsername(username) {
  const db = await openDB();
  return new Promise((r) => {
    const tx = db.transaction("users", "readonly");
    const idx = tx.objectStore("users").index("username");
    const req = idx.get(username.toLowerCase());
    req.onsuccess = () => r(req.result || null);
    req.onerror = () => r(null);
  });
}

async function dbGetUserById(id) {
  const db = await openDB();
  return new Promise((r) => {
    const tx = db.transaction("users", "readonly");
    const req = tx.objectStore("users").get(id);
    req.onsuccess = () => r(req.result || null);
    req.onerror = () => r(null);
  });
}

async function dbAddUser(user) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction("users", "readwrite");
    const req = tx.objectStore("users").add(user);
    req.onsuccess = () => res(user);
    req.onerror = () => rej(req.error);
  });
}

async function dbUpdateUser(user) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction("users", "readwrite");
    const req = tx.objectStore("users").put(user);
    req.onsuccess = () => res(user);
    req.onerror = () => rej(req.error);
  });
}

async function dbDeleteUser(id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction("users", "readwrite");
    const req = tx.objectStore("users").delete(id);
    req.onsuccess = () => res(true);
    req.onerror = () => rej(req.error);
  });
}

/* ---------- SOS ---------- */
async function dbGetAllSOS() {
  const db = await openDB();
  return new Promise((r) => {
    const tx = db.transaction("sos", "readonly");
    const req = tx.objectStore("sos").getAll();
    req.onsuccess = () => r(req.result || []);
    req.onerror = () => r([]);
  });
}

async function dbGetSOSByUser(userId) {
  const db = await openDB();
  return new Promise((r) => {
    const tx = db.transaction("sos", "readonly");
    const idx = tx.objectStore("sos").index("userId");
    const req = idx.getAll(userId);
    req.onsuccess = () => r(req.result || []);
    req.onerror = () => r([]);
  });
}

async function dbGetSOSById(id) {
  const db = await openDB();
  return new Promise((r) => {
    const tx = db.transaction("sos", "readonly");
    const req = tx.objectStore("sos").get(id);
    req.onsuccess = () => r(req.result || null);
    req.onerror = () => r(null);
  });
}

async function dbAddSOS(sos) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction("sos", "readwrite");
    const req = tx.objectStore("sos").add(sos);
    req.onsuccess = () => res(sos);
    req.onerror = () => rej(req.error);
  });
}

async function dbUpdateSOS(sos) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction("sos", "readwrite");
    const req = tx.objectStore("sos").put(sos);
    req.onsuccess = () => res(sos);
    req.onerror = () => rej(req.error);
  });
}

async function dbDeleteSOS(id) {
  const db = await openDB();
  return new Promise((res, rej) => {
    const tx = db.transaction("sos", "readwrite");
    const req = tx.objectStore("sos").delete(id);
    req.onsuccess = () => res(true);
    req.onerror = () => rej(req.error);
  });
}

/* Xóa tất cả SOS của 1 user */
async function dbDeleteSOSByUser(userId) {
  const list = await dbGetSOSByUser(userId);
  for (const s of list) {
    await dbDeleteSOS(s.id);
  }
  return list.length;
}

/* ---------- SEED ADMIN ---------- */
async function seedAdmin() {
  const existing = await dbGetUserByUsername("huykhanh");
  if (existing) {
    if (existing.role !== "admin") {
      existing.role = "admin";
      await dbUpdateUser(existing);
    }
    return;
  }
  await dbAddUser({
    id: "ADMIN-001",
    name: "Quản trị hệ thống",
    username: "huykhanh",
    phone: "—",
    password: "huykhanh",
    role: "admin",
    active: true,
    createdAt: new Date().toISOString()
  });
  console.log("✅ Admin tạo: huykhanh / huykhanh");
}