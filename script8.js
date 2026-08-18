

if (!localStorage.getItem("pseudoGameZone")) {

    window.location.href = "index.html";

}


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
"https://pxgymcwpbesqyjochwgd.supabase.co";

const SUPABASE_KEY =
"sb_publishable_F0af00-z9ZDemm9ch1tIaA_wSNCZb9G";


/*
   JEU 8
*/

const JEU_ID = "8";


/* =========================================================
   ELEMENTS
========================================================= */

const canvas =
document.getElementById("jeuTetris");

const contexte =
canvas.getContext("2d");

const pseudoAffiche =
document.getElementById("pseudoAffiche");

const listeScores =
document.getElementById("listeScores");

const statutClassement =
document.getElementById("statutClassement");

const message =
document.getElementById("message");


/* =========================================================
   PSEUDO
========================================================= */

const pseudo =
localStorage.getItem("pseudoGameZone");


if (pseudo) {

    pseudoAffiche.textContent =
    pseudo;

}


/* =========================================================
   MEILLEUR SCORE
========================================================= */

let meilleurScore =
Number(
    localStorage.getItem(
        "meilleurScoreTetris"
    )
) || 0;


document.getElementById(
    "meilleurScore"
).textContent =
meilleurScore;


/* =========================================================
   GRILLE
========================================================= */

const COLONNES = 10;

const LIGNES = 20;

const TAILLE = 30;


/* =========================================================
   PIECES
========================================================= */

const pieces = [

    [
        [1,1,1,1]
    ],

    [
        [1,1],
        [1,1]
    ],

    [
        [0,1,0],
        [1,1,1]
    ],

    [
        [1,0,0],
        [1,1,1]
    ],

    [
        [0,0,1],
        [1,1,1]
    ],

    [
        [0,1,1],
        [1,1,0]
    ],

    [
        [1,1,0],
        [0,1,1]
    ]

];


const couleurs = [

    "#00eaff",
    "#ffff00",
    "#b000ff",
    "#ff8800",
    "#0066ff",
    "#00ff66",
    "#ff3355"

];


/* =========================================================
   VARIABLES
========================================================= */

let grille;

let piece;

let pieceX;

let pieceY;

let pieceCouleur;

let score = 0;

let niveau = 1;

let lignesSupprimees = 0;

let jeuTermine = false;

let jeuEnPause = false;

let tempsDerniereChute = 0;

let vitesse = 800;


/* =========================================================
   CREER GRILLE
========================================================= */

function creerGrille() {

    return Array.from(
        {
            length: LIGNES
        },
        () =>
        Array(COLONNES).fill(0)
    );

}


/* =========================================================
   NOUVELLE PIECE
========================================================= */

function nouvellePiece() {

    const index =
    Math.floor(
        Math.random() *
        pieces.length
    );


    piece =
    pieces[index].map(
        ligne =>
        [...ligne]
    );


    pieceCouleur =
    couleurs[index];


    pieceX =
    Math.floor(
        COLONNES / 2 -
        piece[0].length / 2
    );


    pieceY = 0;


    if (
        collisionPiece()
    ) {

        terminerJeu();

    }

}


/* =========================================================
   COLLISION
========================================================= */

function collisionPiece(
    decalageX = 0,
    decalageY = 0
) {

    for (
        let y = 0;
        y < piece.length;
        y++
    ) {

        for (
            let x = 0;
            x < piece[y].length;
            x++
        ) {

            if (
                !piece[y][x]
            ) {

                continue;

            }


            const nouveauX =
            pieceX +
            x +
            decalageX;

            const nouveauY =
            pieceY +
            y +
            decalageY;


            if (
                nouveauX < 0 ||
                nouveauX >= COLONNES ||
                nouveauY >= LIGNES
            ) {

                return true;

            }


            if (
                nouveauY >= 0 &&
                grille[nouveauY][nouveauX]
            ) {

                return true;

            }

        }

    }


    return false;

}


/* =========================================================
   FIXER PIECE
========================================================= */

