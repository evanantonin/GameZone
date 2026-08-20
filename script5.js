/* =====================================================
   GAMEZONE — PONG
   script5.js
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://pxgymcwpbesqyjochwgd.supabase.co";

const SUPABASE_ANON_KEY =
    "sb_publishable_F0af00-z9ZDemm9ch1tIaA_wSNCZb9G";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_ANON_KEY
    );


/* =====================================================
   IDENTIFICATION DU JEU
===================================================== */

const JEU =
    "pong";


/*
   Nom EXACT présent dans
   statistiques_jeux
*/

const NOM_JEU_STATISTIQUE =
    "Pong";


/* =====================================================
   PSEUDO
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


const pseudoJoueurElement =
    document.getElementById(
        "pseudoJoueur"
    );


if (pseudoJoueurElement) {

    pseudoJoueurElement.textContent =
        pseudo || "Joueur";

}


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById(
        "pong"
    );


if (!canvas) {

    console.error(
        "❌ Canvas #pong introuvable."
    );

}


const contexte =
    canvas
        ? canvas.getContext("2d")
        : null;


/* =====================================================
   ELEMENTS HTML
===================================================== */

const scoreJoueur1Element =
    document.getElementById(
        "scoreJoueur1"
    );


const scoreJoueur2Element =
    document.getElementById(
        "scoreJoueur2"
    );


const messageElement =
    document.getElementById(
        "message"
    );


const boutonRejouer =
    document.getElementById(
        "boutonRejouer"
    );


const controlesMobile =
    document.getElementById(
        "controlesMobile"
    );


const instructionElement =
    document.getElementById(
        "instruction"
    );


const classementBody =
    document.getElementById(
        "classementBody"
    );


const messageClassement =
    document.getElementById(
        "messageClassement"
    );


/* =====================================================
   VARIABLES DU JEU
===================================================== */

let mode = null;


/*
   false = aucune partie
   true = partie en cours
*/

let jeuCommence = false;


/*
   true = partie terminée
*/

let jeuTermine = false;


/*
   Évite d'enregistrer plusieurs fois
   la même victoire.
*/

let victoireEnregistree = false;


/*
   Évite de compter plusieurs fois
   une même partie.
*/

let partieComptee = false;


/* =====================================================
   SCORE
===================================================== */

let score1 = 0;

let score2 = 0;


/* =====================================================
   TOUCHES
===================================================== */

const touches = {};


/* =====================================================
   MOUVEMENTS MOBILE
===================================================== */

let mouvementJoueur1 = null;

let mouvementJoueur2 = null;


/* =====================================================
   DIMENSIONS RAQUETTES
===================================================== */

const largeurRaquette =
    15;

const hauteurRaquette =
    90;


/* =====================================================
   VITESSE
===================================================== */

const vitesseRaquette =
    7;


/* =====================================================
   BALLE
===================================================== */

const balle = {

    x: canvas
        ? canvas.width / 2
        : 400,

    y: canvas
        ? canvas.height / 2
        : 300,

    rayon: 10,

    vitesseX: 5,

    vitesseY: 2

};


/* =====================================================
   ACCELERATION
===================================================== */

const acceleration =
    0.25;


const vitesseMax =
    12;


/* =====================================================
   JOUEUR 1
===================================================== */

const joueur1 = {

    x: 20,

    y: canvas
        ? canvas.height / 2 -
          hauteurRaquette / 2
        : 255,

    largeur:
        largeurRaquette,

    hauteur:
        hauteurRaquette,

    vitesse:
        vitesseRaquette

};


/* =====================================================
   JOUEUR 2
===================================================== */

const joueur2 = {

    x: canvas
        ? canvas.width -
          20 -
          largeurRaquette
        : 765,

    y: canvas
        ? canvas.height / 2 -
          hauteurRaquette / 2
        : 255,

    largeur:
        largeurRaquette,

    hauteur:
        hauteurRaquette,

    vitesse:
        vitesseRaquette

};


/* =====================================================
   COMPTER UNE PARTIE
   STATISTIQUES DU SITE
===================================================== */

