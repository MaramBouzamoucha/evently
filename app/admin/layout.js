"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AdminLayout({ children }) {
  const pathname = usePathname();

  // Configuration des liens pour faciliter la maintenance
  const navLinks = [
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Utilisateurs", href: "/admin/users", icon: "👥" },
    { name: "Événements", href: "/admin/events", icon: "🎟️" },
    { name: "Catégories", href: "/admin/categories", icon: "📁" },
  ];

  return (
    <div style={styles.container}>
      {/* Sidebar - Design Sombre & Élégant */}
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <span style={styles.logoIcon}>⚙️</span>
          <h2 style={styles.logoText}>ADMIN<span style={{color: '#4318FF'}}>.</span></h2>
        </div>

        <nav style={styles.navStack}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                key={link.href} 
                href={link.href} 
                style={isActive ? styles.activeLink : styles.link}
              >
                <span style={styles.icon}>{link.icon}</span>
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Pied de la sidebar avec déconnexion */}
        <div style={styles.footer}>
          <div style={styles.divider}></div>
          <Link href="/api/auth/signout" style={styles.logoutBtn}>
            <span style={styles.icon}>🚪</span> Se déconnecter
          </Link>
        </div>
      </aside>

      {/* Zone de contenu principale */}
      <main style={styles.mainContent}>
        {/* Barre supérieure discrète */}
        <header style={styles.topBar}>
          <div style={styles.breadcrumb}>Administration / {pathname.split('/').pop() || 'Dashboard'}</div>
          <div style={styles.adminBadge}>Admin</div>
        </header>

        <section style={styles.pageContent}>
          {children}
        </section>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: "flex",
    minHeight: "100vh",
    background: "#F4F7FE", // Fond gris très clair pour faire ressortir les cartes
    fontFamily: "'Inter', sans-serif, Arial",
  },
  sidebar: {
    width: "280px",
    background: "#0B1437", // Bleu nuit très pro
    color: "#FFFFFF",
    display: "flex",
    flexDirection: "column",
    padding: "40px 20px",
    position: "fixed",
    height: "100vh",
    zIndex: 100,
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
    padding: "0 15px",
  },
  logoIcon: { fontSize: "24px" },
  logoText: { fontSize: "22px", fontWeight: "800", letterSpacing: "1px", margin: 0 },
  navStack: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },
  link: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    borderRadius: "12px",
    color: "#A3AED0",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "600",
    transition: "0.2s",
  },
  activeLink: {
    display: "flex",
    alignItems: "center",
    padding: "12px 15px",
    borderRadius: "12px",
    color: "#FFFFFF",
    background: "#4318FF", // Surbrillance discrète
    //borderRight: "4px solid #4318FF", // Barre d'accentuation
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "700",
  },
  icon: { marginRight: "12px", fontSize: "18px" },
  footer: { marginTop: "auto" },
  divider: { height: "1px", background: "rgba(255,255,255,0.1)", margin: "20px 0" },
  logoutBtn: {
    display: "flex",
    alignItems: "center",
    color: "#FF5B5B",
    textDecoration: "none",
    fontSize: "15px",
    fontWeight: "700",
    padding: "10px 15px",
  },
  mainContent: {
    flex: 1,
    marginLeft: "280px",
    display: "flex",
    flexDirection: "column",
  },
  topBar: {
    padding: "20px 40px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  breadcrumb: { color: "#707EAE", fontSize: "14px", textTransform: "capitalize" },
  adminBadge: {
    background: "#FFF",
    padding: "5px 15px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "bold",
    color: "#2b3674",
    boxShadow: "0px 4px 10px rgba(0,0,0,0.05)",
  },
  pageContent: {
    padding: "0 40px 40px 40px",
  }
};