function fixerPiece() {

    for (
        let y = 0;
        y < piece.length;
        y++
    ) {

        for (
            let x = 0;
            x < piece[y].length;
            x++
        ) {

            if (
                piece[y][x]
            ) {

                grille[
                    pieceY + y
                ][
                    pieceX + x
                ] =
                pieceCouleur;

            }

        }

    }


    supprimerLignes();

    nouvellePiece();

}


/* =========================================================
   SUPPRIMER LIGNES
========================================================= */

function supprimerLignes() {

    let nombre =
    0;


    for (
        let y = LIGNES - 1;
        y >= 0;
        y--
    ) {

        if (
            grille[y].every(
                cellule => cellule !== 0
            )
        ) {

            grille.splice(
                y,
                1
            );


            grille.unshift(
                Array(COLONNES).fill(0)
            );


            nombre++;

            y++;

        }

    }


    if (
        nombre > 0
    ) {

        lignesSupprimees +=
        nombre;


        let points = 0;


        if (
            nombre === 1
        ) {

            points = 100;

        }

        else if (
            nombre === 2
        ) {

            points = 300;

        }

        else if (
            nombre === 3
        ) {

            points = 500;

        }

        else if (
            nombre === 4
        ) {

            points = 800;

        }


        ajouterScore(
            points * niveau
        );


        document.getElementById(
            "lignes"
        ).textContent =
        lignesSupprimees;


        const nouveauNiveau =
        Math.floor(
            lignesSupprimees / 10
        ) + 1;


        if (
            nouveauNiveau >
            niveau
        ) {

            niveau =
            nouveauNiveau;


            vitesse =
            Math.max(
                100,
                800 -
                (niveau - 1) *
                70
            );


            document.getElementById(
                "niveau"
            ).textContent =
            niveau;


            message.textContent =
            "🔥 Niveau "
            + niveau
            + " !";

        }

    }

}


/* =========================================================
   DESCENDRE
========================================================= */

function descendre() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;

    }


    if (
        !collisionPiece(
            0,
            1
        )
    ) {

        pieceY++;

    }

    else {

        fixerPiece();

    }

}


/* =========================================================
   DEPLACER
========================================================= */

function deplacer(direction) {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;

    }


    if (
        !collisionPiece(
            direction,
            0
        )
    ) {

        pieceX +=
        direction;

    }

}


/* =========================================================
   ROTATION
========================================================= */

function tourner() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;

    }


    const anciennePiece =
    piece.map(
        ligne =>
        [...ligne]
    );


    const ancienneX =
    pieceX;


    const hauteur =
    piece.length;

    const largeur =
    piece[0].length;


    const nouvelle =
    [];


    for (
        let x = 0;
        x < largeur;
        x++
    ) {

        nouvelle[x] = [];

        for (
            let y = hauteur - 1;
            y >= 0;
            y--
        ) {

            nouvelle[x].push(
                piece[y][x]
            );

        }

    }


    piece =
    nouvelle;


    if (
        collisionPiece()
    ) {

        piece =
        anciennePiece;

        pieceX =
        ancienneX;

    }

}


/* =========================================================
   CHUTE RAPIDE
========================================================= */

function chuteRapide() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;

    }


    let distance = 0;


    while (
        !collisionPiece(
            0,
            1
        )
    ) {

        pieceY++;

        distance++;

    }


    ajouterScore(
        distance * 2
    );


    fixerPiece();

}


/* =========================================================
   SCORE
========================================================= */

function ajouterScore(points) {

    score +=
    points;


    if (
        score >
        meilleurScore
    ) {

        meilleurScore =
        score;


        localStorage.setItem(
            "meilleurScoreTetris",
            meilleurScore
        );

    }


    document.getElementById(
        "score"
    ).textContent =
    score;


    document.getElementById(
        "meilleurScore"
    ).textContent =
    meilleurScore;

}