async function compterPartie(nomJeu) {

    if (!nomJeu) {

        return;

    }


    try {

        console.log(
            "🎮 Comptage de la partie :",
            nomJeu
        );


        /*
           On récupère la ligne du jeu.
        */

        const resultat =
            await supabaseClient

                .from("statistiques_jeux")

                .select(
                    "id,nom_jeu,nombre_parties"
                )

                .eq(
                    "nom_jeu",
                    nomJeu
                )

                .maybeSingle();


        if (resultat.error) {

            console.error(
                "❌ Erreur récupération statistiques :",
                resultat.error
            );

            return;

        }


        if (!resultat.data) {

            console.error(
                "❌ Le jeu n'existe pas dans statistiques_jeux :",
                nomJeu
            );

            return;

        }


        const nouveauNombre =
            Number(
                resultat.data.nombre_parties || 0
            ) + 1;


        /*
           Mise à jour.
        */

        const miseAJour =
            await supabaseClient

                .from("statistiques_jeux")

                .update({

                    nombre_parties:
                        nouveauNombre

                })

                .eq(
                    "id",
                    resultat.data.id
                );


        if (miseAJour.error) {

            console.error(
                "❌ Erreur mise à jour statistiques :",
                miseAJour.error
            );

            return;

        }


        console.log(
            "✅ Partie comptabilisée :",
            nomJeu,
            "→",
            nouveauNombre
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur compterPartie :",
            erreur
        );

    }

}


/* =====================================================
   COMPTER PARTIE PONG
===================================================== */

async function compterPartieJeu5() {

    if (partieComptee) {

        console.log(
            "ℹ️ Partie déjà comptabilisée."
        );

        return;

    }


    partieComptee = true;


    await compterPartie(
        NOM_JEU_STATISTIQUE
    );

}


/* =====================================================
   JOUEUR 1 — MONTER
===================================================== */

function demarrerMonterJoueur1(event) {

    if (event) {

        event.preventDefault();

    }


    arreterJoueur1();


    mouvementJoueur1 =
        setInterval(
            function() {

                if (
                    !jeuCommence ||
                    jeuTermine ||
                    mode === null
                ) {

                    return;

                }


                joueur1.y -=
                    joueur1.vitesse * 1.5;


                limiterRaquette(
                    joueur1
                );

            },
            30
        );

}


/* =====================================================
   JOUEUR 1 — DESCENDRE
===================================================== */

function demarrerDescendreJoueur1(event) {

    if (event) {

        event.preventDefault();

    }


    arreterJoueur1();


    mouvementJoueur1 =
        setInterval(
            function() {

                if (
                    !jeuCommence ||
                    jeuTermine ||
                    mode === null
                ) {

                    return;

                }


                joueur1.y +=
                    joueur1.vitesse * 1.5;


                limiterRaquette(
                    joueur1
                );

            },
            30
        );

}


/* =====================================================
   JOUEUR 1 — ARRÊTER
===================================================== */

function arreterJoueur1(event) {

    if (event) {

        event.preventDefault();

    }


    clearInterval(
        mouvementJoueur1
    );


    mouvementJoueur1 =
        null;

}


/* =====================================================
   JOUEUR 2 — MONTER
===================================================== */

function demarrerMonterJoueur2(event) {

    if (event) {

        event.preventDefault();

    }


    arreterJoueur2();


    mouvementJoueur2 =
        setInterval(
            function() {

                if (
                    !jeuCommence ||
                    jeuTermine ||
                    mode !== 2
                ) {

                    return;

                }


                joueur2.y -=
                    joueur2.vitesse * 1.5;


                limiterRaquette(
                    joueur2
                );

            },
            30
        );

}


/* =====================================================
   JOUEUR 2 — DESCENDRE
===================================================== */

function demarrerDescendreJoueur2(event) {

    if (event) {

        event.preventDefault();

    }


    arreterJoueur2();


    mouvementJoueur2 =
        setInterval(
            function() {

                if (
                    !jeuCommence ||
                    jeuTermine ||
                    mode !== 2
                ) {

                    return;

                }


                joueur2.y +=
                    joueur2.vitesse * 1.5;


                limiterRaquette(
                    joueur2
                );

            },
            30
        );

}


