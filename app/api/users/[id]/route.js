import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

import { revalidatePath } from "next/cache";


export async function GET(req, { params }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { id } });

    if (!user) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
export async function PATCH(req, { params }) {
  try {
    // 1. On récupère l'ID (il faut await params dans les dernières versions)
    const { id } = await params; 

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // 2. On récupère le corps de la requête
    let { name, email, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ error: "Tous les champs sont obligatoires" }, { status: 400 });
    }

    // 3. Traitement du rôle
    role = role.toUpperCase();
    const validRoles = ["ADMIN", "USER", "ORGANIZER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ error: "Rôle invalide" }, { status: 400 });
    }

    // 4. Mise à jour dans Prisma
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { name, email, role },
    });

    return NextResponse.json({ success: true, user: updatedUser });
  } catch (error) {
    console.error("Erreur PATCH:", error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }}
  export async function DELETE(req, { params }) {
  try {
    // 1. Récupération de l'ID
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // 2. Vérification si l'utilisateur existe (optionnel mais recommandé)
    const userExists = await prisma.user.findUnique({
      where: { id },
    });

    if (!userExists) {
      return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });
    }

    // 3. Suppression
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Utilisateur supprimé avec succès" 
    });

  } catch (error) {
    console.error("Erreur DELETE:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de l'utilisateur" },
      { status: 500 }
    );
  }
  }
  export async function deleteUserAction(userId) {
  
  await prisma.user.delete({
    where: { id: userId },
  });
  // Force Next.js à rafraîchir la liste des utilisateurs sans recharger la page
  revalidatePath("/admin/users"); 
}
