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
import i18n from "../../i18n";

// Styles
import useStyles from "./styles";

const Header = () => {
  const classes = useStyles();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

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

  const navLinksEs = [
    { title: `Inquilinos`, path: `/about-us` },
    { title: `Propietarios`, path: `/product` },
    { title: `Agencias`, path: `/blog` },
  ];

  const navLinksEn = [
    { title: `Tenants`, path: `/about-us` },
    { title: `Landlords`, path: `/product` },
    { title: `Agencies`, path: `/blog` },
  ];

  return (
    <>
      <HideOnScroll>
        <AppBar position="fixed" color="white">
          <Toolbar component="nav">
            <Container maxWidth="xl" className={classes.NavBarContainer}>
              <a href="/" style={{ color: `white` }}>
                <img
                  src={RimboLogo}
                  alt="Rimbo Logo"
                  className={classes.Logo}
                />
              </a>

              <Hidden smDown>
                {i18n.language === "es" ? (
                  <List
                    component="nav"
                    aria-labelledby="main navigation"
                    className={classes.LinksListContainer}
                  >
                    {navLinksEs.map(({ title, path }) => (
                      <a href={path} key={title} className={classes.LinkText}>
                        <ListItem>
                          <ListItemText primary={title} />
                        </ListItem>
                      </a>
                    ))}
                    {english_logo}
                  </List>
                ) : (
                  <List
                    component="nav"
                    aria-labelledby="main navigation"
                    className={classes.LinksListContainer}
                  >
                    {navLinksEn.map(({ title, path }) => (
                      <a href={path} key={title} className={classes.LinkText}>
                        <ListItem>
                          <ListItemText primary={title} />
                        </ListItem>
                      </a>
                    ))}
                    {spanish_logo}
                  </List>
                )}
              </Hidden>
              <Hidden mdUp>
                {i18n.language === "es" ? (
                  <SideDrawer navLinks={navLinksEs} />
                ) : (
                  <SideDrawer navLinks={navLinksEn} />
                )}
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

export default Header;
