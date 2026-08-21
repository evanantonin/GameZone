/* =========================================================
   GAMEZONE — SCRIPT 7 — FLAPPY BIRD
=========================================================
   👤 Mode visiteur autorisé
   🔐 Compte connecté = classement mondial
   🏆 Classement mondial Supabase
   📊 Compteur global des parties
   💾 Meilleur score local
   📱 PC + mobile
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

const JEU_ID = "7";


/* =========================================================
   ELEMENTS HTML
========================================================= */

const canvas =
    document.getElementById(
        "jeuFlappy"
    );


const ctx =
    canvas
        ? canvas.getContext("2d")
        : null;


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


const messageElement =
    document.getElementById(
        "message"
    );


const pseudoElement =
    document.getElementById(
        "pseudoJoueur"
    );


const boutonMobile =
    document.getElementById(
        "boutonMobile"
    );


const boutonRejouer =
    document.getElementById(
        "boutonRejouer"
    );


const tableauScores =
    document.getElementById(
        "tableauScores"
    );


/* =========================================================
   VERIFICATION CANVAS
========================================================= */

if (!canvas || !ctx) {

    console.error(
        "❌ Canvas #jeuFlappy introuvable."
    );

    throw new Error(
        "Canvas Flappy introuvable."
    );

}


/* =========================================================
   UTILISATEUR
========================================================= */

let utilisateurConnecte =
    false;


let pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


/* =========================================================
   VERIFICATION DU COMPTE
   MODE VISITEUR AUTORISE
========================================================= */

async function verifierConnexionFlappy() {

    /*
       Si Supabase n'est pas disponible,
       on autorise le mode visiteur.
    */

    if (!supabaseClient) {

        console.warn(
            "⚠️ Supabase non disponible."
        );

        utilisateurConnecte =
            false;

        pseudo =
            null;

        if (pseudoElement) {

            pseudoElement.textContent =
                "Visiteur";

        }

        return true;

    }


    try {

        /*
           Vérifier la session actuelle.
        */

        const resultat =
            await supabaseClient.auth.getSession();


        /*
           Erreur de session :
           mode visiteur.
        */

        if (resultat.error) {

            console.warn(
                "⚠️ Erreur vérification session :",
                resultat.error
            );

            utilisateurConnecte =
                false;

            pseudo =
                null;

            if (pseudoElement) {

                pseudoElement.textContent =
                    "Visiteur";

            }

            return true;

        }


        const session =
            resultat.data.session;


        /*
           =================================================
           VISITEUR
           =================================================
        */

        if (!session) {

            console.log(
                "👤 Mode visiteur activé."
            );

            utilisateurConnecte =
                false;

            pseudo =
                null;

            if (pseudoElement) {

                pseudoElement.textContent =
                    "Visiteur";

            }

            return true;

        }


        /*
           =================================================
           COMPTE CONNECTÉ
           =================================================
        */

        utilisateurConnecte =
            true;


        console.log(
            "✅ Compte connecté :",
            session.user.email
        );


        /*
           Le pseudo est récupéré
           depuis le localStorage.
        */

        pseudo =
            localStorage.getItem(
                "pseudoGameZone"
            );


        if (pseudoElement) {

            pseudoElement.textContent =
                pseudo ||
                "Joueur";

        }


        return true;

    }

    catch (erreur) {

        console.warn(
            "⚠️ Vérification connexion impossible :",
            erreur
        );


        /*
           En cas de problème,
           le mode visiteur reste autorisé.
        */

        utilisateurConnecte =
            false;


        pseudo =
            null;


        if (pseudoElement) {

            pseudoElement.textContent =
                "Visiteur";

        }


        return true;

    }

}


/* =========================================================
   PSEUDO AFFICHAGE
========================================================= */

if (pseudoElement) {

    if (utilisateurConnecte && pseudo) {

        pseudoElement.textContent =
            pseudo;

    }

    else {

        pseudoElement.textContent =
            "Visiteur";

    }

}


