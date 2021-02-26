import Stripe from "stripe";

const stripe = new Stripe(process.env.SECRET_KEY);

const createStripeCustomer = async (req, res) => {
  try {
    const { tenantsName, tenantsEmail } = req.body;

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
};

export { createStripeCustomer };
