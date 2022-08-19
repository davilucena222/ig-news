import { render, screen, fireEvent } from "@testing-library/react";
import { SubscribeButton } from ".";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";
// import { useSession } from "next-auth/react";

//mockando bibliotecas de funções utilizadas nos testes
jest.mock("next-auth/react");
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

describe("SubscribeButton Component", () => {
  /* TESTE PARA VERIFICAR SE O COMPONENTE FOI RENDERIZADO DE FORMA GERAL */
  it("renders correctly", () => {
    //mockando o useSession()
    const useSessionMocked = jest.mocked(useSession);

    //preenchendo o session que será retornando do useSession() com informações nulas do usuário, pois ele não está logado
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    //renderizando o componente
    render(<SubscribeButton />);
    
    //esperando que a string "Subscribe now" esteja no componente SubscribeButton
    expect(screen.getByText("Subscribe now")).toBeInTheDocument();
  });

  /* TESTE COM FUNÇÃO NATIVA DO PRÓPRIO NEXT */
  it("redirects user to sign in when not authenticated", () => {
    //mockando a função nativa signIn() do próprio next
    const signInMocked = jest.mocked(signIn); 

    //mockando o useSession()
    const useSessionMocked = jest.mocked(useSession);
    
    //preenchendo o session que será retornando do useSession() com informações nulas do usuário, pois ele não está logado
    useSessionMocked.mockReturnValueOnce({
      data: null,
      status: "unauthenticated",
    });

    //renderizando o componente
    render(<SubscribeButton />);

    //captura o texto e ao mesmo tempo retorna o elemento button
    const subscribeButton = screen.getByText("Subscribe now");

    //simulando o clique no botão
    fireEvent.click(subscribeButton);

    //verificando se a função de signIn() foi chamada após o evento de clique
    expect(signInMocked).toHaveBeenCalled();
  });

  /* TESTE COM HOOK QUE RETORNA UMA FUNÇÃO DE DENTRO DELE */
  it("redirects to posts when user already has a subscription", () => {
    //mockando a função useSession()
    const useSessionMocked = jest.mocked(useSession);

    const useRouterMocked = jest.mocked(useRouter); //"mockando" o useRouter porque a função push está dentro dela

    //declara a função push do useRouter
    const pushMock = jest.fn();

    //preenche o session com os dados de simulação de usuário autenticado que será retornando ao session do useSession()
    useSessionMocked.mockReturnValueOnce({
      data: {
        user: {
          name: "John Doe",
          email: "johndoe@example.com",
        },
        activeSubscription: "fake-active-subscription",
        expires: "fake-expires",
      },
      status: "authenticated",
    });

    useRouterMocked.mockReturnValueOnce({
      push: pushMock, //espiando se a função push de useRouter foi chamada
    } as never); //"as never" apenas para sinalizar que o retorno da função cumpre todos os requisitos de retorno e uso da useRouter()
    
    render(<SubscribeButton />); //renderiza o componente

    const subscribeButton = screen.getByText("Subscribe now"); //captura o texto e ao mesmo tempo o botão

    fireEvent.click(subscribeButton); //simula o clique no botão

    expect(pushMock).toHaveBeenCalledWith("/posts"); //espera que a função push tenha sido chamada com o parâmetro posts
  });
});