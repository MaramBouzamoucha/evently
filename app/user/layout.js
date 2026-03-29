"use client"; 

import { usePathname } from "next/navigation";
import Link from "next/link";
import { SessionProvider } from "next-auth/react";

export default function UserLayout({ children }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Explorer Événements", href: "/user/events", icon: "🎫" },
    { name: "Mes participations", href: "/user/myevents", icon: "📋" },
    { name: "Mon Profil", href: "/user/profile", icon: "👤" },
  ];

  const sidebarStyles = {
    container: { display: "flex", minHeight: "100vh", background: "#F4F7FE", fontFamily: "'Plus Jakarta Sans', sans-serif" },
    sidebar: { 
      width: "280px", 
      background: "#111C44", 
      color: "white", 
      padding: "40px 20px", 
      display: "flex", 
      flexDirection: "column", 
      position: "fixed", 
      height: "100vh",
      boxShadow: "4px 0px 10px rgba(0,0,0,0.05)"
    },
    logo: { fontSize: "24px", fontWeight: "800", marginBottom: "50px", textAlign: "center", letterSpacing: "1px", color: "white" },
    nav: { display: "flex", flexDirection: "column", gap: "10px", flex: 1 },
    link: (isActive) => ({
      display: "flex",
      alignItems: "center",
      padding: "16px",
      borderRadius: "15px",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: isActive ? "700" : "500",
      transition: "0.3s",
      color: isActive ? "#FFFFFF" : "#A3AED0",
      background: isActive ? "linear-gradient(135deg, #4318FF 0%, #5E35FF 100%)" : "transparent", 
      boxShadow: isActive ? "0px 10px 20px rgba(67, 24, 255, 0.15)" : "none",
    }),
    icon: { marginRight: "12px", fontSize: "18px" },
    footer: {
      marginTop: "auto",
      paddingTop: "20px",
      borderTop: "1px solid rgba(255, 255, 255, 0.05)",
    },
    logout: { 
      display: "flex", 
      alignItems: "center", 
      color: "#FF5B5B", 
      textDecoration: "none", 
      fontWeight: "700", 
      padding: "16px",
      fontSize: "15px",
    }
  };

  return (
    <div style={sidebarStyles.container}>
      <aside style={sidebarStyles.sidebar}>
        <div style={sidebarStyles.logo}>EVENTLY<span style={{color: '#4318FF'}}>.</span></div>
        <nav style={sidebarStyles.nav}>
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={sidebarStyles.link(isActive)}>
                <span style={sidebarStyles.icon}>{item.icon}</span> {item.name}
              </Link>
            );
          })}
        </nav>
        <div style={sidebarStyles.footer}>
          <Link href="/api/auth/signout" style={sidebarStyles.logout}>🚪 Se déconnecter</Link>
        </div>
      </aside>
      <main style={{ flex: 1, marginLeft: "280px", padding: "40px" }}>
        <SessionProvider>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
            <div>
              <p style={{ color: "#707EAE", fontSize: "14px", margin: 0 }}>Espace Utilisateur</p>
              <h2 style={{ color: "#2b3674", fontSize: "24px", fontWeight: "700", margin: 0 }}>
                {menuItems.find(i => i.href === pathname)?.name || "Tableau de bord"}
              </h2>
            </div>
          </div>
          {children}
        </SessionProvider>
      </main>
    </div>
  );
}