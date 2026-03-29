import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";
import Link from "next/link";
import DeleteButton from "./deleteButton";
import { prisma } from "../lib/prisma";

export default async function OrganizerDashboard() {
  const session = await getServerSession(authOptions);

  if (!session || session.user.role !== "ORGANIZER") {
    return (
      <div style={{ padding: "100px", textAlign: "center", fontFamily: "sans-serif", color: "#2b3674" }}>
        <h2 style={{ fontSize: "32px" }}>🚫 Accès refusé</h2>
        <p>Vous n'avez pas les permissions pour voir cette page.</p>
      </div>
    );
  }

  const events = await prisma.event.findMany({
    where: { organizerId: session.user.id },
    orderBy: { date: "desc" },
  });

  const participants = await prisma.participation.findMany({
    where: { event: { organizerId: session.user.id } },
  });

  return (
    <div style={styles.container}>
      
      <div style={styles.main}>
        <header style={styles.topHeader}>
          <div>
            <h1 style={styles.welcomeTitle}>Bonjour, {session.user.name} 👋</h1>
            <p style={styles.subTitle}>Voici l'état actuel de vos événements.</p>
          </div>
          <Link href="/organizer/create">
            <button style={styles.addButton}>+ Ajouter un événement</button>
          </Link>
        </header>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={{...styles.iconBox, backgroundColor: '#E7E9FB'}}>📅</div>
            <div>
              <p style={styles.statLabel}>Total Événements</p>
              <h3 style={styles.statNumber}>{events.length}</h3>
            </div>
          </div>

          <div style={styles.statCard}>
            <div style={{...styles.iconBox, backgroundColor: '#E3FBE3'}}>👥</div>
            <div>
              <p style={styles.statLabel}>Participants inscrits</p>
              <h3 style={styles.statNumber}>{participants.length}</h3>
            </div>
          </div>
        </div>

        <div style={styles.sectionHeader}>
          <h2 style={styles.sectionTitle}>Mes événements</h2>
          <div style={styles.line}></div>
        </div>

        {events.length === 0 ? (
          <div style={styles.emptyState}>
            <p>Vous n'avez pas encore créé d'événement.</p>
          </div>
        ) : (
          <div style={styles.eventsGrid}>
            {events.map((event) => (
              <div key={event.id} style={styles.card}>
                <div style={styles.imageWrapper}>
                  {event.image ? (
                    <img src={event.image} alt={event.title} style={styles.image} />
                  ) : (
                    <div style={styles.placeholderImg}>Pas d'image</div>
                  )}
                  <div style={styles.dateBadge}>
                    {new Date(event.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </div>
                </div>
                
                <div style={styles.cardContent}>
                  <h3 style={styles.eventTitle}>{event.title}</h3>
                  <p style={styles.eventDescription}>
                    {event.description?.substring(0, 80)}...
                  </p>

                  <div style={styles.actions}>
                    <Link href={`/organizer/edit/${event.id}`} style={{ flex: 1 }}>
                      <button style={styles.editBtn}>Modifier</button>
                    </Link>
                    <DeleteButton eventId={event.id} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    background: "#F4F7FE", 
  },
  main: {
    flex: 1,
    padding: "40px 60px",
    maxWidth: "1400px",
    margin: "0 auto",
  },
  topHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  welcomeTitle: {
    fontSize: "30px",
    fontWeight: "800",
    color: "#2b3674",
    margin: 0,
  },
  subTitle: {
    color: "#707EAE",
    margin: "5px 0 0 0",
    fontSize: "16px",
  },
  addButton: {
    background: "#4318FF", 
    color: "white",
    border: "none",
    padding: "12px 24px",
    borderRadius: "12px",
    fontWeight: "600",
    cursor: "pointer",
    boxShadow: "0px 10px 20px rgba(67, 24, 255, 0.2)",
    transition: "transform 0.2s",
  },
  statsGrid: {
    display: "flex",
    gap: "25px",
    marginBottom: "50px",
  },
  statCard: {
    background: "white",
    padding: "20px 30px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    gap: "20px",
    minWidth: "240px",
    boxShadow: "0px 18px 40px rgba(112, 144, 176, 0.12)",
  },
  iconBox: {
    width: "56px",
    height: "56px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
  },
  statNumber: {
    fontSize: "24px",
    fontWeight: "700",
    color: "#2b3674",
    margin: 0,
  },
  statLabel: {
    fontSize: "14px",
    color: "#A3AED0",
    margin: 0,
  },
  sectionHeader: {
    marginBottom: "30px",
  },
  sectionTitle: {
    fontSize: "22px",
    color: "#2b3674",
    fontWeight: "700",
    marginBottom: "10px",
  },
  eventsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: "30px",
  },
  card: {
    background: "white",
    borderRadius: "20px",
    overflow: "hidden",
    boxShadow: "0px 18px 40px rgba(112, 144, 176, 0.08)",
    transition: "all 0.3s ease",
  },
  imageWrapper: {
    position: "relative",
    height: "180px",
  },
  image: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  dateBadge: {
    position: "absolute",
    top: "15px",
    right: "15px",
    background: "rgba(255, 255, 255, 0.9)",
    padding: "5px 12px",
    borderRadius: "8px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#4318FF",
  },
  cardContent: {
    padding: "20px",
  },
  eventTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#2b3674",
    margin: "0 0 10px 0",
  },
  eventDescription: {
    fontSize: "14px",
    color: "#707EAE",
    lineHeight: "1.5",
    height: "42px",
    overflow: "hidden",
  },
  actions: {
    display: "flex",
    gap: "10px",
    marginTop: "20px",
  },
  editBtn: {
    width: "100%",
    background: "#F4F7FE",
    color: "#4318FF",
    border: "none",
    padding: "10px",
    borderRadius: "10px",
    fontWeight: "600",
    cursor: "pointer",
    transition: "background 0.2s",
  },
  emptyState: {
    textAlign: "center",
    padding: "50px",
    background: "white",
    borderRadius: "20px",
    color: "#A3AED0",
  }
};