/* =========================================================
   MEILLEUR SCORE LOCAL
========================================================= */

function obtenirCleMeilleurScore() {

    /*
       Compte connecté :
       score associé au pseudo.

       Visiteur :
       score associé à "visiteur".
    */

    if (
        utilisateurConnecte &&
        pseudo
    ) {

        return (
            "meilleurScoreFlappy_" +
            pseudo
        );

    }


    return "meilleurScoreFlappy_visiteur";

}


/* =========================================================
   CLE SCORE
========================================================= */

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
   COMPTEUR LOCAL DES PARTIES
========================================================= */

function obtenirClePartiesJouees() {

    if (
        utilisateurConnecte &&
        pseudo
    ) {

        return (
            "partiesJoueesFlappy_" +
            pseudo
        );

    }


    return "partiesJoueesFlappy_visiteur";

}


let clePartiesJouees =
    obtenirClePartiesJouees();


let partiesJouees =
    Number(
        localStorage.getItem(
            clePartiesJouees
        )
    ) || 0;


let partieComptee =
    false;


/* =========================================================
   VARIABLES DU JEU
========================================================= */

let oiseau = null;

let tuyaux = [];

let score = 0;

let niveau = 1;

let jeuCommence = false;

let jeuTermine = false;

let animationID = null;

let dernierTemps = 0;

let tempsDernierTuyau = 0;


/* =========================================================
   PARAMETRES DU JEU
========================================================= */

const GRAVITE_BASE =
    950;


const SAUT_BASE =
    -350;


const VITESSE_BASE =
    170;


const VITESSE_MAX =
    330;


let gravite =
    GRAVITE_BASE;


let puissanceSaut =
    SAUT_BASE;


let vitesse =
    VITESSE_BASE;


let espaceTuyaux =
    155;


let intervalleTuyaux =
    1.45;


/* =========================================================
   DIMENSIONS
========================================================= */

const LARGEUR_OISEAU =
    34;


const HAUTEUR_OISEAU =
    26;


const LARGEUR_TUYAU =
    65;


const HAUTEUR_SOL =
    18;


/* =========================================================
   INITIALISATION
========================================================= */

function initialiserJeu() {

    /*
       Annuler une ancienne boucle.
    */

    if (animationID !== null) {

        cancelAnimationFrame(
            animationID
        );

        animationID =
            null;

    }


    /*
       OISEAU
    */

    oiseau = {

        x: 120,

        y:
            canvas.height / 2,

        largeur:
            LARGEUR_OISEAU,

        hauteur:
            HAUTEUR_OISEAU,

        vitesseY: 0

    };


    /*
       TUYAUX
    */

    tuyaux = [];


    /*
       SCORE
    */

    score = 0;

    niveau = 1;


    /*
       DIFFICULTE
    */

    vitesse =
        VITESSE_BASE;


    gravite =
        GRAVITE_BASE;


    puissanceSaut =
        SAUT_BASE;


    espaceTuyaux =
        155;


    intervalleTuyaux =
        1.45;


    /*
       ETAT
    */

    jeuCommence =
        false;


    jeuTermine =
        false;


    dernierTemps =
        0;


    tempsDernierTuyau =
        0;


    partieComptee =
        false;


    /*
       AFFICHAGE
    */

    if (scoreElement) {

        scoreElement.textContent =
            "0";

    }


    if (niveauElement) {

        niveauElement.textContent =
            "1";

    }


    if (messageElement) {

        messageElement.textContent =
            "Clique pour commencer !";

    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "none";

    }


    /*
       Dessin initial.
    */

    dessiner();

}


/* =========================================================
   COMPTER UNE PARTIE
========================================================= */

async function compterPartie() {

    /*
       Compteur local.
    */

    partiesJouees++;


    localStorage.setItem(

        clePartiesJouees,

        partiesJouees

    );


    /*
       Compteur global Supabase.
    */

    await compterPartieJeu7();

}


