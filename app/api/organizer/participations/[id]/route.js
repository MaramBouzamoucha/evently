import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";
import { prisma } from "../../../../lib/prisma";

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { status } = await req.json(); // "CONFIRMED" ou "REJECTED"

  if (!session || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Récupérer la participation et les détails de l'événement
      const participation = await tx.participation.findUnique({
        where: { id },
        include: { event: true }
      });

      if (!participation) throw new Error("Participation introuvable");

      // 2. Logique spécifique si on CONFIRME
      if (status === "CONFIRMED") {
        // Vérifier s'il reste de la place AVANT de décrémenter
        if (participation.event.capacity <= 0) {
          throw new Error("Capacité maximale atteinte pour cet événement");
        }

        // DECRÉMENTER la capacité de l'événement
        await tx.event.update({
          where: { id: participation.eventId },
          data: {
            capacity: { decrement: 1 }
          }
        });
      }

      // 3. Mettre à jour le statut du participant
      return await tx.participation.update({
        where: { id },
        data: { status },
      });
    });

    return NextResponse.json(result);

  } catch (error) {
    console.error("Erreur PATCH:", error.message);
    return NextResponse.json(
      { message: error.message || "Erreur de mise à jour" }, 
      { status: error.message.includes("Capacité") ? 400 : 500 }
    );
  }
}