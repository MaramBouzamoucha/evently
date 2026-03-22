"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  // Synchroniser l'état local avec la session au chargement
  useEffect(() => {
  // On ne synchronise que si on n'est pas en train d'éditer 
  // et que la session contient effectivement quelque chose
  if (session?.user?.name && !isEditing) {
    setName(session.user.name);
  }
}, [session, isEditing]);
  const handleUpdate = async () => {
    if (!name.trim()) return alert("Le nom ne peut pas être vide");

    setLoading(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Erreur lors de la mise à jour");
        setLoading(false);
        return;
      }

      const data = await res.json(); // { user: updatedUser }
      const updatedUser = data.user;

      // Mettre à jour la session côté client
      await update({
        ...session,
        user: {
          ...session.user,
          name: updatedUser.name,  // prend le nom depuis la BDD
        },
      });

      // Mettre à jour l'état local pour re-render immédiat
      setName(updatedUser.name);
      setIsEditing(false);

    } catch (err) {
      console.error(err);
      alert("Erreur serveur");
    } finally {
      setLoading(false);
    }
  };

  if (!session) return <p style={{ textAlign: "center", marginTop: "50px" }}>Chargement du profil...</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "50px auto", padding: "20px", fontFamily: "Segoe UI, sans-serif" }}>
      <div style={{ backgroundColor: "white", borderRadius: "20px", padding: "40px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)", textAlign: "center" }}>
        <div style={{
          width: "100px", height: "100px", borderRadius: "50%", backgroundColor: "#4318FF",
          color: "white", display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "36px", margin: "0 auto 20px", fontWeight: "bold", textTransform: "uppercase"
        }}>
          {name ? name.charAt(0) : session.user?.email?.charAt(0)}
        </div>

        {isEditing ? (
          <div>
            <h2 style={{ fontSize: "18px", color: "#1b2559", marginBottom: "15px" }}>Modifier votre nom</h2>
            <input
              style={{ padding: "12px", borderRadius: "10px", border: "2px solid #4318FF", width: "100%", marginBottom: "15px", textAlign: "center", fontSize: "16px", outline: "none" }}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Entrez votre nouveau nom"
              autoFocus
            />
            <button
              style={{ background: "#4318FF", color: "white", border: "none", padding: "12px 20px", borderRadius: "10px", cursor: "pointer", fontWeight: "600", width: "100%", marginBottom: "10px" }}
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Enregistrement..." : "Confirmer le changement"}
            </button>
            <button
              style={{ background: "#f4f7fe", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", color: "#707eae", fontWeight: "600" }}
              onClick={() => { setIsEditing(false); setName(session.user.name); }}
            >
              Annuler
            </button>
          </div>
        ) : (
          <div>
            <h1 style={{ fontSize: "24px", color: "#1b2559", marginBottom: "5px" }}>{name || "Utilisateur"}</h1>
            <p style={{ color: "#a3aed0", marginBottom: "30px" }}>{session.user.email}</p>
            <div style={{
              display: 'inline-block', padding: '6px 16px', background: '#E5E7EB',
              borderRadius: '20px', color: '#1F2937', fontWeight: 'bold', fontSize: '12px', marginBottom: "30px"
            }}>
              Rôle : {session.user.role}
            </div>
            <div style={{ borderTop: "1px solid #f4f7fe", paddingTop: "20px" }}>
              <button
                style={{ background: "#f4f7fe", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer", color: "#707eae", fontWeight: "600" }}
                onClick={() => setIsEditing(true)}
              >
                ✏️ Modifier mon profil
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}