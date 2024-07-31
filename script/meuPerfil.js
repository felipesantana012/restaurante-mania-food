import { getUsuario, putUsuario } from "./fetchApis/fetchUsuario.js";

const validarInputs = (campos, nomeSecao = "") => {
  for (let campo of campos) {
    if (campo.length < 3 || campo == "") {
      window.alertErro(
        `Os campos de ${nomeSecao} devem ser preenchidos corretamente`
      );
      return true;
    }
  }
  return false;
};

const salvarLogin = async () => {
  const nome = document.getElementById("nome").value;
  const senha = document.getElementById("senha").value;
  if (validarInputs([nome, senha], "Login ADM")) {
    return;
  }
  try {
    const usuarioAtual = await getUsuario();
    const usuarioAtualizado = {
      ...usuarioAtual,
      login: {
        ...usuarioAtual.login,
        ...(nome !== usuarioAtual.login.nome && { nome }),
        ...(senha !== usuarioAtual.login.senha && { senha }),
      },
    };
    await putUsuario(usuarioAtualizado);
    window.alertSucesso("Dados de Login Salvos com sucesso");
  } catch (e) {
    console.error("Erro ao salvar login:", e);
    window.alertErro("Error Login ADM: ", e.message);
  }
};
const salvarEndereco = async () => {
  const rua = document.getElementById("rua").value;
  const bairro = document.getElementById("bairro").value;
  const cidade = document.getElementById("cidade").value;
  const fotoLocal = document.getElementById("fotoLocal").value;
  const linkMaps = document.getElementById("linkMaps").value;
  if (validarInputs([rua, bairro, cidade, fotoLocal, linkMaps], "Endereco")) {
    return;
  }
  try {
    const usuarioAtual = await getUsuario();
    const usuarioAtualizado = {
      ...usuarioAtual,
      endereco: {
        ...usuarioAtual.endereco,
        ...(rua !== usuarioAtual.endereco.rua && { rua }),
        ...(bairro !== usuarioAtual.endereco.bairro && { bairro }),
        ...(cidade !== usuarioAtual.endereco.cidade && { cidade }),
        ...(fotoLocal !== usuarioAtual.endereco.fotoLocal && { fotoLocal }),
        ...(linkMaps !== usuarioAtual.endereco.linkMaps && { linkMaps }),
      },
    };
    await putUsuario(usuarioAtualizado);
    window.alertSucesso("Dados de Endereco salvos com sucesso");
  } catch (e) {
    window.alertErro("Error Endereco: ", e.message);
  }
};

const salvarRedesSociais = async () => {
  const facebook = document.getElementById("facebook").value;
  const instagram = document.getElementById("instagram").value;
  const whatsapp = document.getElementById("whatsapp").value;
  const tiktok = document.getElementById("tiktok").value;
  if (validarInputs([whatsapp], "Whatsapp")) {
    return;
  }
  try {
    const usuarioAtual = await getUsuario();

    const usuarioAtualizado = {
      ...usuarioAtual,
      redeSociais: {
        ...usuarioAtual.redeSociais,
        ...(facebook !== usuarioAtual.redeSociais.facebook && { facebook }),
        ...(instagram !== usuarioAtual.redeSociais.instagram && { instagram }),
        ...(whatsapp !== usuarioAtual.redeSociais.whatsapp && { whatsapp }),
        ...(tiktok !== usuarioAtual.redeSociais.tiktok && { tiktok }),
      },
    };
    await putUsuario(usuarioAtualizado, usuarioAtual._id);
    window.alertSucesso("Dados de Rede Sociais salvos com sucesso");
  } catch (e) {
    window.alertErro("Error Rede Sociais: ", e.message);
  }
};

document.addEventListener("DOMContentLoaded", async () => {
  window.verificacaoAcessoPagina();

  try {
    const user = await getUsuario();

    //dados login
    document.getElementById("nome").value = user.login.nome;
    document.getElementById("senha").value = user.login.senha;

    //dados endereco
    document.getElementById("rua").value = user.endereco.rua;
    document.getElementById("bairro").value = user.endereco.bairro;
    document.getElementById("cidade").value = user.endereco.cidade;
    document.getElementById("fotoLocal").value = user.endereco.fotoLocal;
    document.getElementById("linkMaps").value = user.endereco.linkMaps;

    //dados redeSociais
    document.getElementById("facebook").value = user.redeSociais.facebook;
    document.getElementById("instagram").value = user.redeSociais.instagram;
    document.getElementById("whatsapp").value = user.redeSociais.whatsapp;
    document.getElementById("tiktok").value = user.redeSociais.tiktok;
  } catch (error) {
    console.error("Erro ao carregar dados do usuário:", error);
    window.alertErro("Erro ao carregar dados do usuário");
  }

  const btnSalvarDadosLogin = document.getElementById("salvarDadosLogin");
  btnSalvarDadosLogin.addEventListener("click", async () => {
    await salvarLogin();
  });

  const btnSalvarDadosEndereco = document.getElementById("salvarDadosEndereco");
  btnSalvarDadosEndereco.addEventListener("click", async () => {
    await salvarEndereco();
  });

  const btnSalvarDadosRedes = document.getElementById("salvarDadosRedeSociais");
  btnSalvarDadosRedes.addEventListener("click", async () => {
    await salvarRedesSociais();
  });
});
