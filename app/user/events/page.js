"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

const styles = `
  :root {
    --primary: #6366f1;
    --primary-dark: #4f46e5;
    --primary-light: #818cf8;
    --accent: #ec4899;
    --text-dark: #0f172a;
    --text-gray: #64748b;
    --text-light: #94a3b8;
    --bg-primary: #f8fafc;
    --bg-secondary: #ffffff;
    --border: #e2e8f0;
    --border-light: #f1f5f9;
  }

  * {
    box-sizing: border-box;
  }

  .events-page {
    min-height: 100vh;
    background: linear-gradient(135deg, var(--bg-primary) 0%, #f1f5f9 100%);
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    color: var(--text-dark);
    line-height: 1.6;
  }

  .events-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: linear-gradient(135deg, var(--bg-primary) 0%, #f1f5f9 100%);
  }

  .events-spinner {
    width: 48px;
    height: 48px;
    border: 4px solid var(--border);
    border-top-color: var(--primary);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  .events-loading-text {
    font-size: 16px;
    color: var(--text-gray);
    font-weight: 500;
  }

  .events-header {
    background: var(--bg-secondary);
    border-bottom: 1px solid var(--border);
    padding: 40px 0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
    position: sticky;
    top: 0;
    z-index: 10;
  }

  .events-header-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 32px;
  }

  .events-header-text {
    flex: 1;
  }

  .events-header-text h1 {
    font-size: 36px;
    font-weight: 800;
    color: var(--text-dark);
    margin: 0 0 12px 0;
    letter-spacing: -0.02em;
  }

  .events-header-text p {
    font-size: 16px;
    color: var(--text-gray);
    margin: 0;
    line-height: 1.5;
  }

  .events-btn-primary {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    border: none;
    padding: 12px 28px;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    white-space: nowrap;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
    text-decoration: none;
  }

  .events-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(99, 102, 241, 0.3);
  }

  .events-btn-primary:active {
    transform: translateY(0);
  }

  .events-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 48px 24px;
  }

  .events-filters {
    display: flex;
    gap: 16px;
    margin-bottom: 40px;
    flex-wrap: wrap;
  }

  .events-filters select,
  .events-filters input {
    flex: 1;
    min-width: 200px;
    padding: 12px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    font-size: 15px;
    font-family: inherit;
    background: var(--bg-secondary);
    color: var(--text-dark);
    transition: all 0.2s ease;
  }

  .events-filters select {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 20px;
    padding-right: 36px;
  }

  .events-filters select:focus,
  .events-filters input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
  }

  .events-filters input::placeholder {
    color: var(--text-light);
  }

  .events-empty {
    text-align: center;
    padding: 80px 24px;
    color: var(--text-gray);
    font-size: 18px;
    font-weight: 500;
  }

  .events-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 28px;
  }

  .event-card {
    background: var(--bg-secondary);
    border: 1px solid var(--border);
    border-radius: 14px;
    overflow: hidden;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    height: 100%;
  }

  .event-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    border-color: var(--primary-light);
  }

  .event-image-wrapper {
    position: relative;
    overflow: hidden;
    height: 200px;
    background: linear-gradient(135deg, var(--bg-primary) 0%, var(--border-light) 100%);
  }

  .event-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.4s ease;
  }

  .event-card:hover .event-image {
    transform: scale(1.08);
  }

  .event-date-badge {
    position: absolute;
    top: 16px;
    left: 16px;
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    padding: 8px 14px;
    border-radius: 8px;
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
  }

  .event-content {
    padding: 24px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }

  .event-meta {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 12px;
    font-weight: 700;
    color: var(--primary);
    margin-bottom: 14px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  .event-meta-item {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .event-title {
    font-size: 20px;
    font-weight: 800;
    color: var(--text-dark);
    margin: 0 0 12px 0;
    line-height: 1.3;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    letter-spacing: -0.01em;
  }

  .event-description {
    font-size: 15px;
    color: var(--text-gray);
    line-height: 1.6;
    margin: 0 0 20px 0;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    flex-grow: 1;
  }

  .event-btn {
    width: 100%;
    padding: 12px 16px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.2s ease;
    margin-bottom: 12px;
  }

  .event-btn-join {
    background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%);
    color: white;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }

  .event-btn-join:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
  }

  .event-btn-secondary {
    background: var(--border-light);
    color: var(--text-dark);
    border: 1px solid var(--border);
    font-weight: 600;
  }

  .event-btn-secondary:hover {
    background: var(--border);
    border-color: var(--primary);
  }

  .event-status {
    padding: 12px 16px;
    border-radius: 10px;
    text-align: center;
    font-size: 14px;
    font-weight: 700;
    margin-bottom: 12px;
    border: 1px solid;
  }

  .event-status-accepted {
    background: #ecfdf5;
    color: #065f46;
    border-color: #a7f3d0;
  }

  .event-status-pending {
    background: #fef3c7;
    color: #92400e;
    border-color: #fcd34d;
  }

  @media (max-width: 768px) {
    .events-header-content {
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;
    }

    .events-header-text h1 {
      font-size: 28px;
    }

    .events-header {
      padding: 28px 0;
    }

    .events-filters {
      flex-direction: column;
    }

    .events-filters select,
    .events-filters input {
      width: 100%;
      min-width: unset;
    }

    .events-container {
      padding: 32px 20px;
    }

    .event-image-wrapper {
      height: 160px;
    }

    .event-content {
      padding: 18px;
    }

    .event-title {
      font-size: 18px;
    }

    .events-grid {
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 20px;
    }
  }

  @media (max-width: 480px) {
    .events-header-text h1 {
      font-size: 24px;
    }

    .events-header-text p {
      font-size: 14px;
    }

    .events-btn-primary {
      padding: 10px 20px;
      font-size: 14px;
    }

    .events-container {
      padding: 24px 16px;
    }

    .event-image-wrapper {
      height: 140px;
    }

    .event-content {
      padding: 16px;
    }

    .event-title {
      font-size: 16px;
    }

    .event-description {
      font-size: 14px;
    }

    .event-btn {
      padding: 10px 14px;
      font-size: 14px;
    }

    .events-grid {
      grid-template-columns: 1fr;
    }
  }
`;

