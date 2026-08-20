/* =========================================================
   VERIFICATION DU PSEUDO
========================================================= */

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


/* =========================================================
   IDENTIFICATION DU JEU
========================================================= */

const JEU_ID = "8";


/* =========================================================
   ELEMENTS HTML
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


const scoreElement =
    document.getElementById("score");


const meilleurScoreElement =
    document.getElementById("meilleurScore");


const niveauElement =
    document.getElementById("niveau");


const lignesElement =
    document.getElementById("lignes");


const partiesJoueesElement =
    document.getElementById("partiesJouees");


const boutonPause =
    document.getElementById("boutonPause");


const boutonRejouer =
    document.getElementById("boutonRejouer");


/* =========================================================
   PSEUDO
========================================================= */

const pseudo =
    localStorage.getItem("pseudoGameZone");


if (pseudo && pseudoAffiche) {

    pseudoAffiche.textContent =
        pseudo;

}


/* =========================================================
   MEILLEUR SCORE LOCAL
   Un meilleur score différent pour chaque pseudo
========================================================= */

const cleMeilleurScore =
    "meilleurScoreTetris_" +
    (
        pseudo ||
        "joueur"
    );


let meilleurScore =
    Number(
        localStorage.getItem(
            cleMeilleurScore
        )
    ) || 0;


if (meilleurScoreElement) {

    meilleurScoreElement.textContent =
        meilleurScore;

}


/* =========================================================
   PARTIES JOUEES
========================================================= */

const clePartiesJouees =
    "partiesJoueesTetris_" +
    (
        pseudo ||
        "joueur"
    );


let partiesJouees =
    Number(
        localStorage.getItem(
            clePartiesJouees
        )
    ) || 0;


if (partiesJoueesElement) {

    partiesJoueesElement.textContent =
        partiesJouees;

}


/* =========================================================
   COMPTER UNE PARTIE
========================================================= */

