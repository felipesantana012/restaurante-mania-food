import { getCardapio, URL_CARDAPIO } from "./fetchCardapio.js";
import { putCategoria } from "./fetchCategoria.js";

// // Função para obter todos os itens juntos em um array
export const getItensAll = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.flatMap((item) => item.itens);
  } catch (error) {
    console.error("Erro ao obter itens:", error);
  }
};

// // Função para obter os arrays de itens por categoria
export const getItens = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.map((item) => item.itens);
  } catch (error) {
    console.error("Erro ao obter itens:", error);
  }
};

// // Função para adicionar um item a uma categoria
export const postItemACategoria = async (categoriaId, item) => {
  if (!categoriaId) {
    console.error("Categoria não selecionada");
    return;
  }
  try {
    const cardapio = await getCardapio();
    const categoriaIndex = cardapio.findIndex((cat) => cat.id === categoriaId);
    if (categoriaIndex === -1) {
      throw new Error(`Categoria não encontrada: ${categoriaId}`);
    }
    cardapio[categoriaIndex].itens.push(item);

    // Atualizar a categoria específica
    const res = await fetch(`${URL_CARDAPIO}/${categoriaId}`, {
      method: "PUT", // Ou PATCH, se necessário
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardapio[categoriaIndex]),
    });
    if (!res.ok) {
      throw new Error(`Erro ao adicionar item: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Erro ao adicionar item:", err);
  }
};

export const deletarItem = async (categoriaId, itemId) => {
  try {
    const response = await fetch(`${URL_CARDAPIO}/${categoriaId}`);
    const categoria = await response.json();
    categoria.itens = categoria.itens.filter((i) => i.id !== itemId);
    await putCategoria(categoriaId, categoria);
    return true;
  } catch (err) {
    console.error("Erro ao deletar item:", err);
  }
};
