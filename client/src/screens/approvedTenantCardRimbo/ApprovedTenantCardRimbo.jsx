// React Components
import React, { useEffect, useState, useReducer } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Custom Components
import CustomHelmet from "../../components/Helmet/CustomHelmet";
import Success from "../../components/Success/Success";

// Multi language
import { withNamespaces } from "react-i18next";
// import i18n from "../../i18n";

// Reducer
import { TenantReducer, DefaultTenant } from "./approved_tenant_card-reducer";

// Images
import SuccessImage from "../../images/success-image.svg";

// End-Points env
const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCY,
  REACT_APP_API_RIMBO_TENANCIES,
  REACT_APP_API_RIMBO_TENANT,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const ApprovedTenantCardRimbo = ({ t }) => {
  let { tenancyID } = useParams();
  const randomID = tenancyID;
  const randomIDSend = tenancyID;
  const [tenant] = useReducer(TenantReducer, DefaultTenant);

  const [state, setState] = useState(null); // eslint-disable-line
  const [tenancyState, setTenancyState] = useState(null); // eslint-disable-line

  useEffect(() => {
    // ! TENANT: Simplify fetch tenant Data.
    const fetchTenantData = () =>
      axios.get(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}`
      );

    // ! TENANT: Add body to post decision. So we can send data. For tenant
    const postDecision = (body) =>
      axios.post(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}/card/approved`,
        body
      );

    // ! TENANCY: Simplply fetch tenancy Data.
    const fetchTenancyData = () =>
      axios.get(`${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCIES}`);

    // ! TENANCY: Add body to post decision. So we can send data. For tenancy
    const postTenancyDecision = (body) =>
      axios.post(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}/allTenantsCardAccepted`,
        body
      );

    const processDecision = async () => {
      // ! TENANT
      const { data: tenantData } = await fetchTenantData();

      const postBody = {
        isCardAccepted: tenant.isCardAccepted,
        randomID: tenantData.randomID,
      };

      const { data: decisionResult } = await postDecision(postBody);

      setState(decisionResult);

      // ! TENANCY (AFTER TENANT IS ALL ACCEPTED)

      const { data: tenancyData } = await fetchTenancyData();
      // console.log(tenancyData);

      const tenants = ["tenant", "tenantTwo", "tenantThree", "tenantFour"];

      const getTenancy = (randomID) => {
        for (let tenancy of tenancyData) {
          for (let key in tenancy) {
            if (!tenants.includes(key)) continue;
            if (tenancy[key].randomID === randomID) return tenancy;
          }
        }
      };

      const desiredTenancy = getTenancy(randomID);
      console.log(desiredTenancy);

      const hasAccepted = Object.keys(desiredTenancy)
        // eslint-disable-next-line
        .map((key) => {
          const isExist = tenants.includes(key);
          if (isExist) {
            const thisONE = desiredTenancy[key].isCardAccepted;
            console.log(thisONE);
            return thisONE;
          }
          // return isExist; // If i return isExist I see false on console
        })
        .filter((item) => item !== undefined)
        .every((x) => x);

      console.log(hasAccepted);

      if (hasAccepted) {
        if (!desiredTenancy.isAllCardsAccepted) {
          const postTenancyBody = {
            isAllCardsAccepted: tenant.isAllCardsAccepted,
            tenancyID: desiredTenancy.tenancyID,
          };

          const { data: decisionTenancyResult } = await postTenancyDecision(
            postTenancyBody
          );
          const {
            tenantsName,
            tenantsEmail,
            randomIDSend,
            tenantsLanguage,
          } = tenantData;

          const {
            agencyContactPerson,
            agencyEmailPerson,
            agencyName,
            agencyLanguage,
          } = desiredTenancy.agent;

          const emailData = {
            tenantsName,
            tenantsEmail,
            agencyContactPerson,
            agencyEmailPerson,
            agencyName,
            tenancyID: desiredTenancy.tenancyID,
            randomID: randomIDSend,
          };

          if (tenantsLanguage === "en") {
            await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj15/tt`, emailData);
          } else {
            await axios.post(
              `${REACT_APP_BASE_URL_EMAIL}/es/rj15/tt`,
              emailData
            );
          }

          if (agencyLanguage === "en") {
            await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj15/pm`, emailData);
          } else {
            await axios.post(
              `${REACT_APP_BASE_URL_EMAIL}/es/rj15/pm`,
              emailData
            );
          }

          setTenancyState(decisionTenancyResult);
        }
      }
    };

    processDecision();
  }, [randomID, tenancyID, tenant, randomIDSend]);

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
