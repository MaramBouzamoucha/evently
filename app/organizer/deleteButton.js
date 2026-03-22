"use client"; // Indispensable pour le clic
import { useRouter } from "next/navigation";

export default function DeleteButton({ eventId }) {
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm("Voulez-vous vraiment supprimer cet événement ?")) return;

    const res = await fetch(`/api/events/delete/${eventId}`, {
      method: "DELETE",
    });

    if (res.ok) {
      router.refresh(); // Recharge les données sans changer de page
    } else {
      alert("Erreur lors de la suppression");
    }
  };

  return (
    // Dans deleteButton.js
<button 
  onClick={handleDelete}
  style={{
    backgroundColor: 'transparent',
    color: '#EE5D50',
    border: 'none',
    fontWeight: 'bold',
    cursor: 'pointer',
    fontSize: '14px'
  }}
>
  🗑️ Supprimer
</button>
  );
}