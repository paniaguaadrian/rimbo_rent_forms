// React Components
import React, { useState } from "react";
import PropTypes from "prop-types";

// Custom Components
import Input from "../../components/Input";
import Button from "../../components/Button";

// Styles
import styles from "./register-user.module.scss";

// Validation
import { isTenant, isTenantEs } from "./validation";

// Constants Reducer
import { UPDATE_TENANT_INFO } from "./constants";

// Multilanguage
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

const TenantDetails = ({ step, setStep, tenancy, setTenancy, t }) => {
  const [errors, setErrors] = useState({});

  // Handle on change
  const handleTenant = ({ target }) => {
    setTenancy({
      type: UPDATE_TENANT_INFO,
      payload: { [target.name]: target.value },
    });
  };

  // Hanlde con next / continue
  const handleContinue = (e) => {
    e.preventDefault();
    if (i18n.language === "en") {
      const errors = isTenant(tenancy.tenantDetails);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    } else {
      const errors = isTenantEs(tenancy.tenantDetails);
      setErrors(errors);
      if (Object.keys(errors).length > 0) return;
    }

    setStep(step + 1);
  };

  return (
    <form onSubmit={handleContinue}>
      <div className={styles.FormIntern}>
        <div className={styles.FormLeft}>
          <Input
            type="text"
            name="tenantName"
            value={tenancy.tenantDetails.tenantName}
            label={t("RJ1.stepOne.tenantsName")}
            placeholder={t("RJ1.stepOne.tenantsNamePL")}
            onChange={(e) => handleTenant(e)}
            error={errors.tenantName}
          />
          <Input
            type="email"
            name="tenantEmail"
            value={tenancy.tenantDetails.tenantEmail}
            label={t("RJ1.stepOne.tenantsEmail")}
            placeholder={t("RJ1.stepOne.tenantsEmailPL")}
            onChange={(e) => handleTenant(e)}
            error={errors.tenantEmail}
          />
        </div>
        <div className={styles.FormRight}>
          <Input
            type="text"
            name="tenantPhone"
            value={tenancy.tenantDetails.tenantPhone}
            label={t("RJ1.stepOne.tenantsPhone")}
            placeholder={t("RJ1.stepOne.tenantsPhonePL")}
            onChange={(e) => handleTenant(e)}
            error={errors.tenantPhone}
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

TenantDetails.propTypes = {
  step: PropTypes.number,
  setStep: PropTypes.func,
  tenancy: PropTypes.object,
  setTenancy: PropTypes.func,
};

export default withNamespaces()(TenantDetails);
