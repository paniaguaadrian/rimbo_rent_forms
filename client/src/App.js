// React Components
import { Route, Switch, Redirect } from "react-router-dom";

// Multilingual
import { withNamespaces } from "react-i18next";

// Custom Components
import WhatsappBubble from "./components/WhatsappBubble/WhatsappBubble";
import NavBar from "./components/RimboNavBar/Header";
import Footer from "./components/Footer/Footer";

// Material-UI
import { Container } from "@material-ui/core";

// ! Screens
// Forms
import RegisterTenancy from "./screens/RegisterTenancy";
import RegisterTenant from "./screens/RegisterTenant_RJ2/RegisterTenant";
import RegisterTenantCard from "./screens/RegisterTenantCard_RJ3/StripeHandlerComponent";
import RegisterTenantPM from "./screens/RegisterTenantPM_RJS/RegisterTenantPM";
// Approved
import ApprovedTenantRimbo from "./screens/approvedTenantRimbo/ApprovedTenantRimbo";
import ApprovedTenantPM from "./screens/approvedTenantPM/ApprovedTenantPM";
import ApprovedTenantCardRimbo from "./screens/approvedTenantCardRimbo/ApprovedTenantCardRimbo";
import ApprovedTenancyRimbo from "./screens/approvedTenancyRimbo/ApprovedTenancyRimbo";
// Rejected
import RejectedTenantRimbo from "./screens/approvedTenantRimbo/RejectedTenantRimbo";
// General
import Page404 from "./screens/404/404";

// Normalize & Generic styles
import "./styles/generic.scss";

const App = () => {
  return (
    <>
      <NavBar />

      <WhatsappBubble />
      <Container maxWidth="xl">
        <Switch>
          <Route exact path="/register/rj1" component={RegisterTenancy} />
          <Route
            exact
            path="/register/rj2/:tenancyID"
            component={RegisterTenant}
          />
          <Route
            exact
            path="/register/rj3/:randomID"
            component={RegisterTenantCard}
          />
          <Route
            exact
            path="/register/rjs/:tenancyID"
            component={RegisterTenantPM}
          />
          <Route
            path="/register/rj2/:tenancyID/approved"
            component={ApprovedTenantRimbo}
          />
          <Route
            path="/register/rj2/:tenancyID/rejected"
            component={RejectedTenantRimbo}
          />
          <Route
            path="/register/rj2/:tenancyID/pm/approved"
            component={ApprovedTenantPM}
          />
          <Route
            path="/register/rj3/:tenancyID/card/approved"
            component={ApprovedTenantCardRimbo}
          />

          <Route
            path="/register/rjs/:tenancyID/service-start"
            component={ApprovedTenancyRimbo}
          />

          <Route path="/404" component={Page404} />
          <Redirect to="/404" />
        </Switch>
      </Container>
      <Footer />
    </>
  );
};

export default withNamespaces()(App);
