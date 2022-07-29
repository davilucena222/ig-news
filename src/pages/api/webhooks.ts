import { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";
import Stripe from "stripe";
import { stripe } from "../../services/stripe";
import { saveSubscription } from "./_lib/manageSubscription";

//função para ler as informações que são enviadas em formas de "streams" pelo stripe (webhooks) e converter essas informações em strings
async function buffer(readable: Readable) {
    const chunks = [];

    for await (const chunk of readable) {
        chunks.push(
            typeof chunk === "string" ? Buffer.from(chunk) : chunk
        );
    }

    return Buffer.concat(chunks);
}

//desabilitando entendimento padrão do next via requisições (formulários e arquivos JSON) para que o tipo de dado "stream" possa ser entendido e convertido
export const config = {
    api: {
        bodyParser: false
    }
}

//set[] => Um tipo de array que não permite informaçõe duplicadas
//eventos relevantes para a aplicação ignews
const relevantEvents = new Set([
    "checkout.session.completed",
    "customer.subscription.updated",
    "customer.subscription.deleted",
])

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const buf = await buffer(req);

        //recebendo o código de confirmação de envio dos readables pela aplicação terceira
        const secret = req.headers["stripe-signature"];

        let event: Stripe.Event;

        try {
            event = stripe.webhooks.constructEvent(buf, secret, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            return res.status(400).send(`Webhook error: ${err.message}`);
        }

        //guardando o tipo de evento que o Stripe retornou para a aplicação ignews
        //a partir da configuração deste evento é que a aplicação ignews tomará rumo
        const { type } = event;

        if (relevantEvents.has(type)) {
            try {
                switch (type) {
                    case "customer.subscription.updated":
                    case "customer.subscription.deleted":
                        const subscription = event.data.object as Stripe.Subscription;

                        await saveSubscription(
                            subscription.id,
                            subscription.customer.toString(),
                            false
                        );

                        break;

                    case "checkout.session.completed":

                        //tipando a checkoutSession para identificar as informações que são retornadas dentro dela
                        const checkoutSession = event.data.object as Stripe.Checkout.Session;

                        //função que recebe os id's em formato string
                        await saveSubscription(
                            checkoutSession.subscription.toString(),
                            checkoutSession.customer.toString(),
                            true    
                        )

                        break;
                    default: 
                        throw new Error("Unhandled event!");
                }
            } catch(err) {
                return res.json({ error: "Webhook handler failed!!" })
            }
        }

        res.json({ received: true });
    } else {
        res.setHeader("Allow", "POST");
        res.status(405).end("Method not allowed");
    }
}