// React components
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Custom Components
import CustomHelmet from "../../components/Helmet/CustomHelmet";
import Success from "../../components/Success/Success";

// Multi language
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// Reducer
import { TenantReducer, DefaultTenant } from "./approved_tenant_rimbo-reducer";

// Images
import SuccessImage from "../../images/success-image.svg";

// End-Points env
const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCY,
  REACT_APP_API_RIMBO_TENANT,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const ApprovedTenantRimbo = ({ t }) => {
  let { tenancyID } = useParams();
  const randomID = tenancyID;
  const [tenant] = useReducer(TenantReducer, DefaultTenant);

  const [state, setState] = useState(null); // eslint-disable-line

  useEffect(() => {
    // Simplify fetchUserData.
    const fetchUserData = () =>
      axios.get(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}`
      );

    // Add body to post decision. So we can send data.
    const postDecision = (body) =>
      axios.post(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}/approved`,
        body
      );

    const processDecision = async () => {
      const { data: tenancyData } = await fetchUserData();
      // let's console.log userData here, so we know it is in the right format.
      // console.log(tenancyData);

      const postBody = {
        // use some logic based on tenancyData here to make the postBody
        isRimboAccepted: tenant.isRimboAccepted,
        randomID: tenancyData.tenant.randomID,
      };

      // If the above use of {data} is correct it should be correct here too.
      const { data: decisionResult } = await postDecision(postBody);
      // console.log(postBody);

      const { tenantsName, randomID } = tenancyData.tenant;
      const { agencyContactPerson, agencyEmailPerson } = tenancyData.agent;
      const tenancyID = tenancyData.tenancyID;

      const emailData = {
        tenantsName,
        agencyContactPerson,
        agencyEmailPerson,
        tenancyID,
        randomID,
      };

      if (tenancyData.tenant.isRimboAccepted === false) {
        if (i18n.language === "en") {
          axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj11`, emailData);
        } else {
          axios.post(`${REACT_APP_BASE_URL_EMAIL}/es/rj11`, emailData);
        }
      }

      setState(decisionResult);
    };

    processDecision();
  }, [randomID, tenant.isRimboAccepted, tenancyID]);

  return (
    <>
      <CustomHelmet header={t("approvedTenantRimbo.helmet")} />
      <Success
        title={t("approvedTenantRimbo.title")}
        subtitle={t("approvedTenantRimbo.subTitle")}
        imageSRC={SuccessImage}
        imageAlt="Success image"
      />
    </>
  );
};

export default withNamespaces()(ApprovedTenantRimbo);