/* =========================================================
   SAUT
========================================================= */

function sauter() {

    /*
       Si le jeu est terminé,
       ne rien faire.
    */

    if (jeuTermine) {

        return;

    }


    /*
       Premier saut :
       démarrage.
    */

    if (!jeuCommence) {

        jeuCommence =
            true;


        /*
           Compter une seule partie.
        */

        if (!partieComptee) {

            partieComptee =
                true;


            compterPartie();

        }


        if (messageElement) {

            messageElement.textContent =
                "";

        }


        /*
           Initialiser le temps.
        */

        dernierTemps =
            performance.now();


        tempsDernierTuyau =
            dernierTemps;


        animationID =
            requestAnimationFrame(
                boucle
            );

    }


    /*
       Saut.
    */

    oiseau.vitesseY =
        puissanceSaut;

}


/* =========================================================
   CONTROLE CANVAS
========================================================= */

canvas.addEventListener(

    "pointerdown",

    function(event) {

        event.preventDefault();

        sauter();

    },

    {
        passive: false
    }

);


/* =========================================================
   CONTROLE MOBILE
========================================================= */

if (boutonMobile) {

    boutonMobile.addEventListener(

        "pointerdown",

        function(event) {

            event.preventDefault();

            sauter();

        },

        {
            passive: false
        }

    );

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

            event.code === "Space" ||

            event.key === "ArrowUp" ||

            touche === "z"

        ) {

            event.preventDefault();

            sauter();

        }

    }

);


/* =========================================================
   CREER UN TUYAU
========================================================= */

function creerTuyau() {

    const hauteurMin =
        55;


    const hauteurMax =
        canvas.height -
        HAUTEUR_SOL -
        espaceTuyaux -
        55;


    if (
        hauteurMax <= hauteurMin
    ) {

        return;

    }


    const hauteurHaut =
        Math.floor(

            Math.random() *
            (
                hauteurMax -
                hauteurMin
            )

        ) +
        hauteurMin;


    tuyaux.push({

        x:
            canvas.width,

        largeur:
            LARGEUR_TUYAU,

        hauteurHaut:
            hauteurHaut,

        espace:
            espaceTuyaux,

        passe:
            false

    });

}


/* =========================================================
   DIFFICULTE
========================================================= */

function augmenterDifficulte() {

    /*
       Nouveau niveau tous les 5 points.
    */

    niveau =
        Math.floor(
            score / 5
        ) + 1;


    if (niveauElement) {

        niveauElement.textContent =
            niveau;

    }


    /*
       Vitesse progressive.
    */

    vitesse =
        Math.min(

            VITESSE_MAX,

            VITESSE_BASE +
            (
                niveau - 1
            ) *
            20

        );


    /*
       Passage plus petit.
    */

    espaceTuyaux =
        Math.max(

            112,

            155 -
            (
                niveau - 1
            ) *
            5

        );


    /*
       Tuyaux légèrement
       plus fréquents.
    */

    intervalleTuyaux =
        Math.max(

            0.95,

            1.45 -
            (
                niveau - 1
            ) *
            0.05

        );

}


/* =========================================================
   COLLISION
========================================================= */

function collision(
    oiseau,
    tuyau
) {

    const margeX =
        5;


    const margeY =
        4;


    const gauche =
        oiseau.x +
        margeX;


    const droite =
        oiseau.x +
        oiseau.largeur -
        margeX;


    const haut =
        oiseau.y +
        margeY;


    const bas =
        oiseau.y +
        oiseau.hauteur -
        margeY;


    const tuyauGauche =
        tuyau.x;


    const tuyauDroite =
        tuyau.x +
        tuyau.largeur;


    const basTuyauHaut =
        tuyau.hauteurHaut;


    const hautTuyauBas =
        tuyau.hauteurHaut +
        tuyau.espace;


    const collisionX =
        droite > tuyauGauche &&
        gauche < tuyauDroite;


    if (!collisionX) {

        return false;

    }


    if (

        haut < basTuyauHaut ||

        bas > hautTuyauBas

    ) {

        return true;

    }


    return false;

}


