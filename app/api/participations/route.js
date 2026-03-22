import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const participations = await prisma.participation.findMany({
    where: { userId: session.user.id },
    include: {
      event: true // Pour afficher le titre, la date, etc.
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(participations);
}