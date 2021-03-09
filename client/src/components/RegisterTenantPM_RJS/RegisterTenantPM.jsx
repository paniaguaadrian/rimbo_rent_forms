// React Components
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TenantReducer, DefaultTenant } from "./tenant-reducer";

// Styles
import styles from "../RegisterTenancy/register-user.module.scss";

// Validation
import { newTenant } from "./tenant_validation";

// Constants
import { UPDATE_NEWTENANT_INFO } from "./tenant-constants";

// Custom Components
import Input from "../Input";
import InputFile from "../InputFile";
import Button from "../Button";
import Loader from "react-loader-spinner";

const RegisterTenantPM = () => {
  const { tenancyID } = useParams();

  //   console.log(tenancyID);

  const [tenant, setTenant] = useReducer(TenantReducer, DefaultTenant);
  const [errors, setErrors] = useState({});
  const [isProcessing, setProcessingTo] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);

  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // GET from DB => Tenancy information => Have all information about the tenancy => Send email with it.
  useEffect(
    () => {
      const getData = () => {
        fetch(`http://localhost:8081/api/tenancies/tenancy/${tenancyID}`)
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
    [tenancyID],
    [responseData, loading, err]
  );

  // Handle on change
  const handleNewTenant = ({ target }) => {
    setTenant({
      type: UPDATE_NEWTENANT_INFO,
      payload: { [target.name]: target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // const api_rimbo_tenants = process.env.REACT_APP_API_RIMBO_TENANTS;
    // ! POST to RIMBO_API => DB
    // Production axios: `${api_rimbo_tenants}`;
    // Development axios : "http://localhost:8081/api/tenants/tenant/:randomID"
    // ! POST to email service
    // Production axios: `${XXXXXXXXXXXXX}`;
    // Development axios : "http://localhost:8080/submit-email/rj2"

    const errors = newTenant(tenant);
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setProcessingTo(true);
    setIsSuccessfullySubmitted(true);

    // ! POST to RIMBO_API => DB
    await axios.post(
      `http://localhost:8081/api/tenancies/tenancy/${tenancyID}`,
      {
        pmAnex: tenant.pmAnex,
        rentStartDate: tenant.rentStartDate,
        tenancyID: tenancyID,
      }
    );
    // ! POST to email service
    await axios.post("http://localhost:8080/submit-email/rjs", {
      agencyName: responseData.agent.agencyName,
      rentalAddress: responseData.property.rentalAddress,
      tenantsName: responseData.tenant.tenantsName,
    });
  };

  return (
    <>
      {!isSuccessfullySubmitted ? (
        <div className={styles.RegisterContainer}>
          <div className={styles.Register}>
            <h1>
              Horray! The rental is now covered by Rimbo! Your tenants can move
              in now!
            </h1>
            <div className={styles.ExtraInfoContainer}>
              {/* <h2>
                All we need from you is the following information. Quick and
                easy!
              </h2> */}
              <p>Confirm the rental start date and upload the Rimbo Annex.</p>
            </div>
          </div>
          <div className={styles.FormContent}>
            <form
              onSubmit={handleSubmit}
              className="styles.RegisterForm"
              encType="multipart/form-data"
            >
              <Input
                type="date"
                name="rentStartDate"
                value={tenant.rentStartDate}
                label="Rental start date"
                placeholder="Write your income"
                onChange={(e) => handleNewTenant(e)}
                error={errors.rentStartDate}
              />
              <InputFile
                type="file"
                name="pmAnex"
                value={tenant.pmAnex}
                label="Rental Agreement - Rimbo Annex"
                placeholder="XXXXX"
                onChange={(e) => handleNewTenant(e)}
                error={errors.pmAnex}
              />

              <div className={styles.ButtonContainer}>
                {isProcessing ? (
                  <Loader
                    type="Puff"
                    color="#01d2cc"
                    height={50}
                    width={50}
                    timeout={3000} //3 secs
                  />
                ) : (
                  <Button disabled={isProcessing} type="submit">
                    Send
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <div className={styles.SuccessPageContainer}>
          <div className={styles.SuccessPageText}>
            <h1>The form has been completed successfully</h1>
            <h2>All data has been successfully completed</h2>
            <p>
              Thanks for your time <b>{responseData.tenant.tenantsName}</b>, We
              will contact you shortly to give you more details of the process.
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterTenantPM;
