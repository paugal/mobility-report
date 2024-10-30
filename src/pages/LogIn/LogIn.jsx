import React from "react";
import { useTranslation } from "react-i18next";

import "./LogIn.css";

export default function LogIn() {
  const { t } = useTranslation();

  return (
    <div className="LoginPage">
      <div className="mainLoginBox">
        <div className="Login-title">
          <h1>{t("welcome_back")}</h1>
          <p>{t("enter_credentials")}</p>
        </div>
        <div className="Login-inputs">
          <div className="login-input-icon">
            <span className="material-symbols-outlined">mail</span>
            <input type="email" placeholder={t("enter_email")} />
          </div>
          <div className="login-input-icon">
            <span className="material-symbols-outlined">lock</span>
            <input type="password" placeholder={t("enter_password")} />
          </div>
        </div>

        <button className="login-button">{t("log_in")}</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
        <p>
          {t("no_account")} <a href="#">{t("sign_in")}</a>
        </p>
        <p>
          {t("forgot_password")} <a href="#">{t("reset_password")}</a>
        </p>
      </div>
    </div>
  );
}
