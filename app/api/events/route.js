import { NextResponse } from "next/server";
import { prisma } from "../../lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../../lib/auth";
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json([], { status: 200 });
  }

  const events = await prisma.event.findMany({
    include: {
      category: true,
      organizer: {
        select: { name: true, email: true }
      },
      participations: {
        where: {
          userId: session.user.id,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  const formattedEvents = events.map((event) => ({
    ...event,
    participation: event.participations[0] || null,
  }));

  return NextResponse.json(formattedEvents);
}



export async function PATCH(req, { params }) {
  try {
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