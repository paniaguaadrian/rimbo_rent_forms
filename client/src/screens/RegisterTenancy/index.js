// React Components
import React, { useReducer, useState } from "react";

// Custom Components
import FormSteps from "./form-steps";
import CustomHelmet from "../../components/Helmet/CustomHelmet";

// Material UI Icons
import SubjectIcon from "@material-ui/icons/Subject";
import RestoreIcon from "@material-ui/icons/Restore";
import MailOutlineIcon from "@material-ui/icons/MailOutline";

// Reducer import
import { TenancyReducer, DefaultTenancy } from "./tenancy-reducer";

// Styles imported
import classes from "./multi_step_form.module.scss";

// Multilanguage
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

const RegisterTenancy = ({ t }) => {
  let [step, setStep] = useState(0);

  const [tenancy, setTenancy] = useReducer(TenancyReducer, DefaultTenancy);

  let steps = FormSteps(step, setStep, tenancy, setTenancy);

  return (
    <>
      <CustomHelmet header={t("RJ1.helmet")} />
      <div className={classes.PageContainer}>
        {step === 0 || step === 1 || step === 2 || step === 3 ? (
          <div className={classes.HeaderContainer}>
            <h1>{t("RJ1.header.title")}</h1>
            <div className={classes.HeaderInfo}>
              <div className={classes.HeaderInfoElement}>
                <SubjectIcon className={classes.MaterialIcon} />
                <p>{t("RJ1.header.subtitleOne")}</p>
              </div>

              <div className={classes.HeaderInfoElement}>
                <RestoreIcon className={classes.MaterialIcon} />
                <p>{t("RJ1.header.subtitleTwo")}</p>
              </div>

              <div className={classes.HeaderInfoElement}>
                <MailOutlineIcon className={classes.MaterialIcon} />
                <p>{t("RJ1.header.subtitleThree")}</p>
              </div>
            </div>
            {i18n.language === "es" ? (
              <h4>
                Paso {step + 1} / {steps.length - 1} -{" "}
                <span>{steps[`${step}`].titleEs}</span>
              </h4>
            ) : (
              <h4>
                Step {step + 1} / {steps.length - 1} -{" "}
                <span>{steps[`${step}`].title}</span>
              </h4>
            )}
          </div>
        ) : null}

        <div className={classes.FormContent}>{steps[`${step}`].content}</div>
      </div>
    </>
  );
};

export default withNamespaces()(RegisterTenancy);
