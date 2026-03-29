import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma";

export async function DELETE(req, { params }) {
  try {
    const { id } = await params;

    if (!id) return NextResponse.json({ error: "ID manquant" }, { status: 400 });

    const participation = await prisma.participation.findUnique({
      where: { id },
    });

    if (!participation) {
      return NextResponse.json({ error: "Participation introuvable" }, { status: 404 });
    }

    await prisma.$transaction([
  prisma.participation.delete({
    where: { id },
  }),
  prisma.event.update({
    where: { id: participation.eventId },
    data: {
      placesRestantes: {
        increment: 1
      }
    }
  })
]);

    return NextResponse.json({ success: true, message: "Participation annulée" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}