import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getSession } from "../../lib/auth-utils";
export async function GET() {
  
    // ✅ Correction : Attendre les params
    const session = await getSession();
    
    const events = await prisma.event.findMany({
      include: {
        category: true,   // Important pour ne pas avoir d'erreur d'affichage
        organizer: {
          select: { name: true, email: true } // Sécurité : on ne prend pas le mot de passe
        },
        participations: {
        where: {
          userId: session.user.id,
        },
      },
      },
      orderBy: {
        date: 'asc'
      }
    });
    const formattedEvents = events.map((event) => ({
    ...event,
    // On extrait la participation si elle existe
    participation: event.participations[0] || null, 
  }));

  return NextResponse.json(formattedEvents);
}



export async function PATCH(req, { params }) {
  try {
    // ✅ Correction : Attendre les params
    const { id } = await params; 
    const body = await req.json();
    const { title, description, date, image,capacity,price } = body;

    const updatedEvent = await prisma.event.update({
      where: { id },
      data: {
        title,
        description,
        date: new Date(date),
        image,
        capacity,
        price,
      },
    });

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}