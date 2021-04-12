// React Components
import React, { useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

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
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const ApprovedTenantCardRimbo = ({ t }) => {
  let { tenancyID } = useParams();
  const randomID = tenancyID;

  useEffect(() => {
    // Simplify fetchUserData.
    const fetchUserData = () =>
      axios.get(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}`
      );

    const processDecision = async () => {
      const { data: tenancyData } = await fetchUserData();
      // let's console.log userData here, so we know it is in the right format.
      //   console.log(tenancyData);

      const { tenantsName, tenantsEmail } = tenancyData.tenant;

      const {
        agencyContactPerson,
        agencyEmailPerson,
        agencyName,
      } = tenancyData.agent;
      await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj15`, {
        tenantsName,
        tenantsEmail,
        agencyContactPerson,
        agencyEmailPerson,
        agencyName,
        tenancyID,
        randomID,
      });
    };

    processDecision();
  }, [randomID, tenancyID]);

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
