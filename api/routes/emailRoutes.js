import express from "express";

// Controllers imported
import {
  sendRJ1FormEmails,
  sendRJ2FormEmails,
  sendRJ11Emails,
  sendPMEmails,
  sendRJ3FormEmail,
  sendRJ15Emails,
  sendRJSFormEmail,
} from "../controllers/emailsController.js";

const router = express.Router();

router.route("/rj1").post(sendRJ1FormEmails);
router.route("/rj2").post(sendRJ2FormEmails);
router.route("/rj11").post(sendRJ11Emails);
router.route("/rjpm").post(sendPMEmails);
router.route("/rj3").post(sendRJ3FormEmail);
router.route("/rj15").post(sendRJ15Emails);
router.route("/rjs").post(sendRJSFormEmail);

export default router;
