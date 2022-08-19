import { render, screen } from "@testing-library/react";
import { stripe } from "../../services/stripe";
import Home, { getStaticProps } from "../../pages";

jest.mock("next-auth/react", () => {
  return {
    useSession: () => [null, false]
  }
});

jest.mock("../../services/stripe");

describe("Home page", () => {
  it("renders correctly", () => {
    render(<Home product={{ priceId: "fake-price-id", amount: "R$ 10,00" }} />);

    expect(screen.getByText("for R$ 10,00 month")).toBeInTheDocument();
  });

  it("loads initial data", async () => {
    const retrieveStripePricesMocked = jest.mocked(stripe.prices.retrieve);

    //sempre que a função for uma Promise utiliza a função de teste mockResolvedValueOnce()
    retrieveStripePricesMocked.mockResolvedValueOnce({
      id: "fake-price-id",
      unit_amount: 1000,
    } as any);

    //chamando a função getStaticProps() que retorna um objeto
    const response = await getStaticProps({});

    //espera informações contidas dentro do objeto da resposta (verifica se contém as informações que estão sendo passadas devido o uso do objectContaining() e não se ela é estritamente igual)
    //se tiver qualquer outra informação dentro desse objeto o teste vai continuar passando
    expect(response).toEqual(
      expect.objectContaining({
        props: {
          product: {
            priceId: "fake-price-id",
            amount: "$10.00"
          }
        }
      })
    )
  });

  //dessa forma iria verificar se o objeto é exatamente igual a isso e se tivesse alguma informação a mais do que isso o teste iria falhar devido a função toEqual()
  // expect(response).toEqual({
  //   props: {
  //     product: {
  //       priceId: "fake-price-id",
  //       amount: "$10.00"
  //     }
  //   }
  // })});
})