// React Components
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TenantReducer, DefaultTenant } from "./tenant-reducer";

// Styles
// ? Create a new file for that? Maybe
import styles from "../RegisterTenancy/register-user.module.scss";

// Validation
import { newTenant } from "./tenant_validation";

// Constants
import { UPDATE_NEWTENANT_INFO } from "./tenant-constants";

// Custom Components
import Input from "../Input";
import InputCheck from "../InputCheck";
import InputFile from "../InputFile";
import Button from "../Button";
import Loader from "react-loader-spinner";

const RegisterTenant = () => {
  const { tenancyID } = useParams();

  const [tenant, setTenant] = useReducer(TenantReducer, DefaultTenant);
  const [errors, setErrors] = useState({});
  const [isProcessing, setProcessingTo] = useState(false);

  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // GET from DB => Tenancy information
  useEffect(
    () => {
      const getData = () => {
        fetch(`http://localhost:8080/api/tenancy/${tenancyID}`)
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
    // Production axios: `${api_rimbo_tenants}`;
    // Development axios : "http://localhost:8080/api/tenants"

    const errors = newTenant(tenant);
    setErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setProcessingTo(true);

    // POST to RIMBO_API => DB
    await axios.post("http://localhost:8080/api/tenants/:id", {
      // tenant
      monthlyNetIncome: tenant.monthlyNetIncome,
      jobType: tenant.jobType,
      documentType: tenant.documentType,
      documentNumber: tenant.documentNumber,
      tenantsAddress: tenant.tenantsAddress,
      tenantsZipCode: tenant.tenantsZipCode,
      documentImageFront: tenant.documentImageFront,
      documentImageBack: tenant.documentImageBack,
      documentConfirmAddress: tenant.documentConfirmAddress,
      isAcceptedPrivacy: tenant.isAcceptedPrivacy,
      randomID: tenancyID,
    });

    // POST to email service
    await axios.post("http://localhost:8081/submit-email/rj2", {
      // Agent/Agency
      agencyName: responseData.agent.agencyName,
      agencyContactPerson: responseData.agent.agencyContactPerson,
      agencyPhonePerson: responseData.agent.agencyPhonePerson,
      agencyEmailPerson: responseData.agent.agencyEmailPerson,
      // Tenant
      tenantsName: responseData.tenant.tenantsName,
      tenantsPhone: responseData.tenant.tenantsPhone,
      tenantsEmail: responseData.tenant.tenantsEmail,
      monthlyNetIncome: tenant.monthlyNetIncome,
      jobType: tenant.jobType,
      // ! Falta documento de DNI
      tenantsAddress: tenant.tenantsAddress,
      tenantsZipCode: tenant.tenantsZipCode,
      // Proprety
      monthlyRent: responseData.property.monthlyRent,
      rimboService: responseData.property.rimboService,
      rentalDuration: responseData.property.rentalDuration,
      rentalAddress: responseData.property.rentalAddress,
      rentalCity: responseData.property.rentalCity,
      rentalPostalCode: responseData.property.rentalPostalCode,
      // Landlord
      landlordName: responseData.landlord.landlordName,
      landlordPhone: responseData.landlord.landlordPhone,
      landlordEmail: responseData.landlord.landlordEmail,
    });
  };

  const documentType = ["DNI", "NIE", "Passport", "Other"];
  const jobType = [
    "Salaried",
    "Autonomous",
    "Unemployed",
    "We are a company",
    "I'm retired",
    "I am a student",
    "Other",
  ];

  return (
    <div className={styles.RegisterContainer}>
      <div className={styles.Register}>
        <h1>
          Tell us a little more about yourself to save
          <br /> the deposit of your next apartment
        </h1>
        <div className={styles.ExtraInfoContainer}>
          <h2>
            All we need from you is the following information. Quick and easy!
          </h2>
          <p>
            We will need a scanned copy of your DNI / NIE (front and back) or
            passport and a document that confirms your current address. If you
            are an EU citizen, please provide your NIE number in the “Document
            number” field and send us a scanned copy of the identity document of
            your country of origin.
          </p>
        </div>
      </div>
      <div className={styles.FormContent}>
        <form onSubmit={handleSubmit} className="styles.RegisterForm">
          <div className={styles.FormIntern}>
            <div className={styles.FormLeft}>
              <Input
                type="number"
                name="monthlyNetIncome"
                value={tenant.monthlyNetIncome}
                label="Monthly net income"
                placeholder="Write your income"
                onChange={(e) => handleNewTenant(e)}
                error={errors.monthlyNetIncome}
              />

              <div className={styles.selectContainer}>
                <label className={styles.selectLabel} htmlFor="documentType">
                  Document Type
                </label>
                <select
                  required
                  name="documentType"
                  className={styles.selectInput}
                  value={tenant.documentType}
                  onChange={(e) => handleNewTenant(e)}
                  error={errors.documentType}
                >
                  <option value="">Select Document Type</option>
                  {documentType.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Input
                type="text"
                name="tenantsAddress"
                value={tenant.tenantsAddress}
                label="Current Address"
                placeholder="Write the address where you reside"
                onChange={(e) => handleNewTenant(e)}
                error={errors.tenantsAddress}
              />
            </div>

            <div className={styles.FormRight}>
              <div className={styles.selectContainer}>
                <label className={styles.selectLabel} htmlFor="jobType">
                  Job Type
                </label>
                <select
                  required
                  name="jobType"
                  className={styles.selectInput}
                  value={tenant.jobType}
                  onChange={(e) => handleNewTenant(e)}
                  error={errors.jobType}
                >
                  <option value="">Select your job type</option>
                  {jobType.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </div>
              <Input
                type="text"
                name="documentNumber"
                value={tenant.documentNumber}
                label="Document Number"
                placeholder="Write the number of your document"
                onChange={(e) => handleNewTenant(e)}
                error={errors.documentNumber}
              />
              <Input
                type="number"
                name="tenantsZipCode"
                value={tenant.tenantsZipCode}
                label="Current zip code"
                placeholder="XXXXX"
                onChange={(e) => handleNewTenant(e)}
                error={errors.tenantsZipCode}
              />
            </div>
          </div>
          <div className={styles.FormIntern}>
            <div className={styles.FormLeft}>
              <InputFile
                type="file"
                name="documentImageFront"
                value={tenant.documentImageFront}
                label="DNI/NIE (Front)"
                placeholder="XXXXX"
                onChange={(e) => handleNewTenant(e)}
                error={errors.documentImageFront}
              />
              <InputFile
                type="file"
                name="documentImageBack"
                value={tenant.documentImageBack}
                label="DNI/NIE (Back)"
                placeholder="XXXXX"
                onChange={(e) => handleNewTenant(e)}
                error={errors.documentImageBack}
              />
            </div>
            <div className={styles.FormRight}>
              <InputFile
                type="file"
                name="documentConfirmAddress"
                value={tenant.documentConfirmAddress}
                label="Document confirming your current address (eg receipt of supplies)"
                onChange={(e) => handleNewTenant(e)}
                error={errors.documentConfirmAddress}
              />
            </div>
          </div>

          <div className={styles.TermsContainer}>
            <InputCheck
              type="checkbox"
              required
              name="isAcceptedPrivacy"
              id="terms"
              value={tenant.isAcceptedPrivacy}
              placeholder="Accept our terms and conditions"
              onChange={(e) => handleNewTenant(e)}
              error={errors.isAcceptedPrivacy}
            />
            <p>
              By submitting this form, you understand and agree that we use your
              information in accordance with our{" "}
              <a
                href="https://rimbo.rent/en/privacy-policy/"
                target="_blank"
                rel="noreferrer"
                className="link-tag"
              >
                {" "}
                privacy policy{" "}
              </a>{" "}
              and our{" "}
              <a
                href="https://rimbo.rent/en/cookies-policy/"
                target="_blank"
                rel="noreferrer"
                className="link-tag"
              >
                {" "}
                cookies policy{" "}
              </a>
              to offer you Rimbo services.
            </p>
          </div>
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
                Submit
              </Button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterTenant;
