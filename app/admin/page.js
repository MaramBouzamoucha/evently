import { requireAdmin } from "../lib/auth-utils";
import { prisma } from "../lib/prisma";

export default async function AdminDashboard() {
  await requireAdmin();
  const usersCount = await prisma.user.count();

  const eventsCount = await prisma.event.count();

  const organizersCount = await prisma.user.count({
    where: { role: "ORGANIZER" }
  });

  const upcomingEvents = await prisma.event.count({
    where: {
      date: {
        gte: new Date()
      }
    }
  });

  const styles = {
    wrapper: {
      backgroundColor: "#f4f7fe",
      minHeight: "100vh",
      padding: "40px 20px",
      fontFamily: "'Inter', sans-serif",
    },

    container: {
      maxWidth: "1200px",
      margin: "0 auto",
    },

    header: {
      marginBottom: "40px",
    },

    title: {
      fontSize: "32px",
      fontWeight: "800",
      color: "#1b2559",
      marginBottom: "8px",
      display: "flex",
      alignItems: "center",
      gap: "10px"
    },

    subtitle: {
      color: "#a3aed0",
      fontSize: "16px"
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
      gap: "25px",
    },

    card: {
      backgroundColor: "#ffffff",
      padding: "25px",
      borderRadius: "18px",
      display: "flex",
      alignItems: "center",
      boxShadow: "0px 18px 40px rgba(112,144,176,0.12)",
      transition: "0.2s"
    },

    iconBox: (color) => ({
      width: "55px",
      height: "55px",
      borderRadius: "50%",
      backgroundColor: color,
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontSize: "24px",
      marginRight: "15px"
    }),

    info: {
      display: "flex",
      flexDirection: "column"
    },

    label: {
      fontSize: "14px",
      color: "#a3aed0"
    },

    value: {
      fontSize: "26px",
      fontWeight: "700",
      color: "#1b2559"
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>

        <header style={styles.header}>
          <h1 style={styles.title}>
            📊 Admin Dashboard
          </h1>

          <p style={styles.subtitle}>
            Gestion de la plateforme Evently
          </p>
        </header>

        <div style={styles.grid}>

          {/* USERS */}
          <div style={styles.card}>
            <div style={styles.iconBox("#eef2ff")}>👥</div>

            <div style={styles.info}>
              <span style={styles.label}>Utilisateurs</span>
              <span style={styles.value}>
                {usersCount}
              </span>
            </div>
          </div>

          {/* ORGANIZERS */}
          <div style={styles.card}>
            <div style={styles.iconBox("#fef3c7")}>🎤</div>

            <div style={styles.info}>
              <span style={styles.label}>Organisateurs</span>
              <span style={styles.value}>
                {organizersCount}
              </span>
            </div>
          </div>

          {/* EVENTS */}
          <div style={styles.card}>
            <div style={styles.iconBox("#dcfce7")}>📅</div>

            <div style={styles.info}>
              <span style={styles.label}>Événements</span>
              <span style={{ ...styles.value, color: "#055ccd" }}>
                {eventsCount}
              </span>
            </div>
          </div>

          {/* UPCOMING EVENTS */}
          <div style={styles.card}>
            <div style={styles.iconBox("#ffe4e6")}>🚀</div>

            <div style={styles.info}>
              <span style={styles.label}>Événements à venir</span>
              <span style={{ ...styles.value, color: "#ee5d50" }}>
                {upcomingEvents}
              </span>
            </div>
          </div>

        </div>

       
         
       

      </div>
    </div>
  );
}