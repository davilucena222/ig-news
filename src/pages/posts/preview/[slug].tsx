import { GetStaticPaths, GetStaticProps } from "next"
import { useSession } from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { RichText } from "prismic-dom";
import { useEffect, useState } from "react";
import { getPrismicClient } from "../../../services/prismic";
import styles from "../post.module.scss";

interface PostPreviewProps {
  publication: {
    slug: string;
    title: string;
    content: string;
    updatedAt: string;
  }
}

export default function PostPreview({ publication }: PostPreviewProps) {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session?.activeSubscription) {
      router.push(`/posts/${publication.slug}`);
    }
  }, [session]);

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
            className={`${styles.postContent} ${styles.previewContent}`}
            dangerouslySetInnerHTML={{ __html: publication.content }}
          />

          <div className={styles.continueReading}>
            Wanna continue reading?
            <Link href="/">
              <a>
                Subscribe now 🤗
              </a>
            </Link>
          </div>
        </article>
      </main>
    </>
  )
}

//quais posts ou páginas serão geradas na build, ou seja, quando a aplicação for para produção quais páginas estáticas serão geradas mesmo antes do usuário realizar o acesso pela primeira vez
//o GetStaticPaths só existe em páginas que possuem parâmetros dinâmicos como o arquivo [slug].tsx
//as páginas que não possuem parâmetros dinâmicos são geradas de forma estática automaticamente, exemplo: arquivos index.tsx
export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: "blocking",
  }
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const { slug } = params;

  const prismic = getPrismicClient();

  const response = await prismic.getByUID("publication", String(slug), {});

  const publication = {
    slug,
    title: RichText.asText(response.data.title),
    content: RichText.asHtml(response.data.content.slice(0, 3)),
    updatedAt: new Date(response.last_publication_date).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }),
  }

  return {
    props: {
      publication,
    },
    redirect: 60 * 30,  //30 minutes
  }
}