import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "./auth";

// Récupérer la session côté serveur
export async function getSession() {
  return await getServerSession(authOptions);
}

// Forcer l'authentification côté serveur
export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login"); // redirection côté serveur
  return session;
}
export async function requireAdmin() {
  const session = await requireAuth();

  if (session.user.role !== "ADMIN") {
    redirect("/login");
  }

  return session;
}
