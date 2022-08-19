import { render, screen } from "@testing-library/react";
import Posts, { getStaticProps } from "../../pages/posts";
import { getPrismicClient } from "../../services/prismic";

const post = [
  { slug: "my-new-post", title: "My New Post", excerpt: "Post excerpt", updatedAt: "10 de abril de 2022" }
];

jest.mock("../../services/prismic");

describe("Posts page", () => {
  it("renders correctly", () => {

    //por ser um array de posts basta apenas testar um post em si 
    render(<Posts formatedPublications={post} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    //simulando o retorno do prismic com os dados
    getPrismicClientMocked.mockReturnValueOnce({
      getByType: jest.fn().mockResolvedValueOnce({
        results: [
          {
            uid: "my-new-post",
            data: {
              title: [{ type: "heading", text: "My new post" }],
              content: [{ type: "paragraph", text: "Post excerpt" }]
            },
            last_publication_date: "08-08-2022"
          }
        ]
      })
    } as any); //"as any" porque retorna bem mais funcões do que as atuais e não é preciso utilizar todas elas 

    //executando a getStaticProps() para obter o retorno dela após a simulação de dados advindos do Prismic
    const response = await getStaticProps({});

    //é esperado o retorno de um array de objetos com as informações advindas do Prismic
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          formatedPublications: [{
            slug: "my-new-post",
            title: "My new post",
            excerpt: "Post excerpt",
            updatedAt: "08 de agosto de 2022"
          }]
        }
      })
    )
  });
})
