import React from "react";
import "./MobileMenu.css";

export default function MobileMenu() {
  const options = [
    {
      name: "LogIn",
      icon: "account_circle",
    },
    {
      name: "Map",
      icon: "map",
    },
    {
      name: "Report",
      icon: "report",
    },
    {
      name: "Dashboard",
      icon: "bar_chart_4_bars",
    },
    {
      name: "Trending",
      icon: "trending_up",
    },
  ];

  return (
    <nav className="mobile-menu">
      <ul>
        {options.map((option, index) => (
          <li key={index} className="menu-item">
            <span
              className="material-symbols-outlined material-icons-filled mobile-menu-icons"
              aria-label={option.name}
            >
              {option.icon}
            </span>
            <span className="menu-text">{option.name}</span>
          </li>
        ))}
      </ul>
    </nav>
  );
}
