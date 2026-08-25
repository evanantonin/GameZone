/* =========================================================
   GAMEZONE — SCRIPT 8 — TETRIS
   👤 MODE VISITEUR AUTORISÉ
   🏆 CLASSEMENT MONDIAL
   📊 COMPTEUR GLOBAL DES PARTIES
   💾 MEILLEUR SCORE LOCAL
   📱 PC + MOBILE
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://pxgymcwpbesqyjochwgd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_F0af00-z9ZDemm9ch1tIaA_wSNCZb9G";


const supabaseClient =
    window.supabase
        ? window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        )
        : null;


/* =========================================================
   IDENTIFICATION DU JEU
========================================================= */

const JEU_ID = "8";
const NOM_JEU = "Tetris";


/* =========================================================
   ELEMENTS HTML
========================================================= */

const canvas =
    document.getElementById("jeuTetris");


if (!canvas) {

    console.error(
        "❌ Canvas #jeuTetris introuvable."
    );

    throw new Error(
        "Canvas Tetris introuvable."
    );

}


const contexte =
    canvas.getContext("2d");


const pseudoAffiche =
    document.getElementById(
        "pseudoAffiche"
    );


const listeScores =
    document.getElementById(
        "listeScores"
    );


const statutClassement =
    document.getElementById(
        "statutClassement"
    );


const message =
    document.getElementById(
        "message"
    );


const scoreElement =
    document.getElementById(
        "score"
    );


const meilleurScoreElement =
    document.getElementById(
        "meilleurScore"
    );


const niveauElement =
    document.getElementById(
        "niveau"
    );


const lignesElement =
    document.getElementById(
        "lignes"
    );


const partiesJoueesElement =
    document.getElementById(
        "partiesJouees"
    );


const boutonPause =
    document.getElementById(
        "boutonPause"
    );


const boutonRejouer =
    document.getElementById(
        "boutonRejouer"
    );


/* =========================================================
   UTILISATEUR / VISITEUR
========================================================= */

let pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


if (pseudo && pseudoAffiche) {

    pseudoAffiche.textContent =
        pseudo;

}
else if (pseudoAffiche) {

    pseudoAffiche.textContent =
        "Visiteur";

}


/* =========================================================
   MEILLEUR SCORE LOCAL
========================================================= */

function obtenirCleMeilleurScore() {

    if (pseudo) {

        return (
            "meilleurScoreTetris_" +
            pseudo
        );

    }

    return "meilleurScoreTetris_visiteur";

}


let cleMeilleurScore =
    obtenirCleMeilleurScore();


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

function obtenirClePartiesJouees() {

    if (pseudo) {

        return (
            "partiesJoueesTetris_" +
            pseudo
        );

    }

    return "partiesJoueesTetris_visiteur";

}


const clePartiesJouees =
    obtenirClePartiesJouees();


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

    /*
       Compteur local
    */

    partiesJouees++;


    localStorage.setItem(
        clePartiesJouees,
        partiesJouees
    );


    if (partiesJoueesElement) {

        partiesJoueesElement.textContent =
            partiesJouees;

    }


    /*
       Compteur global
    */

    await compterPartieTetris();

}


/* =========================================================
   COMPTEUR GLOBAL TETRIS
========================================================= */

