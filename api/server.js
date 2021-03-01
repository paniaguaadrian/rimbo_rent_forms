// Server Components
import path from "path";
import express from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import colors from "colors";
import morgan from "morgan";
import { notFound, errorHandler } from "./middleware/errorMiddleware.js";
import cors from "cors";

import Stripe from "stripe";

// Routes imported
import emailRJ1Routes from "./routes/emailRJ1Routes.js";
import emailRJ2Routes from "./routes/emailRJ2Routes.js";

// Use dotenv to store variables
dotenv.config();

// Start our app with Express
const app = express();

// Enable Cors middleware
app.set("trust proxy", true);
app.use(cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

const stripe = new Stripe(process.env.SECRET_KEY);

app.use(express.static("."));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.get("/", (req, res) => {
  res.send("API is running");
});

// Declare routes and URL
app.use("/submit-email/rj1", emailRJ1Routes);
app.use("/submit-email/rj2", emailRJ2Routes);

// * Stripe action
app.get("/stripe/card-wallet", (req, res) => {
  res.send("Api is working...!");
});
app.post("/stripe/card-wallet", async (req, res) => {
  try {
    const { tenantsName, tenantsEmail } = req.body;

    // Stripe
    const customer = await stripe.customers.create({
      name: tenantsName,
      email: tenantsEmail,
    });

    const intent = await stripe.setupIntents.create({
      customer: customer.id,
      payment_method_options: {
        card: { request_three_d_secure: "any" },
      },
    });

    res.status(200).json(intent.client_secret);
  } catch (error) {
    res.status(500).json({ statusCode: 500, message: error.message });
  }
});

app.use(notFound);
app.use(errorHandler);

// Setup our server
const PORT = process.env.PORT || 8081;

app.listen(
  PORT,
  console.log(
    `Server runing in ${process.env.NODE_ENV} port ${PORT}`.yellow.bold
  )
);
