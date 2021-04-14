// React Components
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TenantReducer, DefaultTenant } from "./tenant-reducer";

// Styles
import styles from "./rj2_tenant.module.scss";

// Images
import SuccessImage from "../../images/success-image.svg";

// Validation
import { newTenant, newTenantEs } from "./tenant_validation";

// Constants
import { UPDATE_NEWTENANT_INFO } from "./tenant-constants";

// Custom Components
import Input from "../../components/Input";
import InputCheck from "../../components/InputCheck";
import InputFile from "../../components/InputFile";
import Button from "../../components/Button";
import Loader from "react-loader-spinner";
import Success from "../../components/Success/Success";
import CustomHelmet from "../../components/Helmet/CustomHelmet";
import LocationOnIcon from "@material-ui/icons/LocationOn";

// Multilanguage
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// Google Maps Autocomplete
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCY,
  REACT_APP_API_RIMBO_TENANT,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const RegisterTenant = ({ t }) => {
  let { tenancyID } = useParams();
  const randomID = tenancyID;

  const [tenant, setTenant] = useReducer(TenantReducer, DefaultTenant);

  const [errors, setErrors] = useState({});
  const [isProcessing, setProcessingTo] = useState(false);
  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);
  const [sent, isSent] = useState(false);

  const [responseData, setResponseData] = useState([]);
  const [responseDataAfter, setResponseDataAfter] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  const [files, setFiles] = useState({
    DF: null,
    DB: null,
    DCA: null,
  });

  const [tenantsAddress, setTenantsAddress] = useState("");
  const [tenantsZipCode, setTenantsZipCode] = useState("");

  // Google Maps Address and Zip Code
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);

    const addressComponents = results[0].address_components;

    const route = "route";
    const locality = "locality";
    const streetNumber = "street_number";
    const postalCode = "postal_code";

    if (
      addressComponents[0].types[0] === route &&
      addressComponents[1].types[0] === locality
    ) {
      setTenantsZipCode("");
      setTenantsAddress(results[0].formatted_address);
    } else if (
      addressComponents[0].types[0] === streetNumber && // number
      addressComponents[1].types[0] === route && // Street
      addressComponents[2].types[0] === locality && // Barcelona
      addressComponents[6].types[0] === postalCode
    ) {
      setTenantsZipCode(results[0].address_components[6].long_name);
      setTenantsAddress(results[0].formatted_address);
    }

    setTenantsAddress(results[0].formatted_address);
  };

  useEffect(
    () => {
      const getData = () => {
        fetch(
          `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}`
        )
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

  const handleNewTenant = ({ target }) => {
    setTenant({
      type: UPDATE_NEWTENANT_INFO,
      payload: { [target.name]: target.value },
    });
  };

  const changeHandler = (event) => {
    const name = event.target.name;
    setFiles((files) => {
      const newFiles = { ...files };
      newFiles[name] = event.target.files[0];
      return newFiles;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    isSent(false);

    const formData = new FormData();
    for (const key in files) {
      formData.append(key, files[key]);
    }
    formData.append("randomID", randomID);

    if (i18n.language === "en") {
      const errors = newTenant(tenant);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
      setProcessingTo(true);
    } else {
      const errors = newTenantEs(tenant);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
      setProcessingTo(true);
    }

    // Post to Rimbo API (files/images)
    await axios.post(
      `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}/upload`,
      formData,
      { randomID }
    );

    // Post to Rimbo API Data
    await axios.post(
      `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}`,
      {
        monthlyNetIncome: tenant.monthlyNetIncome,
        jobType: tenant.jobType,
        documentType: tenant.documentType,
        documentNumber: tenant.documentNumber,
        tenantsAddress: tenantsAddress,
        tenantsZipCode: tenantsZipCode,
        isAcceptedPrivacy: tenant.isAcceptedPrivacy,
        randomID: tenancyID,
      }
    );

    // Tenant Email action
    await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj2/tt`, {
      tenantsName: responseData.tenant.tenantsName,
      tenantsEmail: responseData.tenant.tenantsEmail,
    });
    isSent(true);
    setIsSuccessfullySubmitted(true);
  };

  useEffect(() => {
    const getData = () => {
      fetch(`${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}`)
        .then((res) => {
          if (res.status >= 400) {
            throw new Error("Server responds with error!" + res.status);
          }
          return res.json();
        })
        .then(
          (responseDataAfter) => {
            setResponseDataAfter(responseDataAfter);
            setLoading(true);
          },
          (err) => {
            setErr(err);
            setLoading(true);
          }
        );
    };
    getData();
  }, [sent, tenancyID]);

  useEffect(() => {
    const sendAttachments = async () => {
      if (sent) {
        if (i18n.language === "en") {
          await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj2/rimbo`, {
            tenancyID,
            tenantsName: responseDataAfter.tenant.tenantsName,
            tenantsPhone: responseDataAfter.tenant.tenantsPhone,
            tenantsEmail: responseDataAfter.tenant.tenantsEmail,
            agencyName: responseDataAfter.agent.agencyName,
            agencyContactPerson: responseDataAfter.agent.agencyContactPerson,
            agencyPhonePerson: responseDataAfter.agent.agencyPhonePerson,
            agencyEmailPerson: responseDataAfter.agent.agencyEmailPerson,
            documentImageFront: responseDataAfter.tenant.documentImageFront,
            documentImageBack: responseDataAfter.tenant.documentImageBack,
            documentConfirmAddress:
              responseDataAfter.tenant.documentConfirmAddress,
            // Agent/Agency
            monthlyNetIncome: tenant.monthlyNetIncome,
            jobType: tenant.jobType,
            documentNumber: tenant.documentNumber,
            tenantsAddress: tenantsAddress,
            tenantsZipCode: tenantsZipCode,
            // Proprety
            rentAmount: responseDataAfter.rentAmount,
            product: responseDataAfter.product,
            rentDuration: responseDataAfter.rentDuration,
            rentalAddress: responseDataAfter.property.rentalAddress,
            rentalCity: responseDataAfter.property.rentalCity,
            rentalPostalCode: responseDataAfter.property.rentalPostalCode,
            // Landlord
            landlordName: responseDataAfter.landlord.landlordName,
            landlordPhone: responseDataAfter.landlord.landlordPhone,
            landlordEmail: responseDataAfter.landlord.landlordEmail,
          });
        } else {
          await axios.post(`${REACT_APP_BASE_URL_EMAIL}/es/rj2/rimbo`, {
            tenancyID,
            tenantsName: responseDataAfter.tenant.tenantsName,
            tenantsPhone: responseDataAfter.tenant.tenantsPhone,
            tenantsEmail: responseDataAfter.tenant.tenantsEmail,
            agencyName: responseDataAfter.agent.agencyName,
            agencyContactPerson: responseDataAfter.agent.agencyContactPerson,
            agencyPhonePerson: responseDataAfter.agent.agencyPhonePerson,
            agencyEmailPerson: responseDataAfter.agent.agencyEmailPerson,
            documentImageFront: responseDataAfter.tenant.documentImageFront,
            documentImageBack: responseDataAfter.tenant.documentImageBack,
            documentConfirmAddress:
              responseDataAfter.tenant.documentConfirmAddress,
            // Agent/Agency
            monthlyNetIncome: tenant.monthlyNetIncome,
            jobType: tenant.jobType,
            documentNumber: tenant.documentNumber,
            tenantsAddress: tenantsAddress,
            tenantsZipCode: tenantsZipCode,
            // Proprety
            rentAmount: responseDataAfter.rentAmount,
            product: responseDataAfter.product,
            rentDuration: responseDataAfter.rentDuration,
            rentalAddress: responseDataAfter.property.rentalAddress,
            rentalCity: responseDataAfter.property.rentalCity,
            rentalPostalCode: responseDataAfter.property.rentalPostalCode,
            // Landlord
            landlordName: responseDataAfter.landlord.landlordName,
            landlordPhone: responseDataAfter.landlord.landlordPhone,
            landlordEmail: responseDataAfter.landlord.landlordEmail,
          });
        }
      }
    };
    sendAttachments();
  }, [responseDataAfter]); //eslint-disable-line

  return (
    <>
      <CustomHelmet header={t("RJ2.helmet")} />
      {!isSuccessfullySubmitted ? (
        <div className={styles.RegisterContainer}>
          <div className={styles.Register}>
            <h1>{t("RJ2.header.title")}</h1>
            <div className={styles.ExtraInfoContainer}>
              <h2>{t("RJ2.header.subtitle")}</h2>
              <p>{t("RJ2.header.extraInfo")}</p>
            </div>
          </div>
          <div className={styles.FormContent}>
            <form
              onSubmit={handleSubmit}
              className="styles.RegisterForm"
              encType="multipart/form-data"
            >
              <div className={styles.FormIntern}>
                <div className={styles.FormLeft}>
                  <Input
                    type="number"
                    name="monthlyNetIncome"
                    value={tenant.monthlyNetIncome}
                    label={t("RJ2.form.monthlyNetIncome")}
                    placeholder={t("RJ2.form.monthlyNetIncomePL")}
                    onChange={(e) => handleNewTenant(e)}
                    error={errors.monthlyNetIncome}
                  />

                  <div className={styles.selectContainer}>
                    <label
                      className={styles.selectLabel}
                      htmlFor="documentType"
                    >
                      {t("RJ2.form.documentType")}
                    </label>
                    <select
                      required
                      name="documentType"
                      className={styles.selectInput}
                      value={tenant.documentType}
                      onChange={(e) => handleNewTenant(e)}
                      error={errors.documentType}
                    >
                      <option
                        name="documentType"
                        value={t("RJ2.form.documentTypePL")}
                      >
                        {t("RJ2.form.documentTypePL")}
                      </option>
                      <option
                        name="documentType"
                        value={t("RJ2.form.documentTypeOne")}
                      >
                        {t("RJ2.form.documentTypeOne")}
                      </option>
                      <option
                        name="documentType"
                        value={t("RJ2.form.documentTypeTwo")}
                      >
                        {t("RJ2.form.documentTypeTwo")}
                      </option>
                      <option
                        name="documentType"
                        value={t("RJ2.form.documentTypeThree")}
                      >
                        {t("RJ2.form.documentTypeThree")}
                      </option>
                      <option
                        name="documentType"
                        value={t("RJ2.form.documentTypeFour")}
                      >
                        {t("RJ2.form.documentTypeFour")}
                      </option>
                    </select>
                  </div>
                  {/* <Input
                    type="text"
                    name="tenantsAddress"
                    value={tenant.tenantsAddress}
                    label={t("RJ2.form.tenantsAddress")}
                    placeholder={t("RJ2.form.tenantsAddressPL")}
                    onChange={(e) => handleNewTenant(e)}
                    error={errors.tenantsAddress}
                  /> */}
                  {/* Google maps Autocomplete */}
                  <PlacesAutocomplete
                    value={tenantsAddress}
                    onChange={setTenantsAddress}
                    onSelect={handleSelect}
                  >
                    {({
                      getInputProps,
                      suggestions,
                      getSuggestionItemProps,
                      loading,
                    }) => (
                      <div>
                        <Input
                          id="googleInput"
                          {...getInputProps()}
                          label={t("RJ2.form.tenantsAddress")}
                          placeholder={t("RJ2.form.tenantsAddressPL")}
                          required
                        />
                        <div className={styles.GoogleSuggestionContainer}>
                          {/* display sugestions */}
                          {loading ? <div>...loading</div> : null}
                          {suggestions.map((suggestion, place) => {
                            const style = {
                              backgroundColor: suggestion.active
                                ? "#24c4c48f"
                                : "#fff",
                              cursor: "pointer",
                            };
                            return (
                              <div
                                className={styles.GoogleSuggestion}
                                {...getSuggestionItemProps(suggestion, {
                                  style,
                                })}
                                key={place}
                              >
                                <LocationOnIcon />
                                <span>{suggestion.description}</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </PlacesAutocomplete>
                </div>

                <div className={styles.FormRight}>
                  <div className={styles.selectContainer}>
                    <label className={styles.selectLabel} htmlFor="jobType">
                      {t("RJ2.form.jobType")}
                    </label>
                    <select
                      required
                      name="jobType"
                      className={styles.selectInput}
                      value={tenant.jobType}
                      onChange={(e) => handleNewTenant(e)}
                      error={errors.jobType}
                    >
                      <option name="jobType" value={t("RJ2.form.jobTypePL")}>
                        {t("RJ2.form.jobTypePL")}
                      </option>
                      <option name="jobType" value={t("RJ2.form.jobTypeOne")}>
                        {t("RJ2.form.jobTypeOne")}
                      </option>
                      <option name="jobType" value={t("RJ2.form.jobTypeTwo")}>
                        {t("RJ2.form.jobTypeTwo")}
                      </option>
                      <option name="jobType" value={t("RJ2.form.jobTypeThree")}>
                        {t("RJ2.form.jobTypeThree")}
                      </option>
                      <option name="jobType" value={t("RJ2.form.jobTypeFour")}>
                        {t("RJ2.form.jobTypeFour")}
                      </option>
                      <option name="jobType" value={t("RJ2.form.jobTypeFive")}>
                        {t("RJ2.form.jobTypeFive")}
                      </option>
                      <option name="jobType" value={t("RJ2.form.jobTypeSix")}>
                        {t("RJ2.form.jobTypeSix")}
                      </option>
                      <option name="jobType" value={t("RJ2.form.jobTypeSeven")}>
                        {t("RJ2.form.jobTypeSeven")}
                      </option>
                    </select>
                  </div>
                  <Input
                    type="text"
                    name="documentNumber"
                    value={tenant.documentNumber}
                    label={t("RJ2.form.documentNumber")}
                    placeholder={t("RJ2.form.documentNumberPL")}
                    onChange={(e) => handleNewTenant(e)}
                    error={errors.documentNumber}
                  />
                  <Input
                    type="number"
                    name="tenantsZipCode"
                    value={tenantsZipCode}
                    label={t("RJ2.form.tenantsZipCode")}
                    placeholder={t("RJ2.form.tenantsZipCodePL")}
                    onChange={setTenantsZipCode}
                    disabled
                  />
                </div>
              </div>
              <div className={styles.FormIntern}>
                <div className={styles.FormLeft}>
                  <InputFile
                    type="file"
                    name="DF"
                    label={t("RJ2.form.DNIFront")}
                    onChange={changeHandler}
                    required
                  />
                  <InputFile
                    type="file"
                    name="DB"
                    label={t("RJ2.form.DNIBack")}
                    onChange={changeHandler}
                    required
                  />
                </div>
                <div className={styles.FormRight}>
                  <InputFile
                    type="file"
                    name="DCA"
                    label={t("RJ2.form.DCA")}
                    onChange={changeHandler}
                    required
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
                  // placeholder={t("RJ2.form.monthlyNetIncome")}
                  onChange={(e) => handleNewTenant(e)}
                  error={errors.isAcceptedPrivacy}
                />
                <p>
                  {t("RJ2.form.checkbox")}
                  <a
                    href="https://rimbo.rent/en/privacy-policy/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-tag"
                  >
                    {t("RJ2.form.privacy")}
                  </a>
                  {t("RJ2.form.checkboxTwo")}
                  <a
                    href="https://rimbo.rent/en/cookies-policy/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-tag"
                  >
                    {t("RJ2.form.cookies")}
                  </a>
                  {t("RJ2.form.checkboxThree")}
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
                    {t("submitButton")}
                  </Button>
                )}
              </div>
            </form>
          </div>
        </div>
      ) : (
        <Success
          title={t("RJ2.success.title")}
          subtitle={t("RJ2.success.subtitle")}
          imageSRC={SuccessImage}
          imageAlt="Success image"
        />
      )}
    </>
  );
};

export default withNamespaces()(RegisterTenant);