/* =========================================================
   GAME OVER
========================================================= */

async function gameOver() {

    /*
       Empêcher plusieurs appels.
    */

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


    /*
       Meilleur score local.
    */

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


        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;

        }

    }


    /*
       Message.
    */

    if (messageElement) {

        if (utilisateurConnecte) {

            messageElement.textContent =
                "💥 Game Over ! Score : " +
                score;

        }

        else {

            messageElement.textContent =
                "💥 Game Over ! Score : " +
                score +
                " — 👤 Mode visiteur";

        }

    }


    /*
       Bouton Rejouer.
    */

    if (boutonRejouer) {

        boutonRejouer.style.display =
            "inline-block";

    }


    /*
       Dernier dessin.
    */

    dessiner();


    /*
       Enregistrer uniquement
       si un compte est connecté.
    */

    if (
        utilisateurConnecte &&
        pseudo
    ) {

        await enregistrerScoreSupabase();

    }

    else {

        console.log(
            "👤 Visiteur : score non envoyé au classement."
        );

    }

}


/* =========================================================
   ENREGISTRER SCORE FLAPPY DANS SUPABASE
========================================================= */

async function enregistrerScoreSupabase() {

    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        console.log(
            "⚠️ Aucun pseudo enregistré."
        );

        return;

    }


    if (!supabaseClient) {

        console.error(
            "❌ Supabase non disponible."
        );

        return;

    }


    try {

        console.log(
            "💾 Enregistrement score Flappy :",
            pseudoActuel,
            score
        );


        /*
           Rechercher le score du joueur.
        */

        const resultat =
            await supabaseClient
                .from("scores_flappy")
                .select(
                    "pseudo,score,created_at,user_id"
                )
                .eq(
                    "pseudo",
                    pseudoActuel
                )
                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche score Flappy :",
                resultat.error
            );

            return;

        }


        /*
           SCORE EXISTANT
        */

        if (

            resultat.data &&
            resultat.data.length > 0

        ) {

            const ancienScore =
                Number(
                    resultat.data[0].score
                ) || 0;


            /*
               Score moins bon.
            */

            if (
                score <= ancienScore
            ) {

                console.log(
                    "ℹ️ Ancien meilleur score conservé :",
                    ancienScore
                );

                return;

            }


            /*
               Nouveau record.
            */

            const miseAJour =
                await supabaseClient
                    .from("scores_flappy")
                    .update({

                        score:
                            score,

                        created_at:
                            new Date().toISOString()

                    })
                    .eq(
                        "pseudo",
                        pseudoActuel
                    );


            if (miseAJour.error) {

                console.error(
                    "❌ Erreur mise à jour Flappy :",
                    miseAJour.error
                );

                return;

            }


            console.log(
                "✅ Nouveau record Flappy :",
                score
            );

        }


        /*
           PREMIER SCORE
        */

        else {

            const insertion =
                await supabaseClient
                    .from("scores_flappy")
                    .insert({

                        pseudo:
                            pseudoActuel,

                        score:
                            score,

                        created_at:
                            new Date().toISOString(),

                        user_id:
                            null

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur insertion Flappy :",
                    insertion.error
                );

                return;

            }


            console.log(
                "✅ Premier score Flappy enregistré :",
                score
            );

        }


        /*
           Recharger classement.
        */

        await afficherClassement();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur enregistrement Flappy :",
            erreur
        );

    }

}


/* =========================================================
   CLASSEMENT TOP 10
========================================================= */

