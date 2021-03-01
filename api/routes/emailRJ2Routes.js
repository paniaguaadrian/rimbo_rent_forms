import express from "express";

// Controllers imported
import { sendRJ2FormEmails } from "../controllers/emailsController.js";

const router = express.Router();

router.route("/").post(sendRJ2FormEmails);

export default router;
