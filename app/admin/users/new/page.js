import { prisma } from "../../../lib/prisma";
import { requireAdmin } from "../../../lib/auth-utils";
import { redirect } from "next/navigation";

export default async function NewUserPage() {
  await requireAdmin();

  return (
    <div className="max-w-lg mx-auto mt-10 p-8 bg-white rounded-2xl shadow-lg">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Ajouter un utilisateur
      </h1>

      <form action={addUserAction} className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
          <input
            name="name"
            required
            placeholder="Nom complet"
            className=" text-black w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            name="email"
            required
            placeholder="email@example.com"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Mot de passe */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
          <input
            type="password"
            name="password"
            required
            placeholder="••••••••"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />
        </div>

        {/* Rôle */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
          <select
            name="role"
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none transition text-black"
          >
            <option value="USER">USER</option>
            <option value="ADMIN">ADMIN</option>
            <option value="ORGANIZER">ORGANIZER</option>
          </select>
        </div>

        {/* Bouton */}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-lg shadow-md transition"
        >
          Ajouter
        </button>
      </form>
    </div>
  );
}

// Action server-side
async function addUserAction(formData) {
  "use server";

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const role = formData.get("role");

  const bcrypt = require("bcryptjs");
  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword, role },
  });

  redirect("/admin/users");
}
