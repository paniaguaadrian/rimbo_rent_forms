// React Components
import React, { useState, useEffect, useReducer } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

import { TenantStripeReducer, DefaultTenant } from "./tenantStripe-reducer";

// Stripe Components
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";

// Constants
import { UPDATE_NEWTENANT_INFO } from "./tenantStripe-constants";

// Styles
import Loader from "react-loader-spinner";
import styles from "../RegisterTenancy/register-user.module.scss";
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

const RegisterTenantCard = () => {
  const { randomID } = useParams();

  const [tenant, setTenant] = useReducer(TenantStripeReducer, DefaultTenant);

  const [isProcessing, setProcessingTo] = useState(false);
  const [checkoutError, setCheckoutError] = useState();

  const [isSuccessfullySubmitted, setIsSuccessfullySubmitted] = useState(false);

  const stripe = useStripe();
  const elements = useElements();

  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState(null);

  // Fetch data from DataBase
  useEffect(
    () => {
      const getData = () => {
        fetch(`http://localhost:8080/api/tenants/tenant/${randomID}`)
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
    [randomID],
    [responseData, loading, err]
  );

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
    const tenantsEmail = document.getElementById("email").innerHTML;
    const tenantsName = document.getElementById("name").innerHTML;
    const tenantsPhone = document.getElementById("phone").innerHTML;

    // const timestamps = new Date()
    //   .toISOString()
    //   .replace(/T/, " ")
    //   .replace(/\..+/, "");

    const cardElement = elements.getElement("card");

    setProcessingTo(true);

    // ! Development / Production API's
    // * Stripe Action
    // "http://localhost:8081/stripe/card-wallet" (D)
    // `${NOMBRE}` (P)
    // * Emails Action
    // "http://localhost:8081/submit-email/rj1" (D)
    // `${NOMBRE}` (P)
    // * Send data to Rimbo API
    // "http://localhost:8081/api/enso/tenants" (D)
    // `${api_rimbo_enso_tenant}` (P)

    try {
      // ! Post a el basckend de stripe en formularios
      const { data: client_secret } = await axios.post(
        "http://localhost:8081/stripe/card-wallet",
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
        await axios.post("http://localhost:8080/api/tenants/stripe/:randomID", {
          isAccepted: tenant.isAccepted,
          randomID: randomID,
        });

        // ! Post a el backend de emails en formularios
        // await axios.post("http://localhost:8081/submit-email/rj1", {
        //   tenantsName,
        //   tenantsEmail,
        //   tenantsPhone,
        //   timestamps,
        // });
      }
    } catch (err) {
      setCheckoutError(err.message);
    }
  };

  return (
    <>
      {!isSuccessfullySubmitted ? (
        <div className={styles.RegisterContainer}>
          <div className={styles.Register}>
            <h1>
              Great! You are just one step away from renting without a deposit!
            </h1>
            <div className={styles.ExtraInfoContainer}>
              <h2>
                You just need to review our Terms and Conditions and provide the
                charge authorization
              </h2>
              <div>
                <p>
                  * The card will NOT be blocked. The card will NOT be charged
                  now. Only in case of legal claims presented by the landlord
                  the card will be charged, import limited to{" "}
                  <span>{responseData.tenantRimboService} of rent.</span>
                </p>
              </div>
            </div>
          </div>
          <div className={styles.CardContainer}>
            <form onSubmit={handleFormSubmit}>
              <div className={styles.CardInput}>
                <label>
                  <h3>Debit card details</h3>
                  <div>
                    <p id="name">{responseData.tenantsName}</p>
                    <p id="email">{responseData.tenantsEmail}</p>
                    <p id="phone">{responseData.tenantsPhone}</p>
                  </div>

                  <CardElement
                    options={CARD_ELEMENT_OPTIONS}
                    onChange={handleCardDetailsChange}
                  />
                </label>
              </div>
              <div className={styles.ErrorInput}>
                <p className="error-message">{checkoutError}</p>
              </div>
              <div className={styles.TermsContainerStripe}>
                <input
                  type="checkbox"
                  required
                  name="isAccepted"
                  id="terms"
                  value={tenant.isAccepted}
                  onChange={(e) => handleNewTenant(e)}
                />
                <p>
                  By hiring Rimbo's Services, you accept the{" "}
                  <a
                    href="https://rimbo.rent/politica-privacidad/"
                    target="_blank"
                    rel="noreferrer"
                    className="link-tag"
                  >
                    {" "}
                    Rimbo general conditions
                  </a>
                </p>
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
                <button disabled={isProcessing || !stripe}>Authorize</button>
              )}
            </form>
          </div>
        </div>
      ) : (
        <div>
          <h1>Success page</h1>
          <div className="rimbo-sign-success">
            <h4>Powered by</h4>
            {/* <img src={RimboLogo} alt="Rimbo Rent Logo" /> */}
          </div>
        </div>
      )}
    </>
  );
};

export default RegisterTenantCard;
