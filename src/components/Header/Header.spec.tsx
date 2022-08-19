import { render, screen } from "@testing-library/react";
import { Header } from ".";

//simulação de uma funcionalidade externa que está presente dentro do componente de ActiveLink que está importado dentro do componente Header
jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      }
    }
  }
});

jest.mock("next-auth/react", () => {
  return {
    useSession() {
      return [null, false]
    }
  }
});

//bloco para colocar os códigos referentes ao componente ActiveLink
describe("Header Component", () => {
  it("renders correctly", () => {
    render(
      <Header />
    );

    screen.logTestingPlaygroundURL();
  
    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Posts")).toBeInTheDocument();
  });
});