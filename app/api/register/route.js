
import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma"; 
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { name, email, password, role } = await request.json();
    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: "Tous les champs sont obligatoires" }, { status: 400 });
    }

    if (!email.includes("@")) {
      return NextResponse.json({ message: "Email invalide" }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ message: "Mot de passe trop court (min 6 caractères)" }, { status: 400 });
    }
    const validRoles = ["USER", "ORGANIZER"];
    if (!validRoles.includes(role)) {
      return NextResponse.json({ message: "Rôle invalide" }, { status: 400 });
    }
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ message: "Cet email est déjà utilisé" }, { status: 400 });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role, 
      },
    });

    return NextResponse.json(
      { message: "Utilisateur créé avec succès", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("ERREUR API REGISTER :", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}