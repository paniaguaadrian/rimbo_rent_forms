// React Components
import React from "react";

// Images
import RimboLogo from "../../images/rimbo-logo.png";
import SpanishLogo from "../../images/spanish-language.png";
import EnglishLogo from "../../images/english-language.png";

// Styles imported
import styles from "./navbar.module.scss";

// Multi language
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

const NavBar = ({ t }) => {
  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className={styles.NavBarContainer}>
      <div>
        <a href="https://rimbo.rent/" target="_blank" rel="noreferrer">
          <img className={styles.LogoImage} src={RimboLogo} alt="Rimbo Logo" />
        </a>
      </div>

      <div className={styles.ToggleButtonContainer}>
        <ul className={styles.NavLinks}>
          <li>
            <a href="/register/rj1">{t("NavBar.linkOne")}</a>
          </li>
          <li>
            <a href="/">{t("NavBar.linkTwo")}</a>
          </li>
          <li>
            <a href="/">{t("NavBar.linkThree")}</a>
          </li>
        </ul>

        <button
          onClick={() => changeLanguage("es")}
          className={styles.ToggleLanguageButton}
        >
          <img
            src={SpanishLogo}
            alt="Spanish language logo"
            className={styles.LanguageLogo}
          />
        </button>

        <button
          onClick={() => changeLanguage("en")}
          className={styles.ToggleLanguageButton}
        >
          <img
            src={EnglishLogo}
            alt="English language logo"
            className={styles.LanguageLogo}
          />
        </button>
      </div>
    </div>
  );
};

export default withNamespaces()(NavBar);
