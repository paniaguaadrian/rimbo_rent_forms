// React Components
import React, { useState } from "react";
import axios from "axios";
import PropTypes from "prop-types";
// Styles
import classes from "./multi_step_form.module.scss";

// Validation
import { isLandlord, isLandlordEs } from "./validation";

// Constants
import { UPDATE_LANDLORD_INFO } from "./constants";

// Custom Components
import Input from "../../components/Input";
import InputCheck from "../../components/InputCheck";
import Button from "../../components/Button";
import Loader from "react-loader-spinner";

// nanoid
import { nanoid } from "nanoid";

// Multilanguage
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// End-Points env
const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCIES,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const LandlorDetails = ({ step, setStep, tenancy, setTenancy, t }) => {
  const [errors, setErrors] = useState({});
  const [isProcessing, setProcessingTo] = useState(false);

  // Handle on change
  const handleLandlord = ({ target }) => {
    setTenancy({
      type: UPDATE_LANDLORD_INFO,
      payload: { [target.name]: target.value },
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (i18n.language === "en") {
      const errors = isLandlord(tenancy.landlordDetails);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      const errors = isLandlordEs(tenancy.landlordDetails);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }

    setProcessingTo(true);

    const randomID = nanoid();
    const randomIDTwo = nanoid();
    const randomIDThree = nanoid();
    const randomIDFour = nanoid();

    const tenancyData = {
      // tenant
      tenantsName: tenancy.tenantDetails.tenantName,
      tenantsEmail: tenancy.tenantDetails.tenantEmail,
      tenantsPhone: tenancy.tenantDetails.tenantPhone,
      propertyManagerName: tenancy.agencyName,
      randomID: randomID,

      // tenantTwo
      tenantsNameTwo: tenancy.tenantDetails.tenantNameTwo,
      tenantsEmailTwo: tenancy.tenantDetails.tenantEmailTwo,
      tenantsPhoneTwo: tenancy.tenantDetails.tenantPhoneTwo,
      randomIDTwo: randomIDTwo,

      // tenantThree
      tenantsNameThree: tenancy.tenantDetails.tenantNameThree,
      tenantsEmailThree: tenancy.tenantDetails.tenantEmailThree,
      tenantsPhoneThree: tenancy.tenantDetails.tenantPhoneThree,
      randomIDThree: randomIDThree,

      // tenantThree
      tenantsNameFour: tenancy.tenantDetails.tenantNameFour,
      tenantsEmailFour: tenancy.tenantDetails.tenantEmailFour,
      tenantsPhoneFour: tenancy.tenantDetails.tenantPhoneFour,
      randomIDFour: randomIDFour,

      // agency, agent
      agencyName: tenancy.agencyName,
      agencyEmailPerson: tenancy.agencyEmailPerson,
      agencyContactPerson: tenancy.agencyContactPerson,
      agencyPhonePerson: tenancy.agencyPhonePerson,
      isAgentAccepted: tenancy.landlordDetails.isAgentAccepted,
      // property
      rentalCity: tenancy.propertyDetails.rentalCity,
      rentalPostalCode: tenancy.propertyDetails.rentalPostalCode,
      rentalAddress: tenancy.propertyDetails.rentalAddress,
      // landlord
      landlordName: tenancy.landlordDetails.landlordName,
      landlordEmail: tenancy.landlordDetails.landlordEmail,
      landlordPhone: tenancy.landlordDetails.landlordPhone,
      // tenancy
      product: tenancy.propertyDetails.product,
      rentDuration: tenancy.propertyDetails.rentDuration,
      rentAmount: tenancy.propertyDetails.rentAmount,
      tenancyID: randomID,
      // property manager
      PMName: tenancy.agencyName,
    };

    // Post DB
    await axios.post(
      `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCIES}`,
      tenancyData
    );

    // Email action
    // if (i18n.language === "en") {
    //   await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj1`, tenancyData);
    // } else {
    //   await axios.post(`${REACT_APP_BASE_URL_EMAIL}/es/rj1`, tenancyData);
    // }

    setStep(step + 1);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className={classes.FormContainer}>
        <div className={classes.GroupInput}>
          <div className={classes.InputElement}>
            <Input
              type="text"
              name="landlordName"
              value={tenancy.landlordDetails.landlordName}
              label={t("RJ1.stepThree.landlordName")}
              placeholder={t("RJ1.stepThree.landlordNamePL")}
              onChange={(e) => handleLandlord(e)}
              error={errors.landlordName}
            />
          </div>
          <div className={classes.InputElement}>
            <Input
              type="email"
              name="landlordEmail"
              value={tenancy.landlordDetails.landlordEmail}
              label={t("RJ1.stepThree.landlordEmail")}
              placeholder={t("RJ1.stepThree.landlordEmailPL")}
              onChange={(e) => handleLandlord(e)}
              error={errors.landlordEmail}
            />
          </div>
        </div>

        <div className={classes.GroupInputAlone}>
          <div className={classes.InputElement}>
            <Input
              type="tel"
              name="landlordPhone"
              value={tenancy.landlordDetails.landlordPhone}
              label={t("RJ1.stepThree.landlordPhone")}
              placeholder={t("RJ1.stepThree.landlordPhonePL")}
              onChange={(e) => handleLandlord(e)}
              error={errors.landlordPhone}
            />
          </div>
        </div>
      </div>
      <div className={classes.TermsContainer}>
        <InputCheck
          type="checkbox"
          required
          name="isAgentAccepted"
          id="terms"
          value={tenancy.landlordDetails.isAgentAccepted}
          placeholder="Accept our terms and conditions"
          onChange={(e) => handleLandlord(e)}
          error={errors.isAgentAccepted}
        />
        <p>
          {t("RJ1.stepThree.checkbox")}
          <a
            href="https://rimbo.rent/en/privacy-policy/"
            target="_blank"
            rel="noreferrer"
            className="link-tag"
          >
            {t("RJ1.stepThree.privacy")}
          </a>
          {t("RJ1.stepThree.checkboxTwo")}
          <a
            href="https://rimbo.rent/en/cookies-policy/"
            target="_blank"
            rel="noreferrer"
            className="link-tag"
          >
            {t("RJ1.stepThree.cookies")}
          </a>
          .
        </p>
      </div>

      <div className={classes.ButtonContainer}>
        <Button onClick={() => setStep(step - 1)} type="button">
          {t("prevStepButton")}
        </Button>

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
  );
};

LandlorDetails.propTypes = {
  step: PropTypes.number,
  setStep: PropTypes.func,
  tenancy: PropTypes.object,
  setTenancy: PropTypes.func,
};

export default withNamespaces()(LandlorDetails);
