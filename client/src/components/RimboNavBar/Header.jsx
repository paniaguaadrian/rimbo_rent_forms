import {
  AppBar,
  Container,
  Hidden,
  List,
  ListItem,
  ListItemText,
  Toolbar,
  Fab,
} from "@material-ui/core";
import { KeyboardArrowUp } from "@material-ui/icons";
import * as React from "react";
import HideOnScroll from "./HideOnScroll";
import SideDrawer from "./SideDrawer";
import BackToTop from "./BackToTop";

// Images
import RimboLogo from "../../images/rimbo-logo.png";
import SpanishLogo from "../../images/spanish-language.png";
import EnglishLogo from "../../images/english-language.png";

// Multi language
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// Styles
import useStyles from "./styles";

const Header = ({ t }) => {
  const classes = useStyles();

  const spanish_logo = (
    <button
      onClick={() => changeLanguage("es")}
      className={classes.ToggleLanguageButton}
    >
      <img
        src={SpanishLogo}
        alt="Spanish language logo"
        className={classes.LanguageLogo}
      />
    </button>
  );

  const english_logo = (
    <button
      onClick={() => changeLanguage("en")}
      className={classes.ToggleLanguageButton}
    >
      <img
        src={EnglishLogo}
        alt="English language logo"
        className={classes.LanguageLogo}
      />
    </button>
  );

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const navLinks = [
    { title: `Tenants`, path: `/about-us` },
    { title: `Landlords`, path: `/product` },
    { title: `Agencies`, path: `/blog` },
    { title: spanish_logo },
    { title: english_logo },
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" color="white">
          <Toolbar component="nav">
            <Container maxWidth="xl" className={classes.navbarDisplayFlex}>
              <a href="/" style={{ color: `white` }}>
                <img
                  src={RimboLogo}
                  alt="Rimbo Logo"
                  className={classes.logo}
                />
              </a>

              <Hidden smDown>
                <List
                  component="nav"
                  aria-labelledby="main navigation"
                  className={classes.navListDisplayFlex}
                >
                  {navLinks.map(({ title, path }) => (
                    <a href={path} key={title} className={classes.linkText}>
                      <ListItem>
                        <ListItemText primary={title} />
                      </ListItem>
                    </a>
                  ))}
                </List>
              </Hidden>
              <Hidden mdUp>
                <SideDrawer navLinks={navLinks} />
              </Hidden>
            </Container>
          </Toolbar>
        </AppBar>
      </HideOnScroll>
      <Toolbar id="back-to-top-anchor" />

      <BackToTop>
        <Fab color="secondary" size="large" aria-label="scroll back to top">
          <KeyboardArrowUp />
        </Fab>
      </BackToTop>
    </>
  );
};

export default withNamespaces()(Header);
