import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import prisma from "../../../lib/prisma"; // <--- ASSURE-TOI QUE CET IMPORT EST CORRECT

export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    console.log("DEBUG SESSION:", session);
    
    // 1. Vérification de la session
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const { eventId } = body;

    // 2. Vérification des données entrantes
    if (!eventId) {
      return NextResponse.json({ message: "ID de l'événement manquant" }, { status: 400 });
    }

    // 3. Vérifier si l'événement existe dans la base cloud
    const eventExists = await prisma.event.findUnique({
      where: { id: eventId }
    });

    if (!eventExists) {
      return NextResponse.json({ message: "Événement introuvable" }, { status: 404 });
    }

    // 4. Vérifier si déjà inscrit
    const existing = await prisma.participation.findFirst({
      where: { 
        userId: session.user.id, 
        eventId: eventId 
      }
    });

    if (existing) {
      return NextResponse.json({ message: "Déjà inscrit" }, { status: 400 });
    }

    // 5. Création de la participation
    const participation = await prisma.participation.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
        status: "PENDING"
      }
    });

    return NextResponse.json(participation, { status: 201 });

  } catch (error) {
    // Affiche l'erreur réelle dans les logs Vercel pour le debug
    console.error("ERREUR JOIN API:", error); 
    return NextResponse.json({ 
      message: "Erreur serveur", 
      details: error.message 
    }, { status: 500 });
  }
}