async function compterPartie() {

    /* =====================================================
       COMPTEUR LOCAL
    ===================================================== */

    partiesJouees++;


    localStorage.setItem(
        clePartiesJouees,
        partiesJouees
    );


    if (partiesJoueesElement) {

        partiesJoueesElement.textContent =
            partiesJouees;

    }


    /* =====================================================
       COMPTEUR GLOBAL JEUX DU MOMENT
       TABLE : statistiques_jeux
    ===================================================== */

    try {

        const recherche =
            await fetch(

                SUPABASE_URL +
                "/rest/v1/statistiques_jeux" +
                "?nom_jeu=eq.Tetris" +
                "&select=id,nom_jeu,nombre_parties",

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


        if (!recherche.ok) {

            throw new Error(
                await recherche.text()
            );

        }


        const resultat =
            await recherche.json();


        /* =================================================
           TETRIS EXISTE
        ================================================= */

        if (resultat.length > 0) {

            const jeu =
                resultat[0];


            const nouveauNombre =
                Number(
                    jeu.nombre_parties
                ) + 1;


            const miseAJour =
                await fetch(

                    SUPABASE_URL +
                    "/rest/v1/statistiques_jeux" +
                    "?id=eq." +
                    encodeURIComponent(
                        jeu.id
                    ),

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

                                nombre_parties:
                                    nouveauNombre

                            })

                    }

                );


            if (!miseAJour.ok) {

                throw new Error(
                    await miseAJour.text()
                );

            }


            console.log(
                "🎮 Tetris : " +
                nouveauNombre +
                " parties"
            );

        }


        /* =================================================
           TETRIS N'EXISTE PAS
        ================================================= */

        else {

            const insertion =
                await fetch(

                    SUPABASE_URL +
                    "/rest/v1/statistiques_jeux",

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

                                nom_jeu:
                                    "Tetris",

                                nombre_parties:
                                    1

                            })

                    }

                );


            if (!insertion.ok) {

                throw new Error(
                    await insertion.text()
                );

            }


            console.log(
                "🎮 Tetris : première partie"
            );

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur statistiques Tetris :",
            erreur
        );

    }

}


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

    /* I */

    [
        [1, 1, 1, 1]
    ],


    /* O */

    [
        [1, 1],
        [1, 1]
    ],


    /* T */

    [
        [0, 1, 0],
        [1, 1, 1]
    ],


    /* L */

    [
        [1, 0, 0],
        [1, 1, 1]
    ],


    /* J */

    [
        [0, 0, 1],
        [1, 1, 1]
    ],


    /* S */

    [
        [0, 1, 1],
        [1, 1, 0]
    ],


    /* Z */

    [
        [1, 1, 0],
        [0, 1, 1]
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
   VARIABLES DU JEU
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

let animationID;


/* =========================================================
   CREER GRILLE
========================================================= */

function creerGrille() {

    return Array.from(

        {
            length: LIGNES
        },

        () =>
            Array(
                COLONNES
            ).fill(0)

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


    pieceY =
        0;


    /* VERIFICATION GAME OVER */

    if (
        collisionPiece()
    ) {

        terminerJeu();

    }

}


/* =========================================================
   COLLISION PIECE
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


            /* MURS */

            if (

                nouveauX < 0 ||

                nouveauX >=
                COLONNES ||

                nouveauY >=
                LIGNES

            ) {

                return true;

            }


            /* BLOCS */

            if (

                nouveauY >= 0 &&

                grille[
                    nouveauY
                ][
                    nouveauX
                ]

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
   SUPPRIMER LES LIGNES
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
                cellule =>
                    cellule !== 0
            )

        ) {

            grille.splice(
                y,
                1
            );


            grille.unshift(
                Array(
                    COLONNES
                ).fill(0)
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


        if (lignesElement) {

            lignesElement.textContent =
                lignesSupprimees;

        }


        /* =================================================
           NIVEAU
        ================================================= */

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
                    (
                        niveau - 1
                    ) *
                    70

                );


            if (niveauElement) {

                niveauElement.textContent =
                    niveau;

            }


            if (message) {

                message.textContent =
                    "🔥 Niveau " +
                    niveau +
                    " !";

            }

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

function deplacer(
    direction
) {

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
            let y =
                hauteur - 1;

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


    /* SI LA ROTATION PROVOQUE
       UNE COLLISION */

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


    let distance =
        0;


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

function ajouterScore(
    points
) {

    score +=
        points;


    /* MEILLEUR SCORE */

    if (
        score >
        meilleurScore
    ) {

        meilleurScore =
            score;


        localStorage.setItem(
            cleMeilleurScore,
            meilleurScore
        );

    }


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }


    if (meilleurScoreElement) {

        meilleurScoreElement.textContent =
            meilleurScore;

    }

}


/* =========================================================
   CLAVIER AZERTY + FLECHES
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const touche =
            event.key.toLowerCase();


        /* GAUCHE */

        if (

            touche === "q" ||

            event.key ===
            "ArrowLeft"

        ) {

            event.preventDefault();

            deplacer(-1);

        }


        /* DROITE */

        else if (

            touche === "d" ||

            event.key ===
            "ArrowRight"

        ) {

            event.preventDefault();

            deplacer(1);

        }


        /* DESCENDRE */

        else if (

            touche === "s" ||

            event.key ===
            "ArrowDown"

        ) {

            event.preventDefault();

            descendre();

        }


        /* ROTATION */

        else if (

            touche === "z" ||

            event.key ===
            "ArrowUp"

        ) {

            event.preventDefault();

            tourner();

        }


        /* CHUTE RAPIDE */

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

    /* FOND */

    contexte.fillStyle =
        "#050510";


    contexte.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );


    /* =====================================================
       GRILLE VERTICALE
    ===================================================== */

    contexte.strokeStyle =
        "rgba(0,234,255,0.12)";


    contexte.lineWidth =
        1;


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


    /* =====================================================
       GRILLE HORIZONTALE
    ===================================================== */

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


    /* =====================================================
       BLOCS DEJA POSES
    ===================================================== */

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


    /* =====================================================
       PIECE ACTUELLE
    ===================================================== */

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


    contexte.lineWidth =
        1;


    contexte.strokeRect(

        x * TAILLE + 3,
        y * TAILLE + 3,
        TAILLE - 6,
        TAILLE - 6

    );


    contexte.restore();

}


