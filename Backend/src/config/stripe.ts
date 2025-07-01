import Stripe from "stripe";

// Initialize Stripe with the secret key and a valid API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16" as Stripe.LatestApiVersion, // Use the latest stable API version
  typescript: true,
});

export default stripe;
