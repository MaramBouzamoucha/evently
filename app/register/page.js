"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("USER"); // <-- choix par défaut
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!name || !email || !password || !role) {
      setError("Tous les champs sont obligatoires");
      setLoading(false);
      return;
    }

    if (!email.includes("@")) {
      setError("Email invalide");
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push("/login");
      } else {
        setError(data.message || "Une erreur est survenue");
        setLoading(false);
      }
    } catch (err) {
      console.error(err);
      setError("Erreur serveur, réessayez plus tard");
      setLoading(false);
    }
  };

  const styles = {
    container: { display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: "linear-gradient(135deg, #f4f7fe 0%, #e0e7ff 100%)", fontFamily: '"Segoe UI", Roboto, sans-serif', padding: "20px" },
    card: { backgroundColor: "#ffffff", padding: "40px", borderRadius: "30px", boxShadow: "0px 20px 40px rgba(112, 144, 176, 0.12)", width: "100%", maxWidth: "450px", textAlign: "center" },
    title: { color: "#2b3674", fontSize: "28px", fontWeight: "800", marginBottom: "10px", letterSpacing: "-1px" },
    subtitle: { color: "#a3aed0", fontSize: "15px", marginBottom: "30px" },
    label: { display: "block", color: "#2b3674", fontSize: "14px", fontWeight: "700", marginBottom: "8px", textAlign: "left", marginLeft: "4px" },
    input: { width: "100%", padding: "12px 20px", borderRadius: "16px", border: "1px solid #e0e7ff", backgroundColor: "#ffffff", fontSize: "15px", color: "#2b3674", outline: "none", boxSizing: "border-box", marginBottom: "15px" },
    button: { width: "100%", padding: "16px", borderRadius: "16px", border: "none", background: "linear-gradient(135deg, #4318FF 0%, #9919FE 100%)", color: "white", fontSize: "16px", fontWeight: "bold", cursor: "pointer", boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)", marginTop: "10px" },
    error: { backgroundColor: "#fff5f5", color: "#e53e3e", padding: "12px", borderRadius: "12px", marginBottom: "20px", fontSize: "14px" },
    footerText: { marginTop: "20px", fontSize: "14px", color: "#a3aed0" },
    footerLink: { color: "#4318FF", fontWeight: "bold", textDecoration: "none" },
    select: { width: "100%", padding: "12px 20px", borderRadius: "16px", border: "1px solid #e0e7ff", marginBottom: "15px", fontSize: "15px", color: "#2b3674", backgroundColor: "#fff" },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Créer un compte 🎟️</h1>
        <p style={styles.subtitle}>Rejoignez Evently et participez à nos événements</p>

        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Nom complet</label>
          <input type="text" placeholder="Jean Dupont" style={styles.input} value={name} onChange={(e) => setName(e.target.value)} required />

          <label style={styles.label}>Adresse email</label>
          <input type="email" placeholder="email@example.com" style={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} required />

          <label style={styles.label}>Mot de passe</label>
          <input type="password" placeholder="••••••••" style={styles.input} value={password} onChange={(e) => setPassword(e.target.value)} required />

          <label style={styles.label}>Rôle</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} style={styles.select}>
            <option value="USER">Utilisateur</option>
            <option value="ORGANIZER">Organisateur</option>
          </select>

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Chargement..." : "S'inscrire"}
          </button>
        </form>

        <p style={styles.footerText}>
          Déjà un compte ? <Link href="/login" style={styles.footerLink}>Se connecter</Link>
        </p>
      </div>
    </div>
  );
}