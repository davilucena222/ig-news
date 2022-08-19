import { render, screen } from "@testing-library/react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import PostPreview, { getStaticProps } from "../../pages/posts/preview/[slug]";
import { getPrismicClient } from "../../services/prismic";

const publication = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post content</p>",
  updatedAt: "10 de abril de 2022"
};

jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));
jest.mock("next-auth/react");
jest.mock("../../services/prismic");

describe("Post preview page", () => {
  it("renders correctly", () => {
    const useSessionMocked = jest.mocked(useSession);

    useSessionMocked.mockReturnValueOnce({
      data: {
        expires: "fake-expires",
      }
    } as any);

    render(<PostPreview publication={publication} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
    expect(screen.getByText("Wanna continue reading?")).toBeInTheDocument();
  });

  it("redirects user to full post when user is subscribed", async () => {
    const useSessionMocked = jest.mocked(useSession);
    const useRouterMocked = jest.mocked(useRouter);
    const pushMock = jest.fn(); //declarando a função fora do escopo do useRouterMocked porque precisa verificar se ela foi chamda

    useSessionMocked.mockReturnValueOnce({
      data: {
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires"
      },
    } as any);

    useRouterMocked.mockReturnValueOnce({
      push: pushMock,
    } as never);

    render(<PostPreview publication={publication} />);

    expect(pushMock).toHaveBeenCalledWith("/posts/my-new-post");
  });

  it("loads initial data", async () => {
    const getPrismicClientMocked = jest.mocked(getPrismicClient);

    getPrismicClientMocked.mockReturnValueOnce({
      getByUID: jest.fn().mockResolvedValueOnce({
        data: {
          title: [{ type: "heading", text: "My new post" }],
          content: [{ type: "paragraph", text: "Post content" }]
        },
        last_publication_date: "08-19-2022"
      })
    } as any);

    const response = await getStaticProps({
      params: { slug: "my-new-post" }
    });

    expect(response).toEqual(
      expect.objectContaining({
        props: {
          publication: {
            slug: "my-new-post",
            title: "My new post",
            content: "<p>Post content</p>",
            updatedAt: "19 de agosto de 2022"
          }
        }
      })
    );
  });
});