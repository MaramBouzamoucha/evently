import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
import {prisma}from "../../lib/prisma"; 
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ message: "Non autorisé" }, { status: 401 });

  const participations = await prisma.participation.findMany({
    where: { userId: session.user.id },
    include: {
      event: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(participations);
}