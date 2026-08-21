
/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
"https://pxgymcwpbesqyjochwgd.supabase.co";

const SUPABASE_KEY =
"sb_publishable_F0af00-z9ZDemm9ch1tIaA_wSNCZb9G";


/*
    IDENTIFICATION DU JEU

    Space Invaders = jeu 6
*/

const JEU_ID = "6";


/* =========================================================
   ELEMENTS
========================================================= */

const pseudoAffiche =
document.getElementById("pseudoAffiche");

const listeScores =
document.getElementById("listeScores");

const statutClassement =
document.getElementById("statutClassement");



/* =========================================================
   PSEUDO / MODE VISITEUR
========================================================= */

const pseudo =
    localStorage.getItem("pseudoGameZone");

if (pseudo) {

    pseudoAffiche.textContent =
        pseudo;

} else {

    pseudoAffiche.textContent =
        "Visiteur";

}

/* =========================================================
   MEILLEUR SCORE LOCAL
========================================================= */

let meilleurScore =
Number(
    localStorage.getItem(
        "meilleurScoreSpaceInvaders"
    )
) || 0;


document.getElementById(
    "meilleurScore"
).textContent =
meilleurScore;


/* =========================================================
   CANVAS
========================================================= */

const canvas =
document.getElementById("jeuSpace");

const contexte =
canvas.getContext("2d");


/* =========================================================
   JOUEUR
========================================================= */

let joueur = {

    x:
    canvas.width / 2 - 35,

    y:
    canvas.height - 65,

    largeur:
    70,

    hauteur:
    30,

    vitesse:
    7

};


/* =========================================================
   VARIABLES
========================================================= */

let balles = [];

let ballesEnnemies = [];

let ennemis = [];

let explosions = [];

let particules = [];

let etoiles = [];

let score = 0;

let niveau = 1;

let vies = 3;

let jeuEnPause = false;

let jeuTermine = false;

let directionEnnemis = 1;

let vitesseEnnemis = 0.5;

let tempsTirEnnemi = 0;

let boss = null;

let touches = {};

let niveauEnTransition = false;


/* =========================================================
   ETOILES
========================================================= */

for (
    let i = 0;
    i < 100;
    i++
) {

    etoiles.push({

        x:
        Math.random() *
        canvas.width,

        y:
        Math.random() *
        canvas.height,

        taille:
        Math.random() * 2 + 1,

        vitesse:
        Math.random() * 0.7 + 0.2

    });

}


/* =========================================================
   CLAVIER
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        touches[
            event.key.toLowerCase()
        ] = true;


        if (
            event.key === "ArrowLeft" ||
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

        }

    }
);


document.addEventListener(
    "keyup",
    function(event) {

        touches[
            event.key.toLowerCase()
        ] = false;

    }
);


/* =========================================================
   SOURIS
========================================================= */

canvas.addEventListener(
    "mousedown",
    function(event) {

        if (event.button === 0) {

            tirer();

        }

    }
);


/* =========================================================
   CREER ENNEMIS
========================================================= */

function creerEnnemis() {

    ennemis = [];

    boss = null;

    directionEnnemis = 1;


    const lignes =
    Math.min(
        3 + Math.floor(niveau / 2),
        6
    );


    const colonnes =
    Math.min(
        7 + Math.floor(niveau / 2),
        10
    );


    const espaceX = 70;

    const espaceY = 50;


    for (
        let ligne = 0;
        ligne < lignes;
        ligne++
    ) {

        for (
            let colonne = 0;
            colonne < colonnes;
            colonne++
        ) {

            ennemis.push({

                x:
                70 +
                colonne *
                espaceX,

                y:
                55 +
                ligne *
                espaceY,

                largeur:
                45,

                hauteur:
                30,

                vie:
                niveau >= 3
                ? 2
                : 1,

                type:
                ligne === 0
                ? "fort"
                : "normal"

            });

        }

    }

}


/* =========================================================
   BOSS
========================================================= */

function creerBoss() {

    boss = {

        x:
        canvas.width / 2 - 90,

        y:
        55,

        largeur:
        180,

        hauteur:
        65,

        vie:
        10 + niveau * 3,

        vieMax:
        10 + niveau * 3,

        vitesse:
        2.5 + niveau * 0.2,

        direction:
        1

    };

}


/* =========================================================
   TIR
========================================================= */

function tirer() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;

    }


    balles.push({

        x:
        joueur.x +
        joueur.largeur / 2 - 3,

        y:
        joueur.y - 10,

        largeur:
        6,

        hauteur:
        18,

        vitesse:
        10

    });

}


/* =========================================================
   TIR ENNEMI
========================================================= */

function tirerEnnemi() {

    if (
        ennemis.length === 0
    ) {

        return;

    }


    const ennemi =
    ennemis[
        Math.floor(
            Math.random() *
            ennemis.length
        )
    ];


    ballesEnnemies.push({

        x:
        ennemi.x +
        ennemi.largeur / 2,

        y:
        ennemi.y +
        ennemi.hauteur,

        largeur:
        6,

        hauteur:
        15,

        vitesse:
        4 + niveau * 0.3

    });

}


