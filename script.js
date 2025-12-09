document.querySelectorAll('.book-cards').forEach(card => {
    const bookId = card.dataset.bookId;
    const review = card.querySelector('.review');
    const stars = review.querySelectorAll('.star');

    const emptyStar = "./assets/empty-star.svg";
    const filledStar = "./assets/filled-star.svg";

    // Carregar nota salva
    const savedRating = localStorage.getItem(`rating_${bookId}`);
    if (savedRating) {
        updateStars(stars, savedRating);
        review.dataset.rating = savedRating;
    }

    // Clique nas estrelas
    stars.forEach(star => {
        star.addEventListener('click', () => {
            const rating = parseInt(star.dataset.value);

            // Atualiza visual
            updateStars(stars, rating);
            // Salva
            localStorage.setItem(`rating_${bookId}`, rating);
            review.dataset.rating = rating;
        });
    });

    // Função para atualizar as imagens
    function updateStars(stars, rating) {
        stars.forEach(s => {
            const value = parseInt(s.dataset.value);
            s.src = value <= rating ? filledStar : emptyStar;
        });
    }
});


