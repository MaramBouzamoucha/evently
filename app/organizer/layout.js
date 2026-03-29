"use client"; 

import { usePathname } from "next/navigation";
import Link from "next/link";

export default function OrganizerLayout({ children, session }) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Dashboard", href: "/organizer", icon: "📊" },
    { name: "Créer un événement", href: "/organizer/create", icon: "✨" },
    { name: "Participants", href: "/organizer/participants", icon: "👥" },
  ];

  const sidebarStyles = {
    container: { display: "flex", minHeight: "100vh", background: "#F4F7FE", fontFamily: "sans-serif" },
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
    logo: { fontSize: "24px", fontWeight: "800", marginBottom: "40px", textAlign: "center", letterSpacing: "1px" },
    nav: { display: "flex", flexDirection: "column", gap: "8px", flex: 1 },
    link: (isActive) => ({
      display: "flex",
      alignItems: "center",
      padding: "12px 16px",
      borderRadius: "12px",
      textDecoration: "none",
      fontSize: "15px",
      fontWeight: "500",
      transition: "0.3s",
      color: isActive ? "#FFFFFF" : "#A3AED0",
      background: isActive ? "linear-gradient(135deg, #4318FF 0%, #5E35FF 100%)" : "transparent",
      boxShadow: isActive ? "0px 10px 20px rgba(67, 24, 255, 0.2)" : "none",
    }),
    icon: { marginRight: "12px" },
    logout: { marginTop: "auto", color: "#FF5B5B", textDecoration: "none", fontWeight: "bold", padding: "12px 16px" }
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
        <Link href="/api/auth/signout" style={sidebarStyles.logout}>🚪 Se déconnecter</Link>
      </aside>

      <main style={{ flex: 1, marginLeft: "280px", padding: "40px" }}>
        {children}
      </main>
    </div>
  );
}