// React Components
import React from "react";

// Material Ui Icons
import InstagramIcon from "@material-ui/icons/Instagram";
import FacebookIcon from "@material-ui/icons/Facebook";
import TwitterIcon from "@material-ui/icons/Twitter";

// Images
import RimboLogoWhite from "../../images/rimbo_logo_white.png";

// Styles imported
import classes from "./footer.module.scss";

const Footer = () => {
  return (
    <div className={classes.FooterContainer}>
      <div className={classes.FooterContent}>
        <div className={classes.FooterMain}>
          <a href="http://rimbo.rent" target="_blank" rel="noopener noreferrer">
            <img src={RimboLogoWhite} alt="Rimbo Rent Logo" />
          </a>
          <h4>Welcome to the easy renting!</h4>
          <h4>
            Discover a new way of renting that is fairer and safer for everyone
          </h4>
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
            <h4>Rimbo</h4>
            <ul>
              <a href="/">
                <li>About us</li>
              </a>
              <a href="/">
                <li>Tenants</li>
              </a>
              <a href="/">
                <li>Landlords</li>
              </a>
              <a href="/">
                <li>Agencies</li>
              </a>
              <a href="/">
                <li>News</li>
              </a>
            </ul>
          </div>
          <div className={classes.FooterLinks}>
            <h4>Help</h4>
            <ul>
              <a href="/">
                <li>Contact</li>
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
            <h4>Legal</h4>
            <ul>
              <a href="/">
                <li>Legal Notice</li>
              </a>
              <a href="/">
                <li>Privacy Policy</li>
              </a>
              <a href="/">
                <li>Cookies Policy</li>
              </a>
            </ul>
          </div>
        </div>
      </div>
      {/* End FooterContent */}

      <div className={classes.FooterCopyContainer}>
        <p>© Rimbo S.L. 2021 All rights reserved</p>
      </div>
    </div>
    // End FooterContainer
  );
};

export default Footer;
