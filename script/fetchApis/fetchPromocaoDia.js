import { getCardapio } from "./fetchCardapio.js";

export async function updatePromocaoDia() {
  const cardapio = await getCardapio();

  // Atualize todos os itens para promocaoDia: true
  const updatedCardapio = cardapio.map((categoria) => {
    return {
      ...categoria,
      itens: categoria.itens.map((item) => ({
        ...item,
        promocaoDia: false,
      })),
    };
  });

  // Envie as atualizações para o JSON Server
  for (const categoria of updatedCardapio) {
    await fetch(`http://localhost:3000/cardapio/${categoria.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
  }
}
