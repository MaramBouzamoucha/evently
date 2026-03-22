import { NextResponse } from "next/server";
import { prisma } from "../../../lib/prisma";

export async function GET(req, { params }) {
  try {
    // ✅ Correction : Attendre les params
    const { id } = await params; 

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const event = await prisma.event.findUnique({
  where: { id },
  include: {
    category: true,
    organizer: true,
    participations: true // si tu l’utilises
  }
});

    if (!event) return NextResponse.json({ error: "Événement non trouvé" }, { status: 404 });

    return NextResponse.json(event);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
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
        capacity: capacity ? Number(capacity) : null,
        price: price ? Number(price) : null,
      },
    });

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 });
  }
}