/* =========================================================
   CLAVIER AZERTY + FLECHES
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const touche =
        event.key.toLowerCase();


        /* =========================
           GAUCHE
           Q ou ←
        ========================= */

        if (
            touche === "q" ||
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();

            deplacer(-1);

        }


        /* =========================
           DROITE
           D ou →
        ========================= */

        else if (
            touche === "d" ||
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

            deplacer(1);

        }


        /* =========================
           DESCENDRE
           S ou ↓
        ========================= */

        else if (
            touche === "s" ||
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            descendre();

        }


        /* =========================
           ROTATION
           Z ou ↑
        ========================= */

        else if (
            touche === "z" ||
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            tourner();

        }


        /* =========================
           CHUTE RAPIDE
           ESPACE
        ========================= */

        else if (
            event.code === "Space"
        ) {

            event.preventDefault();

            chuteRapide();

        }

    }
);
/* =========================================================
   DESSIN GRILLE
========================================================= */

function dessinerGrille() {

    contexte.fillStyle =
    "#050510";

    contexte.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* GRILLE */

    contexte.strokeStyle =
    "rgba(0,234,255,0.12)";

    contexte.lineWidth = 1;


    for (
        let x = 0;
        x <= COLONNES;
        x++
    ) {

        contexte.beginPath();

        contexte.moveTo(
            x * TAILLE,
            0
        );

        contexte.lineTo(
            x * TAILLE,
            canvas.height
        );

        contexte.stroke();

    }


    for (
        let y = 0;
        y <= LIGNES;
        y++
    ) {

        contexte.beginPath();

        contexte.moveTo(
            0,
            y * TAILLE
        );

        contexte.lineTo(
            canvas.width,
            y * TAILLE
        );

        contexte.stroke();

    }


    /* BLOCS DEJA POSES */

    for (
        let y = 0;
        y < LIGNES;
        y++
    ) {

        for (
            let x = 0;
            x < COLONNES;
            x++
        ) {

            if (
                grille[y][x]
            ) {

                dessinerBloc(
                    x,
                    y,
                    grille[y][x]
                );

            }

        }

    }


    /* PIECE ACTUELLE */

    if (
        piece
    ) {

        for (
            let y = 0;
            y < piece.length;
            y++
        ) {

            for (
                let x = 0;
                x < piece[y].length;
                x++
            ) {

                if (
                    piece[y][x]
                ) {

                    dessinerBloc(
                        pieceX + x,
                        pieceY + y,
                        pieceCouleur
                    );

                }

            }

        }

    }

}


/* =========================================================
   DESSIN BLOC
========================================================= */

function dessinerBloc(
    x,
    y,
    couleur
) {

    contexte.save();


    contexte.fillStyle =
    couleur;

    contexte.shadowBlur =
    12;

    contexte.shadowColor =
    couleur;


    contexte.fillRect(
        x * TAILLE + 2,
        y * TAILLE + 2,
        TAILLE - 4,
        TAILLE - 4
    );


    contexte.strokeStyle =
    "#ffffff";

    contexte.lineWidth = 1;


    contexte.strokeRect(
        x * TAILLE + 3,
        y * TAILLE + 3,
        TAILLE - 6,
        TAILLE - 6
    );


    contexte.restore();

}


/* =========================================================
   BOUCLE
========================================================= */

function boucle(temps) {

    if (
        !jeuTermine &&
        !jeuEnPause
    ) {

        if (
            temps -
            tempsDerniereChute >
            vitesse
        ) {

            descendre();

            tempsDerniereChute =
            temps;

        }

    }


    dessinerGrille();


    requestAnimationFrame(
        boucle
    );

}


/* =========================================================
   PAUSE
========================================================= */

document.getElementById(
    "boutonPause"
).addEventListener(
    "click",
    function() {

        if (
            jeuTermine
        ) {

            return;

        }


        jeuEnPause =
        !jeuEnPause;


        if (
            jeuEnPause
        ) {

            this.textContent =
            "▶️ Reprendre";

            message.textContent =
            "⏸️ Jeu en pause";

        }

        else {

            this.textContent =
            "⏸️ Pause";

            message.textContent =
            "🧱 C'est reparti !";

            tempsDerniereChute =
            performance.now();

        }

    }
);


/* =========================================================
   GAME OVER
========================================================= */

