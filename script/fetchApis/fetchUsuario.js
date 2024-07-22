const URL_USUARIO = "http://localhost:3000/usuario";

export const getUsuario = async () => {
  try {
    const response = await fetch(URL_USUARIO);
    const data = await response.json();
    return data;
  } catch (error) {
    throw new Error("Erro ao verificar usuário: " + error.message);
  }
};
