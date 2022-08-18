import { render, screen } from "@testing-library/react";
import { SignInButton } from ".";
import { useSession } from "next-auth/react";
import { mocked } from "ts-jest/utils";

jest.mock("next-auth/react");

describe("SignInButton Component", () => {
  it("renders correctly when user is not authenticated", () => {
    const useSessionMocked = mocked(useSession);

    useSessionMocked.mockReturnValue([null, false]);

    render(<SignInButton />);
  
    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });

  it("renders correctly when user is authenticated", () => {
    render(<SignInButton />);
  
    expect(screen.getByText("Sign in with GitHub")).toBeInTheDocument();
  });
});