import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

import {prisma} from "../../../../lib/prisma";
export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { status } = await req.json(); // "CONFIRMED" ou "REJECTED"

  if (!session || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    // On utilise une transaction pour lier la vérification et la mise à jour
    const result = await prisma.$transaction(async (tx) => {
      
      // 1. Récupérer la participation et les détails de l'événement
      const participation = await tx.participation.findUnique({
        where: { id },
        include: { event: true }
      });

      if (!participation) throw new Error("Participation introuvable");

      // 2. Si l'organisateur confirme, on vérifie s'il reste de la place
      if (status === "CONFIRMED") {
        // On compte combien sont déjà CONFIRMED pour cet événement
        const confirmedCount = await tx.participation.count({
          where: { 
            eventId: participation.eventId, 
            status: "CONFIRMED" 
          }
        });

        if (confirmedCount >= participation.event.capacity) {
          throw new Error("Capacité maximale atteinte pour cet événement");
        }
      }
      if (status === "CONFIRMED") {
      await tx.event.update({
        where: { id: updatedParticipation.eventId },
        data: {
          capacity: {
            decrement: 1 // <--- C'est cette commande qui change tout !
          }
        }
      });
    }

      // 3. Mettre à jour le statut
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