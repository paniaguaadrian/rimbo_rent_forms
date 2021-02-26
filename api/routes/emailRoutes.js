import express from "express";

// Controllers imported
import { sendRJ1Email } from "../controllers/emailController.js";

const router = express.Router();

router.route("/").post(sendRJ1Email);

export default router;
