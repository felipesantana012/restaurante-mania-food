const URL_CARDAPIO = "http://localhost:3000/cardapio";

// Função para buscar o cardápio
export const getCardapio = async () => {
  try {
    const res = await fetch(URL_CARDAPIO);
    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }
    const resJson = await res.json();
    return resJson;
  } catch (error) {
    console.error("Erro ao buscar o cardápio:", error);
  }
};

// obter as categorias
export const getCategorias = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.map((item) => item.categoria);
  } catch (error) {
    console.error("Erro ao obter categorias:", error);
  }
};

// Função para obter todos os itens juntos
export const getItensAll = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.flatMap((item) => item.itens);
  } catch (error) {
    console.error("Erro ao obter itens:", error);
  }
};

// Função para obter os itens por categoria
export const getItens = async () => {
  try {
    const cardapio = await getCardapio();
    return cardapio.map((item) => item.itens);
  } catch (error) {
    console.error("Erro ao obter itens:", error);
  }
};

// Função para obter uma única categoria
const getCategoria = async (categoriaId) => {
  try {
    const cardapio = await getCardapio();
    const categoria = cardapio.find((cat) => cat.id === categoriaId);
    if (!categoria) {
      throw new Error(`Categoria não encontrada: ${categoriaId}`);
    }
    return categoria;
  } catch (err) {
    console.error("Erro ao buscar categoria:", err);
    throw err;
  }
};

export const deletarCategoria = async (id) => {
  try {
    await fetch(`http://localhost:3000/cardapio/${id}`, {
      method: "DELETE",
    });
  } catch (err) {
    console.error("Erro ao deletar categoria:", err);
  }
};

// Função para atualizar o cardápio completo
const putCardapio = async (novoCardapio) => {
  try {
    const res = await fetch(URL_CARDAPIO, {
      method: "PATCH", // Ou outro método suportado, se necessário
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

// Função para adicionar uma nova categoria
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
      throw new Error(`Erro ao adicionar categoria: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.error("Erro ao adicionar categoria:", err);
  }
};

// Função para adicionar um item a uma categoria
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

const putCategoria = async (categoriaId, categoria) => {
  try {
    await fetch(`${URL_CARDAPIO}/${categoriaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(categoria),
    });
  } catch (e) {
    console.error("Erro ao atualizar categoria:", e);
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
