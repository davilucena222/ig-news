import { render, screen } from "@testing-library/react";
import { getSession } from "next-auth/react";
import Post, { getServerSideProps } from "../../pages/posts/[slug]";
import { getPrismicClient } from "../../services/prismic";

const publication = {
  slug: "my-new-post",
  title: "My New Post",
  content: "<p>Post content</p>",
  updatedAt: "10 de abril de 2022"
};

jest.mock("../../services/prismic");
jest.mock("next-auth/react");

describe("Post page", () => {
  it("renders correctly", () => {

    render(<Post publication={publication} />);

    expect(screen.getByText("My New Post")).toBeInTheDocument();
    expect(screen.getByText("Post content")).toBeInTheDocument();
  });

  it("redirects user if no subscription is found", async () => {
    const getSessionMocked = jest.mocked(getSession);

    getSessionMocked.mockResolvedValueOnce(null);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" }
    } as any);

    expect(response).toEqual(
      expect.objectContaining({
        redirect: expect.objectContaining({
          destination: "/",
        })
      })
    )
  });

  it("loads initial data", async () => {
    const getSessionMocked = jest.mocked(getSession);
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
    
    getSessionMocked.mockResolvedValueOnce({
      activeSubscription: "fake-active-subscription"
    } as any);

    const response = await getServerSideProps({
      params: { slug: "my-new-post" }
    } as any);

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
})
