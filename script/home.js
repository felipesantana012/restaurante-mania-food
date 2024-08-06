import { getCardapio, putCardapio } from "./fetchApis/fetchCardapio.js";
import { postCategoria, deletarCategoria } from "./fetchApis/fetchCategoria.js";
import { deletarItem, postItemACategoria } from "./fetchApis/fetchItens.js";
import { url } from "./fetchApis/url.js";
import { updatePromocaoDia } from "./fetchApis/fetchPromocaoDia.js";
import { uploadImage } from "./fetchApis/fetchImgs.js";

document.addEventListener("DOMContentLoaded", () => {
  window.verificacaoAcessoPagina();
  window.boasVindas();
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
          option.value = categoria._id;
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
    }
  };

  const renderizarCategoria = (categoriaId) => {
    const categoria = cardapioData.find((cat) => cat._id === categoriaId);

    if (!categoria) return;

    cardapioContainer.innerHTML = "";

    const categoriaContainer = document.createElement("div");
    categoriaContainer.className = "container_categoria-item";

    const categoriaDiv = document.createElement("div");
    categoriaDiv.className = "cardapioContainer-categoria";
    categoriaDiv.innerHTML = `
      <input type="text" value="${
        categoria.categoria
      }" class="categoria-nome  input-categoria">
      <button onclick="deleteCategoria('${categoria._id.toString()}')" class="btn-deletar deletar-categoria">
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

      <div class="listaInputs">
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

        <label for="">Tipo ou Tamanho
        <input type="text" value="${
          item.tipo
        }" required class="inputs item-tipo">
        </label>
      
      

        <label for="">Descrição
        <input type="text" value="${
          item.descricao
        }" required class="inputs item-descricao">
        </label>
        

     
        <div class="btn-radio-promocaoDia">
      
        <div class="wrap-check-29">
          <div class="cbx">
              <input type="radio" name="promocaoDia" id="cbx-29" class="item-radio" data-id="${item._id.toString()} "  ${
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
      
    </div>
  
    <div class="imagem-item-cardapio">

      <img src="${url}${item.img}" alt="${url}${item.img}"
      required class="imagem-item" data-img="${item.img}" >
      <button onclick="deleteItem('${categoria._id.toString()}', '${item._id.toString()}', '${
        item.img
      }')" class="btn-deletar deletar-item" data-id="${item._id.toString()}">Deletar Item</button>
   
</div>
  
    
      `;
      itensContainer.appendChild(itemDiv);
    });
    categoriaContainer.appendChild(itensContainer);
    const btn = document.createElement("div");
    btn.className = "item_btn-salvarAlteracoes";
    btn.innerHTML = `<button onclick="atualizarCategoria('${categoria._id}')" class="btn-salvarAlteracoes">Salvar Alterações</button>`;
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
      await alertSucesso("Categoria adicionada com sucesso");
      window.location.reload();
    } catch (e) {
      console.error("Error: ", e);
      alertErro(e.message);
    }
  });

  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const categoriaId = document.querySelector(".categoriaSelectEnvio").value;
    const nome = document.getElementById("nomeInput").value;
    const precoOriginal = window.converterParaNumero(
      document.getElementById("precoInput").value
    );
    const descricao = document.getElementById("descricaoInput").value;
    const tipo = document.getElementById("tipoInput").value;
    const promocaoDia = false;

    const imgInput = document.getElementById("imgInput");
    const file = imgInput.files[0];

    try {
      let imgPath = "";
      if (file) {
        imgPath = await uploadImage(file);
      }

      const item = {
        categoria: categoriaId,
        nome,
        img: imgPath,
        precoOriginal,
        descricao,
        tipo,
        promocaoDia,
      };

      await postItemACategoria(categoriaId, item);
      await alertSucesso("Item Adicionado com sucesso");
      window.location.reload();
    } catch (e) {
      console.error("Error: ", e);
      await alertErro(e.message);
    }
  });

  window.atualizarCategoria = async (categoriaId) => {
    const categoria = cardapioData.find((cat) => cat._id === categoriaId);
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
      const img = itemDiv
        .querySelector(".imagem-item")
        .getAttribute("data-img");
      return {
        id: id,
        nome: itemDiv.querySelector(".item-nome").value,
        precoOriginal: window.converterParaNumero(
          itemDiv.querySelector(".item-preco").value
        ),
        descricao: itemDiv.querySelector(".item-descricao").value,
        tipo: itemDiv.querySelector(".item-tipo").value,
        img,
        promocaoDia: promocaoDia,
      };
    });

    const categoriaAtualizada = {
      id: categoria._id,
      categoria: nomeCategoria,
      itens: itensAtualizados,
    };

    try {
      await putCardapio(categoriaAtualizada);
      await alertSucesso("Categoria atualizada com sucesso!");
      window.location.reload();
    } catch (err) {
      console.error("Erro ao atualizar categoria:", err);
      alertErro(err.message);
    }
  };

  window.deleteCategoria = async (id) => {
    await window.alertDelete(
      deletarCategoria,
      [id],
      "Tem certeza que deseja deletar essa categoria?"
    );
  };

  window.deleteItem = async (categoriaId, itemId, nomeImg) => {
    await window.alertDelete(
      deletarItem,
      [categoriaId, itemId, nomeImg],
      "Tem certeza que deseja deletar esse item?"
    );
  };
  carregarCategorias();
});