async function afficherClassement() {

    if (!tableauScores) {

        return;

    }


    tableauScores.innerHTML = `

        <tr>

            <td colspan="3">
                ⏳ Chargement...
            </td>

        </tr>

    `;


    if (!supabaseClient) {

        tableauScores.innerHTML = `

            <tr>

                <td colspan="3">
                    ❌ Classement indisponible.
                </td>

            </tr>

        `;

        return;

    }


    try {

        const resultat =
            await supabaseClient

                .from("scores_flappy")

                .select(
                    "pseudo,score"
                )

                .order(

                    "score",

                    {
                        ascending: false
                    }

                )

                .limit(10);


        if (resultat.error) {

            throw resultat.error;

        }


        const scores =
            resultat.data || [];


        /*
           Aucun score.
        */

        if (
            scores.length === 0
        ) {

            tableauScores.innerHTML = `

                <tr>

                    <td colspan="3">
                        Aucun score pour le moment.
                    </td>

                </tr>

            `;

            return;

        }


        tableauScores.innerHTML =
            "";


        /*
           Afficher les scores.
        */

        scores.forEach(

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


                const pseudoCellule =
                    document.createElement(
                        "td"
                    );


                const scoreCellule =
                    document.createElement(
                        "td"
                    );


                /*
                   Position.
                */

                if (
                    index === 0
                ) {

                    position.textContent =
                        "🥇";

                }

                else if (
                    index === 1
                ) {

                    position.textContent =
                        "🥈";

                }

                else if (
                    index === 2
                ) {

                    position.textContent =
                        "🥉";

                }

                else {

                    position.textContent =
                        index + 1;

                }


                /*
                   Pseudo.
                */

                pseudoCellule.textContent =
                    joueur.pseudo;


                /*
                   Score.
                */

                scoreCellule.textContent =
                    Number(
                        joueur.score
                    );


                /*
                   Joueur connecté.
                */

                if (

                    utilisateurConnecte &&

                    pseudo &&

                    joueur.pseudo ===
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
                    position
                );


                ligne.appendChild(
                    pseudoCellule
                );


                ligne.appendChild(
                    scoreCellule
                );


                tableauScores.appendChild(
                    ligne
                );

            }

        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur classement Flappy :",
            erreur
        );


        tableauScores.innerHTML = `

            <tr>

                <td colspan="3">
                    ❌ Impossible de charger le classement.
                </td>

            </tr>

        `;

    }

}


/* =========================================================
   MISE A JOUR DU JEU
========================================================= */

function mettreAJour(
    deltaSecondes,
    maintenant
) {

    /*
       PHYSIQUE OISEAU
    */

    oiseau.vitesseY +=
        gravite *
        deltaSecondes;


    oiseau.y +=
        oiseau.vitesseY *
        deltaSecondes;


    /*
       TUYAUX
    */

    for (

        let i = tuyaux.length - 1;

        i >= 0;

        i--

    ) {

        const tuyau =
            tuyaux[i];


        /*
           Déplacement.
        */

        tuyau.x -=
            vitesse *
            deltaSecondes;


        /*
           SCORE.
        */

        if (

            !tuyau.passe &&

            tuyau.x +
            tuyau.largeur <
            oiseau.x

        ) {

            tuyau.passe =
                true;


            score++;


            if (scoreElement) {

                scoreElement.textContent =
                    score;

            }


            augmenterDifficulte();

        }


        /*
           Collision.
        */

        if (
            collision(
                oiseau,
                tuyau
            )
        ) {

            gameOver();

            return;

        }


        /*
           Supprimer tuyaux
           sortis de l'écran.
        */

        if (

            tuyau.x +
            tuyau.largeur <
            0

        ) {

            tuyaux.splice(
                i,
                1
            );

        }

    }


    /*
       CREATION TUYAUX
    */

    if (

        maintenant -
        tempsDernierTuyau >=
        intervalleTuyaux * 1000

    ) {

        creerTuyau();


        tempsDernierTuyau =
            maintenant;

    }


    /*
       SOL
    */

    const limiteSol =
        canvas.height -
        HAUTEUR_SOL;


    if (

        oiseau.y +
        oiseau.hauteur >=
        limiteSol

    ) {

        oiseau.y =
            limiteSol -
            oiseau.hauteur;


        gameOver();

        return;

    }


    /*
       PLAFOND
    */

    if (
        oiseau.y < 0
    ) {

        oiseau.y =
            0;


        oiseau.vitesseY =
            0;

    }

}


