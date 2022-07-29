import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { query as q } from "faunadb";
import { fauna } from "../../services/fauna";
import { stripe } from "../../services/stripe";

type User = {
    ref: {
        id: string;
    }
    data: {
        stripe_customer_id: string;
    }
}

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        //getSession() - recuperando os dados de login do usuário através da req (requisição)
        const session = await getSession({ req });

        //caoturando o usuário no banco de dados pelo seu email
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index("user_by_email"),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerId = user.data.stripe_customer_id;

        if (!customerId) {
            //criando um novo consumidor dentro da lista de consumidores do Stripe
            const stripeCustomer = await stripe.customers.create({
                email: session.user.email,
                // metadata
            });

            //atualizando a informação do usuário no banco de dados
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection("users"), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCustomer.id
                        }
                    }
                )
            )

            customerId = stripeCustomer.id;
        }

        //criando um novo cadastro de compra do usuário 
        const stripeCheckoutSession = await stripe.checkout.sessions.create({
            customer: customerId,
            payment_method_types: ["card"],
            billing_address_collection: "required",
            line_items: [
                { price: "price_1LOkc8A23UxAL6bewYiepHo0", quantity: 1 },
            ],
            mode: "subscription",
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL,
        });

        return res.status(200).json({ sessionId: stripeCheckoutSession.id });
    } else {
        //informando ao front-end que apenas realiza cadastros
        res.setHeader("Allow", "POST");
        res.status(405).end("Method not allowed");
    }
}