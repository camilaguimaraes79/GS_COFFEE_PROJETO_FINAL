document.addEventListener("DOMContentLoaded", () => {

  /*LOGIN MODAL (ABRIR / FECHAR)*/
  const loginModal = document.getElementById("loginModal");
  const userIcon = document.getElementById("userIcon");
  const closeLogin = loginModal?.querySelector(".close");

  userIcon?.addEventListener("click", () => {
    loginModal.style.display = "flex";
  });

  closeLogin?.addEventListener("click", () => {
    loginModal.style.display = "none";
  });

  /*LOGIN FUNCIONAL*/
  const formLogin = document.getElementById("form-login");
  const inputUsuario = document.getElementById("login-username");
  const inputSenha = document.getElementById("login-password");
  const userGreeting = document.getElementById("userGreeting");
  const loggedInUser = document.getElementById("loggedInUser");

  formLogin?.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = inputUsuario.value.trim();
    const senha = inputSenha.value.trim();

    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const usuarioValido = usuarios.find(
      u => u.usuario === usuario && u.senha === senha
    );

    if (usuarioValido) {
      localStorage.setItem("usuarioLogado", usuario);

      loggedInUser.textContent = `Olá, ${usuario}`;
      userGreeting.style.display = "block";

      loginModal.style.display = "none";
      alert("Login realizado com sucesso ☕");
    } else {
      alert("Usuário ou senha incorretos ❌");
    }
  });

  /*CADASTRO FUNCIONAL*/
  const formSignup = document.getElementById("form-signup");
  const signupUsername = document.getElementById("signup-username");
  const signupEmail = document.getElementById("signup-email");
  const signupPassword = document.getElementById("signup-password");
  const signupPasswordConfirm = document.getElementById("signup-password-confirm");

  formSignup?.addEventListener("submit", (e) => {
    e.preventDefault();

    const usuario = signupUsername.value.trim();
    const email = signupEmail.value.trim();
    const senha = signupPassword.value.trim();
    const confirmarSenha = signupPasswordConfirm.value.trim();

    if (!usuario || !email || !senha) {
      alert("Preencha todos os campos ❌");
      return;
    }

    if (senha !== confirmarSenha) {
      alert("As senhas não conferem ❌");
      return;
    }

    let usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

    const existe = usuarios.find(u => u.usuario === usuario);
    if (existe) {
      alert("Usuário já existe ❌");
      return;
    }

    usuarios.push({ usuario, email, senha });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));

    alert("Cadastro realizado com sucesso ☕");
    formSignup.reset();
  });

  /*USUÁRIO LOGADO AO RECARREGAR*/
  const usuarioSalvo = localStorage.getItem("usuarioLogado");
  if (usuarioSalvo) {
    loggedInUser.textContent = `Olá, ${usuarioSalvo}`;
    userGreeting.style.display = "block";
  }

  /*CARRINHO (MODAL)*/
  const cartModal = document.getElementById("cart");
  const cartIcon = document.getElementById("cart-icon");
  const closeCart = document.getElementById("close-cart");

  cartIcon?.addEventListener("click", () => {
    cartModal.classList.add("open");
  });

  closeCart?.addEventListener("click", () => {
    cartModal.classList.remove("open");
  });

  /*CARRINHO (DADOS)*/
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  const cartTableBody = document.querySelector("#carrinho-table tbody");
  const totalAmount = document.getElementById("total-amount");

  function addToCart(item) {
    if (!item || !item.id) return;

    const existing = cart.find(p => p.id === item.id);
    if (existing) {
      existing.quantity++;
    } else {
      cart.push({ ...item, quantity: 1 });
    }

    saveCart();
    updateCart();
    alert(`${item.nome} adicionado ao carrinho ☕`);
  }

  function updateCart() {
    if (!cartTableBody) return;

    cartTableBody.innerHTML = "";
    let total = 0;

    cart.forEach(item => {
      total += item.preco * item.quantity;

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${item.nome}</td>
        <td>R$ ${(item.preco * item.quantity).toFixed(2)}</td>
        <td>
          <button class="trash" data-id="${item.id}">−</button>
          ${item.quantity}
          <button class="more" data-id="${item.id}">+</button>
        </td>
      `;
      cartTableBody.appendChild(tr);
    });

    if (totalAmount) {
      totalAmount.textContent = `Total: R$ ${total.toFixed(2)}`;
    }

    saveCart();
  }

  cartModal?.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;

    const item = cart.find(p => p.id === btn.dataset.id);
    if (!item) return;

    if (btn.classList.contains("more")) item.quantity++;
    if (btn.classList.contains("trash")) {
      item.quantity--;
      if (item.quantity <= 0) {
        cart = cart.filter(p => p.id !== item.id);
      }
    }
    updateCart();
  });

  updateCart();

  /*FINALIZAR / CANCELAR*/
  const finalizarCompraBtn = document.getElementById("finalizar-compra-button");
  const finalizarModal = document.getElementById("finalizarModal");
  const confirmarPedidoBtn = document.getElementById("confirmar-pedido-button");

  finalizarCompraBtn?.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio ☕");
      return;
    }
    finalizarModal.style.display = "flex";
  });

  confirmarPedidoBtn?.addEventListener("click", () => {
    alert("Pedido confirmado com sucesso ☕✨");
    cart = [];
    saveCart();
    updateCart();
    finalizarModal.style.display = "none";
    cartModal.classList.remove("open");
  });

  /*CANCELAR PEDIDO*/
  const cancelarBtn = document.getElementById("cancel-button");
  const modalCancelar = document.getElementById("confirmarCancelamento");
  const btnSim = document.getElementById("sim-cancelar");
  const btnNao = document.getElementById("nao-cancelar");

  cancelarBtn?.addEventListener("click", () => {
    modalCancelar.style.display = "flex";
  });

  btnSim?.addEventListener("click", () => {
    cart = [];
    saveCart();
    updateCart();
    cartModal.classList.remove("open");
    modalCancelar.style.display = "none";
  });

  btnNao?.addEventListener("click", () => {
    modalCancelar.style.display = "none";
  });

  /*PRODUTOS HOME (JSON)*/
  const cardContainer = document.getElementById("card-container");
  let produtosHome = [];

  function createCard(item) {
    const card = document.createElement("section");
    card.innerHTML = `
      <img src="${item.imagem}" alt="${item.nome}">
      <article>
        <h2>${item.nome}</h2>
        <p>${item.descricao}</p>
      </article>
      <div>
        <p>R$ ${item.preco.toFixed(2)}</p>
        <button class="buy-button" data-id="${item.id}">Comprar</button>
      </div>
    `;
    return card;
  }

  async function loadItems() {
    const res = await fetch("./data/db.json");
    const data = await res.json();
    produtosHome = data.produtos || [];

    produtosHome.forEach(item => {
      cardContainer.appendChild(createCard(item));
    });

    cardContainer.addEventListener("click", (e) => {
      if (e.target.classList.contains("buy-button")) {
        const produto = produtosHome.find(p => p.id == e.target.dataset.id);
        addToCart(produto);
      }
    });
  }

  loadItems();

  /*CARDÁPIO COMPLETO*/
  document.querySelectorAll(".cardapio-item").forEach((item, index) => {
    const info = item.querySelector(".cardapio-info");
    if (!info || info.querySelector(".buy-button")) return;

    const nome = info.querySelector(".item-title")?.innerText;
    const precoTexto = info.querySelector(".item-price")?.innerText || "0";
    const preco = Number(precoTexto.replace("R$", "").replace(",", ".").replace(/[^\d.]/g, ""));

    const btn = document.createElement("button");
    btn.className = "buy-button";
    btn.innerText = "Comprar";

    btn.addEventListener("click", () => {
      addToCart({ id: `cardapio-${index}`, nome, preco });
    });

    info.appendChild(btn);
  });

  /*CARROSSEL MAIS PEDIDOS (HOME)*/
  const setaDireita = document.getElementById("seta-direita");
  const setaEsquerda = document.getElementById("seta-esquerda");

  let indexAtual = 0;

  function larguraCard() {
    const card = cardContainer.querySelector("section");
    return card ? card.offsetWidth + 20 : 0;
  }

  function cardsVisiveis() {
    const wrapper = document.querySelector(".section-cardapio__cards");
    return Math.floor(wrapper.offsetWidth / larguraCard());
  }

  function maxIndex() {
    const total = cardContainer.querySelectorAll("section").length;
    return total - cardsVisiveis();
  }

  function moverCarrossel() {
    cardContainer.style.transform =
      `translateX(-${indexAtual * larguraCard()}px)`;
  }

  setaDireita?.addEventListener("click", () => {
    if (indexAtual < maxIndex()) {
      indexAtual++;
      moverCarrossel();
    }
  });

  setaEsquerda?.addEventListener("click", () => {
    if (indexAtual > 0) {
      indexAtual--;
      moverCarrossel();
    }
  });

  window.addEventListener("resize", moverCarrossel);

});