/* =========================================================
   DESSIN DU FOND
========================================================= */

function dessinerFond() {

    const gradient =
        ctx.createLinearGradient(

            0,
            0,
            0,
            canvas.height

        );


    gradient.addColorStop(
        0,
        "#38bdf8"
    );


    gradient.addColorStop(
        0.55,
        "#60a5fa"
    );


    gradient.addColorStop(
        1,
        "#bfdbfe"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );


    /*
       Nuages.
    */

    dessinerNuage(
        80,
        75,
        1
    );


    dessinerNuage(
        390,
        55,
        0.8
    );


    dessinerNuage(
        520,
        135,
        0.65
    );


    /*
       Soleil.
    */

    const soleil =
        ctx.createRadialGradient(

            510,
            65,
            5,

            510,
            65,
            55

        );


    soleil.addColorStop(
        0,
        "rgba(255,255,210,0.95)"
    );


    soleil.addColorStop(
        1,
        "rgba(255,240,100,0)"
    );


    ctx.fillStyle =
        soleil;


    ctx.beginPath();


    ctx.arc(

        510,
        65,
        55,
        0,
        Math.PI * 2

    );


    ctx.fill();

}


/* =========================================================
   DESSIN NUAGE
========================================================= */

function dessinerNuage(
    x,
    y,
    taille
) {

    ctx.save();


    ctx.globalAlpha =
        0.7;


    ctx.fillStyle =
        "#ffffff";


    ctx.beginPath();


    ctx.arc(

        x,
        y,

        22 * taille,

        0,
        Math.PI * 2

    );


    ctx.arc(

        x + 25 * taille,
        y - 10 * taille,

        28 * taille,

        0,
        Math.PI * 2

    );


    ctx.arc(

        x + 55 * taille,
        y,

        22 * taille,

        0,
        Math.PI * 2

    );


    ctx.fill();


    ctx.restore();

}


/* =========================================================
   DESSIN TUYAU
========================================================= */

function dessinerTuyau(
    tuyau
) {

    const x =
        tuyau.x;


    const largeur =
        tuyau.largeur;


    const haut =
        tuyau.hauteurHaut;


    const bas =
        tuyau.hauteurHaut +
        tuyau.espace;


    /*
       Gradient.
    */

    const gradient =
        ctx.createLinearGradient(

            x,
            0,

            x + largeur,
            0

        );


    gradient.addColorStop(
        0,
        "#166534"
    );


    gradient.addColorStop(
        0.35,
        "#22c55e"
    );


    gradient.addColorStop(
        0.7,
        "#4ade80"
    );


    gradient.addColorStop(
        1,
        "#15803d"
    );


    /*
       TUYAU HAUT
    */

    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        x,
        0,
        largeur,
        haut

    );


    /*
       BORD TUYAU HAUT
    */

    ctx.fillStyle =
        "#22c55e";


    ctx.fillRect(

        x - 5,
        haut - 20,
        largeur + 10,
        20

    );


    /*
       TUYAU BAS
    */

    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        x,
        bas,
        largeur,
        canvas.height - bas

    );


    /*
       BORD TUYAU BAS
    */

    ctx.fillStyle =
        "#22c55e";


    ctx.fillRect(

        x - 5,
        bas,
        largeur + 10,
        20

    );


    /*
       REFLETS
    */

    ctx.fillStyle =
        "rgba(255,255,255,0.22)";


    ctx.fillRect(

        x + 9,
        0,
        8,
        Math.max(
            0,
            haut - 20
        )

    );


    ctx.fillRect(

        x + 9,
        bas + 20,
        8,
        Math.max(
            0,
            canvas.height - bas - 20
        )

    );


    /*
       CONTOURS
    */

    ctx.strokeStyle =
        "#14532d";


    ctx.lineWidth =
        2;


    ctx.strokeRect(

        x,
        0,
        largeur,
        haut

    );


    ctx.strokeRect(

        x,
        bas,
        largeur,
        canvas.height - bas

    );

}


