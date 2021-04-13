// React Components
import React, { useState } from "react";
import PropTypes from "prop-types";

// Custom Components
import Input from "../../components/Input";
import Button from "../../components/Button";
import LocationOnIcon from "@material-ui/icons/LocationOn";

// Styles
import styles from "./register-user.module.scss";

// Validation
import { isProperty, isPropertyEs } from "./validation";

// Constants reducer
import { UPDATE_PROPERTY_INFO } from "./constants";

// Multilanguage
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// Google Maps Autocomplete
import PlacesAutocomplete, {
  geocodeByAddress,
} from "react-places-autocomplete";

const PropertyDetails = ({ step, setStep, tenancy, setTenancy, t }) => {
  const [errors, setErrors] = useState({});

  const [rentalAddress, setRentalAddress] = useState("");
  const [rentalCity, setRentalCity] = useState("");
  const [rentalPostalCode, setRentalPostalCode] = useState("");

  // Google Maps Address and Zip Code
  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    console.log(results);

    const addressComponents = results[0].address_components;

    const route = "route";
    const locality = "locality";
    const streetNumber = "street_number";
    const postalCode = "postal_code";

    if (
      addressComponents[0].types[0] === route &&
      addressComponents[1].types[0] === locality
    ) {
      tenancy.propertyDetails.rentalPostalCode = "";
      tenancy.propertyDetails.rentalAddress = results[0].formatted_address;
      setRentalPostalCode("");
      setRentalAddress(results[0].formatted_address);
      setRentalCity(results[0].address_components[1].long_name);
    } else if (
      addressComponents[0].types[0] === streetNumber && // number
      addressComponents[1].types[0] === route && // Street
      addressComponents[2].types[0] === locality && // Barcelona
      addressComponents[6].types[0] === postalCode
    ) {
      tenancy.propertyDetails.rentalPostalCode =
        results[0].address_components[6].long_name;
      tenancy.propertyDetails.rentalAddress = results[0].formatted_address;
      tenancy.propertyDetails.rentalCity =
        results[0].address_components[2].long_name;

      setRentalPostalCode(results[0].address_components[6].long_name);
      setRentalAddress(results[0].formatted_address);
      setRentalCity(results[0].address_components[2].long_name);
    }
    tenancy.propertyDetails.rentalAddress = results[0].formatted_address;
    // setTenantsAddress(results[0].formatted_address);
  };

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
          <PlacesAutocomplete
            value={rentalAddress}
            onChange={setRentalAddress}
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
                  label={t("RJ1.stepTwo.rentalAddress")}
                  placeholder={t("RJ1.stepTwo.rentalAddressPL")}
                  required
                />
                <div className={styles.GoogleSuggestionContainer}>
                  {/* display sugestions */}
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map((suggestion, place) => {
                    const style = {
                      backgroundColor: suggestion.active ? "#24c4c48f" : "#fff",
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
          <Input
            type="text"
            name="rentalCity"
            value={rentalCity}
            label={t("RJ1.stepTwo.rentalCity")}
            placeholder={t("RJ1.stepTwo.rentalCityPL")}
            onChange={setRentalCity}
            onSelect={handleSelect}
            disabled
          />
          <Input
            type="text"
            name="rentalPostalCode"
            value={rentalPostalCode}
            label={t("RJ1.stepTwo.rentalPostalCode")}
            placeholder={t("RJ1.stepTwo.rentalPostalCodePL")}
            onChange={setRentalPostalCode}
            onSelect={handleSelect}
            disabled
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