/* =========================================================
   BOUCLE DU JEU
========================================================= */

function boucle(
    temps
) {

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


    animationID =
        requestAnimationFrame(
            boucle
        );

}


/* =========================================================
   PAUSE
========================================================= */

if (boutonPause) {

    boutonPause.addEventListener(
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


                if (message) {

                    message.textContent =
                        "⏸️ Jeu en pause";

                }

            }

            else {

                this.textContent =
                    "⏸️ Pause";


                if (message) {

                    message.textContent =
                        "🧱 C'est reparti !";

                }


                tempsDerniereChute =
                    performance.now();

            }

        }
    );

}


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


    cancelAnimationFrame(
        animationID
    );


    if (message) {

        message.textContent =
            "💀 GAME OVER ! Score : " +
            score;

    }


    if (boutonPause) {

        boutonPause.style.display =
            "none";

    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "inline-block";

    }


    await enregistrerMeilleurScore();

}


/* =========================================================
   REJOUER
========================================================= */

function rejouer() {

    /* NOUVELLE PARTIE */

    compterPartie();


    grille =
        creerGrille();


    score =
        0;


    niveau =
        1;


    lignesSupprimees =
        0;


    vitesse =
        800;


    jeuTermine =
        false;


    jeuEnPause =
        false;


    if (scoreElement) {

        scoreElement.textContent =
            "0";

    }


    if (niveauElement) {

        niveauElement.textContent =
            "1";

    }


    if (lignesElement) {

        lignesElement.textContent =
            "0";

    }


    if (boutonPause) {

        boutonPause.style.display =
            "inline-block";


        boutonPause.textContent =
            "⏸️ Pause";

    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "none";

    }


    if (message) {

        message.textContent =
            "🧱 Nouvelle partie !";

    }


    nouvellePiece();


    tempsDerniereChute =
        performance.now();


    /* RELANCE LA BOUCLE */

    cancelAnimationFrame(
        animationID
    );


    animationID =
        requestAnimationFrame(
            boucle
        );

}


/* =========================================================
   BOUTON REJOUER
========================================================= */