/* =====================================================
   JOUEUR 2 — ARRÊTER
===================================================== */

function arreterJoueur2(event) {

    if (event) {

        event.preventDefault();

    }


    clearInterval(
        mouvementJoueur2
    );


    mouvementJoueur2 =
        null;

}


/* =====================================================
   MODE 1 JOUEUR
===================================================== */

function modeUnJoueur() {

    mode = 1;

    jeuCommence = true;

    jeuTermine = false;

    victoireEnregistree = false;

    partieComptee = false;


    score1 = 0;

    score2 = 0;


    /*
       UNE seule fois par partie.
    */

    compterPartieJeu5();


    mettreAJourScore();

    reinitialiserBalle();


    joueur1.y =
        canvas.height / 2 -
        hauteurRaquette / 2;


    joueur2.y =
        canvas.height / 2 -
        hauteurRaquette / 2;


    arreterJoueur1();

    arreterJoueur2();


    if (controlesMobile) {

        controlesMobile.classList.remove(
            "mode-2-joueurs"
        );

    }


    if (messageElement) {

        messageElement.textContent =
            "🏓 Joue contre l'ordinateur !";

    }


    if (instructionElement) {

        instructionElement.textContent =
            "⌨️ Joueur 1 : Z / S ou ↑ / ↓";

    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "none";

    }

}


/* =====================================================
   MODE 2 JOUEURS
===================================================== */

function modeDeuxJoueurs() {

    mode = 2;

    jeuCommence = true;

    jeuTermine = false;

    victoireEnregistree = false;

    partieComptee = false;


    score1 = 0;

    score2 = 0;


    compterPartieJeu5();


    mettreAJourScore();

    reinitialiserBalle();


    joueur1.y =
        canvas.height / 2 -
        hauteurRaquette / 2;


    joueur2.y =
        canvas.height / 2 -
        hauteurRaquette / 2;


    arreterJoueur1();

    arreterJoueur2();


    if (controlesMobile) {

        controlesMobile.classList.add(
            "mode-2-joueurs"
        );

    }


    if (messageElement) {

        messageElement.textContent =
            "👥 Mode 2 joueurs !";

    }


    if (instructionElement) {

        instructionElement.textContent =
            "🧑 Joueur 1 : Z / S | 🧑‍💻 Joueur 2 : ↑ / ↓";

    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "none";

    }

}


/* =====================================================
   CONTROLES CLAVIER
===================================================== */

function controles() {

    if (touches["z"]) {

        joueur1.y -=
            joueur1.vitesse;

    }


    if (touches["s"]) {

        joueur1.y +=
            joueur1.vitesse;

    }


    if (mode === 2) {

        if (touches["arrowup"]) {

            joueur2.y -=
                joueur2.vitesse;

        }


        if (touches["arrowdown"]) {

            joueur2.y +=
                joueur2.vitesse;

        }

    }


    limiterRaquette(
        joueur1
    );


    limiterRaquette(
        joueur2
    );

}


/* =====================================================
   EVENEMENTS CLAVIER
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        const touche =
            event.key.toLowerCase();


        if (
            [
                "z",
                "s",
                "arrowup",
                "arrowdown"
            ].includes(touche)
        ) {

            event.preventDefault();

        }


        touches[touche] =
            true;

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        const touche =
            event.key.toLowerCase();


        touches[touche] =
            false;

    }
);


/* =====================================================
   ORDINATEUR
===================================================== */

function ordinateur() {

    if (mode !== 1) {

        return;

    }


    const centreRaquette =
        joueur2.y +
        joueur2.hauteur / 2;


    if (balle.vitesseX > 0) {

        if (
            centreRaquette <
            balle.y - 30
        ) {

            joueur2.y +=
                joueur2.vitesse * 0.55;

        }


        if (
            centreRaquette >
            balle.y + 30
        ) {

            joueur2.y -=
                joueur2.vitesse * 0.55;

        }

    }


    limiterRaquette(
        joueur2
    );

}


/* =====================================================
   LIMITER RAQUETTE
===================================================== */