/* =========================================================
   TIR BOSS
========================================================= */

function tirerBoss() {

    if (!boss) {

        return;

    }


    ballesEnnemies.push({

        x:
        boss.x +
        boss.largeur / 2,

        y:
        boss.y +
        boss.hauteur,

        largeur:
        9,

        hauteur:
        22,

        vitesse:
        5 + niveau * 0.3

    });

}


/* =========================================================
   CONTROLES
========================================================= */

function controles() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;

    }


    if (
        touches["q"] ||
        touches["arrowleft"]
    ) {

        joueur.x -=
        joueur.vitesse;

    }


    if (
        touches["d"] ||
        touches["arrowright"]
    ) {

        joueur.x +=
        joueur.vitesse;

    }


    if (joueur.x < 0) {

        joueur.x = 0;

    }


    if (
        joueur.x +
        joueur.largeur >
        canvas.width
    ) {

        joueur.x =
        canvas.width -
        joueur.largeur;

    }

}


/* =========================================================
   BOUGER ENNEMIS
========================================================= */

function bougerEnnemis() {

    let bord = false;


    for (
        const ennemi of ennemis
    ) {

        ennemi.x +=
        vitesseEnnemis *
        directionEnnemis;


        if (
            ennemi.x <= 10 ||
            ennemi.x +
            ennemi.largeur >=
            canvas.width - 10
        ) {

            bord = true;

        }

    }


    if (bord) {

        directionEnnemis *= -1;


        for (
            const ennemi of ennemis
        ) {

            ennemi.y += 20;

        }

    }


    if (boss) {

        boss.x +=
        boss.vitesse *
        boss.direction;


        if (
            boss.x <= 10 ||
            boss.x +
            boss.largeur >=
            canvas.width - 10
        ) {

            boss.direction *= -1;

        }

    }

}


/* =========================================================
   BALLES
========================================================= */

function bougerBalles() {

    for (
        let i = balles.length - 1;
        i >= 0;
        i--
    ) {

        balles[i].y -=
        balles[i].vitesse;


        if (
            balles[i].y < -30
        ) {

            balles.splice(
                i,
                1
            );

        }

    }

}


