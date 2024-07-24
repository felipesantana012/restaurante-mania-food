export const URL_CARDAPIO = "http://localhost:3000/cardapio";

// Função para buscar o cardápio
export const getCardapio = async () => {
  try {
    const res = await fetch(URL_CARDAPIO);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    return await res.json();
  } catch (error) {
    console.error("Erro ao buscar o cardápio:", error);
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
      throw new Error(`Erro ao atualizar o cardápio: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Erro ao atualizar cardápio:", err);
    throw err;
  }
};
