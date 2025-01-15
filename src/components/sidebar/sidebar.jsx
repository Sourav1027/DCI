/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect } from "react";
import {Routes,Route, Link, useLocation, useNavigate,} from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faTachometerAlt,faUsers,faCreditCard,faBook,faSms,faUser,faSignOutAlt,faChevronDown,faChevronUp,faBars,faTimes,
  faFileAlt,faClock,faScrewdriverWrench,faBookBookmark,faSchool,faSearchLocation,faChalkboardTeacher,faBookOpen,
  faPersonDotsFromLine,} from "@fortawesome/free-solid-svg-icons";
import Dashboard from "../Dashboard/dashboard";
import "./sidebar.css";
import Student from "../../Screens/Students/student";
import ExamManagement from "../../Screens/Super Admin/ExamManagement/examManagement";
import SMS from "../../Screens/Super Admin/SMS/sms";
import Certificate from "../../Screens/Certificates/certificate";
import Profile from "../utils/profile/profile";
import Login from "../EntryScreen/Login/login";
import Course from "../Masters/course/course";
import Batch from "../Masters/Batch/batch";
import CenterManagement from "../../Screens/Super Admin/CenterManagement/centerManagement";
import EnquiryManagement from "../../Screens/Super Admin/EnquiryManagement/enquiryManagement";
import Trainer from "../../Screens/Super Admin/TrainerManagement/trainer";
import Syllabus from "../../Screens/Super Admin/syllabus/syllabus";
import FeeManagement from "../../Screens/Super Admin/FeeManagement/feeManagement";
import SoftSkills from "../../Screens/Super Admin/softSkills/softSkills";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [isMobileOrTablet, setIsMobileOrTablet] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [masterSubmenuOpen, setMasterSubmenuOpen] = useState(false);

  const menuItems = [
    {
      title: "Dashboard",
      icon: <FontAwesomeIcon icon={faTachometerAlt} />,
      path: "/dashboard",
      component: Dashboard,
    },
    {
      title: "Centers",
      icon: <FontAwesomeIcon icon={faSchool} />,
      path: "/center-management",
      component: CenterManagement,
    },
    {
      title: "Enquiry",
      icon: <FontAwesomeIcon icon={faSearchLocation} />,
      path: "/enquiry-management",
      component: EnquiryManagement,
    },
    {
      title: "Students",
      icon: <FontAwesomeIcon icon={faUsers} />,
      path: "/students",
      component: Student,
    },
    {
      title: "Trainers",
      icon: <FontAwesomeIcon icon={faChalkboardTeacher} />,
      path: "/trainer-management",
      component: Trainer,
    },
    {
      title: "Syllabus",
      icon: <FontAwesomeIcon icon={faBookOpen} />,
      path: "/syllabus-management",
      component: Syllabus,
    },
    {
      title: "SMS",
      icon: <FontAwesomeIcon icon={faSms} />,
      path: "/sms",
      component: SMS,
    },
    {
      title: "Fee Management",
      icon: <FontAwesomeIcon icon={faSms} />,
      path: "/fee-management",
      component: FeeManagement,
    },
    {
      title: "Exam Structure",
      icon: <FontAwesomeIcon icon={faBook} />,
      path: "/exam-management",
      component: ExamManagement,
    },
    {
      title: "Soft skills",
      icon: <FontAwesomeIcon icon={faPersonDotsFromLine} />,
      path: "/soft-skills",
      component: SoftSkills,
    },
    {
      title: "Master",
      icon: <FontAwesomeIcon icon={faScrewdriverWrench} />,
      path: "/master",
      hasSubmenu: true,
      submenuItems: [
        {
          title: "Course",
          path: "/master/course",
          icon: <FontAwesomeIcon icon={faBookBookmark} />,
          component: Course,
        },
        {
          title: "Batch",
          path: "/master/batch",
          icon: <FontAwesomeIcon icon={faClock} />,
          component: Batch,
        },
      ],
    },
  ];

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
      {isMobileOrTablet && isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}

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

      <main
        className={`main-wrapper ${isOpen ? "sidebar-expanded" : "sidebar-collapsed"}`}
      >
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
      </main>
    </div>
  );
};

export default Sidebar;