/* =========================================================
   DESSIN OISEAU
========================================================= */

function dessinerOiseau() {

    const x =
        oiseau.x;


    const y =
        oiseau.y;


    ctx.save();


    /*
       Rotation.
    */

    let angle =
        oiseau.vitesseY *
        0.0015;


    angle =
        Math.max(

            -0.35,

            Math.min(
                0.65,
                angle
            )

        );


    ctx.translate(

        x +
        oiseau.largeur / 2,

        y +
        oiseau.hauteur / 2

    );


    ctx.rotate(
        angle
    );


    /*
       OMBRE
    */

    ctx.shadowColor =
        "rgba(0,0,0,0.35)";


    ctx.shadowBlur =
        7;


    ctx.shadowOffsetY =
        4;


    /*
       CORPS
    */

    const gradient =
        ctx.createLinearGradient(

            -18,
            -15,

            18,
            15

        );


    gradient.addColorStop(
        0,
        "#fef08a"
    );


    gradient.addColorStop(
        0.5,
        "#facc15"
    );


    gradient.addColorStop(
        1,
        "#f59e0b"
    );


    ctx.fillStyle =
        gradient;


    ctx.beginPath();


    ctx.ellipse(

        0,
        0,

        18,
        14,

        0,
        0,
        Math.PI * 2

    );


    ctx.fill();


    /*
       AILE
    */

    ctx.shadowBlur =
        0;


    ctx.fillStyle =
        "#f97316";


    ctx.beginPath();


    ctx.ellipse(

        -5,
        5,

        10,
        6,

        -0.3,

        0,
        Math.PI * 2

    );


    ctx.fill();


    /*
       OEIL
    */

    ctx.fillStyle =
        "#ffffff";


    ctx.beginPath();


    ctx.arc(

        10,
        -7,

        6,

        0,
        Math.PI * 2

    );


    ctx.fill();


    ctx.fillStyle =
        "#111111";


    ctx.beginPath();


    ctx.arc(

        12,
        -7,

        2.5,

        0,
        Math.PI * 2

    );


    ctx.fill();


    /*
       BEC
    */

    ctx.fillStyle =
        "#ef4444";


    ctx.beginPath();


    ctx.moveTo(
        16,
        0
    );


    ctx.lineTo(
        30,
        5
    );


    ctx.lineTo(
        16,
        9
    );


    ctx.closePath();


    ctx.fill();


    ctx.restore();

}


/* =========================================================
   DESSIN DU SOL
========================================================= */

function dessinerSol() {

    const y =
        canvas.height -
        HAUTEUR_SOL;


    const gradient =
        ctx.createLinearGradient(

            0,
            y,

            0,
            canvas.height

        );


    gradient.addColorStop(
        0,
        "#84cc16"
    );


    gradient.addColorStop(
        1,
        "#365314"
    );


    ctx.fillStyle =
        gradient;


    ctx.fillRect(

        0,
        y,

        canvas.width,
        HAUTEUR_SOL

    );

}


/* =========================================================
   DESSIN COMPLET
========================================================= */

