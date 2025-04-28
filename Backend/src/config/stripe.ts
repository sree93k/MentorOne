// import Stripe from "stripe";
// if (!process.env.STRIPE_SECRET_KEY) {
//   throw new Error(
//     "STRIPE_SECRET_KEY is not defined in the environment variables"
//   );
// }
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
//   apiVersion: "2025-03-31" as "2025-03-31.basil",
// });

// export default stripe;
import Stripe from "stripe";

// Initialize Stripe with the secret key and a valid API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2023-10-16", // Use the latest stable API version
  typescript: true,
});

export default stripe;