if (boutonRejouer) {

    boutonRejouer.addEventListener(
        "click",
        function() {

            rejouer();

        }
    );

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


    if (!bouton) {

        return;

    }


    function appuyer(
        event
    ) {

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
   MOBILE — GAUCHE
========================================================= */

boutonMobile(

    "tetrisGauche",

    function() {

        deplacer(-1);

    }

);


/* =========================================================
   MOBILE — ROTATION
========================================================= */

boutonMobile(

    "tetrisRotation",

    function() {

        tourner();

    }

);


/* =========================================================
   MOBILE — DROITE
========================================================= */

boutonMobile(

    "tetrisDroite",

    function() {

        deplacer(1);

    }

);


/* =========================================================
   MOBILE — DESCENDRE
========================================================= */

boutonMobile(

    "tetrisDescendre",

    function() {

        descendre();

    }

);


/* =========================================================
   MOBILE — CHUTE RAPIDE
========================================================= */

boutonMobile(

    "tetrisChute",

    function() {

        chuteRapide();

    }

);


/* =========================================================
   ENREGISTRER MEILLEUR SCORE SUPABASE
========================================================= */

async function enregistrerMeilleurScore() {

    if (!pseudo) {

        if (statutClassement) {

            statutClassement.textContent =
                "❌ Aucun pseudo enregistré.";

        }

        return;

    }


    try {

        if (statutClassement) {

            statutClassement.textContent =
                "⏳ Enregistrement du score...";

        }


        /* =================================================
           RECHERCHE DU MEILLEUR SCORE DU JOUEUR
        ================================================= */

        const urlRecherche =

            SUPABASE_URL +

            "/rest/v1/scores" +

            "?pseudo=eq." +
            encodeURIComponent(pseudo) +

            "&jeu=eq." +
            encodeURIComponent(JEU_ID) +

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
                            SUPABASE_KEY,

                        "Accept":
                            "application/json"

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


        /* =================================================
           PREMIER SCORE
        ================================================= */

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
                                    JEU_ID

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


            if (statutClassement) {

                statutClassement.textContent =
                    "🏆 Premier score enregistré !";

            }

        }


        /* =================================================
           SCORE EXISTANT
        ================================================= */

        else {

            const ancien =
                Number(
                    anciensScores[0].score
                );


            /* =================================================
               NOUVEAU RECORD
            ================================================= */

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
                                        JEU_ID

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


                if (statutClassement) {

                    statutClassement.textContent =
                        "🔥 NOUVEAU RECORD ! " +
                        score +
                        " points !";

                }

            }


            /* =================================================
               PAS DE NOUVEAU RECORD
            ================================================= */

            else {

                if (statutClassement) {

                    statutClassement.textContent =
                        "ℹ️ Ton meilleur score reste " +
                        ancien +
                        " points.";

                }

            }

        }


        await chargerClassement();

    }


    catch (erreur) {

        console.error(
            "❌ ERREUR SCORE :",
            erreur
        );


        if (statutClassement) {

            statutClassement.textContent =
                "❌ Erreur lors de l'enregistrement.";

        }

    }

}


/* =========================================================
   TOP 10
========================================================= */

async function chargerClassement() {

    if (!listeScores) {

        return;

    }


    try {

        listeScores.innerHTML = `

            <tr>

                <td colspan="3">
                    ⏳ Chargement...
                </td>

            </tr>

        `;


        const url =

            SUPABASE_URL +

            "/rest/v1/scores" +

            "?jeu=eq." +
            encodeURIComponent(JEU_ID) +

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


        /* =================================================
           AUCUN SCORE
        ================================================= */

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


            if (statutClassement) {

                statutClassement.textContent =
                    "🌍 Aucun score enregistré pour le jeu 8.";

            }

            return;

        }


        /* =================================================
           AFFICHER TOP 10
        ================================================= */

        scores.forEach(

            function(
                joueurScore,
                index
            ) {

                const ligne =
                    document.createElement(
                        "tr"
                    );


                /* POSITION */

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


                /* PSEUDO */

                const pseudoCellule =
                    document.createElement(
                        "td"
                    );


                pseudoCellule.textContent =
                    joueurScore.pseudo;


                /* SCORE */

                const scoreCellule =
                    document.createElement(
                        "td"
                    );


                scoreCellule.textContent =
                    Number(
                        joueurScore.score
                    );


                /* =================================================
                   METTRE LE JOUEUR ACTUEL EN EVIDENCE
                ================================================= */

                if (

                    joueurScore.pseudo ===
                    pseudo

                ) {

                    pseudoCellule.classList.add(
                        "mon-score"
                    );


                    scoreCellule.classList.add(
                        "mon-score"
                    );

                }


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


        if (statutClassement) {

            statutClassement.textContent =
                "🌍 Classement Tetris actualisé.";

        }

    }


    catch (erreur) {

        console.error(
            "❌ ERREUR CLASSEMENT :",
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


        if (statutClassement) {

            statutClassement.textContent =
                "❌ Erreur lors du chargement du classement.";

        }

    }

}


/* =========================================================
   DEMARRAGE DU JEU
========================================================= */

/* Création de la grille */

grille =
    creerGrille();


/* Une partie commence */

compterPartie();


/* Première pièce */

nouvellePiece();


/* Chargement du classement */

chargerClassement();


/* Lancement de la boucle */

animationID =
    requestAnimationFrame(
        boucle
    );