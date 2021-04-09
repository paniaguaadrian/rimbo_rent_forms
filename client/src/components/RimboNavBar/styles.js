import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  navbarDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
    alignItems: `center`,
    // marginTop: `.0.6rem`,
    // marginBottom: `0.6rem`,
  },

  navListDisplayFlex: {
    display: `flex`,
    justifyContent: `space-between`,
  },

  linkText: {
    textDecoration: `none`,
    color: `black`,
    transition: `all .25s ease-in-out`,
    "&:hover": {
      color: `#6aa3a1`,
    },
  },

  logo: {
    height: `3rem`,
  },

  LanguageLogo: {
    height: `1.3rem`,
  },

  ToggleLanguageButton: {
    background: `none !important`,
    border: `none`,
    backgroundColor: `none !important`,
    width: `3rem !important`,
    margin: `0 auto`,
  },
});

export default useStyles;
