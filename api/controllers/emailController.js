import nodemailer from "nodemailer";
import sgTransport from "nodemailer-sendgrid-transport";
// ! Integration with hbs
// import hbs from "nodemailer-express-handlebars";

const sendRJ1Email = async (req, res) => {
  const {
    tenantsName,
    tenantsEmail,
    agencyName,
    rentalAddress,
    rentalPostalCode,
    rentalCity,
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

  const tenantEmail = {
    from: "Enso | Rimbo info@rimbo.rent",
    to: tenantsEmail, // tenant's email
    subject: `¡Tarjeta registrada correctamente ${tenantsName} !`,
    text: "",
    html: `<div>
      <h3 style='color:#6aa3a1'>Hola ${tenantsName}</h3>
      <p>Nombre de la agencia: ${agencyName}</p>
      <p>Direccion del apartamento: ${rentalAddress}</p>
      <p>Codigo Postal: ${rentalPostalCode}</p>
      <p>Ciudad: ${rentalCity}</p>
      <p>En el siguiente enlace puedes registarte</p>
      <p>http://localhost:3000/register/rj2/${randomID}</p>
      
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

export { sendRJ1Email };
