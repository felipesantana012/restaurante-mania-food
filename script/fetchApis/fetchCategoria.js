import { getCardapio, URL_CARDAPIO } from "./fetchCardapio.js";

// // obter as categorias
export const getCategorias = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.map((item) => item.categoria);
  } catch (e) {
    console.error(`Erro ao obter as categorias: ${e}`);
    throw new Error("Ocorreu um problema ao buscar as categorias.");
  }
};

// // Função para obter uma única categoria
const getCategoria = async (categoriaId) => {
  try {
    const cardapio = await getCardapio();
    const categoria = cardapio.find((cat) => cat.id === categoriaId);
    if (!categoria) {
      console.error(`Categoria não encontrada: ${categoriaId}`);
    }
    return categoria;
  } catch (e) {
    throw new Error("Ocorreu um problema ao buscar categoria.");
  }
};

//função para deletar uma nova categoria
export const deletarCategoria = async (id) => {
  try {
    await fetch(`${URL_CARDAPIO}/${id}`, {
      method: "DELETE",
    });
  } catch (e) {
    console.error(`Erro ao deletar categoria: ${e}`);
    throw new Error("Ocorreu um problema ao deletar categoria.");
  }
};

// // Função para adicionar uma nova categoria
export const postCategoria = async (categoria) => {
  try {
    const res = await fetch(URL_CARDAPIO, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
    if (!res.ok) {
      console.error(`Erro ao adicionar categoria: ${res.statusText}`);
    }
    return await res.json();
  } catch (e) {
    console.error(`Erro ao adicionar categoria: ${e}`);
    throw new Error("Ocorreu um problema ao adicionar categoria.");
  }
};

// Função para atualizar categoria
export const putCategoria = async (categoriaId, categoria) => {
  try {
    await fetch(`${URL_CARDAPIO}/${categoriaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
  } catch (e) {
    console.error(`Erro ao Atualizar categoria: ${e}`);
    throw new Error("Ocorreu um problema ao atualizar categoria.");
  }
};