function dessiner() {

    /*
       Fond.
    */

    dessinerFond();


    /*
       Tuyaux.
    */

    for (
        const tuyau of tuyaux
    ) {

        dessinerTuyau(
            tuyau
        );

    }


    /*
       Sol.
    */

    dessinerSol();


    /*
       Oiseau.
    */

    if (oiseau) {

        dessinerOiseau();

    }


    /*
       ECRAN DE DEPART
    */

    if (

        !jeuCommence &&

        !jeuTermine

    ) {

        ctx.fillStyle =
            "rgba(0,0,0,0.18)";


        ctx.fillRect(

            0,
            0,

            canvas.width,
            canvas.height

        );


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 28px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(

            "CLIQUE POUR JOUER",

            canvas.width / 2,

            canvas.height / 2

        );

    }


    /*
       GAME OVER
    */

    if (jeuTermine) {

        ctx.fillStyle =
            "rgba(0,0,0,0.42)";


        ctx.fillRect(

            0,
            0,

            canvas.width,
            canvas.height

        );


        ctx.fillStyle =
            "#ffffff";


        ctx.font =
            "bold 38px Arial";


        ctx.textAlign =
            "center";


        ctx.fillText(

            "GAME OVER",

            canvas.width / 2,

            canvas.height / 2 - 10

        );


        ctx.font =
            "bold 20px Arial";


        ctx.fillText(

            "Score : " +
            score,

            canvas.width / 2,

            canvas.height / 2 + 28

        );

    }

}


/* =========================================================
   BOUCLE PRINCIPALE
========================================================= */

function boucle(
    maintenant
) {

    /*
       Arrêt après Game Over.
    */

    if (jeuTermine) {

        return;

    }


    /*
       Premier frame.
    */

    if (!dernierTemps) {

        dernierTemps =
            maintenant;

    }


    /*
       Delta.
    */

    let deltaSecondes =
        (
            maintenant -
            dernierTemps
        ) / 1000;


    /*
       Protection.
    */

    deltaSecondes =
        Math.min(
            deltaSecondes,
            0.033
        );


    dernierTemps =
        maintenant;


    /*
       Mise à jour.
    */

    mettreAJour(

        deltaSecondes,

        maintenant

    );


    /*
       Dessin.
    */

    dessiner();


    /*
       Continuer.
    */

    if (!jeuTermine) {

        animationID =
            requestAnimationFrame(
                boucle
            );

    }

}


/* =========================================================
   BOUTON REJOUER
========================================================= */

if (boutonRejouer) {

    boutonRejouer.addEventListener(

        "click",

        function() {

            initialiserJeu();

        }

    );

}


/* =========================================================
   JEUX DU MOMENT
   COMPTEUR GLOBAL — JEU 7
========================================================= */

async function compterPartieJeu7() {

    const NOM_JEU =
        "Flappy Bird";


    if (!supabaseClient) {

        return;

    }


    try {

        console.log(
            "🎮 Comptage d'une partie :",
            NOM_JEU
        );


        /*
           Rechercher le jeu.
        */

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
                .maybeSingle();


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche statistiques Flappy :",
                resultat.error
            );

            return;

        }


        /*
           Jeu introuvable.
        */

        if (!resultat.data) {

            console.error(
                "❌ Flappy Bird n'existe pas dans statistiques_jeux."
            );

            return;

        }


        const ancienNombre =
            Number(
                resultat.data.nombre_parties
            ) || 0;


        const nouveauNombre =
            ancienNombre + 1;


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
                "❌ Erreur mise à jour statistiques Flappy :",
                miseAJour.error
            );

            return;

        }


        console.log(
            "✅ Flappy Bird :",
            nouveauNombre,
            "parties"
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur compteur Flappy :",
            erreur
        );

    }

}


/* =========================================================
   DEMARRAGE
========================================================= */

async function demarrerFlappy() {

    /*
       Vérification du compte.
       Le visiteur est autorisé.
    */

    const connecte =
        await verifierConnexionFlappy();


    if (!connecte) {

        return;

    }


    /*
       Initialiser le jeu.
    */

    initialiserJeu();


    /*
       Charger le classement.
    */

    afficherClassement();

}


/* =========================================================
   LANCEMENT
========================================================= */

demarrerFlappy();