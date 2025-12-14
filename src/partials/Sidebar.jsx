import React, { useState, useEffect, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { RiDashboard3Line, RiSettings3Line, RiUserSettingsLine } from "react-icons/ri";
import banner_img from "../images/logo.png";
import SidebarLinkGroup from "./SidebarLinkGroup";
import { getUserAssignedAccess, AccessModules } from "../hooks/moduleHook";

function Sidebar({ sidebarOpen, setSidebarOpen }) {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef(null);
  const sidebar = useRef(null);

  const [sidebarExpanded, setSidebarExpanded] = useState(() => {
    const stored = localStorage.getItem("sidebar-expanded");
    return stored === "true" || ["/", "/dashboard"].includes(pathname);
  });

  const [userAccess, setUserAccess] = useState([]);

  useEffect(() => {
    localStorage.setItem("sidebar-expanded", sidebarExpanded);
    document.body.classList.toggle("sidebar-expanded", sidebarExpanded);
  }, [sidebarExpanded]);

  // Fetch user modules
  useEffect(() => {
  const fetchAccess = async () => {
    try {
      const userModules = await getUserAssignedAccess(); // [{ moduleid: 1 }, ...]
      const allModules = await AccessModules(); // [{ id: 1, name: 'Farmers', platform: 'dashboard' }, ...]

      //console.log(userModules);
      
      // Filter for modules where the platform is 'dashboard' and user has access
      const dashboardModules = allModules
        .filter(
          (m) =>
            m.platform === "dashboard" &&
            userModules.some((um) => um.moduleid === m.id)
        )
        .map((m) => m.id);

      setUserAccess(dashboardModules);
    } catch (err) {
      console.error("Error fetching access modules:", err);
    }
  };

  fetchAccess();
}, []);

  const hasAccess = (moduleId) => userAccess.includes(moduleId);

  const linkGroups = [
    {
      title: "Registration",
      icon: <RiUserSettingsLine className="text-[#8B593E]" />,
      links: [
        { to: "/new_farmer", label: "Farmers", moduleId: 9 },
        { to: "/new_group", label: "Groups", moduleId: 2 },
        { to: "/new_tree_survey", label: "Trees", moduleId: 3 },
      ],
    },
    {
      title: "App Settings",
      icon: <RiSettings3Line className="text-[#8B593E]" />,
      links: [
        { to: "/user_admin", label: "Manage Users", moduleId: 13 },
        { to: "/inspection_admin", label: "Inspection Questions", moduleId: 31 },
        { to: "/access_admin", label: "Access Modules", moduleId: 6 },
        { to: "/groups", label: "Groups", moduleId: 58 },
      ],
    },
    {
      title: "Coffee Inventory",
      icon: <RiSettings3Line className="text-[#8B593E]" />,
      links: [
        { to: "/assign_parchment", label: "Assign Parchment", moduleId: 19 },
        { to: "/parchment_stock", label: "Parchment Stock", moduleId: 9 },
        { to: "/delivery_processing", label: "Delivery Processing", moduleId: 10 },
        { to: "/parchment_transport", label: "Parchment Transport", moduleId: 21 },
        { to: "/parchment_reception", label: "Parchment Reception", moduleId: 40 },
      ],
    },
    {
      title: "System Reports",
      icon: <RiSettings3Line className="text-[#8B593E]" />,
      links: [{ to: "/activity_report", label: "Station Activities", moduleId: 35 }],
    },
  ];

  const handleNavReload = (to) => {
    if (window.location.pathname === to) window.location.reload();
  };

  return (
    <div className="min-w-fit">
      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 bg-gray-900/30 z-40 lg:hidden transition-opacity duration-200 ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <div
        ref={sidebar}
        className={`flex flex-col fixed z-40 left-0 top-0 lg:static transform transition-transform duration-200 ease-in-out h-screen w-64 bg-white dark:bg-gray-800 p-4 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64"
        } lg:translate-x-0`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <NavLink to="/dashboard" className="flex items-center space-x-4">
            <img src={banner_img} className="w-12 h-12" alt="logo" />
            <h1 className="text-xl font-bold text-black dark:text-white">FARMER IMPACT</h1>
          </NavLink>
          <button
            ref={trigger}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="lg:hidden text-gray-500 hover:text-gray-400"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M10.7 18.7l1.4-1.4L7.8 13H20v-2H7.8l4.3-4.3-1.4-1.4L4 12z" />
            </svg>
          </button>
        </div>

        <ul className="space-y-1">
          {/* Dashboard */}
          <li>
            <NavLink
              to="/dashboard"
              onClick={() => handleNavReload("/dashboard")}
              className={({ isActive }) =>
                `flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                  isActive ? "bg-[#f3e7e2] text-[#8B593E]" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                }`
              }
            >
              <RiDashboard3Line className="text-[#8B593E]" />
              <span className="ml-3">Dashboard</span>
            </NavLink>
          </li>

          {/* Dynamic Link Groups */}
          {linkGroups.map(({ title, icon, links }) => {
            const accessibleLinks = links.filter((l) => hasAccess(l.moduleId));
            if (accessibleLinks.length === 0) return null;

            return (
              <SidebarLinkGroup key={title} activecondition={links.some((l) => pathname.startsWith(l.to))}>
                {(handleClick, open) => (
                  <>
                    <button
                      onClick={() => {
                        handleClick();
                        setSidebarExpanded(true);
                      }}
                      aria-expanded={open}
                      className={`w-full flex items-center justify-between px-4 py-2 rounded-lg font-medium transition-colors ${
                        open ? "bg-[#f3e7e2] text-[#8B593E]" : "text-gray-700 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                      }`}
                    >
                      {icon}
                      <span>{title}</span>
                      <svg className={`w-3 h-3 transform transition-transform ${open ? "rotate-180" : ""}`} viewBox="0 0 12 12" fill="currentColor">
                        <path d="M5.9 11.4L.5 6l1.4-1.4 4 4 4-4L11.3 6z" />
                      </svg>
                    </button>
                    <ul className={`pl-6 mt-2 space-y-1 text-sm ${!open && "hidden"}`}>
                      {accessibleLinks.map(({ to, label }) => (
                        <li key={to}>
                          <NavLink
                            to={to}
                            onClick={() => handleNavReload(to)}
                            className={({ isActive }) =>
                              `block transition-colors ${
                                isActive ? "text-[#8B593E]" : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
                              }`
                            }
                          >
                            {label}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </SidebarLinkGroup>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
