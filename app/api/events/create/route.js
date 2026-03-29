import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { prisma } from "../../../lib/prisma"; 
export async function POST(req) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || (session.user.role !== "ORGANIZER" && session.user.role !== "ADMIN")) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401, headers: { "Content-Type": "application/json" } });
    }

    const { title, description, date, image, capacity, price, location, categoryId } = await req.json();

    if (!title || !description || !date || !capacity || !price || !location || !categoryId) {
      return new Response(JSON.stringify({ message: "Tous les champs sont obligatoires" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const event = await prisma.event.create({
      data: {
        title,
        description,
        date: new Date(date),
        image: image || "",
        location,
        capacity: Number(capacity),
        placesRestantes: Number(capacity),
        price: Number(price),
        organizer: {
          connect: { id: session.user.id },
        },
        category: {
          connect: { id: categoryId },
        },
      },
    });
    console.log({ title, description, date, image, capacity, price, location, categoryId });

    return new Response(JSON.stringify({ message: "Événement créé", event }), {
      status: 201,
      headers: { "Content-Type": "application/json" }
    });
  } catch (err) {
    console.error("Erreur API create event:", err);
    return new Response(JSON.stringify({ message: "Erreur serveur" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}




