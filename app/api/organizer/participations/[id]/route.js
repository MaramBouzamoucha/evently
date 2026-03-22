import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

const prisma = new PrismaClient();

export async function PATCH(req, { params }) {
  const session = await getServerSession(authOptions);
  const { id } = await params;
  const { status } = await req.json(); // "CONFIRMED" ou "REJECTED"

  if (!session || session.user.role !== "ORGANIZER") {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }

  try {
    const updated = await prisma.participation.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json(updated);
  } catch (error) {
    return NextResponse.json({ message: "Erreur de mise à jour" }, { status: 500 });
  }
}