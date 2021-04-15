// React Components
import React, { useState } from "react";
import PropTypes from "prop-types";

// Custom Components
// import Input from "../../components/Input"; // This is my input component
// import Button from "../../components/Button"; // This is my button component

// Material-ui Components
import Grid from "@material-ui/core/Grid";
import FormHelperText from "@material-ui/core/FormHelperText";
import TextField from "@material-ui/core/TextField";
import InputAdornment from "@material-ui/core/InputAdornment";
import ButtonMat from "@material-ui/core/Button";

// Material-ui icons
import HomeWorkIcon from "@material-ui/icons/HomeWork";
import PersonPinIcon from "@material-ui/icons/PersonPin";
import MailOutlineIcon from "@material-ui/icons/MailOutline";
import PhoneIcon from "@material-ui/icons/Phone";
// Icon for button to send
// import SendIcon from "@material-ui/icons/Send";
// Icons for buttons (prev and next)
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

// Validation
import { isAgency, isAgencyEs } from "./validation";

// Constants
import { UPDATE_TENANCY_INFO } from "./constants";

// Multilanguage
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// Styles imported
import classes from "./multi_step_form.module.scss";

const AgencyDetails = ({ step, setStep, tenancy, setTenancy, t }) => {
  const [errors, setErrors] = useState({});

  // Handle on change
  const handleAgency = ({ target }) => {
    setTenancy({
      type: UPDATE_TENANCY_INFO,
      payload: { [target.name]: target.value },
    });
  };

  // Hanlde con next / continue
  const handleContinue = (e) => {
    e.preventDefault();
    if (i18n.language === "en") {
      const errors = isAgency(tenancy);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      const errors = isAgencyEs(tenancy);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }

    setStep(step + 1);
  };

  return (
    <form onSubmit={handleContinue}>
      <div className={classes.FormContainer}>
        <div className={classes.GroupInput}>
          <div className={classes.InputElementMaterial}>
            <Grid container spacing={2} alignItems="flex-end">
              <Grid item>
                <HomeWorkIcon className={classes.IconStyleMaterial} />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  type="text"
                  name="agencyName"
                  value={tenancy.agencyName}
                  label={t("RJ1.stepZero.agencyName")}
                  placeholder={t("RJ1.stepZero.agencyNamePL")}
                  onChange={(e) => handleAgency(e)}
                  className={classes.InputMaterial}
                  fullWidth
                />
              </Grid>
              <FormHelperText className={classes.ErrorTextMaterial}>
                {errors.agencyName}
              </FormHelperText>
            </Grid>
          </div>
          <div className={classes.InputElementMaterial}>
            <TextField
              type="text"
              name="agencyContactPerson"
              value={tenancy.agencyContactPerson}
              label={t("RJ1.stepZero.contactPerson")}
              placeholder={t("RJ1.stepZero.contactPersonPL")}
              onChange={(e) => handleAgency(e)}
              className={classes.InputMaterial}
              fullWidth
              // error={errors.agencyContactPerson}
              InputProps={{
                startAdornment: (
                  <InputAdornment
                    position="start"
                    variant="outlined"
                    disablePointerEvents="true"
                  >
                    <PersonPinIcon className={classes.IconStyleMaterial} />
                  </InputAdornment>
                ),
              }}
              variant="outlined"
            />
            <FormHelperText className={classes.ErrorTextMaterial}>
              {errors.agencyContactPerson}
            </FormHelperText>
          </div>
        </div>
        <div className={classes.GroupInput}>
          <div className={classes.InputElementMaterial}>
            <Grid container spacing={1} alignItems="center">
              <Grid item>
                <MailOutlineIcon className={classes.IconStyleMaterial} />
              </Grid>
              <Grid item>
                <TextField
                  type="email"
                  name="agencyEmailPerson"
                  value={tenancy.agencyEmailPerson}
                  label={t("RJ1.stepZero.email")}
                  placeholder={t("RJ1.stepZero.emailPL")}
                  onChange={(e) => handleAgency(e)}
                  className={classes.InputMaterial}
                  fullWidth
                  // error={errors.agencyEmailPerson}
                  variant="outlined"
                />
              </Grid>
              <FormHelperText className={classes.ErrorTextMaterial}>
                {errors.agencyEmailPerson}
              </FormHelperText>
            </Grid>
          </div>
          <div className={classes.InputElementMaterial}>
            <TextField
              type="tel"
              name="agencyPhonePerson"
              value={tenancy.agencyPhonePerson}
              label={t("RJ1.stepZero.phoneNumber")}
              placeholder={t("RJ1.stepZero.phoneNumberPL")}
              onChange={(e) => handleAgency(e)}
              className={classes.InputMaterial}
              fullWidth
              // error={errors.agencyPhonePerson}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneIcon className={classes.IconStyleMaterial} />
                  </InputAdornment>
                ),
              }}
            />
            <FormHelperText className={classes.ErrorTextMaterial}>
              {errors.agencyPhonePerson}
            </FormHelperText>
          </div>
        </div>
        <div className={classes.ButtonContainerMaterial}>
          {/* <Button type="submit">{t("nextStepButton")}</Button> */}
          <ButtonMat
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            startIcon={<ChevronLeftIcon />}
          >
            {t("prevStepButton")}
          </ButtonMat>
          <ButtonMat
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            endIcon={<ChevronRightIcon />}
          >
            {t("nextStepButton")}
          </ButtonMat>
        </div>
      </div>
    </form>
  );
};

AgencyDetails.propTypes = {
  step: PropTypes.number,
  setStep: PropTypes.func,
  tenancy: PropTypes.object,
  setTenancy: PropTypes.func,
};

export default withNamespaces()(AgencyDetails);
