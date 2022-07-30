import { GetServerSideProps } from "next"
import { getSession, useSession } from "next-auth/react";
import Head from "next/head";
import { RichText } from "prismic-dom";
import { getPrismicClient } from "../../services/prismic";
import styles from "./post.module.scss";

interface PostProsps {
    publication: {
        slug: string;
        title: string;
        content: string;
        updatedAt: string;
    }
}

export default function Post({ publication }: PostProsps) {
    return (
        <>
            <Head>
                <title>{publication.title}</title>
            </Head>

            <main className={styles.container}>
                <article className={styles.post}>
                    <h1>{publication.title}</h1>
                    <time>{publication.updatedAt}</time>
                    <div
                        className={styles.postContent}
                        dangerouslySetInnerHTML={{ __html: publication.content }}
                    />
                </article>
            </main>
        </>
    )
}

export const getServerSideProps: GetServerSideProps = async ({ req, params }) => {
    const session = await getSession({ req });
    const { slug } = params;

    //verificando se o usuário possui uma assinatura ativa
    if(!session?.activeSubscription) {
        return {
            redirect: {
                // destination: "/",
                destination: `/posts/preview/${slug}`,
                permanent: false,
            }
        }
    }

    const prismic = getPrismicClient();

    const response = await prismic.getByUID("publication", String(slug), {});

    const publication = {
        slug,
        title: RichText.asText(response.data.title),
        content: RichText.asHtml(response.data.content),
        updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
            day: "2-digit",
            month: "long",
            year: "numeric",
        }),
    }

    return {
        props: {
            publication,
        }
    }
}