// React Components
import { Route } from "react-router-dom";

// Custom Components

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
    </>
  );
};

export default App;
