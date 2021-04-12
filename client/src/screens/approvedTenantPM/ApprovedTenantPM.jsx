// React components
import React, { useState, useEffect, useReducer } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { TenantReducer, DefaultTenant } from "./approved_tenant_pm-reducer";

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

const ApprovedTenantPM = ({ t }) => {
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
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/pm/approved`,
        body
      );

    const processDecision = async () => {
      const { data: tenancyData } = await fetchUserData();
      // let's console.log userData here, so we know it is in the right format.
      // console.log(tenancyData);

      const postBody = {
        // use some logic based on tenancyData here to make the postBody
        isPMAccepted: tenant.isPMAccepted,
        randomID: tenancyData.tenant.randomID,
      };

      // If the above use of {data} is correct it should be correct here too.
      const { data: decisionResult } = await postDecision(postBody);
      // console.log(postBody);

      const {
        tenantsName,
        tenantsEmail,
        tenantsPhone,
        monthlyNetIncome,
        jobType,
        documentNumber,
        randomID,
      } = tenancyData.tenant;

      const {
        agencyContactPerson,
        agencyEmailPerson,
        agencyName,
        agencyPhonePerson,
      } = tenancyData.agent;

      const {
        rentalAddress,
        rentalCity,
        rentalPostalCode,
      } = tenancyData.property;

      const {
        landlordName,
        landlordEmail,
        landlordPhone,
      } = tenancyData.landlord;

      const { rentAmount, product, rentDuration } = tenancyData;

      const tenancyID = tenancyData.tenancyID;

      console.log(tenancyData);
      // console.log(tenantsName, randomID);
      // console.log(agencyContactPerson, agencyEmailPerson);
      // console.log("this is tenancyID:" + tenancyID);

      // Don't send an email if the tenant is already accepted
      if (tenancyData.tenant.isPMAccepted === false) {
        axios.post(`${REACT_APP_BASE_URL_EMAIL}/rjpm`, {
          tenancyID,
          randomID,
          tenantsName,
          tenantsEmail,
          tenantsPhone,
          monthlyNetIncome,
          jobType,
          documentNumber,
          agencyContactPerson,
          agencyEmailPerson,
          agencyName,
          agencyPhonePerson,
          rentAmount,
          product,
          rentDuration,
          rentalAddress,
          rentalCity,
          rentalPostalCode,
          landlordName,
          landlordEmail,
          landlordPhone,
        });
      }

      setState(decisionResult);
    };

    processDecision();
  }, [randomID, tenant.isPMAccepted, tenancyID]);

  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

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
      <CustomHelmet header={t("approvedTenantPM.helmet")} />
      <Success
        title={t("approvedTenantPM.title")}
        subtitle={t("approvedTenantPM.subTitle")}
        imageSRC={SuccessImage}
        imageAlt="Success image"
      />
    </>
  );
};

export default withNamespaces()(ApprovedTenantPM);
