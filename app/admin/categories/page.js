import { prisma } from "../../lib/prisma";
import { requireAdmin } from "../../lib/auth-utils";
import { revalidatePath } from "next/cache";

export default async function AdminCategoriesPage() {
  await requireAdmin();
  const categories = await prisma.category.findMany({ orderBy: { name: "asc" } });
  async function addCategory(formData) {
    "use server";
    const name = formData.get("name") ;
    if (name) {
      await prisma.category.create({ data: { name } });
      revalidatePath("/admin/categories");
    }
  }
  async function deleteCategory(formData) {
    "use server";
    const id = formData.get("id") ;
    await prisma.category.delete({ where: { id } });
    revalidatePath("/admin/categories");
  }

  return (
    <div className="max-w-4xl mx-auto mt-12 p-8 bg-white rounded-2xl shadow-xl">
      <h1 className="text-3xl font-bold text-black mb-8">Gestion des Catégories</h1>
      <form action={addCategory} className="flex gap-4 mb-8">
        <input 
          name="name" 
          required 
          placeholder="Nouvelle catégorie (ex: Sport)" 
          className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">
          Ajouter
        </button>
      </form>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-semibold text-gray-700">Nom</th>
              <th className="px-6 py-3 font-semibold text-gray-700 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-gray-50 transition">
                <td className="px-6 py-4 text-gray-800">{cat.name}</td>
                <td className="px-6 py-4 text-right">
                  <form action={deleteCategory}>
                    <input type="hidden" name="id" value={cat.id} />
                    <button type="submit" className="text-red-600 hover:underline font-medium">
                      Supprimer
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}