import express from "express";

// Controllers imported
import {
  sendRJ1FormEmails,
  sendRJ2FormEmails,
  sendRJ11Emails,
  sendPMEmails,
} from "../controllers/emailsController.js";

const router = express.Router();

router.route("/rj1").post(sendRJ1FormEmails);
router.route("/rj2").post(sendRJ2FormEmails);
router.route("/rj11").post(sendRJ11Emails);
router.route("/rjpm").post(sendPMEmails);

export default router;
