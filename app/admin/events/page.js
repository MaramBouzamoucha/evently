import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth-utils";
import Link from "next/link";
export default async function AdminEventsPage() {
  await requireAdmin();

  const events = await prisma.event.findMany({
    orderBy: { date: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-black">
          Gestion des Événements
        </h1>
        <Link href="/admin/events/new">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition">
            + Nouvel Événement
          </button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-900 text-lg">Aucun événement trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left border border-gray-300 rounded-lg">
            <thead className="bg-gray-300">
              <tr>
                <th className="px-6 py-3 border-b text-black font-semibold">Titre</th>
                <th className="px-6 py-3 border-b text-black font-semibold">Date</th>
                <th className="px-6 py-3 border-b text-black font-semibold">Lieu</th>
                <th className="px-6 py-3 border-b text-black font-semibold">Places</th>
                <th className="px-6 py-3 border-b text-black font-semibold">Prix</th>
                <th className="px-6 py-3 border-b text-black font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event, index) => (
                <tr
                  key={event.id}
                  className={`${index % 2 === 0 ? "bg-gray-100" : "bg-gray-50"} hover:bg-gray-200 transition`}
                >
                  <td className="px-6 py-3 text-black font-medium">{event.title}</td>
                  <td className="px-6 py-3 text-black">
                    {new Date(event.date).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-6 py-3 text-black">
                    {event.location || "Non défini"}
                  </td>
                  <td className="px-6 py-3 text-black">
                    {event.capacity} 
                  </td>
                  <td className="px-6 py-3 text-black font-semibold">
                    {event.price ? `${event.price}dt` : "Gratuit"}
                  </td>
                  <td className="px-6 py-3 space-x-3">
                    <Link
                      href={`/admin/events/${event.id}/edit`}
                      className="text-blue-600 font-medium hover:underline"
                    >
                      Modifier
                    </Link>
                    <Link
                      href={`/admin/events/${event.id}/delete`}
                      className="text-red-600 font-medium hover:underline"
                    >
                      Supprimer
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}