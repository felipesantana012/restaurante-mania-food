import { getCardapio } from "./fetchCardapio.js";
import { URL_CARDAPIO } from "./fetchCardapio.js";

export async function updatePromocaoDia() {
  const cardapio = await getCardapio();

  // Atualize todos os itens para promocaoDia: false
  const updatedCardapio = cardapio.map((categoria) => {
    return {
      ...categoria,
      itens: categoria.itens.map((item) => ({
        ...item,
        promocaoDia: false,
      })),
    };
  });

  for (const categoria of updatedCardapio) {
    await fetch(`${URL_CARDAPIO}/${categoria._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
  }
}
