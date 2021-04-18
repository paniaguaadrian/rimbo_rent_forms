// React Components
import React, { useState } from "react";
import PropTypes from "prop-types";

// Custom Components
import Input from "../../components/Input";
import Button from "../../components/Button";
import LocationOnIcon from "@material-ui/icons/LocationOn";

// Material-ui Components
// import FormHelperText from "@material-ui/core/FormHelperText";
// import TextField from "@material-ui/core/TextField";
// import InputAdornment from "@material-ui/core/InputAdornment";
// import ButtonMat from "@material-ui/core/Button";
// import Divider from "@material-ui/core/Divider";

// // Material Icons
// import GroupAddIcon from "@material-ui/icons/GroupAdd";
// import PersonIcon from "@material-ui/icons/Person";
// import EmailOutlinedIcon from "@material-ui/icons/EmailOutlined";
// import LocalPhoneOutlinedIcon from "@material-ui/icons/LocalPhoneOutlined";
// import ChevronRightIcon from "@material-ui/icons/ChevronRight";
// import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
// import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined";

// Styles
import classes from "./multi_step_form.module.scss";

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

      const street = results[0].address_components[1].long_name;
      const streetNumber = results[0].address_components[0].long_name;
      const finalAddress = `${street}, ${streetNumber}`;

      setRentalPostalCode(results[0].address_components[6].long_name);
      setRentalAddress(finalAddress);
      setRentalCity(results[0].address_components[2].long_name);
    }
    tenancy.propertyDetails.rentalAddress = results[0].formatted_address;
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
      <div className={classes.FormContainer}>
        <div className={classes.GroupInput}>
          <div className={classes.InputElement}>
            <div className={classes.selectContainer}>
              <label className={classes.selectLabel} htmlFor="product">
                {t("RJ1.stepTwo.service")}
              </label>
              <select
                required
                name="product"
                className={classes.selectInput}
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
          </div>
          <div className={classes.InputElement}>
            <Input
              type="text"
              name="rentDuration"
              value={tenancy.propertyDetails.rentDuration}
              label={t("RJ1.stepTwo.rentDuration")}
              placeholder={t("RJ1.stepTwo.rentDurationPL")}
              onChange={(e) => handleAgency(e)}
              error={errors.rentDuration}
            />
          </div>
        </div>
        <div className={classes.GroupInput}>
          <div className={classes.InputElement}>
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

          <div className={classes.InputElement}>
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
        </div>
        <div className={classes.GroupInput}>
          <div className={classes.InputElement}>
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
          </div>

          <div className={classes.InputElement}>
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
        <div className={classes.ButtonContainer}>
          <Button onClick={() => setStep(step - 1)} type="button">
            {t("prevStepButton")}
          </Button>
          <Button type="submit">{t("nextStepButton")}</Button>
        </div>
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