function limiterRaquette(
    raquette
) {

    if (!raquette) {

        return;

    }


    if (raquette.y < 0) {

        raquette.y = 0;

    }


    if (
        raquette.y +
        raquette.hauteur >
        canvas.height
    ) {

        raquette.y =
            canvas.height -
            raquette.hauteur;

    }

}


/* =====================================================
   REINITIALISER BALLE
===================================================== */

function reinitialiserBalle() {

    balle.x =
        canvas.width / 2;


    balle.y =
        canvas.height / 2;


    balle.vitesseX =
        Math.random() > 0.5
            ? 5
            : -5;


    balle.vitesseY =
        Math.random() * 4 - 2;

}


/* =====================================================
   ACCELERER BALLE
===================================================== */

function accelererBalle() {

    if (balle.vitesseX > 0) {

        balle.vitesseX =
            Math.min(
                balle.vitesseX +
                acceleration,
                vitesseMax
            );

    }

    else {

        balle.vitesseX =
            Math.max(
                balle.vitesseX -
                acceleration,
                -vitesseMax
            );

    }


    if (balle.vitesseY > 0) {

        balle.vitesseY =
            Math.min(
                balle.vitesseY +
                0.1,
                vitesseMax
            );

    }

    else {

        balle.vitesseY =
            Math.max(
                balle.vitesseY -
                0.1,
                -vitesseMax
            );

    }

}


/* =====================================================
   COLLISION RAQUETTE
===================================================== */

function collisionRaquette(
    raquette
) {

    return (

        balle.x -
        balle.rayon
        <
        raquette.x +
        raquette.largeur

        &&

        balle.x +
        balle.rayon
        >
        raquette.x

        &&

        balle.y +
        balle.rayon
        >
        raquette.y

        &&

        balle.y -
        balle.rayon
        <
        raquette.y +
        raquette.hauteur

    );

}


/* =====================================================
   MISE À JOUR DU JEU
===================================================== */

function mettreAJour() {

    if (
        !jeuCommence ||
        jeuTermine
    ) {

        return;

    }


    controles();

    ordinateur();


    balle.x +=
        balle.vitesseX;


    balle.y +=
        balle.vitesseY;


    /* =================================================
       MUR HAUT
    ================================================= */

    if (
        balle.y -
        balle.rayon <= 0
    ) {

        balle.y =
            balle.rayon;

        balle.vitesseY *= -1;

    }


    /* =================================================
       MUR BAS
    ================================================= */

    if (
        balle.y +
        balle.rayon >=
        canvas.height
    ) {

        balle.y =
            canvas.height -
            balle.rayon;

        balle.vitesseY *= -1;

    }


    /* =================================================
       JOUEUR 1
    ================================================= */

    if (
        balle.vitesseX < 0 &&
        collisionRaquette(joueur1)
    ) {

        balle.x =
            joueur1.x +
            joueur1.largeur +
            balle.rayon;


        balle.vitesseX *= -1;

        accelererBalle();

    }


    /* =================================================
       JOUEUR 2
    ================================================= */

    if (
        balle.vitesseX > 0 &&
        collisionRaquette(joueur2)
    ) {

        balle.x =
            joueur2.x -
            balle.rayon;


        balle.vitesseX *= -1;

        accelererBalle();

    }


    /* =================================================
       POINT JOUEUR 2
    ================================================= */

    if (balle.x < 0) {

        score2++;


        mettreAJourScore();

        verifierVictoire();


        if (!jeuTermine) {

            reinitialiserBalle();

        }

    }


    /* =================================================
       POINT JOUEUR 1
    ================================================= */

    if (
        balle.x >
        canvas.width
    ) {

        score1++;


        mettreAJourScore();

        verifierVictoire();


        if (!jeuTermine) {

            reinitialiserBalle();

        }

    }

}


/* =====================================================
   SCORE
===================================================== */

function mettreAJourScore() {

    if (scoreJoueur1Element) {

        scoreJoueur1Element.textContent =
            score1;

    }


    if (scoreJoueur2Element) {

        scoreJoueur2Element.textContent =
            score2;

    }

}


/* =====================================================
   VICTOIRE
===================================================== */

