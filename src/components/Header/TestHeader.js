import React, { useState, useEffect, useRef } from "react";
import "./TestHeader.css";
import { Link, useLocation } from "react-router-dom";

const NavbarComponent = () => {
  const location = useLocation(); // Get current location from react-router
  const [activeTab, setActiveTab] = useState(location.pathname); // Initialize with current path
  const [selectorStyle, setSelectorStyle] = useState({});
  const navbarRef = useRef(null);

  useEffect(() => {
    const updateSelectorPosition = () => {
      const activeItem = navbarRef.current?.querySelector(".active");
      if (!activeItem) return; // Guard clause to handle null active item

      const itemPos = activeItem.getBoundingClientRect();
      setSelectorStyle({
        left: `${itemPos.left}px`,
        width: `${activeItem.offsetWidth}px`,
      });
    };

    updateSelectorPosition();
    window.addEventListener("resize", updateSelectorPosition);

    return () => {
      window.removeEventListener("resize", updateSelectorPosition);
    };
  }, [activeTab]);

  const handleTabClick = (path) => {
    setActiveTab(path);
  };

  return (
    <div id="navbar-animmenu" ref={navbarRef}>
      <h1 className="montserrat-title">MORE: Mobility Report</h1>
      <ul className="show-dropdown main-navbar">
        <div className="hori-selector" style={selectorStyle}>
          <div className="left"></div>
          <div className="right"></div>
        </div>
        {[
          { id: "map", to: "/mobility-report/map", label: "Map" },
          { id: "report", to: "/mobility-report/report", label: "Report" },
          { id: "about", to: "/mobility-report/about", label: "About" },
        ].map((tab) => (
          <li
            key={tab.id}
            className={activeTab === tab.to ? "active" : ""}
            onClick={() => handleTabClick(tab.to)}
          >
            <Link to={tab.to}>
              <i className={tab.icon}></i>
              {tab.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NavbarComponent;
