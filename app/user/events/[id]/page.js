"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getSession } from "next-auth/react";

export default function EventDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [userId, setUserId] = useState(null);
  const [userParticipation, setUserParticipation] = useState(null);
  const [myParticipations, setMyParticipations] = useState([]);

  // 🔹 Récupérer la session utilisateur
  useEffect(() => {
    async function fetchUser() {
      const session = await getSession();
      if (session?.user) setUserId(session.user.id);
    }
    fetchUser();
  }, []);

  // 🔹 Récupérer l'événement
  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Erreur lors de la récupération de l'événement");
        const data = await res.json();
        setEvent(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  // 🔹 Vérifier la participation de l'utilisateur
  useEffect(() => {
  async function fetchMyParticipations() {
    const res = await fetch("/api/participations");
    const data = await res.json();
    setMyParticipations(data);
  }
  fetchMyParticipations();
}, []);
useEffect(() => {
  if (!event || myParticipations.length === 0) return;

  const participation = myParticipations.find(
    (p) => p.eventId === event.id
  );

  setUserParticipation(participation || null);
}, [event, myParticipations]);
console.log("Participation ID:", userParticipation?.id);
  // 🔹 Annuler la participation
  const handleCancel = async () => {
  if (!userParticipation) return;

  if (confirm("Annuler votre participation ?")) {
    const res = await fetch(`/api/participations/cancel/${userParticipation.id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    console.log("Response:", data);

    if (res.ok) {
      alert("Participation annulée !");
      setUserParticipation(null);
    } else {
      alert(data.error);
    }
  }
};

  if (loading) return <p style={styles.center}>Chargement des détails...</p>;
  if (!event) return <p style={styles.center}>Événement introuvable.</p>;

  return (
    <div style={styles.container}>
      <button onClick={() => router.back()} style={styles.backBtn}>
        ← Retour
      </button>

      <div style={styles.card}>
        <img
          src={event.image || "https://via.placeholder.com/800x400"}
          alt={event.title}
          style={styles.image}
        />

        <div style={styles.content}>
          <div style={styles.badge}>{event.category?.name || "Sans catégorie"}</div>
          <h1 style={styles.title}>{event.title}</h1>

          <div style={styles.infoGrid}>
            <div style={styles.infoItem}>📅 <strong>Date :</strong> {new Date(event.date).toLocaleDateString()}</div>
            <div style={styles.infoItem}>📍 <strong>Lieu :</strong> {event.location || "Non défini"}</div>
            <div style={styles.infoItem}>💰 <strong>Prix :</strong> {!event.price || event.price === 0 ? "Gratuit" : `${event.price} DT`}</div>
            <div style={styles.infoItem}>👥 <strong>Capacité :</strong> {event.capacity || "Illimitée"}</div>
            <div style={styles.infoItem}>👤 <strong>Organisateur :</strong> {event.organizer?.name || event.organizer?.email || "Inconnu"}</div>
          </div>

          <p style={styles.description}>{event.description}</p>

          {/* 🔹 Bouton Annuler si inscrit */}
          {userParticipation && (
  <>
    <div
      style={{
        ...styles.statusBox,
        backgroundColor:
          userParticipation.status === "CONFIRMED"
            ? "#D1FAE5"
            : "#FEF3C7",
      }}
    >
      {userParticipation.status === "PENDING"
        ? "⏳ En attente"
        : "✅ Confirmé"}
    </div>

    <button onClick={handleCancel} style={styles.cancelBtn}>
      Annuler ma participation
    </button>
  </>
)}
        </div>
      </div>
    </div>
  );
}

// 🎨 Styles
const styles = {
  container: { maxWidth: "850px", margin: "40px auto", padding: "0 20px", fontFamily: "Segoe UI, sans-serif" },
  center: { textAlign: "center", marginTop: "60px", fontSize: "18px" },
  backBtn: { background: "none", border: "none", color: "#4318FF", cursor: "pointer", fontWeight: "bold", marginBottom: "20px" },
  card: { background: "white", borderRadius: "20px", overflow: "hidden", boxShadow: "0 10px 30px rgba(0,0,0,0.1)" },
  image: { width: "100%", maxHeight: "350px", objectFit: "cover" },
  content: { padding: "35px" },
  badge: { display: "inline-block", padding: "6px 14px", background: "#F4F7FE", color: "#4318FF", borderRadius: "8px", fontSize: "12px", fontWeight: "bold", marginBottom: "15px" },
  title: { fontSize: "30px", color: "#1B2559", marginBottom: "20px" },
  infoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px", padding: "20px", background: "#F8F9FF", borderRadius: "12px" },
  infoItem: { fontSize: "14px", color: "#1B2559" },
  description: { lineHeight: "1.7", color: "#707EAE", fontSize: "15px", marginBottom: "30px" },
  cancelBtn: { width: "100%", padding: "14px", background: "#e11d48", color: "white", border: "none", borderRadius: "10px", fontSize: "15px", fontWeight: "bold", cursor: "pointer", marginTop: "15px" },
  statusBox: { padding: "18px", borderRadius: "10px", textAlign: "center", fontWeight: "bold", color: "#1B2559" },
};