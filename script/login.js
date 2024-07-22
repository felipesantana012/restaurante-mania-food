import { fetchUsuario } from "./fetchApi.js";
import { mensagemError } from "./funcoesGlobais.js";

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;

    try {
      const data = await fetchUsuario();
      if (data) {
        const usuario = data.nome === nome && data.senha === senha;

        if (usuario) {
          let agora = new Date();
          let expiraEm = new Date(agora.getTime() + 12 * 60 * 60 * 1000); //12 horas para expirar o token
          let token =
            Math.random().toString(16).substring(2) +
            Math.random().toString(16).substring(2);
          localStorage.setItem("token", token);
          localStorage.setItem("expiraEm", expiraEm.toISOString());
          window.location.href = "paginas/home.html";
        } else {
          mensagemError("Usuário ou senha inválidos");
        }
      }
    } catch (error) {
      mensagemError("Erro ao verificar usuário. Tente novamente mais tarde.");
    }
  });
