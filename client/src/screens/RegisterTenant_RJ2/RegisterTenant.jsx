// React Components
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { TenantReducer, DefaultTenant } from "./tenant-reducer";

// Styles
import classes from "./rj2_tenant.module.scss";

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
  // REACT_APP_API_RIMBO_TENANCY,
  REACT_APP_API_RIMBO_TENANCIES,
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

  const [tenantData, setTenantData] = useState([]);

  const [tenancyData, setTenancyData] = useState([]);

  const [tenantDataAfter, setTenantDataAfter] = useState([]);

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
        // Hemos cambiado este endpoint de REACT_APP_API_RIMBO_TENANCY al actual para hacer fetch del tenant, no necesitamos hacer fetch de toda la tenancy.
        fetch(`${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}`)
          .then((res) => {
            if (res.status >= 400) {
              throw new Error("Server responds with error!" + res.status);
            }
            return res.json();
          })
          .then(
            (tenantData) => {
              setTenantData(tenantData);
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
    [tenantData, loading, err]
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
    // ! This seems working
    await axios.post(
      `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}/upload`,
      formData,
      { randomID }
    );

    // Post to Rimbo API Data
    // ! This seems working
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
    // ! This seems working
    await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj2/tt`, {
      tenantsName: tenantData.tenantsName,
      tenantsEmail: tenantData.tenantsEmail,
    });

    setIsSuccessfullySubmitted(true);
  };

  useEffect(() => {
    const getData = () => {
      // Change that ${REACT_APP_API_RIMBO_TENANCY}/${tenancyID} to find all tenancies
      fetch(`${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCIES}`)
        .then((res) => {
          if (res.status >= 400) {
            throw new Error("Server responds with error!" + res.status);
          }
          return res.json();
        })
        .then(
          (tenancyData) => {
            setTenancyData(tenancyData);
            setLoading(true);
          },
          (err) => {
            setErr(err);
            setLoading(true);
          }
        );
    };
    getData();
  }, [tenancyID]);

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

  useEffect(
    () => {
      const getData = () => {
        // Hemos cambiado este endpoint de REACT_APP_API_RIMBO_TENANCY al actual para hacer fetch del tenant, no necesitamos hacer fetch de toda la tenancy.
        fetch(`${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}`)
          .then((res) => {
            if (res.status >= 400) {
              throw new Error("Server responds with error!" + res.status);
            }
            return res.json();
          })
          .then(
            (tenantDataAfter) => {
              setTenantDataAfter(tenantDataAfter);
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
    [tenantDataAfter, loading, err]
  );

  console.log(tenantDataAfter);

  // !Send an email with the specific data
  useEffect(() => {
    const sendAttachments = async () => {
      if (sent) {
        if (i18n.language === "en") {
          await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj2/rimbo`, {
            tenancyID,
            tenantsName: tenantData.tenantsName,
            tenantsPhone: tenantData.tenantsPhone,
            tenantsEmail: tenantData.tenantsEmail,
            monthlyNetIncome: tenant.monthlyNetIncome,
            jobType: tenant.jobType,
            documentNumber: tenant.documentNumber,
            tenantsAddress: tenantsAddress,
            tenantsZipCode: tenantsZipCode,
            documentImageFront: tenantDataAfter.documentImageFront,
            documentImageBack: tenantDataAfter.documentImageBack,
            documentConfirmAddress: tenantDataAfter.documentConfirmAddress,
            // Agent/Agency
            agencyName: desiredTenancy.agent.agencyName,
            agencyContactPerson: desiredTenancy.agent.agencyContactPerson,
            agencyPhonePerson: desiredTenancy.agent.agencyPhonePerson,
            agencyEmailPerson: desiredTenancy.agent.agencyEmailPerson,
            // Proprety
            rentAmount: desiredTenancy.rentAmount,
            product: desiredTenancy.product,
            rentDuration: desiredTenancy.rentDuration,
            rentalAddress: desiredTenancy.property.rentalAddress,
            rentalCity: desiredTenancy.property.rentalCity,
            rentalPostalCode: desiredTenancy.property.rentalPostalCode,
            // Landlord
            landlordName: desiredTenancy.landlord.landlordName,
            landlordPhone: desiredTenancy.landlord.landlordPhone,
            landlordEmail: desiredTenancy.landlord.landlordEmail,
          });
        } else {
          await axios.post(`${REACT_APP_BASE_URL_EMAIL}/es/rj2/rimbo`, {
            tenancyID,
            tenantsName: tenantData.tenantsName,
            tenantsPhone: tenantData.tenantsPhone,
            tenantsEmail: tenantData.tenantsEmail,
            monthlyNetIncome: tenant.monthlyNetIncome,
            jobType: tenant.jobType,
            documentNumber: tenant.documentNumber,
            tenantsAddress: tenantsAddress,
            tenantsZipCode: tenantsZipCode,
            documentImageFront: tenantDataAfter.documentImageFront,
            documentImageBack: tenantDataAfter.documentImageBack,
            documentConfirmAddress: tenantDataAfter.documentConfirmAddress,
            // Agent/Agency
            agencyName: desiredTenancy.agent.agencyName,
            agencyContactPerson: desiredTenancy.agent.agencyContactPerson,
            agencyPhonePerson: desiredTenancy.agent.agencyPhonePerson,
            agencyEmailPerson: desiredTenancy.agent.agencyEmailPerson,
            // Proprety
            rentAmount: desiredTenancy.rentAmount,
            product: desiredTenancy.product,
            rentDuration: desiredTenancy.rentDuration,
            rentalAddress: desiredTenancy.property.rentalAddress,
            rentalCity: desiredTenancy.property.rentalCity,
            rentalPostalCode: desiredTenancy.property.rentalPostalCode,
            // Landlord
            landlordName: desiredTenancy.landlord.landlordName,
            landlordPhone: desiredTenancy.landlord.landlordPhone,
            landlordEmail: desiredTenancy.landlord.landlordEmail,
          });
        }
      }
    };
    sendAttachments();
  }, [tenancyData]); //eslint-disable-line

  return (
    <>
      <CustomHelmet header={t("RJ2.helmet")} />
      {!isSuccessfullySubmitted ? (
        <div className={classes.PageContainer}>
          <div className={classes.HeaderContainer}>
            <h1>{t("RJ2.header.title")}</h1>
            <h1>{t("RJ2.header.titleTwo")}</h1>
            <div className={classes.HeaderInfo}>
              <h2>{t("RJ2.header.subtitle")}</h2>
              <p>{t("RJ2.header.extraInfo")}</p>
            </div>
          </div>
          <div className={classes.FormContent}>
            <form
              onSubmit={handleSubmit}
              className="classes.RegisterForm"
              encType="multipart/form-data"
            >
              <div className={classes.FormContainer}>
                <div className={classes.GroupInput}>
                  <div className={classes.InputElement}>
                    <Input
                      type="number"
                      name="monthlyNetIncome"
                      value={tenant.monthlyNetIncome}
                      label={t("RJ2.form.monthlyNetIncome")}
                      placeholder={t("RJ2.form.monthlyNetIncomePL")}
                      onChange={(e) => handleNewTenant(e)}
                      error={errors.monthlyNetIncome}
                    />
                  </div>
                  <div className={classes.InputElement}>
                    <div className={classes.selectContainer}>
                      <label className={classes.selectLabel} htmlFor="jobType">
                        {t("RJ2.form.jobType")}
                      </label>
                      <select
                        required
                        name="jobType"
                        className={classes.selectInput}
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
                        <option
                          name="jobType"
                          value={t("RJ2.form.jobTypeThree")}
                        >
                          {t("RJ2.form.jobTypeThree")}
                        </option>
                        <option
                          name="jobType"
                          value={t("RJ2.form.jobTypeFour")}
                        >
                          {t("RJ2.form.jobTypeFour")}
                        </option>
                        <option
                          name="jobType"
                          value={t("RJ2.form.jobTypeFive")}
                        >
                          {t("RJ2.form.jobTypeFive")}
                        </option>
                        <option name="jobType" value={t("RJ2.form.jobTypeSix")}>
                          {t("RJ2.form.jobTypeSix")}
                        </option>
                        <option
                          name="jobType"
                          value={t("RJ2.form.jobTypeSeven")}
                        >
                          {t("RJ2.form.jobTypeSeven")}
                        </option>
                      </select>
                    </div>
                  </div>
                </div>
                <div className={classes.GroupInput}>
                  <div className={classes.InputElement}>
                    <div className={classes.selectContainer}>
                      <label
                        className={classes.selectLabel}
                        htmlFor="documentType"
                      >
                        {t("RJ2.form.documentType")}
                      </label>
                      <select
                        required
                        name="documentType"
                        className={classes.selectInput}
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
                  </div>
                  <div className={classes.InputElement}>
                    <Input
                      type="text"
                      name="documentNumber"
                      value={tenant.documentNumber}
                      label={t("RJ2.form.documentNumber")}
                      placeholder={t("RJ2.form.documentNumberPL")}
                      onChange={(e) => handleNewTenant(e)}
                      error={errors.documentNumber}
                    />
                  </div>
                </div>
                <div className={classes.GroupInput}>
                  <div className={classes.InputElement}>
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
                          <div className={classes.GoogleSuggestionContainer}>
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
                                  className={classes.GoogleSuggestion}
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
                  <div className={classes.InputElement}>
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

                <div className={classes.GroupInput}>
                  <div className={classes.InputElement}>
                    <InputFile
                      type="file"
                      name="DF"
                      label={t("RJ2.form.DNIFront")}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                  <div className={classes.InputElement}>
                    <InputFile
                      type="file"
                      name="DB"
                      label={t("RJ2.form.DNIBack")}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                </div>
                <div className={classes.GroupInputAlone}>
                  <div className={classes.InputElement}>
                    <InputFile
                      type="file"
                      name="DCA"
                      label={t("RJ2.form.DCA")}
                      onChange={changeHandler}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className={classes.TermsContainer}>
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
              <div className={classes.ButtonContainer}>
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
