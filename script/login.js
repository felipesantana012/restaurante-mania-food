const urlUsuario = "http://localhost:3000/usuario";

document
  .getElementById("loginForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // Impede o envio do formulário

    const nome = document.getElementById("nome").value;
    const senha = document.getElementById("senha").value;

    try {
      const response = await fetch(urlUsuario);
      const data = await response.json();

      if (data) {
        const usuario = data.find(
          (user) => user.nome === nome && user.senha === senha
        );

        if (usuario) {
          let agora = new Date();
          let expiraEm = new Date(agora.getTime() + 12 * 60 * 60 * 1000); //12 horas para expirar o token
          let token =
            Math.random().toString(16).substring(2) +
            Math.random().toString(16).substring(2);
          localStorage.setItem("token", token);
          localStorage.setItem("expiraEm", expiraEm.toISOString());
          window.location.href = "home.html";
        } else {
          mensagemError("Usuário ou senha inválidos");
        }
      }
    } catch (error) {
      console.error("Erro ao verificar usuário:", error);
      mensagemError("Erro ao verificar usuário. Tente novamente mais tarde.");
    }
  });

const mensagemError = (mensagem) => {
  const mensagemDiv = document.getElementById("mensagem");
  mensagemDiv.textContent = mensagem;
  setTimeout(() => {
    mensagemDiv.textContent = "";
  }, 4000);
};
