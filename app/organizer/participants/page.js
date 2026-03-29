"use client";

import { useState, useEffect } from "react";

export default function OrganizerParticipants() {
  const [participations, setParticipations] = useState([]);
  const [loading, setLoading] = useState(true);

  const stats = {
    total: participations.length,
    pending: participations.filter(p => p.status === "PENDING").length,
    confirmed: participations.filter(p => p.status === "CONFIRMED").length,
  };

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    try {
      const res = await fetch("/api/organizer/participations");
      const data = await res.json();
      setParticipations(data);
    } catch (error) {
      console.error("Erreur de chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    const res = await fetch(`/api/organizer/participations/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      setParticipations(participations.map(p =>
        p.id === id ? { ...p, status: newStatus } : p
      ));
    }
  };

  const styles = {
    container: { padding: '40px', backgroundColor: '#f4f7fe', minHeight: '100vh', fontFamily: 'sans-serif' },
    card: { backgroundColor: 'white', borderRadius: '25px', padding: '30px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' },
    
    statsContainer: { display: 'flex', gap: '20px', marginBottom: '30px' },
    statCard: { backgroundColor: 'white', padding: '20px', borderRadius: '20px', flex: 1, boxShadow: '0 10px 20px rgba(0,0,0,0.05)', textAlign: 'center' },
    statLabel: { color: '#a3aed0', fontSize: '14px', fontWeight: '600' },
    statValue: { fontSize: '24px', fontWeight: 'bold', color: '#2b3674', marginTop: '5px' },
    
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', color: '#a3aed0', fontSize: '14px', borderBottom: '1px solid #f4f7fe', padding: '15px' },
    td: { padding: '15px', color: '#2b3674', borderBottom: '1px solid #f4f7fe' },
    btnAccept: { backgroundColor: '#05CD99', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold', marginRight: '10px' },
    btnReject: { backgroundColor: '#EE5D50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' },
    badge: (status) => ({
      padding: '5px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 'bold',
      backgroundColor: status === 'CONFIRMED' ? '#e6fcf5' : (status === 'PENDING' ? '#fff9e6' : '#fff5f5'),
      color: status === 'CONFIRMED' ? '#05CD99' : (status === 'PENDING' ? '#FFB547' : '#EE5D50'),
    })
  };

  if (loading) return <div style={styles.container}>Chargement...</div>;

  return (
    <div style={styles.container}>
      <h1 style={{ color: '#2b3674', marginBottom: '30px' }}>Gestion des Participants 👥</h1>
      <div style={styles.statsContainer}>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Total Demandes</span>
          <div style={styles.statValue}>{stats.total}</div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>En Attente ⏳</span>
          <div style={{ ...styles.statValue, color: '#FFB547' }}>{stats.pending}</div>
        </div>
        <div style={styles.statCard}>
          <span style={styles.statLabel}>Confirmés ✅</span>
          <div style={{ ...styles.statValue, color: '#05CD99' }}>{stats.confirmed}</div>
        </div>
      </div>
      <div style={styles.card}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>PARTICIPANT</th>
              <th style={styles.th}>ÉVÉNEMENT</th>
              <th style={styles.th}>STATUT</th>
              <th style={styles.th}>ACTIONS</th>
            </tr>
          </thead>
          <tbody>
            {participations.map((p) => (
              <tr key={p.id}>
                <td style={styles.td}>
                  <div style={{ fontWeight: 'bold' }}>{p.user?.name || "Sans nom"}</div>
                  <div style={{ fontSize: '12px', color: '#a3aed0' }}>{p.user?.email}</div>
                </td>
                <td style={styles.td}>{p.event?.title}</td>
                <td style={styles.td}>
                  <span style={styles.badge(p.status)}>{p.status}</span>
                </td>
                <td style={styles.td}>
                  {p.status === "PENDING" && (
                    <>
                      <button onClick={() => updateStatus(p.id, "CONFIRMED")} style={styles.btnAccept}>Accepter</button>
                      <button onClick={() => updateStatus(p.id, "REJECTED")} style={styles.btnReject}>Refuser</button>
                    </>
                  )}
                  {p.status !== "PENDING" && (
                    <button
                      onClick={() => updateStatus(p.id, "PENDING")}
                      style={{ background: 'none', border: '1px solid #e0e7ff', padding: '5px 10px', borderRadius: '8px', cursor: 'pointer', color: '#a3aed0' }}
                    >
                      Réinitialiser
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {participations.length === 0 && <p style={{ textAlign: 'center', color: '#a3aed0', marginTop: '20px' }}>Aucune demande pour le moment.</p>}
      </div>
    </div>
  );
}