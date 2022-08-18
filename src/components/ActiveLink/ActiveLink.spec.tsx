/* Primeira forma de escrever o teste unitário de um componente */
// import { render } from "@testing-library/react";
// import { ActiveLink } from ".";

// //simulação de uma funcionalidade externa que está presente dentro do componente de ActiveLink
// jest.mock("next/router", () => {
//   return {
//     useRouter() {
//       return {
//         asPath: "/",
//       }
//     }
//   }
// });


// //bloco para colocar os códigos referentes ao componente ActiveLink
// describe("Active Link Component", () => {
//   it("renders correctly", () => {
//     const { getByText } = render(
//       <ActiveLink href="/" activeClassName="active">
//         <a>Home</a>
//       </ActiveLink>
//     );
  
//     expect(getByText("Home")).toBeInTheDocument();
//   });
  
//   it("adds active class if the link as currently active", () => {
//     const { getByText } = render(
//       <ActiveLink href="/" activeClassName="active">
//         <a>Home</a>
//       </ActiveLink>
//     );
  
//     expect(getByText("Home")).toHaveClass("active");
//   });
// });

/* Segunda forma de escrever o teste unitário de um componente */
import { render, screen } from "@testing-library/react";
import { ActiveLink } from ".";

//simulação de uma funcionalidade externa que está presente dentro do componente de ActiveLink
jest.mock("next/router", () => {
  return {
    useRouter() {
      return {
        asPath: "/",
      }
    }
  }
});


//bloco para colocar os códigos referentes ao componente ActiveLink
describe("Active Link Component", () => {
  it("renders correctly", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );
  
    expect(screen.getByText("Home")).toBeInTheDocument();
  });
  
  it("adds active class if the link as currently active", () => {
    render(
      <ActiveLink href="/" activeClassName="active">
        <a>Home</a>
      </ActiveLink>
    );
  
    expect(screen.getByText("Home")).toHaveClass("active");
  });
});