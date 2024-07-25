import { getCardapio, putCardapio } from "./fetchApis/fetchCardapio.js";
import { postCategoria, deletarCategoria } from "./fetchApis/fetchCategoria.js";
import { deletarItem, postItemACategoria } from "./fetchApis/fetchItens.js";

import { updatePromocaoDia } from "./fetchApis/fetchPromocaoDia.js";

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

  let cardapioData = [];

  const carregarCategorias = async () => {
    try {
      cardapioData = await getCardapio();
      cardapioContainer.innerHTML = "";

      cardapioData.forEach((categoria) => {
        categoriaSelect.forEach((select) => {
          const option = document.createElement("option");
          option.value = categoria.id;
          option.textContent = categoria.categoria;
          select.appendChild(option);
        });
      });

      categoriaSelectEdicao.addEventListener("change", (event) => {
        const categoriaId = event.target.value;
        if (categoriaId) {
          renderizarCategoria(categoriaId);
        } else {
          cardapioContainer.innerHTML = "";
        }
      });
    } catch (e) {
      console.error("Error: ", e);
      alert(e.message);
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
          <input type="text" value="${
            item.nome
          }" required class="inputs item-nome">
        </label>
  
        <label for="">Preço
          <input type="text" value="${
            item.precoOriginal
          }" required class="inputs item-preco">
        </label>
  
        <label for="">Descrição
          <input type="text" value="${
            item.descricao
          }" required class="inputs item-descricao">
        </label>
  
        <label for="">Tipo ou Tamanho
          <input type="text" value="${
            item.tipo
          }" required class="inputs item-tipo">
        </label>
  
        <label for="">Imagem
          <input type="text" value="${
            item.img
          }" required class="inputs item-img">
        </label>
        
        <button onclick="deleteItem('${categoria.id}', ${
        item.id
      })" class="btn-deletar deletar-item" data-id="${
        item.id
      }">Deletar Item</button>
       
  
      <div class="btn-radio-promocaoDia">
      
      <div class="wrap-check-29">
          <div class="cbx">
              <input type="radio" name="promocaoDia" id="radio-${
                item.id
              } cbx-29" class="item-radio" data-id="${item.id}" ${
        item.promocaoDia ? "checked" : ""
      } />
              <label for="cbx-29"></label>
              <svg width="15" height="14" viewbox="0 0 15 14" fill="none">
                  <path d="M2 8.36364L6.23077 12L13 2"></path>
              </svg>
          </div>
      </div>
      <p>Promoção do dia<p/>
    </div>

    
      `;
      itensContainer.appendChild(itemDiv);
    });
    categoriaContainer.appendChild(itensContainer);
    const btn = document.createElement("div");
    btn.className = "item_btn-salvarAlteracoes";
    btn.innerHTML = `<button onclick="atualizarCategoria('${categoria.id}')" class="btn-salvarAlteracoes">Salvar Alterações</button>`;
    categoriaContainer.appendChild(btn);
    cardapioContainer.appendChild(categoriaContainer);
  };

  categoriaForm.addEventListener("submit", async (event) => {
    event.preventDefault();
    const categoria = {
      categoria: document.getElementById("categoriaInput").value,
      itens: [],
    };

    try {
      await postCategoria(categoria);
      alert("Categoria adicionado com sucesso");
    } catch (e) {
      console.error("Error: ", e);
      alert(e.message);
    }
  });

  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoriaId = categoriaSelectEnvio.value;
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
      alert("Item Adicionado com sucesso");
    } catch (e) {
      console.error("Error: ", e);
      alert(e.message);
    }
  });

  window.atualizarCategoria = async (categoriaId) => {
    const categoria = cardapioData.find((cat) => cat.id === categoriaId);
    if (!categoria) return;
    try {
      await updatePromocaoDia();
    } catch (e) {
      console.error("Erro ao atualizar Promoção do dia dos itens:", e);
    }

    const nomeCategoria = document.querySelector(".categoria-nome").value;

    const itensAtualizados = Array.from(
      document.querySelectorAll(".cardapioContainer-item")
    ).map((itemDiv) => {
      const id = itemDiv.querySelector(".btn-deletar").getAttribute("data-id");
      const promocaoDia = itemDiv.querySelector(".item-radio").checked;

      return {
        id: Number(id),
        nome: itemDiv.querySelector(".item-nome").value,
        precoOriginal: itemDiv.querySelector(".item-preco").value,
        descricao: itemDiv.querySelector(".item-descricao").value,
        tipo: itemDiv.querySelector(".item-tipo").value,
        img: itemDiv.querySelector(".item-img").value,
        promocaoDia: promocaoDia,
      };
    });

    const categoriaAtualizada = {
      id: categoria.id,
      categoria: nomeCategoria,
      itens: itensAtualizados,
    };

    try {
      await putCardapio(categoriaAtualizada);
      alert("Categoria atualizada com sucesso!");
      console.log(
        "Item atualizado com promoção do dia:",
        itensAtualizados.find((item) => item.promocaoDia)
      );
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
    }
  };

  window.deleteCategoria = async (id) => {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        await deletarCategoria(id);
        alert("Categoria deletada com sucesso!");
      } catch (e) {
        console.error("Error :", e);
        alert(e.message);
      }
    }
  };

  window.deleteItem = async (categoriaId, itemId) => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      try {
        await deletarItem(categoriaId, itemId);
        alert("Item deletado com sucesso!");
      } catch (err) {
        console.error("Error :", e);
        alert(e.message);
      }
    }
  };
  carregarCategorias();
});
