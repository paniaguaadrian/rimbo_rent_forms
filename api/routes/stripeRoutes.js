import express from "express";

// Controllers imported
import { createStripeCustomer } from "../controllers/stripeController.js";

const router = express.Router();

router.route("/").post(createStripeCustomer);

export default router;