async function terminerJeu() {

    if (
        jeuTermine
    ) {

        return;

    }


    jeuTermine =
    true;


    message.textContent =
    "💀 GAME OVER ! Score : "
    + score;


    document.getElementById(
        "boutonPause"
    ).style.display =
    "none";


    document.getElementById(
        "boutonRejouer"
    ).style.display =
    "inline-block";


    await enregistrerMeilleurScore();

}


/* =========================================================
   REJOUER
========================================================= */

function rejouer() {

    grille =
    creerGrille();


    score = 0;

    niveau = 1;

    lignesSupprimees = 0;

    vitesse = 800;

    jeuTermine = false;

    jeuEnPause = false;


    document.getElementById(
        "score"
    ).textContent =
    "0";


    document.getElementById(
        "niveau"
    ).textContent =
    "1";


    document.getElementById(
        "lignes"
    ).textContent =
    "0";


    document.getElementById(
        "boutonPause"
    ).style.display =
    "inline-block";


    document.getElementById(
        "boutonPause"
    ).textContent =
    "⏸️ Pause";


    document.getElementById(
        "boutonRejouer"
    ).style.display =
    "none";


    message.textContent =
    "🧱 Nouvelle partie !";


    nouvellePiece();


    tempsDerniereChute =
    performance.now();

}


/* =========================================================
   CONTROLES MOBILES
========================================================= */

function boutonMobile(
    id,
    action
) {

    const bouton =
    document.getElementById(id);


    function appuyer(event) {

        event.preventDefault();

        action();

    }


    bouton.addEventListener(
        "touchstart",
        appuyer,
        {
            passive: false
        }
    );


    bouton.addEventListener(
        "mousedown",
        appuyer
    );

}


/* =========================================================
   GAUCHE
========================================================= */

boutonMobile(
    "tetrisGauche",
    function() {

        deplacer(-1);

    }
);


/* =========================================================
   ROTATION
========================================================= */

boutonMobile(
    "tetrisRotation",
    function() {

        tourner();

    }
);


/* =========================================================
   DROITE
========================================================= */

boutonMobile(
    "tetrisDroite",
    function() {

        deplacer(1);

    }
);


/* =========================================================
   DESCENDRE
========================================================= */

boutonMobile(
    "tetrisDescendre",
    function() {

        descendre();

    }
);


/* =========================================================
   CHUTE
========================================================= */

boutonMobile(
    "tetrisChute",
    function() {

        chuteRapide();

    }
);


/* =========================================================
   SUPABASE
========================================================= */

async function enregistrerMeilleurScore() {

    if (!pseudo) {

        statutClassement.textContent =
        "❌ Aucun pseudo enregistré.";

        return;

    }


    try {

        statutClassement.textContent =
        "⏳ Enregistrement du score...";


        const urlRecherche =
        SUPABASE_URL +
        "/rest/v1/scores" +
        "?pseudo=eq." +
        encodeURIComponent(pseudo) +
        "&jeu=eq.8" +
        "&select=id,pseudo,score,jeu" +
        "&order=score.desc" +
        "&limit=1";


        const recherche =
        await fetch(
            urlRecherche,
            {

                method: "GET",

                headers: {

                    "apikey":
                    SUPABASE_KEY,

                    "Authorization":
                    "Bearer " +
                    SUPABASE_KEY

                }

            }
        );


        if (
            !recherche.ok
        ) {

            throw new Error(
                await recherche.text()
            );

        }


        const anciensScores =
        await recherche.json();


        /* PREMIER SCORE */

        if (
            anciensScores.length === 0
        ) {

            const insertion =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/scores",
                {

                    method: "POST",

                    headers: {

                        "apikey":
                        SUPABASE_KEY,

                        "Authorization":
                        "Bearer " +
                        SUPABASE_KEY,

                        "Content-Type":
                        "application/json",

                        "Prefer":
                        "return=minimal"

                    },

                    body:
                    JSON.stringify({

                        pseudo:
                        pseudo,

                        score:
                        score,

                        jeu:
                        "8"

                    })

                }
            );


            if (
                !insertion.ok
            ) {

                throw new Error(
                    await insertion.text()
                );

            }


            statutClassement.textContent =
            "🏆 Premier score enregistré !";

        }


        /* SCORE EXISTANT */

        else {

            const ancien =
            Number(
                anciensScores[0].score
            );


            if (
                score > ancien
            ) {

                const id =
                anciensScores[0].id;


                const miseAJour =
                await fetch(

                    SUPABASE_URL +
                    "/rest/v1/scores" +
                    "?id=eq." +
                    encodeURIComponent(id),

                    {

                        method: "PATCH",

                        headers: {

                            "apikey":
                            SUPABASE_KEY,

                            "Authorization":
                            "Bearer " +
                            SUPABASE_KEY,

                            "Content-Type":
                            "application/json",

                            "Prefer":
                            "return=minimal"

                        },

                        body:
                        JSON.stringify({

                            score:
                            score,

                            jeu:
                            "8"

                        })

                    }

                );


                if (
                    !miseAJour.ok
                ) {

                    throw new Error(
                        await miseAJour.text()
                    );

                }


                statutClassement.textContent =
                "🔥 NOUVEAU RECORD ! "
                + score
                + " points !";

            }

            else {

                statutClassement.textContent =
                "ℹ️ Ton meilleur score reste "
                + ancien
                + " points.";

            }

        }


        await chargerClassement();

    }


    catch (erreur) {

        console.error(
            "ERREUR SCORE :",
            erreur
        );


        statutClassement.textContent =
        "❌ Erreur lors de l'enregistrement.";

    }

}