function verifierVictoire() {

    /* =================================================
       JOUEUR 1
    ================================================= */

    if (score1 >= 2) {

        jeuTermine = true;


        if (messageElement) {

            messageElement.textContent =
                "🏆 🧑 TU AS GAGNÉ ! 🏆";

        }


        if (boutonRejouer) {

            boutonRejouer.style.display =
                "inline-block";

        }


        arreterJoueur1();

        arreterJoueur2();


        if (
            mode === 1 &&
            !victoireEnregistree
        ) {

            victoireEnregistree = true;

            enregistrerVictoire();

        }


        return;

    }


    /* =================================================
       JOUEUR 2 / ORDINATEUR
    ================================================= */

    if (score2 >= 3) {

        jeuTermine = true;


        if (messageElement) {

            if (mode === 1) {

                messageElement.textContent =
                    "🤖 L'ORDINATEUR A GAGNÉ !";

            }

            else {

                messageElement.textContent =
                    "🏆 🧑‍💻 JOUEUR 2 A GAGNÉ ! 🏆";

            }

        }


        if (boutonRejouer) {

            boutonRejouer.style.display =
                "inline-block";

        }


        arreterJoueur1();

        arreterJoueur2();

    }

}


/* =====================================================
   ENREGISTRER VICTOIRE
===================================================== */

async function enregistrerVictoire() {

    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        console.log(
            "ℹ️ Aucun pseudo connecté."
        );

        return;

    }


    try {

        const resultat =
            await supabaseClient

                .from("scores")

                .select(
                    "id,pseudo,score,jeu"
                )

                .eq(
                    "pseudo",
                    pseudoActuel
                )

                .eq(
                    "jeu",
                    JEU
                )

                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche score :",
                resultat.error
            );

            return;

        }


        /* =================================================
           SCORE EXISTANT
        ================================================= */

        if (
            resultat.data &&
            resultat.data.length > 0
        ) {

            const ancienScore =
                Number(
                    resultat.data[0].score
                ) || 0;


            const miseAJour =
                await supabaseClient

                    .from("scores")

                    .update({

                        score:
                            ancienScore + 1,

                        date_creation:
                            new Date()
                                .toISOString()

                    })

                    .eq(
                        "id",
                        resultat.data[0].id
                    );


            if (miseAJour.error) {

                console.error(
                    "❌ Erreur update score :",
                    miseAJour.error
                );

                return;

            }

        }


        /* =================================================
           PREMIER SCORE
        ================================================= */

        else {

            const insertion =
                await supabaseClient

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudoActuel,

                        score:
                            1,

                        jeu:
                            JEU,

                        date_creation:
                            new Date()
                                .toISOString()

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur insertion score :",
                    insertion.error
                );

                return;

            }

        }


        await chargerClassement();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur enregistrement victoire :",
            erreur
        );

    }

}


/* =====================================================
   CLASSEMENT TOP 10
===================================================== */

async function chargerClassement() {

    if (!classementBody) {

        return;

    }


    classementBody.innerHTML = `

        <tr>

            <td colspan="3">
                ⏳ Chargement...
            </td>

        </tr>

    `;


    try {

        const resultat =
            await supabaseClient

                .from("scores")

                .select(
                    "pseudo,score,date_creation"
                )

                .eq(
                    "jeu",
                    JEU
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
                "❌ Erreur classement :",
                resultat.error
            );

            throw resultat.error;

        }


        const data =
            resultat.data;


        /* =================================================
           AUCUN SCORE
        ================================================= */

        if (
            !data ||
            data.length === 0
        ) {

            classementBody.innerHTML = `

                <tr>

                    <td colspan="3">

                        🏆 Aucune victoire
                        enregistrée pour le moment.

                    </td>

                </tr>

            `;


            if (messageClassement) {

                messageClassement.textContent =
                    "🌍 Aucun joueur classé.";

            }


            return;

        }


        /* =================================================
           AFFICHAGE
        ================================================= */

        classementBody.innerHTML =
            "";


        data.forEach(
            function(
                joueur,
                index
            ) {

                const ligne =
                    document.createElement(
                        "tr"
                    );


                const position =
                    document.createElement(
                        "td"
                    );


                if (index === 0) {

                    position.textContent =
                        "🥇";

                }

                else if (index === 1) {

                    position.textContent =
                        "🥈";

                }

                else if (index === 2) {

                    position.textContent =
                        "🥉";

                }

                else {

                    position.textContent =
                        index + 1;

                }


                const pseudoCell =
                    document.createElement(
                        "td"
                    );


                pseudoCell.textContent =
                    joueur.pseudo;


                const victoireCell =
                    document.createElement(
                        "td"
                    );


                victoireCell.textContent =
                    joueur.score;


                ligne.appendChild(
                    position
                );


                ligne.appendChild(
                    pseudoCell
                );


                ligne.appendChild(
                    victoireCell
                );


                classementBody.appendChild(
                    ligne
                );

            }
        );


        if (messageClassement) {

            messageClassement.textContent =
                "🌍 Classement actualisé.";

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur chargement classement :",
            erreur
        );


        classementBody.innerHTML = `

            <tr>

                <td colspan="3">

                    ❌ Impossible de charger
                    le classement.

                </td>

            </tr>

        `;


        if (messageClassement) {

            messageClassement.textContent =
                "❌ Erreur lors du chargement.";

        }

    }

}


