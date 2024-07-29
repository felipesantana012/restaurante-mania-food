import { url } from "./url.js";
const URL_USUARIO = `${url}usuario`;

export const getUsuario = async () => {
  try {
    const response = await fetch(URL_USUARIO);
    const data = await response.json();
    return data;
  } catch (e) {
    throw new Error("Erro ao verificar usuário: " + e.message);
  }
};

export const putUsuario = async (usuarioAtualizado) => {
  try {
    await fetch(`${URL_USUARIO}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioAtualizado),
    });
  } catch (e) {
    console.error(`Erro ao atualizar usuário: ${e}`);
    throw new Error("Ocorreu um problema ao atualizar os dados!");
  }
};
