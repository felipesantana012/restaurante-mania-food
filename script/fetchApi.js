const URL_USUARIO = "http://localhost:3000/usuario";

export const fetchUsuario = async () => {
  try {
    const response = await fetch(URL_USUARIO);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Erro ao verificar usuário:", error);
  }
};
