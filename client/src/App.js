// React Components
import { Route } from "react-router-dom";

// Custom Components
import RegisterTenancy from "./components/RegisterTenancy";
import RegisterTenant from "./components/RegisterTenant_RJ2/RegisterTenant";
import StripeHandler from "./components/RegisterTenantCard_RJ3/StripeHandlerComponent";

// Normalize & Generic styles
import "./styles/generic.scss";

const App = () => {
  return (
    <>
      <Route exact path="/register/rj1" component={RegisterTenancy} />
      <Route exact path="/register/rj2/:tenancyID" component={RegisterTenant} />
      <Route exact path="/register/rj3/:randomID" component={StripeHandler} />
    </>
  );
};

export default App;
