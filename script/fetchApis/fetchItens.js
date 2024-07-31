import { getCardapio, URL_CARDAPIO } from "./fetchCardapio.js";
import { putCategoria } from "./fetchCategoria.js";

// // Função para obter todos os itens juntos em um array
export const getItensAll = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.flatMap((item) => item.itens);
  } catch (e) {
    console.error("Erro ao obter todos os itens:", e);
    throw new Error("Ocorreu um problema ao obter todos os itens.");
  }
};

// // Função para obter os arrays de itens por categoria
export const getItens = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.map((item) => item.itens);
  } catch (e) {
    console.error("Erro ao obter itens:", e);
    throw new Error("Ocorreu um problema ao obter itens.");
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
    const categoriaIndex = cardapio.findIndex(
      (cat) => cat._id.toString() === categoriaId.toString()
    );
    if (categoriaIndex === -1) {
      console.error(`Categoria não encontrada: ${categoriaId}`);
      return;
    }
    // Adiciona o novo item à categoria encontrada
    cardapio[categoriaIndex].itens.push(item);

    // Atualizar a categoria específica
    const res = await fetch(`${URL_CARDAPIO}/${categoriaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardapio[categoriaIndex]),
    });
    if (!res.ok) {
      const errorMessage = await res.text(); // Captura a mensagem de erro do backend
      console.error(
        `Erro ao adicionar item: ${res.statusText} - ${errorMessage}`
      );
      return;
    }
    return await res.json();
  } catch (e) {
    console.error("Erro ao adicionar item:", e);
    throw new Error("Ocorreu um problema ao adicionar item.");
  }
};

// // Função para deletar um item de uma categoria
export const deletarItem = async (categoriaId, itemId) => {
  try {
    const response = await fetch(`${URL_CARDAPIO}/${categoriaId}`);
    const categoria = await response.json();
    categoria.itens = categoria.itens.filter(
      (i) => i._id.toString() !== itemId.toString()
    );
    await putCategoria(categoriaId, categoria);
    return true;
  } catch (e) {
    console.error("Erro ao deletar item:", e);
    throw new Error("Ocorreu um problema ao deletar item");
  }
};
