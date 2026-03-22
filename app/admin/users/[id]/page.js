"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditUserPage() {
  const router = useRouter();
  const params = useParams();
  const userId = params.id;

  const [user, setUser] = useState({ name: "", email: "", role: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Récupérer l'utilisateur
  useEffect(() => {
    if (!userId) return;

    async function fetchUser() {
      try {
        const res = await fetch(`/api/users/${userId}`);
        if (!res.ok) throw new Error("Impossible de récupérer l'utilisateur");
        const data = await res.json();
        setUser({
          name: data.name || "",
          email: data.email || "",
          role: data.role || "",
        });
      } catch (err) {
        setError(err.message);
      }
    }

    fetchUser();
  }, [userId]);

  // Gestion des inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  // Envoi des modifications
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!user.name || !user.email || !user.role) {
      setError("Tous les champs sont obligatoires");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
      });

      if (!res.ok) throw new Error("Erreur lors de la mise à jour");

      router.push("/admin/users");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h1>Modifier l'utilisateur</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          placeholder="Nom"
          required
        />
        <input
          type="email"
          name="email"
          value={user.email}
          onChange={handleChange}
          placeholder="Email"
          required
        />
        <select
          name="role"
          value={user.role}
          onChange={handleChange}
          required
        >
          <option value="">-- Sélectionnez un rôle --</option>
          <option value="admin">Admin</option>
          <option value="user">Utilisateur</option>
        </select>

        <button type="submit" disabled={loading}>
          {loading ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>

      <style jsx>{`
        .container {
          max-width: 1000px;
          margin: 50px auto;
          padding: 30px;
          background: #ffffff;
          border-radius: 12px;
          box-shadow: 0 5px 25px rgba(0, 0, 0, 0.1);
          font-family: Arial, sans-serif;
          color: #333;
        }

        h1 {
          font-size: 2rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        form {
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        input,
        select {
          padding: 10px 12px;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          width: 100%;
        }

        input:focus,
        select:focus {
          outline: none;
          border-color: #007bff;
          box-shadow: 0 0 0 2px rgba(0, 123, 255, 0.2);
        }

        button {
          background: #007bff;
          color: white;
          padding: 10px 16px;
          border: none;
          border-radius: 6px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s ease;
        }

        button:hover {
          background: #0056b3;
        }

        button:disabled {
          background: #a0c4ff;
          cursor: not-allowed;
        }

        .error {
          color: #d9534f;
          margin-bottom: 10px;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
}