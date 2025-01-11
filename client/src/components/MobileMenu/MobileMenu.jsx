import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "./MobileMenu.css";

export default function MobileMenu() {
  const { t } = useTranslation();
  const options = [
    {
      name: "LogIn",
      icon: "account_circle",
      link: "/login",
    },
    {
      name: "Map",
      icon: "map",
      link: "/map",
    },
    {
      name: "Report",
      icon: "report",
      link: "/report",
    },
    {
      name: "Dashboard",
      icon: "bar_chart_4_bars",
      link: "/dashboard",
    },
    {
      name: "Trending",
      icon: "trending_up",
      link: "/hotreports",
    },
  ];

  return (
    <nav className="mobile-menu">
      <ul>
        {options.map((option, index) => (
          <li key={index} className="menu-item">
            <Link id={option.name} to={option.link}>
              <span
                className="material-symbols-outlined material-icons-filled mobile-menu-icons"
                aria-label={option.name}
              >
                {option.icon}
              </span>
              <span className="menu-text">{option.name}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
