"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterOrganizer() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/organizerRegister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) {
        const text = await res.text();
        setError(text);
        setLoading(false);
        return;
      }
      router.push("/loginOrganizer");
    } catch (err) {
      setError("Une erreur est survenue.");
      setLoading(false);
    }
  };

  // Styles CSS en objets (Design vibrant et pro)
  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f4f7fe 0%, #e0e7ff 100%)',
      fontFamily: '"Segoe UI", Roboto, sans-serif',
      padding: '20px'
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '40px',
      borderRadius: '30px',
      boxShadow: '0px 20px 40px rgba(112, 144, 176, 0.15)',
      width: '100%',
      maxWidth: '400px',
      textAlign: 'center'
    },
    logo: {
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #4318FF 0%, #9919FE 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold',
      fontSize: '24px',
      margin: '0 auto 20px auto',
      boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)'
    },
    title: {
      color: '#2b3674',
      fontSize: '28px',
      fontWeight: '800',
      marginBottom: '10px',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#a3aed0',
      fontSize: '15px',
      marginBottom: '30px'
    },
    input: {
      width: '100%',
      padding: '15px 20px',
      borderRadius: '16px',
      border: '1px solid #e0e7ff',
      backgroundColor: '#f8faff',
      marginBottom: '15px',
      fontSize: '15px',
      color: '#2b3674',
      outline: 'none',
      boxSizing: 'border-box',
      transition: 'border 0.2s'
    },
    button: {
      width: '100%',
      padding: '16px',
      borderRadius: '16px',
      border: 'none',
      background: loading ? '#ccc' : 'linear-gradient(135deg, #4318FF 0%, #9919FE 100%)',
      color: 'white',
      fontSize: '16px',
      fontWeight: 'bold',
      cursor: loading ? 'not-allowed' : 'pointer',
      boxShadow: '0px 10px 20px rgba(67, 24, 255, 0.2)',
      marginTop: '10px',
      transition: 'transform 0.2s'
    },
    error: {
      backgroundColor: '#fff5f5',
      color: '#e53e3e',
      padding: '12px',
      borderRadius: '12px',
      fontSize: '13px',
      marginBottom: '20px',
      fontWeight: '500'
    },
    footer: {
      marginTop: '25px',
      fontSize: '14px',
      color: '#a3aed0'
    },
    link: {
      color: '#4318FF',
      fontWeight: 'bold',
      textDecoration: 'none',
      cursor: 'pointer'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.logo}>E</div>
        <h1 style={styles.title}>Inscription</h1>
        <p style={styles.subtitle}>Créez votre compte organisateur</p>

        {error && <div style={styles.error}>⚠️ {error}</div>}

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Nom complet"
            style={styles.input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <input
            type="email"
            placeholder="Adresse email"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Mot de passe"
            style={styles.input}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            style={styles.button}
            onMouseOver={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseOut={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? "Création en cours..." : "S'inscrire"}
          </button>
        </form>

        <p style={styles.footer}>
          Déjà un compte ?{" "}
          <span 
            style={styles.link} 
            onClick={() => router.push("/loginOrganizer")}
          >
            Se connecter
          </span>
        </p>
      </div>
    </div>
  );
}