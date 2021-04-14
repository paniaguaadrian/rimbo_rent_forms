// React Components
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// Custom Components
import CustomHelmet from "../../components/Helmet/CustomHelmet";
import Success from "../../components/Success/Success";

// Reducer & constants
import { TenantStripeReducer, DefaultTenant } from "./tenantStripe-reducer";
import { UPDATE_NEWTENANT_INFO } from "./tenantStripe-constants";

// Stripe Components
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Multi language
import { withNamespaces } from "react-i18next";
import i18n from "../../i18n";

// Images
import StripeLogo from "../../images/secure-payments.png";
import SuccessImage from "../../images/success-image.svg";

// Styles
import Loader from "react-loader-spinner";
import classes from "./rj3_tenant.module.scss";
import "./CardSection.css";
const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "14px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};

// End-Points env
const {
  REACT_APP_BASE_URL,
  REACT_APP_API_RIMBO_TENANCY,
  REACT_APP_API_RIMBO_TENANT,
  REACT_APP_BASE_URL_STRIPE,
  REACT_APP_API_RIMBO_TENANT_STRIPE,
  REACT_APP_BASE_URL_EMAIL,
} = process.env;

const RegisterTenantCard = ({ t }) => {
  let { randomID } = useParams();
  const tenancyID = randomID;

  const [tenant, setTenant] = useReducer(TenantStripeReducer, DefaultTenant);

  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();

  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [tenancyData, setTenancyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null); //eslint-disable-line

  const [state, setState] = useState(null); // eslint-disable-line

  // ! Fetch data from DB to autocomplete input form
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
          (tenancyData) => {
            setTenancyData(tenancyData);
            setLoading(false);
          },
          (err) => {
            setErr(err);
            setLoading(false);
          }
        );
    };
    getData();
  }, [tenancyID]);

  // ! Fetch data to send email notification to Gloria when tenant enters to that page (one time)
  useEffect(() => {
    // fetch data from DB
    const fetchUserData = () =>
      axios.get(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANCY}/${tenancyID}`
      );

    const postDecision = (body) =>
      axios.post(
        `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT}/${randomID}/payment/try`,
        body
      );

    const processDecision = async () => {
      const { data: tenancyData } = await fetchUserData();

      const postBody = {
        // use some logic based on tenancyData here to make the postBody
        isTrying: tenant.isTrying,
        randomID: tenancyData.tenant.randomID,
      };

      const { data: decisionResult } = await postDecision(postBody);

      const { tenantsName, tenantsEmail, tenantsPhone } = tenancyData.tenant;
      const { agencyName } = tenancyData.agent;

      if (tenancyData.tenant.isTrying === false) {
        axios.post(`${REACT_APP_BASE_URL_EMAIL}/e2r`, {
          tenantsName,
          tenantsEmail,
          tenantsPhone,
          randomID,
          agencyName,
        });
      }
      setState(decisionResult);
    };
    processDecision();
  }, [randomID, tenant.isTrying, tenancyID]);

  // Handle on change
  const handleNewTenant = ({ target }) => {
    setTenant({
      type: UPDATE_NEWTENANT_INFO,
      payload: { [target.name]: target.value },
    });
  };

  const handleCardDetailsChange = (ev) => {
    ev.error ? setCheckoutError(ev.error.message) : setCheckoutError();
  };

  const handleFormSubmit = async (ev) => {
    ev.preventDefault();

    const tenantsEmail = document.getElementById("email").value;
    const tenantsName = document.getElementById("name").value;
    const tenantsPhone = document.getElementById("phone").value;
    const timestamps = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const cardElement = elements.getElement("card");

    setProcessingTo(true);

    try {
      // ! Stripe action
      const { data: client_secret } = await axios.post(
        `${REACT_APP_BASE_URL_STRIPE}/card-wallet`,
        {
          tenantsName,
          tenantsEmail,
        }
      );

      const { error } = await stripe.confirmCardSetup(client_secret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: tenantsName,
            email: tenantsEmail,
            phone: tenantsPhone,
          },
        },
      });

      if (error) {
        setCheckoutError("* Rellena todos los campos del formulario.");
        setProcessingTo(false);
        return;
      } else {
        setIsSuccessfullySubmitted(true);

        // ! post a nuestra BDD
        await axios.post(
          `${REACT_APP_BASE_URL}${REACT_APP_API_RIMBO_TENANT_STRIPE}/${randomID}`,
          {
            isTrying: tenant.isTrying,
            isAcceptedGC: tenant.isAcceptedGC,
            randomID: randomID,
          }
        );

        // ! Post to Emil service
        if (i18n.language === "en") {
          await axios.post(`${REACT_APP_BASE_URL_EMAIL}/rj3`, {
            tenantsName,
            tenantsEmail,
            tenantsPhone,
            timestamps,
            agencyEmailPerson: tenancyData.agent.agencyEmailPerson,
            agencyContactPerson: tenancyData.agent.agencyContactPerson,
            agencyName: tenancyData.agent.agencyName,
            rentalAddress: tenancyData.property.rentalAddress,
            randomID,
            tenancyID,
          });
        } else {
          await axios.post(`${REACT_APP_BASE_URL_EMAIL}/es/rj3`, {
            tenantsName,
            tenantsEmail,
            tenantsPhone,
            timestamps,
            agencyEmailPerson: tenancyData.agent.agencyEmailPerson,
            agencyContactPerson: tenancyData.agent.agencyContactPerson,
            agencyName: tenancyData.agent.agencyName,
            rentalAddress: tenancyData.property.rentalAddress,
            randomID,
            tenancyID,
          });
        }
      }
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  return (
    <>
      <CustomHelmet header={t("RJ3.helmet")} />
      {!isSuccessfullySubmitted ? (
        <div className={classes.RegisterContainer}>
          {loading ? (
            <div className={classes.Register}>
              <Loader
                type="Puff"
                color="#01d2cc"
                height={200}
                width={200}
                timeout={3000} //3 secs
              />
            </div>
          ) : (
            <>
              <div className={classes.Register}>
                <h1>{t("RJ3.header.title")}</h1>
                <div className={classes.ExtraInfoContainer}>
                  <h2>{t("RJ3.header.subtitle")}</h2>
                </div>
              </div>
              <div className={classes.CardContainer}>
                <form onSubmit={handleFormSubmit}>
                  <div className={classes.CardInput}>
                    <label>
                      <h3>{t("RJ3.form.tenantTitle")}</h3>
                      <div>
                        <div>
                          <h4>{t("RJ3.form.name")}</h4>
                          <input
                            id="name"
                            type="text"
                            value={tenancyData.tenant.tenantsName}
                            disabled
                          />
                        </div>
                        <div>
                          <h4>{t("RJ3.form.email")}</h4>
                          <input
                            id="email"
                            type="text"
                            value={tenancyData.tenant.tenantsEmail}
                            disabled
                          />
                        </div>

                        <div>
                          <h4>{t("RJ3.form.phone")}</h4>
                          <input
                            id="phone"
                            type="text"
                            value={tenancyData.tenant.tenantsPhone}
                            disabled
                          />
                        </div>
                      </div>
                      <div>
                        <p>{t("RJ3.form.cardSubtitle")}</p>
                      </div>
                      <h3>{t("RJ3.form.cardTitle")}</h3>
                      <CardElement
                        options={CARD_ELEMENT_OPTIONS}
                        onChange={handleCardDetailsChange}
                      />
                    </label>
                    <div>
                      <p>
                        {t("RJ3.form.extraInfo")}
                        <span>
                          {tenancyData.product}
                          {t("RJ3.form.extraInfoTwo")}
                        </span>
                      </p>
                    </div>
                    <div className={classes.TermsContainerStripe}>
                      <input
                        type="checkbox"
                        required
                        name="isAcceptedGC"
                        id="terms"
                        value={tenant.isAcceptedGC}
                        onChange={(e) => handleNewTenant(e)}
                      />
                      <p>
                        {t("RJ3.form.checkbox")}
                        <a
                          href="https://rimbo.rent/politica-privacidad/"
                          target="_blank"
                          rel="noreferrer"
                          className="link-tag"
                        >
                          {t("RJ3.form.generalConditions")}
                        </a>
                      </p>
                    </div>
                    <div className={classes.ErrorInput}>
                      <p className="error-message">{checkoutError}</p>
                    </div>
                    {isProcessing ? (
                      <Loader
                        type="Puff"
                        color="#01d2cc"
                        height={50}
                        width={50}
                        timeout={3000} //3 secs
                      />
                    ) : (
                      <button disabled={isProcessing || !stripe}>
                        {t("authorizeTwo")}
                      </button>
                    )}
                    <div>
                      <img
                        src={StripeLogo}
                        alt="Stripe Security Payment Logo"
                      />
                    </div>
                  </div>
                </form>
              </div>
            </>
          )}
        </div>
      ) : (
        <Success
          title={t("RJ3.success.title")}
          subtitle={t("RJ3.success.subtitle")}
          imageSRC={SuccessImage}
          imageAlt="Success image"
        />
      )}
    </>
  );
};

export default withNamespaces()(RegisterTenantCard);
