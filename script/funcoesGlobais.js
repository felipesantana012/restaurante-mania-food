export const mensagemError = (mensagem) => {
  const mensagemDiv = document.getElementById("mensagem");
  mensagemDiv.textContent = mensagem;
  setTimeout(() => {
    mensagemDiv.textContent = "";
  }, 4000);
};
