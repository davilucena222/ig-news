import Head from "next/head";
import styles from "./styles.module.scss";
import { getPrismicClient } from "../../services/prismic";
import { RichText } from "prismic-dom";
import Link from "next/link";

type Publication = {
    slug: string,
    title: string,
    excerpt: string,
    updatedAt: string
}

interface PostsProps {
    formatedPublications: Publication[];
}

export default function Posts({ formatedPublications }: PostsProps) {
    return (
        <>
            <Head>
                <title>Posts | Ignews</title>
            </Head>

            <main className={styles.container}>
                <div className={styles.posts}>
                    {formatedPublications.map(publication => (
                        <Link href={`/posts/${publication.slug}`} key={publication.slug}>
                            <a key={publication.slug}>
                                <time>{publication.updatedAt}</time>
                                <strong>{publication.title}</strong>
                                <p>{publication.excerpt}</p>
                            </a>
                        </Link>
                    ))}

                    <a href="#">
                        <time>12 de março de 2022</time>
                        <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
                        <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process.</p>
                    </a>
                    <a href="#">
                        <time>12 de março de 2022</time>
                        <strong>Creating a Monorepo with Lerna & Yarn Workspaces</strong>
                        <p>In this guide, you will learn how to create a Monorepo to manage multiple packages with a shared build, test, and release process.</p>
                    </a>
                </div>
            </main>
        </>
    );
}

export async function getServerSideProps() {
    const prismic = getPrismicClient()

    const publications = await prismic.getByType("publication", {
        pageSize: 100,
    });

    const formatedPublications = publications.results.map(publication => {
        return {
            slug: publication.uid,
            title: RichText.asText(publication.data.title),
            excerpt: publication.data.content.find(content => content.type === "paragraph")?.text ?? "",
            updatedAt: new Date(publication.last_publication_date).toLocaleDateString("pt-BR", {
                day: "2-digit",
                month: "long",
                year: "numeric"
            })
        }
    })

    return {
        props: { formatedPublications },
    };
}