// lib/prisma.js
import { PrismaClient } from "@prisma/client"; 
// ⚠️ On utilise globalThis pour éviter de recréer PrismaClient à chaque hot reload
const globalForPrisma = globalThis;

// Si déjà créé, on réutilise, sinon on crée une nouvelle instance
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ["query", "error"], // optionnel : pour voir les requêtes et erreurs dans la console
  });

// Ne pas recréer en dev à chaque reload
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
