import { NavLink, Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import { useAuthContext } from "../auth/AuthProvider";
import Pacientes from "./paciente/paciente";
import Laboratorio from "./laboratorio/laboratorio";
import Usuario from "./usuario/usuario";
import { useState } from "react";

const Dashboard = () => {
  const { user, logout } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  const menuItems = [
    { path: "pacientes", label: "Pacientes", roles: ["medico", "admin"] },
    { path: "laboratorio", label: "Laboratorios", roles: ["laboratorio", "admin"] },
    { path: "usuario", label: "Usuarios", roles: ["admin"] },
  ];

  const allowedMenu = menuItems.filter(item => item.roles.includes(user.rol));

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getIconForPath = (path) => {
    const icons = {
      pacientes: "bi-people-fill",
      laboratorio: "bi-droplet-fill",
      usuario: "bi-person-badge-fill"
    };
    return icons[path] || "bi-folder-fill";
  };

  const getPageTitleFromPath = (path) => {
    const item = menuItems.find(item => path.includes(item.path));
    return item ? item.label : "Dashboard";
  };

  // Estilos integrados
  const styles = {
    sidebar: {
      width: collapsed ? "80px" : "250px",
      transition: "all 0.3s ease",
      boxShadow: "2px 0 10px rgba(0,0,0,0.1)",
      backgroundColor: darkMode ? "#1a1a2e" : "#212529",
      color: "white",
      display: "flex",
      flexDirection: "column",
      padding: "1rem",
      minHeight: "100vh",
      zIndex: 1000
    },
    navLink: {
      display: "flex",
      alignItems: "center",
      padding: "0.5rem 1rem",
      borderRadius: "0.375rem",
      marginBottom: "0.5rem",
      color: darkMode ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.5)",
      textDecoration: "none",
      transition: "all 0.2s ease"
    },
    navLinkActive: {
      backgroundColor: darkMode ? "#3a3a5e" : "#0d6efd",
      color: "white"
    },
    navLinkHover: {
      backgroundColor: darkMode ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)",
      color: "white"
    },
    mainContent: {
      flexGrow: 1,
      backgroundColor: darkMode ? "#121212" : "#f8f9fa",
      padding: "2rem",
      minHeight: "100vh",
      overflowY: "auto"
    },
    topBar: {
      backgroundColor: darkMode ? "#1e1e1e" : "white",
      boxShadow: darkMode ? "0 2px 10px rgba(0,0,0,0.3)" : "0 2px 10px rgba(0,0,0,0.1)",
      padding: "0.75rem 1.5rem",
      borderRadius: "0.375rem",
      marginBottom: "1.5rem",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center"
    },
    avatar: {
      width: "40px",
      height: "40px",
      borderRadius: "50%",
      backgroundColor: darkMode ? "#0d6efd" : "#0d6efd",
      color: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      fontWeight: "bold",
      fontSize: "1.2rem"
    },
    toggleBtn: {
      width: "30px",
      height: "30px",
      borderRadius: "50%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`
    },
    userInfo: {
      backgroundColor: darkMode ? "#16213e" : "#343a40",
      padding: "0.75rem",
      borderRadius: "0.375rem",
      marginBottom: "1.5rem"
    }
  };

  return (
    <div className="d-flex" style={{ minHeight: "100vh" }}>
      {/* Sidebar */}
      <nav style={styles.sidebar}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          {!collapsed && (
            <div className="d-flex align-items-center">
              <i className="bi bi-heart-pulse-fill fs-4 me-2" style={{ color: "#0d6efd" }}></i>
              <h4 className="mb-0 fw-bold">Clínica Salud</h4>
            </div>
          )}
          {collapsed && <i className="bi bi-heart-pulse-fill fs-4" style={{ color: "#0d6efd" }}></i>}
          <button 
            style={styles.toggleBtn}
            onClick={() => setCollapsed(!collapsed)}
          >
            <i className={`bi ${collapsed ? "bi-chevron-right" : "bi-chevron-left"}`}></i>
          </button>
        </div>

        {!collapsed && (
          <div style={styles.userInfo}>
            <div className="d-flex align-items-center">
              <div style={styles.avatar}>
                {user.nombre.charAt(0)}
              </div>
              <div className="ms-3">
                <p className="mb-0 fw-bold">{user.nombre}</p>
                <small style={{ color: darkMode ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.6)" }}>
                  {user.rol}
                </small>
              </div>
            </div>
          </div>
        )}

        <ul className="nav flex-column flex-grow-1">
          {allowedMenu.map(item => (
            <li key={item.path} className="nav-item">
              <NavLink
                to={`/dashboard/${item.path}`}
                style={({ isActive }) => ({
                  ...styles.navLink,
                  ...(isActive ? styles.navLinkActive : {}),
                  "&:hover": styles.navLinkHover
                })}
                onMouseEnter={(e) => {
                  if (!e.currentTarget.className.includes("active")) {
                    e.currentTarget.style.backgroundColor = styles.navLinkHover.backgroundColor;
                    e.currentTarget.style.color = styles.navLinkHover.color;
                  }
                }}
                onMouseLeave={(e) => {
                  if (!e.currentTarget.className.includes("active")) {
                    e.currentTarget.style.backgroundColor = styles.navLink.backgroundColor;
                    e.currentTarget.style.color = styles.navLink.color;
                  }
                }}
              >
                <i className={`bi ${getIconForPath(item.path)}`} style={{ marginRight: collapsed ? "0" : "0.75rem" }}></i>
                {!collapsed && <span>{item.label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="mt-auto">
          <button 
            className="btn d-flex align-items-center justify-content-center py-2 w-100"
            onClick={handleLogout}
            style={{
              border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.2)"}`,
              color: "white",
              backgroundColor: "transparent"
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = darkMode ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.1)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "transparent";
            }}
          >
            <i className="bi bi-box-arrow-right" style={{ marginRight: collapsed ? "0" : "0.5rem" }}></i>
            {!collapsed && <span>Cerrar sesión</span>}
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <main style={styles.mainContent}>
        <div style={styles.topBar}>
          <h5 className="mb-0 fw-bold" style={{ color: darkMode ? "white" : "inherit" }}>
            {getPageTitleFromPath(location.pathname)}
          </h5>
          <div className="d-flex align-items-center">
            <button 
              className="btn me-2"
              onClick={() => setDarkMode(!darkMode)}
              style={{
                border: `1px solid ${darkMode ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)"}`,
                color: darkMode ? "white" : "inherit"
              }}
            >
              <i className={`bi ${darkMode ? "bi-sun-fill" : "bi-moon-fill"}`}></i>
              {!collapsed && <span className="ms-2">{darkMode ? "Modo claro" : "Modo oscuro"}</span>}
            </button>
            <div style={{ ...styles.avatar, cursor: "pointer" }} onClick={() => {}}>
              {user.nombre.charAt(0)}
            </div>
          </div>
        </div>

        <div className="container-fluid">
          <Routes>
            <Route path="/" element={<Navigate to={allowedMenu[0]?.path || "/dashboard"} />} />
            {allowedMenu.some(m => m.path === "pacientes") && (
              <Route path="pacientes" element={<Pacientes darkMode={darkMode} />} />
            )}
            {allowedMenu.some(m => m.path === "laboratorio") && (
              <Route path="laboratorio" element={<Laboratorio darkMode={darkMode} />} />
            )}
            {allowedMenu.some(m => m.path === "usuario") && (
              <Route path="usuario" element={<Usuario darkMode={darkMode} />} />
            )}
            <Route path="*" element={<h2>Página no encontrada</h2>} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;