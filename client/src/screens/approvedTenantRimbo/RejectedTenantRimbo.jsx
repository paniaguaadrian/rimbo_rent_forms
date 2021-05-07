// React components
import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

// Custom Components
import CustomHelmet from "../../components/Helmet/CustomHelmet";
import Success from "../../components/Success/Success";
import PageContainer from "../../components/PageContainer/PageContainer";

// Multi language
import { withNamespaces } from "react-i18next";

// Images
import CancelImage from "../../images/undraw_cancel_u1it.svg";

// End-Points env
const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCIES,
  REACT_APP_API_RIMBO_TENANT,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const RejectedTenantRimbo = ({ t }) => {
  let { tenancyID } = useParams();
  const randomID = tenancyID;
  const randomIDSend = tenancyID;

  useEffect(() => {
    // ! TENANT: Simplify fetch tenant Data.
    const fetchTenantData = () =>
      axios.get(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}`
      );

    // ! TENANCY: Simplply fetch tenancy Data.
    const fetchTenancyData = () =>
      axios.get(`${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCIES}`);

    const processDecision = async () => {
      const { data: tenantData } = await fetchTenantData();
      const { data: tenancyData } = await fetchTenancyData();

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

      const {
        tenantsName,
        tenantsEmail,
        tenantsPhone,
        randomIDSend,
      } = tenantData;
      const {
        agencyName,
        agencyContactPerson,
        agencyEmailPerson,
        agencyLanguage,
      } = desiredTenancy.agent;
      const { rentalAddress } = desiredTenancy.property;
      const tenancyID = desiredTenancy.tenancyID;

      const emailData = {
        tenantsName,
        tenantsEmail,
        tenantsPhone,
        agencyName,
        agencyContactPerson,
        agencyEmailPerson,
        rentalAddress,
        tenancyID,
        randomID: randomIDSend,
      };

      if (agencyLanguage === "en") {
        axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj12`, emailData);
      } else if (agencyLanguage === "es") {
        axios.post(`${REACT_APP_BASE_URL_EMAIL}/es/rj12`, emailData);
      }
    };
    processDecision();
  }, [tenancyID, randomID, randomIDSend]);
  return (
    <>
      <CustomHelmet header={t("rejectedTenantRimbo.helmet")} />
      <PageContainer>
        <Success
          title={t("rejectedTenantRimbo.title")}
          subtitle={t("rejectedTenantRimbo.subTitle")}
          imageSRC={CancelImage}
          imageAlt="Rejected image"
        />
      </PageContainer>
    </>
  );
};

export default withNamespaces()(RejectedTenantRimbo);
