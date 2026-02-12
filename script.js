
// CONFIGURAÇÃO DE ARMAZENAMENTO

const STORAGE_KEY = "myLibraryBooks"; // chave onde todos os livros são salvos


// FUNÇÕES DE LOCALSTORAGE


// Salva a lista inteira de livros
function saveBooksToStorage(books) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Retorna todos os livros salvos
function getBooksFromStorage() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}


// FUNÇÃO PARA CLASSE DA TAG


function getStatusClass(status) {
  switch (status) {
    case "Lendo": return "reading";
    case "Lido": return "read";
    case "Quero ler": return "to-read";
    default: return "";
  }
}


//  SISTEMA DE AVALIAÇÃO POR ESTRELAS

const emptyStar = "./assets/empty-star.svg";
const filledStar = "./assets/filled-star.svg";

// Atualiza visual das estrelas de um card
function updateStars(stars, rating) {
  stars.forEach(star => {
    const value = parseInt(star.dataset.value);
    star.src = value <= rating ? filledStar : emptyStar;
  });
}

// Ativa o clique nas estrelas e salva a nota
function enableRatingForCard(card) {
  const bookId = card.dataset.bookId;
  const review = card.querySelector(".review");
  const stars = review.querySelectorAll(".star");

  // Carrega avaliação salva
  const books = getBooksFromStorage();
  const savedBook = books.find(b => b.id == bookId);

  if (savedBook && savedBook.rating) {
    review.dataset.rating = savedBook.rating;
    updateStars(stars, savedBook.rating);
  }

  // Evento de clique
  stars.forEach(star => {
    star.addEventListener("click", () => {
      const rating = parseInt(star.dataset.value);

      review.dataset.rating = rating;
      updateStars(stars, rating);

      // Atualiza no localStorage
      const books = getBooksFromStorage();
      const index = books.findIndex(b => b.id == bookId);
      if (index !== -1) {
        books[index].rating = rating;
        saveBooksToStorage(books);
      }
    });
  });
}


// CRIAR CARD DO LIVRO NA TELA


function addBookToPage(book, save = true) {
  const container = document.querySelector("#books");

  const bookId = book.id || Date.now(); // cria id único se não existir
  book.id = bookId;

  const card = document.createElement("div");
  card.classList.add("book-cards");
  card.dataset.bookId = bookId;

  
  card.innerHTML = `
    <img src="${book.cover}" alt="Capa do Livro: ${book.title}">

    <section class="infos">
        <p class="title">${book.title}</p>
        <p class="author">${book.author}</p>
    </section>

    <p class="tag ${getStatusClass(book.status)}">${book.status}</p>

    <section class="review" data-rating="${book.rating}">
        ${[1,2,3,4,5].map(i => `
            <img class="star" data-value="${i}" 
                 src="${i <= book.rating ? filledStar : emptyStar}" alt="">
        `).join("")}
    </section>

    <section class="comment">
        <p>${book.comment || ""}</p>
    </section>

    <div class="buttons">
        <button class="edit">
            <img src="./assets/pen.svg" alt="Ícone de um lápis">
            Editar
        </button>

        <button class="trash">
            <img src="./assets/trash.svg" alt="Ícone de um Lixo">
            Excluir
        </button>
    </div>
  `;

  container.appendChild(card);

  enableRatingForCard(card); // ativa estrelas

  // Salva no armazenamento
  if (save) {
    const books = getBooksFromStorage();
    books.push(book);
    saveBooksToStorage(books);
  }
}



// EXCLUIR LIVRO


function enableDeleteButtons() {
  document.addEventListener("click", function (e) {
    if (e.target.closest(".trash")) {
      const card = e.target.closest(".book-cards");
      const bookId = card.dataset.bookId;

      card.remove();

      const books = getBooksFromStorage().filter(b => b.id != bookId);
      saveBooksToStorage(books);
      emptyLibrary(countBooks())
    }
  });
  
}

// CONTROLE DO MODAL

const modal = document.getElementById("bookModal");
const overlay = document.getElementById("overlay");
const openModalBtn = document.getElementById("add-book");
const closeModalBtn = document.getElementById("closeModalBtn");
const cancelBtn = document.getElementById("cancelBtn");
const form = document.getElementById("bookForm");
const modalReview = document.getElementById("modalReview");

// Abrir modal
function openModal() {
  modal.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

// Fechar modal
function closeModal() {
  modal.classList.add("hidden");
  overlay.classList.add("hidden");
  form.reset();
  resetModalStars();
}

openModalBtn.addEventListener("click", openModal);
closeModalBtn.addEventListener("click", closeModal);
cancelBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);


// ESTRELAS DENTRO DO MODAL


function resetModalStars() {
  modalReview.dataset.rating = 0;
  const stars = modalReview.querySelectorAll(".star");
  updateStars(stars, 0);
}

modalReview.querySelectorAll(".star").forEach(star => {
  star.addEventListener("click", () => {
    const rating = parseInt(star.dataset.value);
    modalReview.dataset.rating = rating;
    updateStars(modalReview.querySelectorAll(".star"), rating);
  });
});



// SUBMIT DO FORMULÁRIO PARA ADICIONAR NOVO LIVRO


form.addEventListener("submit", function (e) {
  e.preventDefault();

  const book = {
    cover: document.getElementById("cover").value,
    title: document.getElementById("title").value,
    author: document.getElementById("author").value,
    status: document.getElementById("status").value,
    rating: parseInt(modalReview.dataset.rating),
    comment: document.getElementById("comment").value,
  };

  addBookToPage(book, true);

  emptyLibrary(countBooks())

  closeModal();
});



// CARREGAR LIVROS SALVOS AO INICIAR


document.addEventListener("DOMContentLoaded", () => {
  const savedBooks = getBooksFromStorage();
  savedBooks.forEach(book => addBookToPage(book, false));
  enableDeleteButtons();

  console.log("Número de cards:", countBooks());
  emptyLibrary(countBooks())
});



// CONTAR QUANTIDADE DE LIVROS

function countBooks() {
  // Seleciona todas as classes 'book-cards' dentro do elemento com id 'books'
  const cards = document.querySelectorAll('#books .book-cards');
  return cards.length;
}

// Exemplo de uso
console.log("Número de cards:", countBooks());

// VERIFICAR SE A BIBLIOTECA ESTÁ VAZIA


function emptyLibrary(books){
    const emptyLibrary = document.getElementById("empty")

     books > 0 ? emptyLibrary.classList.add("hidden") : emptyLibrary.classList.remove("hidden")
} 

