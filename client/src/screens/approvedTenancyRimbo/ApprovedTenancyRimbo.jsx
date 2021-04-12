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
import { TenantReducer, DefaultTenant } from "./approved_tenancy_rimbo-reducer";

// Images
import SuccessImage from "../../images/success-image.svg";

// End-Points env
const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCY,
  REACT_APP_API_RIMBO_TENANT,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const ApprovedTenancyRimbo = ({ t }) => {
  let { tenancyID } = useParams();
  const randomID = tenancyID;
  const [tenant] = useReducer(TenantReducer, DefaultTenant);
  const [state, setState] = useState(null); // eslint-disable-line
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  useEffect(() => {
    // Simplify fetchUserData.

    const fetchUserData = () =>
      axios.get(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}`
      );

    // Add body to post decision. So we can send data.
    const postDecision = (body) =>
      axios.post(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}/rimbo/start-service`,
        body
      );

    const processDecision = async () => {
      const { data: tenancyData } = await fetchUserData();
      // let's console.log userData here, so we know it is in the right format.
      // console.log(tenancyData);

      const postBody = {
        // use some logic based on tenancyData here to make the postBody
        rentStart: tenant.rentStart,
        tenancyID: tenancyData.tenancyID,
      };

      // If the above use of {data} is correct it should be correct here too.
      const { data: decisionResult } = await postDecision(postBody);
      // console.log(postBody);

      const { tenantsName, tenantsEmail, randomID } = tenancyData.tenant;
      const { agencyContactPerson, agencyEmailPerson } = tenancyData.agent;
      const { rentalAddress } = tenancyData.property;
      const tenancyID = tenancyData.tenancyID;

      // console.log(tenancyData);

      // Don't send an email if the tenancy is already accepted
      if (tenancyData.rentStart === false) {
        axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj18`, {
          tenancyID,
          randomID,
          tenantsName,
          tenantsEmail,
          agencyContactPerson,
          agencyEmailPerson,
          rentalAddress,
        });
      }

      setState(decisionResult);
    };

    processDecision();
  }, [randomID, tenant.rentStart, tenancyID]);

  useEffect(
    () => {
      const getData = () => {
        fetch(`${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}`)
          .then((res) => {
            if (res.status >= 400) {
              throw new Error("Server responds with error!" + res.status);
            }
            return res.json();
          })
          .then(
            (responseData) => {
              setResponseData(responseData);
              setLoading(true);
            },
            (err) => {
              setErr(err);
              setLoading(true);
            }
          );
      };
      getData();
    },
    [randomID],
    [responseData, loading, err]
  );

  return (
    <>
      <CustomHelmet header={t("approvedTenancyRimbo.helmet")} />
      <Success
        title={t("approvedTenancyRimbo.title")}
        subtitle={t("approvedTenancyRimbo.subTitle")}
        imageSRC={SuccessImage}
        imageAlt="Success image"
      />
    </>
  );
};

export default withNamespaces()(ApprovedTenancyRimbo);