function bougerBallesEnnemies() {

    for (
        let i =
        ballesEnnemies.length - 1;
        i >= 0;
        i--
    ) {

        ballesEnnemies[i].y +=
        ballesEnnemies[i].vitesse;


        if (
            ballesEnnemies[i].y >
            canvas.height
        ) {

            ballesEnnemies.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   COLLISION
========================================================= */

function collision(a, b) {

    return (

        a.x <
        b.x + b.largeur

        &&

        a.x + a.largeur >
        b.x

        &&

        a.y <
        b.y + b.hauteur

        &&

        a.y + a.hauteur >
        b.y

    );

}


/* =========================================================
   EXPLOSION
========================================================= */

function creerExplosion(
    x,
    y,
    puissance = 1
) {

    explosions.push({

        x: x,

        y: y,

        taille: 5,

        vie:
        20 * puissance

    });


    for (
        let i = 0;
        i < 15 * puissance;
        i++
    ) {

        particules.push({

            x: x,

            y: y,

            vx:
            Math.random() * 6 - 3,

            vy:
            Math.random() * 6 - 3,

            vie:
            25 +
            Math.random() * 20,

            taille:
            Math.random() * 4 + 2

        });

    }

}


/* =========================================================
   COLLISIONS
========================================================= */

function verifierCollisions() {

    for (
        let i = balles.length - 1;
        i >= 0;
        i--
    ) {

        const balle =
        balles[i];

        let touche = false;


        for (
            let j =
            ennemis.length - 1;
            j >= 0;
            j--
        ) {

            const ennemi =
            ennemis[j];


            if (
                collision(
                    balle,
                    ennemi
                )
            ) {

                ennemi.vie--;

                balles.splice(
                    i,
                    1
                );


                creerExplosion(
                    balle.x,
                    balle.y,
                    0.6
                );


                if (
                    ennemi.vie <= 0
                ) {

                    ennemis.splice(
                        j,
                        1
                    );


                    ajouterScore(

                        ennemi.type === "fort"
                        ? 20
                        : 10

                    );

                }


                touche = true;

                break;

            }

        }


        if (touche) {

            continue;

        }


        if (
            boss &&
            collision(
                balle,
                boss
            )
        ) {

            boss.vie--;

            balles.splice(
                i,
                1
            );


            creerExplosion(
                balle.x,
                balle.y,
                0.8
            );


            if (
                boss.vie <= 0 &&
                !niveauEnTransition
            ) {

                niveauEnTransition =
                true;


                ajouterScore(
                    100 * niveau
                );


                creerExplosion(
                    boss.x +
                    boss.largeur / 2,

                    boss.y +
                    boss.hauteur / 2,

                    4
                );


                boss = null;


                document.getElementById(
                    "message"
                ).textContent =
                "💥 BOSS DÉTRUIT !";


                setTimeout(
                    function() {

                        if (jeuTermine) {

                            niveauEnTransition =
                            false;

                            return;

                        }


                        niveauSuivant();


                        niveauEnTransition =
                        false;

                    },
                    800
                );

            }

        }

    }


    for (
        let i =
        ballesEnnemies.length - 1;
        i >= 0;
        i--
    ) {

        if (
            collision(
                ballesEnnemies[i],
                joueur
            )
        ) {

            ballesEnnemies.splice(
                i,
                1
            );


            perdreVie();

        }

    }


    for (
        const ennemi of ennemis
    ) {

        if (
            ennemi.y +
            ennemi.hauteur >=
            joueur.y
        ) {

            terminerJeu();

            return;

        }

    }

}


/* =========================================================
   SCORE
========================================================= */

function ajouterScore(points) {

    score += points;


    if (
        score > meilleurScore
    ) {

        meilleurScore =
        score;


        localStorage.setItem(
            "meilleurScoreSpaceInvaders",
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
   PERDRE VIE
========================================================= */

function perdreVie() {

    vies--;


    document.getElementById(
        "vies"
    ).textContent =
    vies;


    creerExplosion(
        joueur.x +
        joueur.largeur / 2,

        joueur.y,

        2
    );


    if (
        vies <= 0
    ) {

        terminerJeu();

        return;

    }


    joueur.x =
    canvas.width / 2 -
    joueur.largeur / 2;


    ballesEnnemies = [];


    document.getElementById(
        "message"
    ).textContent =
    "💥 Attention ! Il te reste "
    + vies +
    " vie(s).";

}


/* =========================================================
   NIVEAU SUIVANT
========================================================= */

function niveauSuivant() {

    if (jeuTermine) {

        return;

    }


    niveau++;


    document.getElementById(
        "niveau"
    ).textContent =
    niveau;


    balles = [];

    ballesEnnemies = [];


    vitesseEnnemis =
    0.5 +
    niveau * 0.15;


    if (
        niveau % 3 === 0
    ) {

        creerBoss();


        document.getElementById(
            "message"
        ).textContent =
        "👹 BOSS ! Niveau "
        + niveau
        + " !";

    }

    else {

        creerEnnemis();


        document.getElementById(
            "message"
        ).textContent =
        "🚀 Niveau "
        + niveau
        + " !";

    }

}


/* =========================================================
   GAME OVER
========================================================= */

async function terminerJeu() {

    if (jeuTermine) {

        return;

    }


    jeuTermine = true;

    niveauEnTransition =
    false;


    document.getElementById(
        "message"
    ).textContent =
    "💀 GAME OVER ! Score : "
    + score;


    document.getElementById(
        "boutonRejouer"
    ).style.display =
    "inline-block";


    document.getElementById(
        "boutonPause"
    ).style.display =
    "none";


    await enregistrerMeilleurScore();

}


/* =========================================================
   PAUSE
========================================================= */

function pauseJeu() {

    if (jeuTermine) {

        return;

    }


    jeuEnPause =
    !jeuEnPause;


    const bouton =
    document.getElementById(
        "boutonPause"
    );


    if (jeuEnPause) {

        bouton.textContent =
        "▶️ Reprendre";


        document.getElementById(
            "message"
        ).textContent =
        "⏸️ Jeu en pause";

    }

    else {

        bouton.textContent =
        "⏸️ Pause";


        document.getElementById(
            "message"
        ).textContent =
        "🔥 C'est reparti !";

    }

}


document.getElementById(
    "boutonPause"
).addEventListener(
    "click",
    pauseJeu
);


/* =========================================================
   REJOUER
========================================================= */

function rejouer() {
    compterPartieJeu6();

    score = 0;

    niveau = 1;

    vies = 3;

    jeuTermine = false;

    jeuEnPause = false;

    niveauEnTransition = false;

    balles = [];

    ballesEnnemies = [];

    explosions = [];

    particules = [];

    boss = null;


    joueur.x =
    canvas.width / 2 -
    joueur.largeur / 2;


    vitesseEnnemis =
    0.5;


    directionEnnemis =
    1;


    tempsTirEnnemi =
    0;


    document.getElementById(
        "score"
    ).textContent =
    "0";


    document.getElementById(
        "niveau"
    ).textContent =
    "1";


    document.getElementById(
        "vies"
    ).textContent =
    "3";


    document.getElementById(
        "message"
    ).textContent =
    "🚀 Nouvelle partie !";


    document.getElementById(
        "boutonRejouer"
    ).style.display =
    "none";


    document.getElementById(
        "boutonPause"
    ).style.display =
    "inline-block";


    document.getElementById(
        "boutonPause"
    ).textContent =
    "⏸️ Pause";


    creerEnnemis();

}


/* =========================================================
   PARTICULES
========================================================= */

function bougerParticules() {

    for (
        let i =
        particules.length - 1;
        i >= 0;
        i--
    ) {

        const p =
        particules[i];


        p.x += p.vx;

        p.y += p.vy;

        p.vy += 0.05;

        p.vie--;


        if (
            p.vie <= 0
        ) {

            particules.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   EXPLOSIONS
========================================================= */

function bougerExplosions() {

    for (
        let i =
        explosions.length - 1;
        i >= 0;
        i--
    ) {

        explosions[i].taille += 2;

        explosions[i].vie--;


        if (
            explosions[i].vie <= 0
        ) {

            explosions.splice(
                i,
                1
            );

        }

    }

}


/* =========================================================
   ETOILES
========================================================= */

function bougerEtoiles() {

    for (
        const etoile of etoiles
    ) {

        etoile.y +=
        etoile.vitesse;


        if (
            etoile.y >
            canvas.height
        ) {

            etoile.y = 0;


            etoile.x =
            Math.random() *
            canvas.width;

        }

    }

}


/* =========================================================
   DESSIN FOND
========================================================= */

function dessinerFond() {

    contexte.fillStyle =
    "#02020a";


    contexte.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    for (
        const etoile of etoiles
    ) {

        contexte.fillStyle =
        "white";


        contexte.globalAlpha =
        Math.random() *
        0.5 + 0.5;


        contexte.fillRect(
            etoile.x,
            etoile.y,
            etoile.taille,
            etoile.taille
        );

    }


    contexte.globalAlpha =
    1;

}


/* =========================================================
   DESSIN JOUEUR
========================================================= */

function dessinerJoueur() {

    const x = joueur.x;

    const y = joueur.y;

    const centreX =
    x +
    joueur.largeur / 2;


    contexte.save();


    contexte.shadowBlur =
    25;

    contexte.shadowColor =
    "#00eaff";


    const gradient =
    contexte.createLinearGradient(
        x,
        y - 22,
        x,
        y + joueur.hauteur
    );


    gradient.addColorStop(
        0,
        "#ffffff"
    );

    gradient.addColorStop(
        0.25,
        "#00eaff"
    );

    gradient.addColorStop(
        0.65,
        "#008cff"
    );

    gradient.addColorStop(
        1,
        "#003cff"
    );


    contexte.fillStyle =
    gradient;


    contexte.beginPath();


    contexte.moveTo(
        centreX,
        y - 22
    );


    contexte.lineTo(
        x +
        joueur.largeur -
        8,

        y +
        joueur.hauteur
    );


    contexte.lineTo(
        x +
        joueur.largeur -
        23,

        y +
        joueur.hauteur -
        3
    );


    contexte.lineTo(
        centreX + 10,
        y + 10
    );


    contexte.lineTo(
        centreX,
        y + 15
    );


    contexte.lineTo(
        centreX - 10,
        y + 10
    );


    contexte.lineTo(
        x + 23,
        y +
        joueur.hauteur -
        3
    );


    contexte.lineTo(
        x + 8,
        y +
        joueur.hauteur
    );


    contexte.closePath();

    contexte.fill();


    contexte.strokeStyle =
    "#8fffff";

    contexte.lineWidth =
    2;

    contexte.stroke();


    /* COCKPIT */

    contexte.shadowBlur =
    15;

    contexte.shadowColor =
    "#ffffff";


    contexte.fillStyle =
    "#dfffff";


    contexte.beginPath();


    contexte.moveTo(
        centreX,
        y - 8
    );


    contexte.lineTo(
        centreX + 14,
        y + 12
    );


    contexte.lineTo(
        centreX - 14,
        y + 12
    );


    contexte.closePath();

    contexte.fill();


    /* LIGNE DU COCKPIT */

    contexte.strokeStyle =
    "#00ffff";

    contexte.lineWidth =
    2;


    contexte.beginPath();


    contexte.moveTo(
        centreX,
        y - 5
    );


    contexte.lineTo(
        centreX,
        y + 10
    );


    contexte.stroke();


    /* MOTEURS */

    contexte.shadowBlur =
    20;

    contexte.shadowColor =
    "#ff6600";

    contexte.fillStyle =
    "#ff9d00";


    contexte.fillRect(
        x + 12,
        y +
        joueur.hauteur -
        2,
        12,
        7
    );


    contexte.fillRect(
        x +
        joueur.largeur -
        24,

        y +
        joueur.hauteur -
        2,

        12,
        7
    );


    /* FLAMMES */

    contexte.shadowColor =
    "#ff1744";

    contexte.fillStyle =
    "#ff1744";


    contexte.beginPath();


    contexte.moveTo(
        x + 14,
        y +
        joueur.hauteur +
        5
    );


    contexte.lineTo(
        x + 18,
        y +
        joueur.hauteur +
        17
    );


    contexte.lineTo(
        x + 23,
        y +
        joueur.hauteur +
        5
    );


    contexte.closePath();

    contexte.fill();


    contexte.beginPath();


    contexte.moveTo(
        x +
        joueur.largeur -
        23,

        y +
        joueur.hauteur +
        5
    );


    contexte.lineTo(
        x +
        joueur.largeur -
        18,

        y +
        joueur.hauteur +
        17
    );


    contexte.lineTo(
        x +
        joueur.largeur -
        14,

        y +
        joueur.hauteur +
        5
    );


    contexte.closePath();

    contexte.fill();


    contexte.restore();

}


/* =========================================================
   DESSIN ENNEMI
========================================================= */

function dessinerEnnemi(ennemi) {

    const x =
    ennemi.x;

    const y =
    ennemi.y;


    const couleurPrincipale =
        ennemi.type === "fort"
        ? "#ff1744"
        : "#a020f0";


    const couleurClaire =
        ennemi.type === "fort"
        ? "#ff6680"
        : "#df80ff";


    contexte.save();


    contexte.shadowBlur =
    22;

    contexte.shadowColor =
    couleurPrincipale;


    /* CORPS */

    const gradient =
    contexte.createLinearGradient(
        x,
        y,
        x,
        y +
        ennemi.hauteur
    );


    gradient.addColorStop(
        0,
        couleurClaire
    );


    gradient.addColorStop(
        0.35,
        couleurPrincipale
    );


    gradient.addColorStop(
        1,
        "#250020"
    );


    contexte.fillStyle =
    gradient;


    contexte.beginPath();


    contexte.roundRect(
        x + 3,
        y + 5,
        ennemi.largeur - 6,
        ennemi.hauteur - 8,
        8
    );


    contexte.fill();


    /* CONTOUR */

    contexte.strokeStyle =
    couleurClaire;

    contexte.lineWidth =
    2;

    contexte.stroke();


    /* ANTENNES */

    contexte.strokeStyle =
    couleurClaire;

    contexte.lineWidth =
    3;


    contexte.beginPath();


    contexte.moveTo(
        x + 10,
        y + 7
    );


    contexte.lineTo(
        x + 4,
        y - 5
    );


    contexte.moveTo(
        x +
        ennemi.largeur -
        10,

        y + 7
    );


    contexte.lineTo(
        x +
        ennemi.largeur -
        4,

        y - 5
    );


    contexte.stroke();


    /* YEUX */

    contexte.shadowBlur =
    12;

    contexte.shadowColor =
    "#ffffff";


    contexte.fillStyle =
    "#ffffff";


    contexte.fillRect(
        x + 9,
        y + 11,
        8,
        9
    );


    contexte.fillRect(
        x +
        ennemi.largeur -
        17,

        y + 11,

        8,
        9
    );


    /* PUPILLES */

    contexte.fillStyle =
    "#050505";


    contexte.fillRect(
        x + 12,
        y + 13,
        3,
        5
    );


    contexte.fillRect(
        x +
        ennemi.largeur -
        14,

        y + 13,

        3,
        5
    );


    /* BOUCHE */

    contexte.strokeStyle =
    couleurClaire;

    contexte.lineWidth =
    2;


    contexte.beginPath();


    contexte.moveTo(
        x + 12,
        y + 25
    );


    contexte.lineTo(
        x + 18,
        y + 20
    );


    contexte.lineTo(
        x + 25,
        y + 25
    );


    contexte.lineTo(
        x + 32,
        y + 20
    );


    contexte.lineTo(
        x + 39,
        y + 25
    );


    contexte.stroke();


    /* LUMIERES */

    contexte.fillStyle =
    "#ffffff";

    contexte.shadowBlur =
    10;


    contexte.fillRect(
        x + 4,
        y +
        ennemi.hauteur -
        5,

        5,
        3
    );


    contexte.fillRect(
        x +
        ennemi.largeur -
        9,

        y +
        ennemi.hauteur -
        5,

        5,
        3
    );


    contexte.restore();

}


/* =========================================================
   DESSIN BOSS
========================================================= */

function dessinerBoss() {

    if (!boss) {

        return;

    }


    const x =
    boss.x;

    const y =
    boss.y;


    contexte.save();


    contexte.shadowBlur =
    35;

    contexte.shadowColor =
    "#ff004c";


    /* CORPS */

    const gradient =
    contexte.createLinearGradient(
        x,
        y,
        x,
        y +
        boss.hauteur
    );


    gradient.addColorStop(
        0,
        "#ff315f"
    );


    gradient.addColorStop(
        0.3,
        "#b0004c"
    );


    gradient.addColorStop(
        0.7,
        "#4b0035"
    );


    gradient.addColorStop(
        1,
        "#120018"
    );


    contexte.fillStyle =
    gradient;


    contexte.beginPath();


    contexte.roundRect(
        x,
        y,
        boss.largeur,
        boss.hauteur,
        18
    );


    contexte.fill();


    /* CONTOUR */

    contexte.strokeStyle =
    "#ff5577";

    contexte.lineWidth =
    4;

    contexte.stroke();


    /* AILES */

    contexte.fillStyle =
    "#67003e";


    contexte.beginPath();


    contexte.moveTo(
        x,
        y + 15
    );


    contexte.lineTo(
        x - 28,
        y + 42
    );


    contexte.lineTo(
        x,
        y + 48
    );


    contexte.closePath();

    contexte.fill();


    contexte.strokeStyle =
    "#ff1744";

    contexte.lineWidth =
    2;

    contexte.stroke();


    contexte.beginPath();


    contexte.moveTo(
        x +
        boss.largeur,

        y + 15
    );


    contexte.lineTo(
        x +
        boss.largeur +
        28,

        y + 42
    );


    contexte.lineTo(
        x +
        boss.largeur,

        y + 48
    );


    contexte.closePath();

    contexte.fill();

    contexte.stroke();


    /* YEUX */

    contexte.shadowBlur =
    20;

    contexte.shadowColor =
    "#ffff00";


    contexte.fillStyle =
    "#ffff00";


    contexte.fillRect(
        x + 35,
        y + 20,
        38,
        16
    );


    contexte.fillRect(
        x +
        boss.largeur -
        73,

        y + 20,

        38,
        16
    );


    /* PUPILLES */

    contexte.fillStyle =
    "#ff3300";


    contexte.fillRect(
        x + 48,
        y + 22,
        8,
        12
    );


    contexte.fillRect(
        x +
        boss.largeur -
        56,

        y + 22,

        8,
        12
    );


    /* NOYAU CENTRAL */

    contexte.shadowBlur =
    25;

    contexte.shadowColor =
    "#00ffff";


    contexte.fillStyle =
    "#00ffff";


    contexte.beginPath();


    contexte.arc(
        x +
        boss.largeur / 2,

        y + 38,

        12,

        0,
        Math.PI * 2
    );


    contexte.fill();


    contexte.fillStyle =
    "#ffffff";


    contexte.beginPath();


    contexte.arc(
        x +
        boss.largeur / 2,

        y + 38,

        5,

        0,
        Math.PI * 2
    );


    contexte.fill();


    /* BARRE DE VIE */

    contexte.shadowBlur =
    0;


    contexte.fillStyle =
    "#100010";


    contexte.fillRect(
        x,
        y - 17,
        boss.largeur,
        9
    );


    contexte.fillStyle =
    "#00ff55";


    contexte.fillRect(
        x,
        y - 17,

        boss.largeur *
        (
            boss.vie /
            boss.vieMax
        ),

        9
    );


    contexte.strokeStyle =
    "#ffffff";

    contexte.lineWidth =
    1;


    contexte.strokeRect(
        x,
        y - 17,
        boss.largeur,
        9
    );


    /* CIRCUITS */

    contexte.strokeStyle =
    "#ff5577";

    contexte.lineWidth =
    2;


    contexte.beginPath();


    contexte.moveTo(
        x + 15,
        y + 48
    );


    contexte.lineTo(
        x + 45,
        y + 48
    );


    contexte.lineTo(
        x + 55,
        y + 55
    );


    contexte.moveTo(
        x +
        boss.largeur -
        15,

        y + 48
    );


    contexte.lineTo(
        x +
        boss.largeur -
        45,

        y + 48
    );


    contexte.lineTo(
        x +
        boss.largeur -
        55,

        y + 55
    );


    contexte.stroke();


    contexte.restore();

}


/* =========================================================
   DESSIN GENERAL
========================================================= */

function dessiner() {

    dessinerFond();


    dessinerJoueur();


    for (
        const balle of balles
    ) {

        contexte.fillStyle =
        "#00ffcc";


        contexte.fillRect(
            balle.x,
            balle.y,
            balle.largeur,
            balle.hauteur
        );

    }


    for (
        const balle of ballesEnnemies
    ) {

        contexte.fillStyle =
        "#ff3355";


        contexte.fillRect(
            balle.x,
            balle.y,
            balle.largeur,
            balle.hauteur
        );

    }


    for (
        const ennemi of ennemis
    ) {

        dessinerEnnemi(
            ennemi
        );

    }


    dessinerBoss();


    for (
        const explosion of explosions
    ) {

        contexte.fillStyle =
        "#ff6600";


        contexte.beginPath();


        contexte.arc(
            explosion.x,
            explosion.y,
            explosion.taille,
            0,
            Math.PI * 2
        );


        contexte.fill();

    }


    for (
        const p of particules
    ) {

        contexte.globalAlpha =
        Math.max(
            0,
            p.vie / 40
        );


        contexte.fillStyle =
        "#ffaa00";


        contexte.fillRect(
            p.x,
            p.y,
            p.taille,
            p.taille
        );

    }


    contexte.globalAlpha =
    1;

}


/* =========================================================
   BOUCLE
========================================================= */

function boucle() {

    if (
        !jeuEnPause &&
        !jeuTermine
    ) {

        controles();

        bougerEnnemis();

        bougerBalles();

        bougerBallesEnnemies();

        verifierCollisions();

        bougerExplosions();

        bougerParticules();

        bougerEtoiles();


        tempsTirEnnemi++;


        const intervalle =
        Math.max(
            25,
            100 -
            niveau * 5
        );


        if (
            tempsTirEnnemi >=
            intervalle
        ) {

            tirerEnnemi();

            tempsTirEnnemi =
            0;

        }


        if (
            boss &&
            Math.random() < 0.02
        ) {

            tirerBoss();

        }


        if (
            ennemis.length === 0 &&
            !boss &&
            !niveauEnTransition
        ) {

            niveauSuivant();

        }

    }


    dessiner();


    requestAnimationFrame(
        boucle
    );

}


/* =========================================================
   CONTROLES TELEPHONE
========================================================= */

function maintenirBouton(
    bouton,
    action
) {

    let intervalle = null;


    function commencer(event) {

        event.preventDefault();


        action();


        intervalle =
        setInterval(
            action,
            40
        );

    }


    function arreter(event) {

        event.preventDefault();


        clearInterval(
            intervalle
        );


        intervalle = null;

    }


    bouton.addEventListener(
        "touchstart",
        commencer,
        {
            passive: false
        }
    );


    bouton.addEventListener(
        "touchend",
        arreter,
        {
            passive: false
        }
    );


    bouton.addEventListener(
        "touchcancel",
        arreter,
        {
            passive: false
        }
    );


    bouton.addEventListener(
        "mousedown",
        commencer
    );


    bouton.addEventListener(
        "mouseup",
        arreter
    );


    bouton.addEventListener(
        "mouseleave",
        arreter
    );

}


/* =========================================================
   BOUTON GAUCHE
========================================================= */

maintenirBouton(

    document.getElementById(
        "gauche"
    ),

    function() {

        if (
            jeuTermine ||
            jeuEnPause
        ) {

            return;

        }


        joueur.x -=
        joueur.vitesse * 2.2;


        if (
            joueur.x < 0
        ) {

            joueur.x = 0;

        }

    }

);


/* =========================================================
   BOUTON DROITE
========================================================= */

maintenirBouton(

    document.getElementById(
        "droite"
    ),

    function() {

        if (
            jeuTermine ||
            jeuEnPause
        ) {

            return;

        }


        joueur.x +=
        joueur.vitesse * 2.2;


        if (
            joueur.x +
            joueur.largeur >
            canvas.width
        ) {

            joueur.x =
            canvas.width -
            joueur.largeur;

        }

    }

);


/* =========================================================
   TIR TELEPHONE
========================================================= */

const boutonTirer =
document.getElementById(
    "tirer"
);


let tirDejaEffectue =
false;


function appuyerTir(event) {

    event.preventDefault();


    if (
        tirDejaEffectue
    ) {

        return;

    }


    tirer();


    tirDejaEffectue =
    true;

}


function relacherTir(event) {

    event.preventDefault();


    tirDejaEffectue =
    false;

}


boutonTirer.addEventListener(
    "touchstart",
    appuyerTir,
    {
        passive: false
    }
);


boutonTirer.addEventListener(
    "touchend",
    relacherTir,
    {
        passive: false
    }
);


boutonTirer.addEventListener(
    "touchcancel",
    relacherTir,
    {
        passive: false
    }
);


boutonTirer.addEventListener(
    "mousedown",
    appuyerTir
);


boutonTirer.addEventListener(
    "mouseup",
    relacherTir
);


/* =========================================================
   SUPABASE
   ENREGISTREMENT MEILLEUR SCORE
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
        "&jeu=eq.6" +
        "&select=id,pseudo,score,jeu" +
        "&order=score.desc" +
        "&limit=1";


        const recherche =
        await fetch(
            urlRecherche,
            {

                method:
                "GET",

                headers: {

                    "apikey":
                    SUPABASE_KEY,

                    "Authorization":
                    "Bearer " +
                    SUPABASE_KEY

                }

            }
        );


        if (!recherche.ok) {

            const texte =
            await recherche.text();


            console.error(
                "ERREUR RECHERCHE :",
                texte
            );


            throw new Error(
                texte
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

                    method:
                    "POST",

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
                        "6"

                    })

                }
            );


            if (!insertion.ok) {

                const texte =
                await insertion.text();


                console.error(
                    "ERREUR INSERT :",
                    texte
                );


                throw new Error(
                    texte
                );

            }


            statutClassement.textContent =
            "🏆 Premier score enregistré !";

        }


        /* =================================================
           SCORE EXISTANT
        ================================================= */

        else {

            const ancien =
            Number(
                anciensScores[0].score
            );


            /* =============================================
               NOUVEAU RECORD
            ============================================= */

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

                        method:
                        "PATCH",

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
                            "6"

                        })

                    }

                );


                if (!miseAJour.ok) {

                    const texte =
                    await miseAJour.text();


                    console.error(
                        "ERREUR UPDATE :",
                        texte
                    );


                    throw new Error(
                        texte
                    );

                }


                statutClassement.textContent =
                "🔥 NOUVEAU RECORD ! " +
                score +
                " points !";

            }


            /* =============================================
               PAS DE NOUVEAU RECORD
            ============================================= */

            else {

                statutClassement.textContent =
                "ℹ️ Ton meilleur score reste " +
                ancien +
                " points.";

            }

        }


        await chargerClassement();

    }


    catch (erreur) {

        console.error(
            "ERREUR ENREGISTREMENT :",
            erreur
        );


        statutClassement.textContent =
        "❌ Erreur lors de l'enregistrement.";

    }

}


/* =========================================================
   SUPABASE
   TOP 10 SPACE INVADERS
========================================================= */

async function chargerClassement() {

    try {

        statutClassement.textContent =
        "⏳ Chargement du classement...";


        const url =
        SUPABASE_URL +
        "/rest/v1/scores" +
        "?jeu=eq.6" +
        "&select=pseudo,score,jeu" +
        "&order=score.desc" +
        "&limit=10";


        const resultat =
        await fetch(
            url,
            {

                method:
                "GET",

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


        if (!resultat.ok) {

            const texte =
            await resultat.text();


            console.error(
                "ERREUR CLASSEMENT :",
                texte
            );


            throw new Error(
                texte
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

                        Aucun score pour
                        Space Invaders.

                    </td>

                </tr>

            `;


            statutClassement.textContent =
            "🌍 Aucun score enregistré pour le jeu 6.";


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


                const celluleNumero =
                document.createElement(
                    "td"
                );


                if (
                    index === 0
                ) {

                    celluleNumero.textContent =
                    "🥇";

                }

                else if (
                    index === 1
                ) {

                    celluleNumero.textContent =
                    "🥈";

                }

                else if (
                    index === 2
                ) {

                    celluleNumero.textContent =
                    "🥉";

                }

                else {

                    celluleNumero.textContent =
                    index + 1;

                }


                const cellulePseudo =
                document.createElement(
                    "td"
                );


                cellulePseudo.textContent =
                joueurScore.pseudo;


                const celluleScore =
                document.createElement(
                    "td"
                );


                celluleScore.textContent =
                Number(
                    joueurScore.score
                );


                ligne.appendChild(
                    celluleNumero
                );


                ligne.appendChild(
                    cellulePseudo
                );


                ligne.appendChild(
                    celluleScore
                );


                listeScores.appendChild(
                    ligne
                );

            }
        );


        statutClassement.textContent =
        "🌍 Classement Space Invaders actualisé.";

    }


    catch (erreur) {

        console.error(
            "ERREUR TOP 10 :",
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
   JEUX DU MOMENT
   COMPTAGE DES PARTIES — JEU 6
========================================================= */

async function compterPartieJeu6() {

    try {

        console.log("🔄 Comptage Space Invaders...");

        const url =
            SUPABASE_URL +
            "/rest/v1/statistiques_jeux" +
            "?id=eq.22" +
            "&select=id,nom_jeu,nombre_parties,ordre";

        console.log("🌐 URL :", url);


        const recherche =
            await fetch(
                url,
                {
                    method: "GET",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " + SUPABASE_KEY,
                        "Accept":
                            "application/json"
                    }
                }
            );


        console.log(
            "📡 Statut :",
            recherche.status
        );


        const texte =
            await recherche.text();

        console.log(
            "📦 Réponse brute :",
            texte
        );


        if (!recherche.ok) {

            throw new Error(texte);

        }


        const statistiques =
            JSON.parse(texte);


        if (
            !Array.isArray(statistiques) ||
            statistiques.length === 0
        ) {

            console.error(
                "❌ Supabase ne retourne aucune ligne pour id=22."
            );

            return;

        }


        const jeu =
            statistiques[0];


        console.log(
            "🎮 Jeu trouvé :",
            jeu
        );


        const nouveauNombre =
            Number(jeu.nombre_parties) + 1;


        /* =========================================
           MISE À JOUR
        ========================================= */

        const updateUrl =
            SUPABASE_URL +
            "/rest/v1/statistiques_jeux" +
            "?id=eq.22";


        const miseAJour =
            await fetch(
                updateUrl,
                {
                    method: "PATCH",

                    headers: {
                        "apikey": SUPABASE_KEY,

                        "Authorization":
                            "Bearer " + SUPABASE_KEY,

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

            const erreur =
                await miseAJour.text();

            throw new Error(erreur);

        }


        console.log(
            "🚀 Space Invaders : " +
            nouveauNombre +
            " parties"
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur comptage Jeux du moment :",
            erreur
        );

    }

}
/* =========================================================
   DEMARRAGE
========================================================= */

creerEnnemis();

dessiner();

chargerClassement();

/*
    Comptage du Jeu 6 dans
    "Jeux du moment"
*/

compterPartieJeu6();

boucle();