export default function UserEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterLocation, setFilterLocation] = useState("");

  useEffect(() => {
    async function fetchEvents() {
      const res = await fetch("/api/events");
      const data = await res.json();
      setEvents(data);
      setLoading(false);
    }
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchCategory =
      filterCategory === "" || event.category?.name === filterCategory;
    const matchLocation =
      filterLocation === "" ||
      (event.location &&
        event.location.toLowerCase().includes(filterLocation.toLowerCase()));
    return matchCategory && matchLocation;
  });

  const categories = Array.from(
    new Set(events.map((e) => e.category?.name))
  ).filter(Boolean);

  const handleJoin = async (eventId) => {
    const res = await fetch("/api/participations/join", {
      method: "POST",
      body: JSON.stringify({ eventId }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      alert("Participation envoyée !");
    }
  };

  if (loading) {
    return (
      <div className="events-loading">
        <div className="events-spinner"></div>
        <p className="events-loading-text">Chargement des événements...</p>
      </div>
    );
  }

  return (
    <div className="events-page">
      <style>{styles}</style>
      {/* Header */}
      <header className="events-header">
        <div className="events-header-content">
          <div className="events-header-text">
            <h1>Découvrir des événements</h1>
            <p>Explore les événements disponibles et rejoins une communauté dynamique</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="events-container">
        {/* Filters */}
        <div className="events-filters">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Rechercher par lieu (ex: Tunis...)"
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value)}
          />
        </div>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <div className="events-empty">
            Aucun événement ne correspond à vos critères.
          </div>
        ) : (
          <div className="events-grid">
            {filteredEvents.map((event) => (
              <div key={event.id} className="event-card">
                {/* Image Container */}
                <div className="event-image-wrapper">
                  <img
                    src={event.image || "https://via.placeholder.com/400"}
                    alt={event.title}
                    className="event-image"
                  />
                  <div className="event-date-badge">
                    {new Date(event.date).toLocaleDateString("fr-FR", {
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="event-content">
                  <div className="event-meta">
                    <span className="event-meta-item">
                      {event.category?.name || "Sans catégorie"}
                    </span>
                    <span>•</span>
                    <span className="event-meta-item">
                      {event.location || "Lieu non défini"}
                    </span>
                  </div>

                  <h3 className="event-title">{event.title}</h3>
                  <p className="event-description">{event.description}</p>

                  {/* Status or Join Button */}
                  {event.participation ? (
                    <div
                      className={`event-status ${
                        event.participation.status === "ACCEPTED"
                          ? "event-status-accepted"
                          : "event-status-pending"
                      }`}
                    >
                      {event.participation.status === "PENDING"
                        ? "⏳ Demande envoyée"
                        : "✅ Déjà inscrit"}
                    </div>
                  ) : (
                    <button
                      onClick={() => handleJoin(event.id)}
                      className="event-btn event-btn-join"
                    >
                      Participer
                    </button>
                  )}

                  {/* Details Link */}
                  <Link href={`/user/events/${event.id}`}>
                    <button className="event-btn event-btn-secondary">
                      Voir plus
                    </button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
