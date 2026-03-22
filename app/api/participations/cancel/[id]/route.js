import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/prisma"; // adapte le chemin si nécessaire

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

    await prisma.participation.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Participation annulée" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}