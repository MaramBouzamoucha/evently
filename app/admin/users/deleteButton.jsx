"use client";

import { useRouter } from "next/navigation";

export default function DeleteButton({ id }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
      const res = await fetch(`/api/users/${id}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // C'est ICI qu'on rafraîchit la page côté client
        router.refresh(); 
      } else {
        alert("Erreur lors de la suppression");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="text-red-600 hover:underline font-medium cursor-pointer"
    >
      Supprimer
    </button>
  );
}