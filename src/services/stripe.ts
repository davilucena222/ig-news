import Stripe from "stripe";
import { version } from "../../package.json";

export const stripe = new Stripe(
  process.env.STRIPE_API_KEY, //key para realizar a conexão com a API do Stripe
  {
    apiVersion: "2020-08-27",
    appInfo: {
      name: "Ignews",
      version
    },
  }
)