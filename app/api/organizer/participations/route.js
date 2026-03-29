import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import {prisma} from "../../../lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ message: "Accès refusé" }, { status: 403 });
  }

  try {
    const participations = await prisma.participation.findMany({
      where: {
        event: {
          organizerId: session.user.id, 
        },
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
        event: {
          select: {
            title: true,
            date: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(participations);
  } catch (error) {
    console.error("Erreur participations:", error);
    return NextResponse.json({ message: "Erreur serveur" }, { status: 500 });
  }
}