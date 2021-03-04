import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
// ! Integration with hbs
// import hbs from "nodemailer-express-handlebars";

// * Rimbo rent emails
// Production
const rimboEmail = "info@rimbo.rent";
const testEmail = "paniaguasanchezadrian@gmail.com";
// Development
// const rimboEmail = "";

// * RJ1 Form => RJ3, RJ4, RJD Emails
const sendRJ1FormEmails = async (req, res) => {
  const {
    tenantsName,
    tenantsEmail,
    tenantsPhone,

    agencyName,
    agencyContactPerson,
    agencyEmailPerson,
    agencyPhonePerson,
    rentalAddress,
    rentalPostalCode,
    rentalCity,

    monthlyRent,
    rimboService,
    rentalDuration,

    landlordName,
    landlordEmail,
    landlordPhone,

    randomID,
  } = req.body;

  const transporter = nodemailer.createTransport(
    sgTransport({
      auth: {
        api_key: process.env.SENDGRID_API,
      },
    })
  );

  // ! Integration with hbs
  //   let options = {
  //     viewEngine: {
  //       extname: ".handlebars",
  //       layoutsDir: "views/",
  //       defaultLayout: "index",
  //     },
  //     viewPath: "views/",
  //   };
  //   transporter.use("compile", hbs(options));

  // RJ4 Email  @Tenant
  const tenantEmail = {
    from: "Rimbo info@rimbo.rent",
    to: tenantsEmail, // tenant's email
    subject: "Welcome to Rimbo!",
    text: "",
    html: `<div>
      <h3 style='color:#6aa3a1'>Hello ${tenantsName}</h3>
      <br/>
      <p>You have contacted <b>${agencyName}</b> regarding the following apartment:</p>
      <p><b>Address:</b> ${rentalAddress}</p>
      <p><b>Postal code:</b> ${rentalPostalCode}</p>
      <p><b>City:</b> ${rentalCity}</p>
      <br/>
      <p>Rimbo joined forces with ${agencyName} to move you into your next apartment at ${rentalAddress} quick and easy!</p>
      <br/>
      <p>With Rimbo, you ‘check in’ without paying additional cash deposit, and pay for any damages or unpaid rent only when you check out.</p>
      <br/>
      <p>It sounds great, doesn't it?</p>
      <br/>
      <p>Click on the link below to register.</p>
      <br/>
      <p><b>What’s next?</b></p>
      <p>Rimbo takes care of running a few checks - to prove that you are a great tenant. It’s online, fast, secure and completely confidential.</p>
      <br/>
      <button type="button"><a href="http://localhost:3000/register/rj2/${randomID}">Join now!</a></button>
      </div>`,
  };
  transporter.sendMail(tenantEmail, (err, data) => {
    if (err) {
      console.log("There is an error here...!" + err);
    } else {
      console.log("Email sent!");
    }
  });

  // RJ3 Email  @PM/Agency
  const PMEmail = {
    from: "Rimbo info@rimbo.rent",
    to: agencyEmailPerson, // PM/Agency email
    subject: "Rimbo Tenant Listing Successful",
    text: "",
    html: `<div>
      <h3 style='color:#6aa3a1'>Hi ${agencyContactPerson}</h3>
      <p>Thank you for listing your tenant on Rimbo.rent. We have received all data correctly.</p>
      <br/>
      <b>Please, keep an eye on your email in the upcoming hours in order to proceed with the next steps.</b>
      <br/>
      <p>Tenant's full name: ${tenantsName}</p>
      <p>Tenant's phone number: ${tenantsPhone}</p>
      <p>Tenant's email: ${tenantsEmail}</p>
      <p>Monthly rent: ${monthlyRent}€</p>
      <p>Selected Product: ${rimboService}</p>
      <p>Contract duration: ${rentalDuration} years</p>
      <p>Address of property: ${rentalAddress}</p>
      <p>Postal code: ${rentalPostalCode}</p>
      <p>City: ${rentalCity}</p>
      <br/>
      <p>We will contact the Tenant to complete the registration and we’ll keep you posted!</p>
      <br/>
      <p>As soon as the screening is done we will contact you via email  to complete the rental process of this property.</p>
      <br/>
      <p>Warm greetings from our team!</p>
      </div>`,
  };
  transporter.sendMail(PMEmail, (err, data) => {
    if (err) {
      console.log("There is an error here...!" + err);
    } else {
      console.log("Email sent!");
    }
  });

  // RJD Email  @Rimbo
  const RimboEmail = {
    from: "Rimbo info@rimbo.rent",
    to: rimboEmail, // PM/Agency email
    subject: `New Tenant Listing by ${agencyName}`,
    text: "",
    html: `<div>
      
      <p>The agency ${agencyName} has filled the Tenant Registration Form (RJ1n)</p>
      <br/>
      <b>Agency:</b>
      <p>Agency's Name: ${agencyName}</p>
      <p>Agency Contact: ${agencyContactPerson}</p>
      <p>Agency's Email: ${agencyEmailPerson}</p>
      <p>Agency's Phone: ${agencyPhonePerson}</p>
      <br/>
      <b>Tenant:</b>
      <p>Tenant's Name: ${tenantsName}</p>
      <p>Tenant's Email: ${tenantsEmail}</p>
      <p>Tenant's Phone: ${tenantsPhone}</p>
      <br/>
      <b>Property info:</b>
      <p>Monthly rent: ${monthlyRent}€</p>
      <p>Selected Service: ${rimboService}</p>
      <p>Contract duration: ${rentalDuration} years</p>
      <p>Address of the property: ${rentalAddress}</p>
      <p>City: ${rentalCity}</p>
      <p>Postal Code: ${rentalPostalCode}</p>
      <br/>
      <b>Landlord:</b>
      <p>Landlord's Full Name: ${landlordName}</p>
      <p>Landlord's Phone: ${landlordPhone}</p>
      <p>Landlord's Email: ${landlordEmail}</p>
      
      </div>`,
  };
  transporter.sendMail(RimboEmail, (err, data) => {
    if (err) {
      console.log("There is an error here...!" + err);
    } else {
      console.log("Email sent!");
    }
  });

  res.status(200).json();
};

