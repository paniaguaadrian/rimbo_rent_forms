// React components
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TenantReducer, DefaultTenant } from "./approved_tenant_rimbo-reducer";

// Constants
// import { UPDATE_NEWTENANT_RIMBO_APPROVED } from "./approved_tenant_rimbo-constants";

const ApprovedTenantRimbo = () => {
  let { tenancyID } = useParams();
  const randomID = tenancyID;
  const [tenant] = useReducer(TenantReducer, DefaultTenant);
  const [state, setState] = useState(null);

  useEffect(() => {
    // Simplify fetchUserData.
    const fetchUserData = () =>
      axios.get(`http://localhost:8081/api/tenants/tenant/${randomID}`);

    // Add body to post decision. So we can send data.
    const postDecision = (body) =>
      axios.post(
        `http://localhost:8081/api/tenants/tenant/${randomID}/approved`,
        body
      );

    const processDecision = async () => {
      const { data: userData } = await fetchUserData();
      // let's console.log userData here, so we know it is in the right format.
      console.log(userData);

      const postBody = {
        // use some logic based on userData here to make the postBody
        isRimboAccepted: tenant.isRimboAccepted,
        randomID: randomID,
      };

      // If the above use of {data} is correct it should be correct here too.
      const { data: decisionResult } = await postDecision(postBody);
      console.log(postBody);

      setState(decisionResult);
    };

    processDecision();
  }, [randomID, tenant.isRimboAccepted]);

  return (
    <div>
      <h1>Tenant Approved!</h1>
      <p>the tenant is Accepted</p>
    </div>
  );
};

export default ApprovedTenantRimbo;
