
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";



export async function DELETE(req, { params }) {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZER") {
    return new Response("Unauthorized", { status: 401 });
  }

  const { id } =await params;

  const event = await prisma.event.findUnique({
    where: { id },
  });

  if (!event) {
    return new Response("Event not found", { status: 404 });
  }

  if (event.organizerId !== session.user.id) {
    return new Response("Forbidden", { status: 403 });
  }

  await prisma.event.delete({
    where: { id },
  });

  return new Response("Deleted", { status: 200 });
}