// * RJ2 Form => RJ9, RJXX3 emails
const sendRJ2FormEmails = async (req, res) => {
  const {
    agencyName,
    agencyContactPerson,
    agencyPhonePerson,
    agencyEmailPerson,
    tenantsName,
    tenantsPhone,
    tenantsEmail,
    monthlyNetIncome,
    jobType,
    tenantsAddress,
    tenantsZipCode,
    monthlyRent,
    rimboService,
    rentalDuration,
    rentalAddress,
    rentalCity,
    rentalPostalCode,
    landlordName,
    landlordPhone,
    landlordEmail,
    tenancyID,
  } = req.body;

  const transporter = nodemailer.createTransport(
    sgTransport({
      auth: {
        api_key: process.env.SENDGRID_API,
      },
    })
  );

  // RJXX3 email @Rimbo
  const RimboEmail = {
    from: "Rimbo info@rimbo.rent",
    to: rimboEmail, // PM/Agency email
    subject: `${tenantsName} ready for Screening`,
    text: "",
    html: `<div>
      <h3>Hello Rimbo team,</h3>
      <p>The tenant ${tenantsName} wants to join Rimbo through the agency ${agencyName}.</p>
      <br/>
      <b>Agency:</b>
      <p>Agencyname: ${agencyName}</p>
      <p>Contact person: ${agencyContactPerson}</p>
      <p>Phone number: ${agencyPhonePerson}</p>
      <p>Email: ${agencyEmailPerson}</p>
      <br/>
      <b>Tenant:</b>
      <p>Tenant Full name: ${tenantsName}</p>
      <p>Tenant Telephone number: ${tenantsPhone}</p>
      <p>Tenant Email: ${tenantsEmail}</p>
      <p>Net monthly income: ${monthlyNetIncome}€</p>
      <p>Job Type: ${jobType}</p>
      <p>DNI/NIE: 'Adjuntado al email, FALTA ESTE PUNTO.'</p>
      <p>Current Address: ${tenantsAddress}</p>
      <p>Current Postal Code: ${tenantsZipCode}</p>
      <br/>
      <b>Property:</b>
      <p>Monthly rent: ${monthlyRent}</p>
      <p>Selected Product: ${rimboService}</p>
      <p>Contract duration: ${rentalDuration} years</p>
      <p>Address of Property: ${rentalAddress}</p>
      <p>City: ${rentalCity}</p>
      <p>Postal Code: ${rentalPostalCode}</p>
      <br/>
      <b>Landlord: </b>
      <p>Landlord Full name: ${landlordName}</p>
      <p>Landlord Telephone Number: ${landlordPhone}</p>
      <p>LandlordEmail: ${landlordEmail}</p>
    
      <button type="button"><a href="http://localhost:3000/register/rj2/${tenancyID}/approved">Approve</a></button>

      <button type="button"><a href="http://localhost:3000/register/rj2/${tenancyID}/rejected">Reject</a></button>

      <h3>DOCS SENT IN A SEPARATE EMAIL, PLEASE CHECK</h3>
      </div>`,
  };
  transporter.sendMail(RimboEmail, (err, data) => {
    if (err) {
      console.log("There is an error here...!" + err);
    } else {
      console.log("Email sent!");
    }
  });

  // Tenant email @Tenant
  const tenantEmail = {
    from: "Rimbo info@rimbo.rent",
    to: tenantsEmail, // Tenant email
    subject: `Info Received! Your Rimbo Journey Has Begun!`,
    text: "",
    html: `<div>
      <h3>Thank you, ${tenantsName}</h3>
      <p>You have registered successfully.</p>
      <br/>
      <ul>What's next?</ul>
      <li>We will complete our checks and registration within 2 business days</li>
      <li>Your agent / landlord will be in touch with you then, to confirm the next steps of the rental process</li>
      <br/>
      <p>In just a few hours you will be part of Rimbo's family!</p>
      <br/>
      <p>Exciting, right?</p>
      </div>`,
  };

  transporter.sendMail(tenantEmail, (err, data) => {
    if (err) {
      console.log("There is an error here...!" + err);
    } else {
      console.log("Email sent!");
    }
  });

  res.status(200).json();
};

export { sendRJ1FormEmails, sendRJ2FormEmails };
