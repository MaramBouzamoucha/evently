"use client";

import { useState, useEffect } from "react";

export default function MyParticipations() {
  const [participations, setParticipations] = useState([]);

  useEffect(() => {
    async function fetchMyEvents() {
      const res = await fetch("/api/participations");
      const data = await res.json();
      setParticipations(data);
    }
    fetchMyEvents();
  }, []);

  const handleCancel = async (id) => {
    if (confirm("Annuler votre participation ?")) {
      await fetch(`/api/participations/cancel/${id}`, { method: 'DELETE' });
      setParticipations(participations.filter(p => p.id !== id));
    }
  };

  const getStatusStyle = (status) => {
    if (status === "CONFIRMED") return { color: '#05CD99', background: '#e6fcf5' };
    if (status === "PENDING") return { color: '#FFB547', background: '#fff9e6' };
    return { color: '#EE5D50', background: '#fff5f5' };
  };

  return (
    <div style={{ padding: '40px', backgroundColor: '#f4f7fe', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#2b3674', marginBottom: '30px' }}>Mes Participations 📅</h1>
      
      <div style={{ backgroundColor: 'white', borderRadius: '25px', padding: '20px', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ textAlign: 'left', color: '#a3aed0', fontSize: '14px', borderBottom: '1px solid #f4f7fe' }}>
              <th style={{ padding: '15px' }}>ÉVÉNEMENT</th>
              <th>DATE</th>
              <th>STATUT</th>
              <th>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {participations.map(p => (
              <tr key={p.id} style={{ borderBottom: '1px solid #f4f7fe' }}>
                <td style={{ padding: '15px', fontWeight: 'bold', color: '#2b3674' }}>{p.event.title}</td>
                <td style={{ color: '#707eae' }}>{new Date(p.event.date).toLocaleDateString()}</td>
                <td>
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '10px', 
                    fontSize: '12px', 
                    fontWeight: 'bold',
                    ...getStatusStyle(p.status) 
                  }}>
                    {p.status === "CONFIRMED" ? "Confirmé ✅" : "En attente ⏳"}
                  </span>
                </td>
                <td>
                  <button 
                    onClick={() => handleCancel(p.id)}
                    style={{ background: 'none', border: 'none', color: '#EE5D50', cursor: 'pointer', fontWeight: 'bold' }}
                  >
                    Annuler
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}