import { url } from "./url.js";

export const uploadImage = async (file) => {
  const formData = new FormData();
  formData.append("imgInput", file);

  const response = await fetch(`${url}/uploads`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Erro ao fazer upload da imagem");
  }

  const result = await response.json();
  return result.imgPath;
};

export const deleteImage = async (filename) => {
  const response = await fetch(`${url}/uploads/${filename}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Erro ao deletar a imagem");
  }

  const result = await response.json();
  return result.mensagem;
};
