"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditEvent() {
  const router = useRouter();
  const params = useParams();
  const eventId = params?.id;

  const [event, setEvent] = useState({
    title: "",
    description: "",
    date: "",
    capacity: "",
    price: "",
    image: "",
  });

  const [preview, setPreview] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ✅ Fetch event
  useEffect(() => {
    if (!eventId) return;

    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${eventId}`);
        if (!res.ok) {
          setError("Erreur lors du chargement");
          return;
        }

        const data = await res.json();

        setEvent({
          title: data.title || "",
          description: data.description || "",
          date: data.date ? data.date.slice(0, 10) : "",
          capacity: data.capacity || "",
          price: data.price || "",
          image: data.image || "",
        });

        setPreview(data.image);
      } catch {
        setError("Erreur serveur");
      }
    }

    fetchEvent();
  }, [eventId]);

  // ✅ handle change
  const handleChange = (e) => {
    setEvent({
      ...event,
      [e.target.name]: e.target.value,
    });
  };

  // ✅ image preview
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setEvent({ ...event, image: reader.result });
      setPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // ✅ submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/events/${eventId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(event),
      });

      if (!res.ok) {
        setError("Erreur lors de la modification");
        return;
      }

      router.push("/admin/events");
    } catch {
      setError("Erreur serveur");
    }

    setLoading(false);
  };

  return (
    <div className="container">
      <h1>Modifier l'événement</h1>

      {error && <p className="error">{error}</p>}

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          value={event.title}
          onChange={handleChange}
          placeholder="Titre"
        />

        <input
          type="date"
          name="date"
          value={event.date}
          onChange={handleChange}
        />

        <input
          type="number"
          name="capacity"
          value={event.capacity}
          onChange={handleChange}
          placeholder="Capacité"
        />

        <input
          type="number"
          name="price"
          value={event.price}
          onChange={handleChange}
          placeholder="Prix"
        />

        <textarea
          name="description"
          value={event.description}
          onChange={handleChange}
          placeholder="Description"
        />

        <input type="file" onChange={handleImageChange} />

        {preview && <img src={preview} className="preview" />}

        <button type="submit">
          {loading ? "Chargement..." : "Modifier"}
        </button>
      </form>

      {/* ✅ CSS DANS LA MÊME PAGE */}
      <style jsx>{`
  .container {
    width: 400px;
    margin: 50px auto;
    padding: 25px;
    background: #ffffff;
    border-radius: 10px;
    box-shadow: 0 5px 20px rgba(0, 0, 0, 0.1);
    font-family: Arial, sans-serif;
    color: #333; /* ✅ IMPORTANT */
  }

  h1 {
    text-align: center;
    margin-bottom: 20px;
    color: #222; /* ✅ */
  }

  .form {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  input,
  textarea {
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 14px;
    color: #000; /* ✅ texte visible */
    background: #fff; /* ✅ fond blanc */
  }

  textarea {
    resize: none;
    height: 80px;
  }

  input::placeholder,
  textarea::placeholder {
    color: #888; /* ✅ placeholder visible */
  }

  input:focus,
  textarea:focus {
    border-color: #007bff;
    outline: none;
  }

  button {
    background: #007bff;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-size: 15px;
  }

  button:hover {
    background: #0056b3;
  }

  .preview {
    width: 100%;
    height: 150px;
    object-fit: cover;
    border-radius: 6px;
    margin-top: 10px;
  }

  .error {
    color: red;
    text-align: center;
  }
`}</style>
    </div>
  );
}