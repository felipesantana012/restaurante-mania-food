import { url } from "./url.js";
export const URL_CARDAPIO = `${url}cardapio`;

// Função para buscar o cardápio
export const getCardapio = async () => {
  try {
    const res = await fetch(URL_CARDAPIO);
    if (!res.ok) {
      console.error(`HTTP Error! status: ${res.status}`);
    }
    const cardapio = await res.json();
    return cardapio;
  } catch (e) {
    console.error("Erro ao buscar o cardápio:", e);
    throw new Error("Ocorreu um problema ao buscar o cardápio.");
  }
};

// Função para atualizar o cardápio completo
export const putCardapio = async (novoCardapio) => {
  try {
    const res = await fetch(`${URL_CARDAPIO}/${novoCardapio.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(novoCardapio),
    });
    if (!res.ok) {
      console.error(`HTTP Error! status: ${res.status}`);
    }
    return await res.json();
  } catch (e) {
    console.error("Erro ao atualizar cardápio:", e);
    throw new Error("Ocorreu um problema ao atualizar o cardápio.");
  }
};
