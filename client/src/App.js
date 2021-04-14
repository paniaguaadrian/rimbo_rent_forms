// Multilingual
import { withNamespaces } from "react-i18next";

// Custom Components
import WhatsappBubble from "./components/WhatsappBubble/WhatsappBubble";
import NavBar from "./components/RimboNavBar/Header";
import Footer from "./components/Footer/Footer";

// Material-UI
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

import RouterWrapper from "./RouterWrapper";

// Normalize & Generic styles
import "./styles/generic.scss";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#6aa3a1",
    },
    secondary: {
      main: "#24c4c4",
    },
  },
});

const App = () => {
  return (
    <MuiThemeProvider theme={theme}>
      <NavBar />
      <WhatsappBubble />
      <RouterWrapper />
      <Footer />
    </MuiThemeProvider>
  );
};

export default withNamespaces()(App);
