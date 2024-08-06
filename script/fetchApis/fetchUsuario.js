import { url } from "./url.js";
const URL_USUARIO = `${url}/usuario`;

export const getUsuario = async () => {
  try {
    const response = await fetch(URL_USUARIO);
    const data = await response.json();
    const user = data[0];
    return user;
  } catch (e) {
    throw new Error("Erro ao verificar usuário: " + e.message);
  }
};

export const putUsuario = async (usuarioAtualizado) => {
  try {
    const response = await fetch(`${URL_USUARIO}/${usuarioAtualizado._id}`, {
      // Inclua o ID na URL
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(usuarioAtualizado),
    });
    if (!response.ok) {
      throw new Error(`Erro ao atualizar usuário: ${response.statusText}`);
    }
  } catch (e) {
    console.error(`Erro ao atualizar usuário: ${e}`);
    throw new Error("Ocorreu um problema ao atualizar os dados!");
  }
};
