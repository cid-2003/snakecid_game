// Sélectionne l'élément du plateau de jeu (div avec la classe 'play-board')
const playBoard = document.querySelector('.play-board');

// Sélectionne l'élément affichant le score actuel
const scoreElement = document.querySelector('.score');

// Sélectionne l'élément affichant le score élevé
const highScoreElement = document.querySelector('.high-score');

// Sélectionne toutes les images des contrôles (boutons de direction)
const controls = document.querySelectorAll('.controls img');

// Sélectionne l'élément de la modale (popup de fin de jeu)
const modal = document.getElementById('.modal');

// Déclare les coordonnées de la nourriture
let foodX, foodY;

// Position initiale de la tête du serpent
let snakeX = 5, snakeY = 10;

// Direction initiale (aucun mouvement au départ)
let velocityX = 0, velocityY = 0;

// Tableau représentant le corps du serpent
let snakeBody = [];

// Indicateur pour savoir si le jeu est terminé
let gameOver = false;

// Identifiant pour gérer l'intervalle du jeu
let setIntervalId;

// Score initial
let score = 0;

// Récupère le score élevé depuis le localStorage, ou 0 s'il n'existe pas
let highScore = localStorage.getItem("high-score") || 0;

// Met à jour l'affichage du score élevé
highScoreElement.innerText = `Score Elevé : ${highScore}`;

// Fonction pour changer la position de la nourriture à un endroit aléatoire
const changeFoodPosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1; // Position X entre 1 et 30
    foodY = Math.floor(Math.random() * 30) + 1; // Position Y entre 1 et 30
};

// Fonction pour gérer la fin du jeu
const handleGameOver = () => {
    clearInterval(setIntervalId); // Arrête la boucle du jeu

    // Affiche la modale de fin de jeu
    const modal = document.getElementById("game-over-modal");
    modal.style.display = "block";

    // Gère le clic sur le bouton "Rejouer"
    const replayButton = document.getElementById("replay-button");
    replayButton.addEventListener("click", () => {
        modal.style.display = "none"; // Cache la modale
        location.reload(); // Recharge la page pour redémarrer le jeu
    });
};

// Fonction pour changer la direction du serpent en fonction des touches pressées
const changeDirection = (e) => {
   if(e.key === "ArrowUp" && velocityY != 1) { // Haut
        velocityX = 0;
        velocityY = -1;
   } else if(e.key === "ArrowDown" && velocityY != -1) { // Bas
        velocityX = 0;
        velocityY = 1;
   } else if(e.key === "ArrowLeft" && velocityX != 1) { // Gauche
        velocityX = -1;
        velocityY = 0;
   } else if(e.key === "ArrowRight" && velocityX != -1) { // Droite
        velocityX = 1;
        velocityY = 0;
   }
};

// Ajoute un événement au clic sur chaque bouton de contrôle
controls.forEach(key => {
    key.addEventListener("click", () => changeDirection({key: key.dataset.key })); // Change la direction selon l'attribut data-key
});

// Fonction principale du jeu, appelée à chaque intervalle
const initgame = () => {
    if(gameOver) return handleGameOver(); // Si le jeu est terminé, appelle la fonction de fin de jeu

    // Ajoute un élément HTML représentant la nourriture
    let htmlmarkup = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;

    // Vérifie si la tête du serpent a mangé la nourriture
    if(snakeX === foodX && snakeY === foodY) {
        changeFoodPosition(); // Change la position de la nourriture
        snakeBody.push([foodX, foodY]); // Ajoute un segment au serpent
        score++; // Augmente le score

        // Met à jour le score élevé si le score actuel est supérieur
        highScore = score >= highScore ? score : highScore;
        localStorage.setItem("high-score", highScore); // Enregistre le nouveau score élevé
        scoreElement.innerText = `Score: ${score}`; // Met à jour l'affichage du score
        highScoreElement.innerText = `High Score: ${highScore}`; // Met à jour le score élevé
    }

    // Met à jour la position de chaque segment du corps du serpent
    for (let i = snakeBody.length - 1; i > 0; i--) {
        snakeBody[i] = snakeBody[i - 1];
    }

    // Met à jour la position de la tête du serpent
    snakeBody[0] = [snakeX, snakeY];

    // Met à jour les coordonnées de la tête selon la direction actuelle
    snakeX += velocityX;
    snakeY += velocityY;

    // Vérifie si le serpent touche les bords du plateau
    if(snakeX <= 0 || snakeX > 50 || snakeY <= 0 || snakeY > 50) {
        gameOver = true; // Termine le jeu
    }

    // Vérifie si le serpent se mord lui-même
    for (let i = 0; i < snakeBody.length; i++) {
        htmlmarkup += `<div class="head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`; // Ajoute chaque segment du serpent
        if(i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
            gameOver = true; // Termine le jeu si la tête touche le corps
        }
    }

    // Met à jour le HTML du plateau de jeu
    playBoard.innerHTML = htmlmarkup;
};

// Initialise la position de la nourriture
changeFoodPosition();

// Lance le jeu avec un intervalle de 125ms
setIntervalId = setInterval(initgame, 125);

// Ajoute un événement pour détecter les touches pressées
document.addEventListener("keydown", changeDirection);