/* =========================================================
   TOP 10
========================================================= */

async function chargerClassement() {

    try {

        const url =
        SUPABASE_URL +
        "/rest/v1/scores" +
        "?jeu=eq.8" +
        "&select=pseudo,score,jeu" +
        "&order=score.desc" +
        "&limit=10";


        const resultat =
        await fetch(
            url,
            {

                method: "GET",

                headers: {

                    "apikey":
                    SUPABASE_KEY,

                    "Authorization":
                    "Bearer " +
                    SUPABASE_KEY,

                    "Accept":
                    "application/json"

                }

            }
        );


        if (
            !resultat.ok
        ) {

            throw new Error(
                await resultat.text()
            );

        }


        const scores =
        await resultat.json();


        listeScores.innerHTML =
        "";


        if (
            scores.length === 0
        ) {

            listeScores.innerHTML = `

                <tr>

                    <td colspan="3">

                        Aucun score pour Tetris.

                    </td>

                </tr>

            `;


            statutClassement.textContent =
            "🌍 Aucun score enregistré pour le jeu 8.";

            return;

        }


        scores.forEach(
            function(
                joueurScore,
                index
            ) {

                const ligne =
                document.createElement(
                    "tr"
                );


                const numero =
                document.createElement(
                    "td"
                );


                if (
                    index === 0
                ) {

                    numero.textContent =
                    "🥇";

                }

                else if (
                    index === 1
                ) {

                    numero.textContent =
                    "🥈";

                }

                else if (
                    index === 2
                ) {

                    numero.textContent =
                    "🥉";

                }

                else {

                    numero.textContent =
                    index + 1;

                }


                const pseudoCellule =
                document.createElement(
                    "td"
                );


                pseudoCellule.textContent =
                joueurScore.pseudo;


                const scoreCellule =
                document.createElement(
                    "td"
                );


                scoreCellule.textContent =
                Number(
                    joueurScore.score
                );


                ligne.appendChild(
                    numero
                );

                ligne.appendChild(
                    pseudoCellule
                );

                ligne.appendChild(
                    scoreCellule
                );


                listeScores.appendChild(
                    ligne
                );

            }
        );


        statutClassement.textContent =
        "🌍 Classement Tetris actualisé.";

    }


    catch (erreur) {

        console.error(
            "ERREUR CLASSEMENT :",
            erreur
        );


        listeScores.innerHTML = `

            <tr>

                <td colspan="3">

                    ❌ Impossible de charger
                    le classement.

                </td>

            </tr>

        `;


        statutClassement.textContent =
        "❌ Erreur lors du chargement du classement.";

    }

}


/* =========================================================
   DEMARRAGE
========================================================= */

grille =
creerGrille();


nouvellePiece();


chargerClassement();


requestAnimationFrame(
    boucle
);




