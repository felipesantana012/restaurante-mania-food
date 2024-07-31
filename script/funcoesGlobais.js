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

const converterParaNumero = (valor) => {
  valor = valor.replace(",", ".");
  valor = valor.replace(/[^0-9.]/g, "");
  return parseFloat(valor);
};

const alertDelete = async (deletar, params, text) => {
  try {
    const result = await Swal.fire({
      title: "Tem Certeza?",
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#059e00",
      cancelButtonColor: "#ad0000",
      reverseButtons: true,
      confirmButtonText: "Sim, Deletar!",
      cancelButtonText: "Não, cancelar!",
    });

    if (result.isConfirmed) {
      await deletar(...params); // Usa o spread operator para passar os parâmetros
      await Swal.fire({
        title: "Deletado!",
        text: "Deletado com sucesso",
        icon: "success",
      });

      window.location.reload();
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

const alertSucesso = async (texto) => {
  await Swal.fire({
    title: texto,
    icon: "success",
  });
};

const alertErro = async (texto) => {
  await Swal.fire({
    title: texto,
    icon: "error",
  });
};

window.alertErro = alertErro;
window.alertSucesso = alertSucesso;
window.alertDelete = alertDelete;
window.converterParaNumero = converterParaNumero;
window.visualizarSenha = visualizarSenha;
window.mensagemErro = mensagemErro;
window.sair = sair;
window.verificacaoAcessoPagina = verificacaoAcessoPagina;