async function compterPartieTetris() {

    if (!supabaseClient) {

        console.warn(
            "⚠️ Supabase indisponible pour le compteur Tetris."
        );

        return;

    }


    try {

        const resultat =
            await supabaseClient
                .from("statistiques_jeux")
                .select(
                    "id,nom_jeu,nombre_parties"
                )
                .eq(
                    "nom_jeu",
                    NOM_JEU
                )
                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche statistiques Tetris :",
                resultat.error
            );

            return;

        }


        /*
           Tetris existe
        */

        if (
            resultat.data &&
            resultat.data.length > 0
        ) {

            const jeu =
                resultat.data[0];


            const ancienNombre =
                Number(
                    jeu.nombre_parties
                ) || 0;


            const nouveauNombre =
                ancienNombre + 1;


            const miseAJour =
                await supabaseClient
                    .from("statistiques_jeux")
                    .update({

                        nombre_parties:
                            nouveauNombre

                    })
                    .eq(
                        "id",
                        jeu.id
                    );


            if (miseAJour.error) {

                console.error(
                    "❌ Erreur mise à jour statistiques Tetris :",
                    miseAJour.error
                );

                return;

            }


            console.log(
                "🎮 Tetris :",
                nouveauNombre,
                "parties"
            );

        }

        /*
           Tetris n'existe pas
        */

        else {

            const insertion =
                await supabaseClient
                    .from("statistiques_jeux")
                    .insert({

                        nom_jeu:
                            NOM_JEU,

                        nombre_parties:
                            1

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur création statistiques Tetris :",
                    insertion.error
                );

                return;

            }


            console.log(
                "🎮 Tetris : première partie"
            );

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur compteur Tetris :",
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

let animationID = null;


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


    if (collisionPiece()) {

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

            if (!piece[y][x]) {

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

                nouveauX >=
                COLONNES ||

                nouveauY >=
                LIGNES

            ) {

                return true;

            }


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

                const grilleY =
                    pieceY + y;


                const grilleX =
                    pieceX + x;


                if (

                    grilleY >= 0 &&

                    grilleY < LIGNES &&

                    grilleX >= 0 &&

                    grilleX < COLONNES

                ) {

                    grille[
                        grilleY
                    ][
                        grilleX
                    ] =
                        pieceCouleur;

                }

            }

        }

    }


    supprimerLignes();


    if (!jeuTermine) {

        nouvellePiece();

    }

}


/* =========================================================
   SUPPRIMER LES LIGNES
========================================================= */

