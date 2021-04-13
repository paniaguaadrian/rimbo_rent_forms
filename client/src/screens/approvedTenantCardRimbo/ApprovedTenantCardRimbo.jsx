// React Components
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Reducers
import { TenantReducer, DefaultTenant } from "./approved_tenant_card-reducer";

// Custom Components
import CustomHelmet from "../../components/Helmet/CustomHelmet";
import Success from "../../components/Success/Success";

// Multi language
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// Images
import SuccessImage from "../../images/success-image.svg";

// End-Points env
const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCY,
  REACT_APP_API_RIMBO_TENANT,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const ApprovedTenantCardRimbo = ({ t }) => {
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
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}/card/approved`,
        body
      );

    const processDecision = async () => {
      const { data: tenancyData } = await fetchUserData();
      // let's console.log userData here, so we know it is in the right format.
      //   console.log(tenancyData);

      const postBody = {
        // use some logic based on tenancyData here to make the postBody
        isCardAccepted: tenant.isCardAccepted,
        randomID: tenancyData.tenant.randomID,
      };

      // If the above use of {data} is correct it should be correct here too.
      const { data: decisionResult } = await postDecision(postBody);
      // console.log(postBody);

      const { tenantsName, tenantsEmail } = tenancyData.tenant;

      const {
        agencyContactPerson,
        agencyEmailPerson,
        agencyName,
      } = tenancyData.agent;

      if (tenancyData.tenant.isCardAccepted === false) {
        await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj15`, {
          tenantsName,
          tenantsEmail,
          agencyContactPerson,
          agencyEmailPerson,
          agencyName,
          tenancyID,
          randomID,
        });
      }
      setState(decisionResult);
    };

    processDecision();
  }, [randomID, tenancyID, tenant.isCardAccepted]);

  return (
    <>
      <CustomHelmet header={t("approvedCardRimbo.helmet")} />
      <Success
        title={t("approvedCardRimbo.title")}
        subtitle={t("approvedCardRimbo.subTitle")}
        imageSRC={SuccessImage}
        imageAlt="Success image"
      />
    </>
  );
};

export default withNamespaces()(ApprovedTenantCardRimbo);
