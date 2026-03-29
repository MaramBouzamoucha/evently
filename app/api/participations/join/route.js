import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import {prisma}from "../../../lib/prisma"; 
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user?.id) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { eventId } = await req.json();
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      
    });

    if (!event) {
      return NextResponse.json({ message: "Événement introuvable" }, { status: 404 });
    }
    if (event.placesRestantes <= 0) {
      return NextResponse.json(
        { message: "Désolé, cet événement est complet !" }, 
        { status: 400 }
      );
    }

    const existing = await prisma.participation.findFirst({
      where: { userId: session.user.id, eventId }
    });
    if (existing) {
      return NextResponse.json({ message: "Vous êtes déjà inscrit" }, { status: 400 });
    }
    const participation = await prisma.$transaction([
  prisma.participation.create({
    data: {
      userId: session.user.id,
      eventId: eventId,
      status: "PENDING"
    }
  }),
  prisma.event.update({
    where: { id: eventId },
    data: {
      placesRestantes: {
        decrement: 1
      }
    }
  })
]);

    return NextResponse.json(participation[0], { status: 201 });

  } catch (error) {
    console.error("Erreur Join API:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}