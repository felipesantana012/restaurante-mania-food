// import { postCategoria, deletarCategoria } from "./fetchApis/fetchCategoria.js";
// import { postItemACategoria, deletarItem } from "./fetchApis/fetchItens.js";
import {
  getCardapio,
  postCategoria,
  postItemACategoria,
  deletarCategoria,
  deletarItem,
} from "./fetchApis/fetchCardapio.js";

document.addEventListener("DOMContentLoaded", () => {
  window.verificacaoAcessoPagina();

  const categoriaForm = document.getElementById("categoriaForm");
  const itemForm = document.getElementById("itemForm");
  const categoriaSelect = document.querySelectorAll(".categoriaSelect");
  const categoriaSelectEdicao = document.querySelector(
    ".categoriaSelectEdicao"
  );
  const categoriaSelectEnvio = document.querySelector(".categoriaSelectEnvio");
  const cardapioContainer = document.getElementById("cardapioContainer");
  const salvarAlteracoesBtn = document.getElementById("salvarAlteracoesBtn");

  let cardapioData = [];

  const carregarCategorias = async () => {
    try {
      cardapioData = await getCardapio();
      // categoriaSelect.forEach((select) => (select.innerHTML = ""));

      cardapioContainer.innerHTML = "";

      cardapioData.forEach((categoria) => {
        categoriaSelect.forEach((select) => {
          const option = document.createElement("option");
          option.value = categoria.id;
          option.textContent = categoria.categoria;
          select.appendChild(option);
        });
      });

      // Adiciona evento de mudança no select
      categoriaSelectEdicao.addEventListener("change", (event) => {
        const categoriaId = event.target.value;
        if (categoriaId) {
          renderizarCategoria(categoriaId);
        } else {
          cardapioContainer.innerHTML = ""; // Limpa o container se nenhuma categoria for selecionada
        }
      });
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  const renderizarCategoria = (categoriaId) => {
    const categoria = cardapioData.find((cat) => cat.id === categoriaId);
    if (!categoria) return;

    cardapioContainer.innerHTML = "";

    const categoriaContainer = document.createElement("div");
    categoriaContainer.className = "container_categoria-item";

    const categoriaDiv = document.createElement("div");
    categoriaDiv.className = "cardapioContainer-categoria";
    categoriaDiv.innerHTML = `
      <input type="text" value="${categoria.categoria}" class="categoria-nome  input-categoria">
      <button onclick="deleteCategoria('${categoria.id}')" class="btn-deletar deletar-categoria">
        <i class="fa-solid fa-trash"></i>
      </button>
    `;
    categoriaContainer.append(categoriaDiv);

    const itensContainer = document.createElement("div");
    itensContainer.className = "itens-container";
    categoria.itens.forEach((item, itemIndex) => {
      const itemDiv = document.createElement("div");
      itemDiv.className = "cardapioContainer-item";
      itemDiv.innerHTML = `
        <label for="">Nome
          <input type="text" value="${item.nome}" required class="inputs item-nome">
        </label>
  
        <label for="">Preço
          <input type="text" value="${item.precoOriginal}" required class="inputs item-preco">
        </label>
  
        <label for="">Descrição
          <input type="text" value="${item.descricao}" required class="inputs item-descricao">
        </label>
  
        <label for="">Tipo ou Tamanho
          <input type="text" value="${item.tipo}" required class="inputs item-tipo">
        </label>
  
        <label for="">Imagem
          <input type="text" value="${item.img}" required class="inputs item-img">
        </label>
        <button onclick="deletarItem('${categoria.id}', ${item.id})" class="btn-deletar deletar-item">Deletar Item</button>
      `;
      itensContainer.appendChild(itemDiv);
    });
    categoriaContainer.appendChild(itensContainer);
    cardapioContainer.appendChild(categoriaContainer);
  };

  categoriaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoria = {
      categoria: document.getElementById("categoriaInput").value,
      itens: [],
    };
    postCategoria(categoria);
    alert("Categoria adicionada com sucesso!");
    carregarCategorias();
  });

  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoriaId = categoriaSelectEnvio.value;
    console.log("Categoria selecionada:", categoriaId);
    const item = {
      id: Date.now(),
      nome: document.getElementById("nomeInput").value,
      img: document.getElementById("imgInput").value,
      precoOriginal: document.getElementById("precoInput").value,
      descricao: document.getElementById("descricaoInput").value,
      tipo: document.getElementById("tipoInput").value,
    };

    try {
      postItemACategoria(categoriaId, item);
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
    }
  });

  const URL_CARDAPIO = "http://localhost:3000/cardapio";
  salvarAlteracoesBtn.addEventListener("click", async () => {
    const categoriaNomes = document.querySelectorAll(".categoria-nome");
    categoriaNomes.forEach((input) => {
      const catIndex = input.dataset.catIndex;
      cardapioData[catIndex].categoria = input.value;
    });

    const itemNomes = document.querySelectorAll(".item-nome");
    const itemImgs = document.querySelectorAll(".item-img");
    const itemPrecos = document.querySelectorAll(".item-preco");
    const itemDescricoes = document.querySelectorAll(".item-descricao");
    const itemTipos = document.querySelectorAll(".item-tipo");

    itemNomes.forEach((input) => {
      const catIndex = input.dataset.catIndex;
      const itemIndex = input.dataset.itemIndex;
      cardapioData[catIndex].itens[itemIndex].nome = input.value;
    });
    itemImgs.forEach((input) => {
      const catIndex = input.dataset.catIndex;
      const itemIndex = input.dataset.itemIndex;
      cardapioData[catIndex].itens[itemIndex].img = input.value;
    });
    itemPrecos.forEach((input) => {
      const catIndex = input.dataset.catIndex;
      const itemIndex = input.dataset.itemIndex;
      cardapioData[catIndex].itens[itemIndex].precoOriginal = input.value;
    });
    itemDescricoes.forEach((input) => {
      const catIndex = input.dataset.catIndex;
      const itemIndex = input.dataset.itemIndex;
      cardapioData[catIndex].itens[itemIndex].descricao = input.value;
    });
    itemTipos.forEach((input) => {
      const catIndex = input.dataset.catIndex;
      const itemIndex = input.dataset.itemIndex;
      cardapioData[catIndex].itens[itemIndex].tipo = input.value;
    });

    try {
      for (let categoria of cardapioData) {
        await fetch(`${URL_CARDAPIO}/${categoria.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoria),
        });
      }
      alert("Alterações salvas com sucesso!");
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao salvar alterações:", err);
    }
  });

  window.deleteCategoria = async (id) => {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      await deletarCategoria(id);
      if (deletarCategoria) {
        alert("Categoria deletada com sucesso!");
        carregarCategorias();
      }
    }
  };

  window.deletarItem = async (categoriaId, itemId) => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      try {
        await deletarItem(categoriaId, itemId);
        if (deletarItem) {
          alert("Item deletado com sucesso!");
          carregarCategorias();
        }
      } catch (err) {
        console.error("Erro ao deletar item:", err);
      }
    }
  };

  carregarCategorias();
});
