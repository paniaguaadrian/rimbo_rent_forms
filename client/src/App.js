// React Components
import { Route, Redirect } from "react-router-dom";

// Multilingual
import { withNamespaces } from "react-i18next";

// Custom Components

// ! Screens
// General
import Page404 from "./screens/404/404";
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

// Normalize & Generic styles
import "./styles/generic.scss";

const App = () => {
  return (
    <>
      <Route exact path="/register/rj1" component={RegisterTenancy} />
      <Route exact path="/register/rj2/:tenancyID" component={RegisterTenant} />
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
        exact
        path="/register/rj2/:tenancyID/approved"
        component={ApprovedTenantRimbo}
      />
      <Route
        exact
        path="/register/rj2/:tenancyID/rejected"
        component={RejectedTenantRimbo}
      />
      <Route
        exact
        path="/register/rj2/:tenancyID/pm/approved"
        component={ApprovedTenantPM}
      />
      <Route
        exact
        path="/register/rj3/:tenancyID/card/approved"
        component={ApprovedTenantCardRimbo}
      />

      <Route
        exact
        path="/register/rjs/:tenancyID/service-start"
        component={ApprovedTenancyRimbo}
      />

      <Route path="/404" component={Page404} />
      <Redirect to="/404" />
    </>
  );
};

export default withNamespaces()(App);
