
import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth-utils";
import Link from "next/link";
import DeleteButton from "./deleteButton";

export default async function AdminUsersPage() {
  await requireAdmin();

  const users = await prisma.user.findMany({
  });

  return (
    <div className="max-w-6xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Gestion des utilisateurs</h1>
        <Link href="/admin/users/new">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md transition">
            + Ajouter Utilisateur
          </button>
        </Link>
      </div>

      {/* Table */}
      {users.length === 0 ? (
        <p className="text-gray-600">Aucun utilisateur trouvé.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white shadow rounded-lg overflow-hidden">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left px-6 py-3 text-gray-700 font-medium">Nom</th>
                <th className="text-left px-6 py-3 text-gray-700 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-700 font-medium">Rôle</th>
                <th className="text-left px-6 py-3 text-gray-700 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-black">{user.name}</td>
                  <td className="px-6 py-4 text-black">{user.email}</td>
                  <td className="px-6 py-4 capitalize text-black">{user.role}</td>
                  <td className="px-6 py-4 space-x-2">
                    <Link
                      href={`/admin/users/${user.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      Modifier
                    </Link>
                    <span className="text-gray-400">|</span>
                   
              
              <DeleteButton id={user.id} />
            
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
