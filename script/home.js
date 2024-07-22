document.addEventListener("DOMContentLoaded", () => {
  window.verificacaoAcessoPagina();
  const categoriaForm = document.getElementById("categoriaForm");
  const itemForm = document.getElementById("itemForm");
  const categoriaSelect = document.getElementById("categoriaSelect");
  const cardapioContainer = document.getElementById("cardapioContainer");
  const salvarAlteracoesBtn = document.getElementById("salvarAlteracoesBtn");

  let cardapioData = [];
  const urlCardapio = "http://localhost:3000/cardapio";

  const carregarCategorias = async () => {
    try {
      const response = await fetch(urlCardapio);
      cardapioData = await response.json();
      categoriaSelect.innerHTML = "";
      cardapioContainer.innerHTML = "";

      cardapioData.forEach((categoria, catIndex) => {
        const categoriaContainer = document.createElement("div");
        categoriaContainer.className = "container_categoria-item";

        const categoriaDiv = document.createElement("div");
        categoriaDiv.className = "cardapioContainer-categoria";
        categoriaDiv.innerHTML = `
              <input type="text" value="${categoria.categoria}" data-cat-index="${catIndex}" class="categoria-nome  input-categoria">
              <button onclick="deletarCategoria('${categoria.id}')" class="btn-deletar deletar-categoria"><i class="fa-solid fa-trash"></i></button>
            `;

        categoriaContainer.append(categoriaDiv);

        const itensContainer = document.createElement("div");
        itensContainer.className = "itens-container";
        categoria.itens.forEach((item, itemIndex) => {
          const itemDiv = document.createElement("div");
          itemDiv.className = "cardapioContainer-item";
          itemDiv.innerHTML = `
                <label for="">Nome
                <input type="text" value="${item.nome}" data-cat-index="${catIndex}" data-item-index="${itemIndex}" required class="inputs item-nome">
                </label>

                <label for="">Preço
                <input type="number" value="${item.precoOriginal}" data-cat-index="${catIndex}" data-item-index="${itemIndex}" required class="inputs item-preco">
                </label>

                <label for="">Descrição
                <input type="text" value="${item.descricao}" data-cat-index="${catIndex}" data-item-index="${itemIndex}" required class="inputs item-descricao">
                </label>

                <label for="">Tipo ou Tamanho
                <input type="text" value="${item.tipo}" data-cat-index="${catIndex}" data-item-index="${itemIndex}" required class="inputs item-tipo">
                </label>


                <label for="">Imagem
                <input type="text" value="${item.img}" data-cat-index="${catIndex}" data-item-index="${itemIndex}" required class="inputs item-img">
                </label>
                <button onclick="deletarItem('${categoria.id}', ${item.id})" class="btn-deletar deletar-item">Deletar Item</button>
              `;
          itensContainer.appendChild(itemDiv);
        });
        categoriaContainer.appendChild(itensContainer);
        cardapioContainer.appendChild(categoriaContainer);
      });

      // Populate the select options
      cardapioData.forEach((categoria) => {
        const option = document.createElement("option");
        option.value = categoria.id;
        option.textContent = categoria.categoria;
        categoriaSelect.appendChild(option);
      });
    } catch (err) {
      console.error("Erro ao carregar categorias:", err);
    }
  };

  categoriaForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoria = {
      categoria: document.getElementById("categoriaInput").value,
      itens: [],
    };

    try {
      await fetch(urlCardapio, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });
      alert("Categoria adicionada com sucesso!");
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao adicionar categoria:", err);
    }
  });

  itemForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const categoriaId = categoriaSelect.value;
    const item = {
      id: Date.now(),
      nome: document.getElementById("nomeInput").value,
      img: document.getElementById("imgInput").value,
      precoOriginal: document.getElementById("precoInput").value,
      descricao: document.getElementById("descricaoInput").value,
      tipo: document.getElementById("tipoInput").value,
    };

    try {
      const response = await fetch(`${urlCardapio}/${categoriaId}`);
      const categoria = await response.json();
      categoria.itens.push(item);

      await fetch(`${urlCardapio}/${categoriaId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoria),
      });
      alert("Item adicionado com sucesso!");
      carregarCategorias();
    } catch (err) {
      console.error("Erro ao adicionar item:", err);
    }
  });

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
        await fetch(`${urlCardapio}/${categoria.id}`, {
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

  window.deletarCategoria = async (id) => {
    if (confirm("Tem certeza que deseja deletar esta categoria?")) {
      try {
        await fetch(`http://localhost:3000/cardapio/${id}`, {
          method: "DELETE",
        });
        alert("Categoria deletada com sucesso!");
        carregarCategorias();
      } catch (err) {
        console.error("Erro ao deletar categoria:", err);
      }
    }
  };

  window.deletarItem = async (categoriaId, itemId) => {
    if (confirm("Tem certeza que deseja deletar este item?")) {
      try {
        const response = await fetch(`${urlCardapio}/${categoriaId}`);
        const categoria = await response.json();
        categoria.itens = categoria.itens.filter((i) => i.id !== itemId);

        await fetch(`${urlCardapio}/${categoriaId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(categoria),
        });
        alert("Item deletado com sucesso!");
        carregarCategorias();
      } catch (err) {
        console.error("Erro ao deletar item:", err);
      }
    }
  };

  carregarCategorias();
});
