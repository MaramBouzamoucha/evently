import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import {prisma}from "../../../lib/prisma"; // <--- ASSURE-TOI QUE CET IMPORT EST CORRECT
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { eventId } = await req.json();

    // 1. Récupérer l'événement ET le compte des participations actuelles
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { participations: true } // Compte auto les participations liées
        }
      }
    });

    if (!event) {
      return NextResponse.json({ message: "Événement introuvable" }, { status: 404 });
    }

    // 2. Vérifier si l'événement est complet
    // On compare le nombre actuel au champ 'capacity' de ton modèle Event
    if (event._count.participations >= event.capacity) {
      return NextResponse.json(
        { message: "Désolé, cet événement est complet !" }, 
        { status: 400 }
      );
    }

    // 3. Vérifier si l'utilisateur est déjà inscrit (pour éviter les doublons)
    const existing = await prisma.participation.findFirst({
      where: { userId: session.user.id, eventId }
    });

    if (existing) {
      return NextResponse.json({ message: "Vous êtes déjà inscrit" }, { status: 400 });
    }

    // 4. Créer la participation si tout est OK
    const participation = await prisma.participation.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
        status: "PENDING" // Ou "PENDING" selon ta logique
      }
    });

    return NextResponse.json(participation, { status: 201 });

  } catch (error) {
    console.error("Erreur Join API:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}