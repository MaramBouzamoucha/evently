import { NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";


export async function POST(req) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  try {
    const { eventId } = await req.json();

    // Vérifier si déjà inscrit
    const existing = await prisma.participation.findFirst({
      where: { userId: session.user.id, eventId }
    });

    if (existing) {
      return NextResponse.json({ message: "Déjà inscrit" }, { status: 400 });
    }

    const participation = await prisma.participation.create({
      data: {
        userId: session.user.id,
        eventId: eventId,
        status: "PENDING"
      }
    });

    return NextResponse.json(participation, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}