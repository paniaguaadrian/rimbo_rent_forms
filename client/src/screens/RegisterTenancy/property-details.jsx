// React Components
import React, { useState } from "react";
import PropTypes from "prop-types";

// Custom Components
import Input from "../../components/Input";
import Button from "../../components/Button";

// Styles
import styles from "./register-user.module.scss";

// Validation
import { isProperty, isPropertyEs } from "./validation";

// Constants reducer
import { UPDATE_PROPERTY_INFO } from "./constants";

// Multilanguage
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

const PropertyDetails = ({ step, setStep, tenancy, setTenancy, t }) => {
  const [errors, setErrors] = useState({});

  // Handle on change
  const handleAgency = ({ target }) => {
    setTenancy({
      type: UPDATE_PROPERTY_INFO,
      payload: { [target.name]: target.value },
    });
  };

  // Hanlde con next / continue
  const handleContinue = (e) => {
    e.preventDefault();
    if (i18n.laanguage === "en") {
      const errors = isProperty(tenancy.propertyDetails);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      const errors = isPropertyEs(tenancy.propertyDetails);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }

    setStep(step + 1);
  };

  return (
    <form onSubmit={handleContinue}>
      <div className={styles.FormIntern}>
        <div className={styles.FormLeft}>
          <div className={styles.selectContainer}>
            <label className={styles.selectLabel} htmlFor="product">
              {t("RJ1.stepTwo.service")}
            </label>
            <select
              required
              name="product"
              className={styles.selectInput}
              value={tenancy.propertyDetails.product}
              onChange={(e) => handleAgency(e)}
            >
              <option name="product" value={t("RJ1.stepTwo.servicePL")}>
                {t("RJ1.stepTwo.servicePL")}
              </option>

              <option name="product" value={t("RJ1.stepTwo.serviceOne")}>
                {t("RJ1.stepTwo.serviceOne")}
              </option>

              <option name="product" value={t("RJ1.stepTwo.serviceTwo")}>
                {t("RJ1.stepTwo.serviceTwo")}
              </option>

              <option name="product" value={t("RJ1.stepTwo.serviceThree")}>
                {t("RJ1.stepTwo.serviceThree")}
              </option>
            </select>
          </div>

          <Input
            type="text"
            name="rentDuration"
            value={tenancy.propertyDetails.rentDuration}
            label={t("RJ1.stepTwo.rentDuration")}
            placeholder={t("RJ1.stepTwo.rentDurationPL")}
            onChange={(e) => handleAgency(e)}
            error={errors.rentDuration}
          />
          <Input
            type="text"
            name="rentAmount"
            value={tenancy.propertyDetails.rentAmount}
            label={t("RJ1.stepTwo.rentAmount")}
            placeholder={t("RJ1.stepTwo.rentAmountPL")}
            onChange={(e) => handleAgency(e)}
            error={errors.rentAmount}
          />
        </div>
        <div className={styles.FormRight}>
          <Input
            type="text"
            name="rentalAddress"
            value={tenancy.propertyDetails.rentalAddress}
            label={t("RJ1.stepTwo.rentalAddress")}
            placeholder={t("RJ1.stepTwo.rentalAddressPL")}
            onChange={(e) => handleAgency(e)}
            error={errors.rentalAddress}
          />
          <Input
            type="text"
            name="rentalCity"
            value={tenancy.propertyDetails.rentalCity}
            label={t("RJ1.stepTwo.rentalCity")}
            placeholder={t("RJ1.stepTwo.rentalCityPL")}
            onChange={(e) => handleAgency(e)}
            error={errors.rentalCity}
          />
          <Input
            type="text"
            name="rentalPostalCode"
            value={tenancy.propertyDetails.rentalPostalCode}
            label={t("RJ1.stepTwo.rentalPostalCode")}
            placeholder={t("RJ1.stepTwo.rentalPostalCodePL")}
            onChange={(e) => handleAgency(e)}
            error={errors.rentalPostalCode}
          />
        </div>
      </div>

      <div className={styles.ButtonContainer}>
        <Button onClick={() => setStep(step - 1)} type="button">
          {t("prevStepButton")}
        </Button>
        <Button type="submit">{t("nextStepButton")}</Button>
      </div>
    </form>
  );
};

PropertyDetails.propTypes = {
  step: PropTypes.number,
  setStep: PropTypes.func,
  tenancy: PropTypes.object,
  setTenancy: PropTypes.func,
};

export default withNamespaces()(PropertyDetails);