/* =====================================================
   REJOUER
===================================================== */

function rejouer() {

    score1 = 0;

    score2 = 0;

    jeuTermine = false;

    jeuCommence = true;

    victoireEnregistree = false;

    /*
       Nouvelle partie =
       nouveau comptage.
    */

    partieComptee = false;

    compterPartieJeu5();


    arreterJoueur1();

    arreterJoueur2();


    mettreAJourScore();

    reinitialiserBalle();


    joueur1.y =
        canvas.height / 2 -
        hauteurRaquette / 2;


    joueur2.y =
        canvas.height / 2 -
        hauteurRaquette / 2;


    if (messageElement) {

        messageElement.textContent =
            mode === 1
                ? "🏓 La partie recommence contre l'ordinateur !"
                : "🏓 La partie recommence !";

    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "none";

    }

}


/* =====================================================
   DESSIN
===================================================== */

function dessiner() {

    if (!contexte) {

        return;

    }


    /* =================================================
       FOND
    ================================================= */

    contexte.fillStyle =
        "black";


    contexte.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* =================================================
       LIGNE CENTRALE
    ================================================= */

    contexte.strokeStyle =
        "#333";


    contexte.lineWidth =
        3;


    contexte.setLineDash(
        [10, 10]
    );


    contexte.beginPath();


    contexte.moveTo(
        canvas.width / 2,
        0
    );


    contexte.lineTo(
        canvas.width / 2,
        canvas.height
    );


    contexte.stroke();


    contexte.setLineDash([]);


    /* =================================================
       JOUEUR 1
    ================================================= */

    contexte.fillStyle =
        "#00aaff";


    contexte.fillRect(

        joueur1.x,

        joueur1.y,

        joueur1.largeur,

        joueur1.hauteur

    );


    /* =================================================
       JOUEUR 2
    ================================================= */

    contexte.fillStyle =
        "#ff4444";


    contexte.fillRect(

        joueur2.x,

        joueur2.y,

        joueur2.largeur,

        joueur2.hauteur

    );


    /* =================================================
       BALLE
    ================================================= */

    contexte.beginPath();


    contexte.arc(

        balle.x,

        balle.y,

        balle.rayon,

        0,

        Math.PI * 2

    );


    contexte.fillStyle =
        "white";


    contexte.fill();


    contexte.closePath();

}


/* =====================================================
   BOUCLE PRINCIPALE
===================================================== */

function boucle() {

    mettreAJour();

    dessiner();


    requestAnimationFrame(
        boucle
    );

}


/* =====================================================
   BOUTON REJOUER
===================================================== */

if (boutonRejouer) {

    boutonRejouer.addEventListener(
        "click",
        rejouer
    );

}


/* =====================================================
   INITIALISATION
===================================================== */

mettreAJourScore();

reinitialiserBalle();

dessiner();

boucle();

chargerClassement();


console.log(
    "✅ script5.js chargé correctement."
);

console.log(
    "🎮 Jeu :",
    NOM_JEU_STATISTIQUE
);