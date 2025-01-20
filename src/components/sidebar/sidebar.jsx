/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import { Routes, Route, Link, useLocation, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faSignOutAlt,
  faChevronDown,
  faChevronUp,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import "./sidebar.css";
import Profile from "../utils/profile/profile";
import Login from "../EntryScreen/Login/login";
import { menuItems } from "./menuItems"; // Import the menuItems

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [masterSubmenuOpen, setMasterSubmenuOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileOrTablet(window.innerWidth < 992);
      setIsOpen(window.innerWidth >= 992);
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    if (isMobileOrTablet && showProfile) {
      setShowProfile(false);
    }
  };

  const toggleMasterSubmenu = (e) => {
    e.preventDefault();
    setMasterSubmenuOpen(!masterSubmenuOpen);
  };

  const handleNavClick = () => {
    if (isMobileOrTablet) {
      setIsOpen(false);
    }
  };

  const handleProfileClick = () => {
    setShowProfile(false);
    navigate("/profile");
  };

  const handleLogout = () => {
    setShowProfile(false);
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const renderMenuItem = (item) => {
    if (item.hasSubmenu) {
      return (
        <div key={item.path} className="nav-item-with-submenu">
          <a
            href="#"
            className={`nav-link ${location.pathname.startsWith(item.path) ? "active" : ""}`}
            onClick={toggleMasterSubmenu}
            aria-expanded={masterSubmenuOpen}
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-text">{item.title}</span>
            <FontAwesomeIcon
              icon={masterSubmenuOpen ? faChevronUp : faChevronDown}
              className="submenu-arrow"
            />
          </a>
          {masterSubmenuOpen && (
            <div className="submenu">
              {item.submenuItems.map((subItem) => (
                <Link
                  key={subItem.path}
                  to={subItem.path}
                  className={`nav-link submenu-item ${
                    location.pathname === subItem.path ? "active" : ""
                  }`}
                  onClick={handleNavClick}
                >
                  <span className="nav-icon">{subItem.icon}</span>
                  <span className="nav-text">{subItem.title}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      );
    }
    return (
      <Link
        key={item.path}
        to={item.path}
        className={`nav-link ${location.pathname === item.path ? "active" : ""}`}
        onClick={handleNavClick}
      >
        <span className="nav-icon">{item.icon}</span>
        <span className="nav-text">{item.title}</span>
      </Link>
    );
  };

  return (
    <div className="layout-wrapper">
      {/* Header */}
      <div className="header">
        <header className="main-header">
          {isMobileOrTablet && (
            <button className="mobile-menu" onClick={toggleSidebar}>
              <FontAwesomeIcon icon={faBars} size="lg" />
            </button>
          )}

          <div className="header-controls">
            <div className="profile-menu">
              <button
                className="profile-toggle"
                onClick={() => setShowProfile(!showProfile)}
              >
                <FontAwesomeIcon icon={faUser} />
              </button>

              {showProfile && (
                <div className="profile-dropdown">
                  <div className="dropdown-item" onClick={handleProfileClick}>
                    <FontAwesomeIcon icon={faUser} size="sm" />
                    <span>Profile</span>
                  </div>
                  <div className="dropdown-divider" />
                  <button className="dropdown-item" onClick={handleLogout}>
                    <FontAwesomeIcon icon={faSignOutAlt} size="sm" />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      </div>

      {/* Sidebar and Page Content */}
      <div className="content-wrapper">
        <aside
          className={`sidebar-container ${isOpen ? "expanded" : "collapsed"} ${
            isMobileOrTablet ? "mobile" : ""
          }`}
        >
          <div className="sidebar-header">
            <h3 className="sidebar-title">d-Codetech</h3>
            {isMobileOrTablet && (
              <button onClick={toggleSidebar} className="mobile-close">
                <FontAwesomeIcon icon={faTimes} size="lg" />
              </button>
            )}
          </div>

          <nav className="sidebar-nav">
            {menuItems.map((item) => renderMenuItem(item))}
          </nav>
        </aside>

        <div className="page-content">
          <Routes>
            {menuItems.map((item) => (
              <Route
                key={item.path}
                path={item.path}
                element={item.component && <item.component />}
              />
            ))}
            {menuItems
              .find((item) => item.hasSubmenu)
              ?.submenuItems.map((subItem) => (
                <Route
                  key={subItem.path}
                  path={subItem.path}
                  element={subItem.component && <subItem.component />}
                />
              ))}
            <Route path="/profile" element={<Profile />} />
            <Route path="/" element={<Login />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