function supprimerLignes() {

    let nombre = 0;


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


    if (nombre <= 0) {

        return;

    }


    lignesSupprimees +=
        nombre;


    let points = 0;


    if (nombre === 1) {

        points = 100;

    }

    else if (nombre === 2) {

        points = 300;

    }

    else if (nombre === 3) {

        points = 500;

    }

    else if (nombre === 4) {

        points = 800;

    }


    ajouterScore(
        points * niveau
    );


    if (lignesElement) {

        lignesElement.textContent =
            lignesSupprimees;

    }


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


    /*
       Petite correction de position
       pour éviter les rotations
       impossibles près des bords.
    */

    if (
        pieceX + piece[0].length >
        COLONNES
    ) {

        pieceX =
            COLONNES -
            piece[0].length;

    }


    if (pieceX < 0) {

        pieceX = 0;

    }


    if (collisionPiece()) {

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

function ajouterScore(
    points
) {

    score +=
        points;


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
   CLAVIER
========================================================= */

document.addEventListener(

    "keydown",

    function(event) {

        const touche =
            event.key.toLowerCase();


        if (

            touche === "q" ||

            event.key ===
            "ArrowLeft"

        ) {

            event.preventDefault();

            deplacer(-1);

        }


        else if (

            touche === "d" ||

            event.key ===
            "ArrowRight"

        ) {

            event.preventDefault();

            deplacer(1);

        }


        else if (

            touche === "s" ||

            event.key ===
            "ArrowDown"

        ) {

            event.preventDefault();

            descendre();

        }


        else if (

            touche === "z" ||

            event.key ===
            "ArrowUp"

        ) {

            event.preventDefault();

            tourner();

        }


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


    /*
       Blocs déjà posés
    */

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


    /*
       Pièce actuelle
    */

    if (piece) {

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

            if (jeuTermine) {

                return;

            }


            jeuEnPause =
                !jeuEnPause;


            if (jeuEnPause) {

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

    if (jeuTermine) {

        return;

    }


    jeuTermine =
        true;


    if (animationID !== null) {

        cancelAnimationFrame(
            animationID
        );

        animationID =
            null;

    }


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


    /*
       VISITEUR
    */

    if (!pseudo) {

        if (statutClassement) {

            statutClassement.textContent =
                "👤 Mode visiteur : le score n'est pas enregistré dans le classement.";

        }

        return;

    }


    /*
       JOUEUR CONNECTÉ
    */

    await enregistrerMeilleurScore();

}


/* =========================================================
   REJOUER
========================================================= */

async function rejouer() {

    /*
       Compter la nouvelle partie
    */

    await compterPartie();


    grille =
        creerGrille();


    score = 0;

    niveau = 1;

    lignesSupprimees = 0;

    vitesse = 800;

    jeuTermine = false;

    jeuEnPause = false;


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


    if (statutClassement) {

        if (pseudo) {

            statutClassement.textContent =
                "🌍 Tu peux améliorer ton meilleur score.";

        }

        else {

            statutClassement.textContent =
                "👤 Mode visiteur activé.";

        }

    }


    nouvellePiece();


    tempsDerniereChute =
        performance.now();


    if (animationID !== null) {

        cancelAnimationFrame(
            animationID
        );

    }


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

function configurerBoutonMobile(

    id,
    action

) {

    const bouton =
        document.getElementById(id);


    if (!bouton) {

        return;

    }


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
   MOBILE — GAUCHE
========================================================= */

configurerBoutonMobile(

    "tetrisGauche",

    function() {

        deplacer(-1);

    }

);


/* =========================================================
   MOBILE — ROTATION
========================================================= */

configurerBoutonMobile(

    "tetrisRotation",

    function() {

        tourner();

    }

);


/* =========================================================
   MOBILE — DROITE
========================================================= */

configurerBoutonMobile(

    "tetrisDroite",

    function() {

        deplacer(1);

    }

);


/* =========================================================
   MOBILE — DESCENDRE
========================================================= */

configurerBoutonMobile(

    "tetrisDescendre",

    function() {

        descendre();

    }

);


/* =========================================================
   MOBILE — CHUTE RAPIDE
========================================================= */

configurerBoutonMobile(

    "tetrisChute",

    function() {

        chuteRapide();

    }

);


/* =========================================================
   ENREGISTRER SCORE
   TABLE : scores
   COLONNES UTILISÉES :
   id / pseudo / score / jeu

   IMPORTANT :
   Aucun user_id utilisé.
========================================================= */

async function enregistrerMeilleurScore() {

    if (!pseudo) {

        return;

    }


    if (!supabaseClient) {

        console.error(
            "❌ Supabase indisponible."
        );

        return;

    }


    try {

        if (statutClassement) {

            statutClassement.textContent =
                "⏳ Enregistrement du score...";

        }


        /*
           Recherche du meilleur score
           du pseudo pour Tetris.
        */

        const resultat =
            await supabaseClient
                .from("scores")
                .select(
                    "id,pseudo,score,jeu"
                )
                .eq(
                    "pseudo",
                    pseudo
                )
                .eq(
                    "jeu",
                    NOM_JEU
                )
                .order(
                    "score",
                    {
                        ascending: false
                    }
                )
                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche score Tetris :",
                resultat.error
            );

            if (statutClassement) {

                statutClassement.textContent =
                    "❌ Impossible de récupérer ton score.";

            }

            return;

        }


        const anciensScores =
            resultat.data || [];


        /*
           =================================================
           PREMIER SCORE
        =================================================
        */

        if (
            anciensScores.length === 0
        ) {

            const insertion =
                await supabaseClient
                    .from("scores")
                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            score,

                        jeu:
                            NOM_JEU

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur insertion score Tetris :",
                    insertion.error
                );

                if (statutClassement) {

                    statutClassement.textContent =
                        "❌ Impossible d'enregistrer le score.";

                }

                return;

            }


            if (statutClassement) {

                statutClassement.textContent =
                    "🏆 Premier score Tetris enregistré !";

            }

        }


        /*
           =================================================
           SCORE EXISTANT
        =================================================
        */

        else {

            const ancienScore =
                Number(
                    anciensScores[0].score
                ) || 0;


            /*
               Nouveau record
            */

            if (
                score > ancienScore
            ) {

                const id =
                    anciensScores[0].id;


                const miseAJour =
                    await supabaseClient
                        .from("scores")
                        .update({

                            score:
                                score

                        })
                        .eq(
                            "id",
                            id
                        );


                if (miseAJour.error) {

                    console.error(
                        "❌ Erreur mise à jour score Tetris :",
                        miseAJour.error
                    );

                    if (statutClassement) {

                        statutClassement.textContent =
                            "❌ Impossible de mettre à jour le score.";

                    }

                    return;

                }


                if (statutClassement) {

                    statutClassement.textContent =
                        "🔥 NOUVEAU RECORD ! " +
                        score +
                        " points !";

                }

            }

            /*
               Ancien record conservé
            */

            else {

                if (statutClassement) {

                    statutClassement.textContent =
                        "ℹ️ Ton meilleur score reste " +
                        ancienScore +
                        " points.";

                }

            }

        }


        await chargerClassement();

    }

    catch (erreur) {

        console.error(
            "❌ ERREUR SCORE TETRIS :",
            erreur
        );


        if (statutClassement) {

            statutClassement.textContent =
                "❌ Erreur lors de l'enregistrement.";

        }

    }

}


/* =========================================================
   TOP 10 TETRIS
========================================================= */

async function chargerClassement() {

    if (!listeScores) {

        return;

    }


    if (!supabaseClient) {

        listeScores.innerHTML = `

            <tr>

                <td colspan="3">
                    ❌ Classement indisponible.
                </td>

            </tr>

        `;

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


        const resultat =
            await supabaseClient
                .from("scores")
                .select(
                    "pseudo,score,jeu"
                )
                .eq(
                    "jeu",
                    NOM_JEU
                )
                .order(
                    "score",
                    {
                        ascending: false
                    }
                )
                .limit(10);


        if (resultat.error) {

            console.error(
                "❌ Erreur classement Tetris :",
                resultat.error
            );

            listeScores.innerHTML = `

                <tr>

                    <td colspan="3">
                        ❌ Impossible de charger le classement.
                    </td>

                </tr>

            `;

            return;

        }


        const scores =
            resultat.data || [];


        listeScores.innerHTML =
            "";


        /*
           Aucun score
        */

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

            return;

        }


        /*
           Afficher Top 10
        */

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


                if (index === 0) {

                    numero.textContent =
                        "🥇";

                }

                else if (index === 1) {

                    numero.textContent =
                        "🥈";

                }

                else if (index === 2) {

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


                /*
                   Mettre en évidence
                   le joueur actuel
                */

                if (

                    pseudo &&

                    joueurScore.pseudo ===
                    pseudo

                ) {

                    pseudoCellule.classList.add(
                        "mon-score"
                    );


                    scoreCellule.classList.add(
                        "mon-score"
                    );


                    pseudoCellule.textContent +=
                        " 👈";

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

            if (pseudo) {

                statutClassement.textContent =
                    "🌍 Classement Tetris actualisé.";

            }

            else {

                statutClassement.textContent =
                    "👤 Mode visiteur — ton score n'est pas enregistré.";

            }

        }

    }

    catch (erreur) {

        console.error(
            "❌ ERREUR CLASSEMENT TETRIS :",
            erreur
        );


        listeScores.innerHTML = `

            <tr>

                <td colspan="3">
                    ❌ Impossible de charger le classement.
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
   DEMARRAGE
========================================================= */

async function demarrerTetris() {

    /*
       Créer la grille
    */

    grille =
        creerGrille();


    /*
       Réinitialisation
    */

    score = 0;

    niveau = 1;

    lignesSupprimees = 0;

    vitesse = 800;

    jeuTermine = false;

    jeuEnPause = false;


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


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "none";

    }


    if (boutonPause) {

        boutonPause.style.display =
            "inline-block";

        boutonPause.textContent =
            "⏸️ Pause";

    }


    if (message) {

        message.textContent =
            "🧱 Bonne chance !";

    }


    /*
       Compter la première partie
    */

    await compterPartie();


    /*
       Première pièce
    */

    nouvellePiece();


    /*
       Classement
    */

    await chargerClassement();


    /*
       Boucle
    */

    tempsDerniereChute =
        performance.now();


    animationID =
        requestAnimationFrame(
            boucle
        );

}


/* =========================================================
   LANCEMENT
========================================================= */

demarrerTetris();