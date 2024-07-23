const mensagemErro = (mensagem) => {
  const mensagemDiv = document.getElementById("mensagem");
  mensagemDiv.textContent = mensagem;
  setTimeout(() => {
    mensagemDiv.textContent = "";
  }, 4000);
};

const sair = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("expiraEm");
  window.location.href = "/";
};

const verificacaoAcessoPagina = () => {
  let token = localStorage.getItem("token");
  let expiraEm = new Date(localStorage.getItem("expiraEm"));
  let agora = new Date();
  if (token == null || agora > expiraEm) {
    alert("Seção expirada, Voce Precisa logar novamente para acessar a pagina");
    window.location.href = "/";
  }
};

const visualizarSenha = () => {
  const senha = document.getElementById("senha");
  const toggleIcone = document.querySelector(".senha__input-icone i");
  senha.type = senha.type === "password" ? "text" : "password";
  toggleIcone.classList.toggle("fa-eye");
  toggleIcone.classList.toggle("fa-eye-slash");
};

window.visualizarSenha = visualizarSenha;
window.mensagemErro = mensagemErro;
window.sair = sair;
window.verificacaoAcessoPagina = verificacaoAcessoPagina;
