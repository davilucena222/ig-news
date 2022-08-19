import { render, screen, waitFor, waitForElementToBeRemoved } from "@testing-library/react";
import { Async } from ".";

test("it renders correctly", async () => {
  render(<Async />);

  /* FUNÇÕES FIND AND GET */
  expect(screen.getByText("Hello World")).toBeInTheDocument();

  //função que é uma Promise devido esperar o botão aparecer em tela (demora alguns segundos a mais para executar devido a função ser assíncrona e o componente possui um bloco de código assíncrono)
  //o jest também possui uma propriedade timout que é utilizada para informar quando tempo a função de teste deve esperar para algo aparecer em tela
  expect(await screen.findByText("Button")).toBeInTheDocument();

  /* FUNÇÃO WAIT FOR */

  //função que será executada várias vezes até que o expect passe pelo teste
  //waitFor() -> espera qualquer coisa aparecer em tela, não necessariamente precisa ser um componente
  //não precisa mais usar a função findByText devido a função waitFor realizar o que ela fazia antes
  //por padrão o timeout da função é abaixo de 1 segundo
  await waitFor(() => {
    return expect(screen.getByText("Button")).toBeInTheDocument();
  });

  //verificando se algo não está em tela (se o botão estiver invisível passa pelo teste)
  await waitFor(() => {
    return expect(screen.queryByText("Button")).not.toBeInTheDocument();
  });

  //configurando o timeout da função (quanto tempo ela deve esperar para algo aparecer em tela e executar o teste)
  // await waitFor(() => {
  //   expect(screen.getByText("Button")).toBeInTheDocument();
  // }, {
  //   timeout: 9000,
  // });

  //configurando o interval da função (de quanto em quanto tempo a função vai ficar executando para confirmar se o esperado apareceu em tela)
  // await waitFor(() => {
  //   expect(screen.getByText("Button")).toBeInTheDocument();
  // }, {
  //   interval: 9000,
  // });

  /* FUNÇÃO WAIT FOR ELEMENT TO BE REMOVED */
  //a diferença da função queryByText para a função getByText é que se nada for retornado ela não vai dar erro (a função queryByText)
  // await waitForElementToBeRemoved(screen.queryByText("Button"));
}); 

/* 3 TIPOS DE MÉTODOS QUE SÃO IMPORTADOS DE DENTRO DO SCREEN */
//get => Os que começam com get vão procurar um elemento de forma assíncrona, ou seja, se ele não estiver em tela no momento em que esse código executar ele não vai aguardar esperar e caso o elemento não seja encontrado ele vai dar erro
//query => Os que começam com query vão procurar o elemento e se não encontrar ele não vai dar erro, mas ele procura de forma assíncrona também
//find => Os que começam com find vão procurar e se o elemento não existir ele vai ficar observando se esse elemento em algum momento vai aparecer em tela e se ele não for encontrado vai dar erro
