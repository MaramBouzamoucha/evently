"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const eventId = params.id;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [capacity, setCapacity] = useState("");
  const [price, setPrice] = useState("");
  const [date, setDate] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) {
          setError("Impossible de récupérer l'événement");
          return;
        }
        const data = await res.json();
        setTitle(data.title || "");
        setDescription(data.description || "");
        setCapacity(data.capacity || "");
        setPrice(data.price || "");
        setDate(data.date ? data.date.slice(0, 10) : "");
        setImage(data.image);
        setPreview(data.image);
      } catch (err) {
        setError("Erreur serveur lors de la récupération");
      }
    }

    if (eventId) fetchEvent();
  }, [eventId]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setImage(reader.result);
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, date, image, capacity, price }),
      });

      if (!res.ok) {
        setError("Erreur lors de la mise à jour");
        setLoading(false);
        return;
      }

      router.push("/organizer");
    } catch (err) {
      setError("Erreur serveur");
      setLoading(false);
    }
  };

  const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px', fontFamily: 'Arial', backgroundColor: '#f4f7fe' },
    card: { backgroundColor: '#fff', borderRadius: '20px', padding: '40px', maxWidth: '600px', width: '100%', boxShadow: '0 5px 15px rgba(0,0,0,0.1)' },
    label: { display: 'block', marginBottom: '6px', fontWeight: '600', color: '#2b3674' },
    // ✅ Ajout explicite de color: 'black' ici
    input: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', color: 'black' },
    textarea: { width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '8px', border: '1px solid #ccc', outline: 'none', minHeight: '100px', color: 'black' },
    fileInputContainer: { padding: '12px', border: '2px dashed #ccc', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', cursor: 'pointer', color: 'black' },
    preview: { width: '100%', maxHeight: '250px', objectFit: 'cover', borderRadius: '8px', marginTop: '10px' },
    button: { padding: '12px 20px', border: 'none', borderRadius: '8px', backgroundColor: '#4318FF', color: 'white', fontWeight: '600', cursor: 'pointer' },
    cancel: { textDecoration: 'none', color: '#555', marginRight: '10px' },
    error: { background: '#ffe5e5', padding: '10px', borderRadius: '6px', color: '#e53e3e', marginBottom: '20px' },
    header: { marginBottom: '30px', color: '#2b3674', fontSize: '24px', fontWeight: '700' }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.header}>Modifier l'événement</h1>
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Titre</label>
          <input style={styles.input} value={title} onChange={(e) => setTitle(e.target.value)} />

          <label style={styles.label}>Description</label>
          <textarea style={styles.textarea} value={description} onChange={(e) => setDescription(e.target.value)} />

          {/* ✅ Correction : Utilisation de <input> au lieu de <text> et lien avec la bonne variable */}
          <label style={styles.label}>Capacité</label>
          <input type="number" style={styles.input} value={capacity} onChange={(e) => setCapacity(e.target.value)} />

          <label style={styles.label}>Prix</label>
          <input type="number" style={styles.input} value={price} onChange={(e) => setPrice(e.target.value)} />

          <label style={styles.label}>Date</label>
          <input style={styles.input} type="date" value={date} onChange={(e) => setDate(e.target.value)} />

          <label style={styles.label}>Image</label>
          <div style={styles.fileInputContainer}>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {preview && <img src={preview} alt="Aperçu" style={styles.preview} />}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <Link href="/organizer" style={styles.cancel}>Annuler</Link>
            <button type="submit" style={styles.button} disabled={loading}>
              {loading ? "Chargement..." : "Enregistrer"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}