// React Components
import React from "react";

// Material Ui Icons
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";

// Images
import RimboLogoWhite from "../../images/rimbo_logo_white.png";

// Multi language
import { withNamespaces } from "react-i18next";

// Styles imported
import classes from "./footer.module.scss";

const Footer = ({ t }) => {
  return (
    <div className={classes.FooterContainer}>
      <div className={classes.FooterContent}>
        <div className={classes.FooterMain}>
          <a href="http://rimbo.rent" target="_blank" rel="noopener noreferrer">
            <img src={RimboLogoWhite} alt="Rimbo Rent Logo" />
          </a>
          <h4>{t("Footer.leftTitle")}</h4>
          <h4>{t("Footer.leftSubtitle")} </h4>
          <div className={classes.FooterSocialMedia}>
            <ul>
              <li>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon className={classes.SocialMediaIcon} />
                </a>
              </li>
              <li>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon className={classes.SocialMediaIcon} />
                </a>
              </li>
              <li>
                <a href="/" target="_blank" rel="noopener noreferrer">
                  <TwitterIcon className={classes.SocialMediaIcon} />
                </a>
              </li>
            </ul>
          </div>
        </div>
        {/* End of FooterMain */}

        <div className={classes.FooterSecond}>
          <div className={classes.FooterLinks}>
            <h4>{t("Footer.rimbo")}</h4>
            <ul>
              <a href="/">
                <li>{t("Footer.about")}</li>
              </a>
              <a href="/">
                <li>{t("Footer.tenants")}</li>
              </a>
              <a href="/">
                <li>{t("Footer.landlords")}</li>
              </a>
              <a href="/">
                <li>{t("Footer.agencies")}</li>
              </a>
              <a href="/">
                <li>{t("Footer.news")}</li>
              </a>
            </ul>
          </div>
          <div className={classes.FooterLinks}>
            <h4>{t("Footer.help")}</h4>
            <ul>
              <a href="/">
                <li>{t("Footer.contact")}</li>
              </a>
              <a
                href="mailto:info@rimbo.rent"
                target="_blank"
                rel="noopener noreferrer"
              >
                <li>info@rimbo.rent</li>
              </a>
            </ul>
          </div>
          <div className={classes.FooterLinks}>
            <h4>{t("Footer.legal")}</h4>
            <ul>
              <a href="/">
                <li>{t("Footer.legalNotice")}</li>
              </a>
              <a href="/">
                <li>{t("Footer.privacy")}</li>
              </a>
              <a href="/">
                <li>{t("Footer.cookies")}</li>
              </a>
            </ul>
          </div>
        </div>
      </div>
      {/* End FooterContent */}

      <div className={classes.FooterCopyContainer}>
        <p>{t("Footer.copyright")}</p>
      </div>
    </div>
    // End FooterContainer
  );
};

export default withNamespaces()(Footer);
