/* =========================================================
   GAMEZONE — SCRIPT 7 — FLAPPY BIRD
=========================================================
   👤 Mode visiteur autorisé
   💾 Meilleur score visiteur = localStorage
   🔐 Compte connecté = classement mondial
   🏆 Top 10 Supabase
   📊 Compteur global des parties
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

const NOM_JEU = "Flappy Bird";


/* =========================================================
   ELEMENTS HTML
========================================================= */

const canvas =
    document.getElementById("jeuFlappy");

const ctx =
    canvas
        ? canvas.getContext("2d")
        : null;

const scoreElement =
    document.getElementById("score");

const meilleurScoreElement =
    document.getElementById("meilleurScore");

const niveauElement =
    document.getElementById("niveau");

const messageElement =
    document.getElementById("message");

const pseudoElement =
    document.getElementById("pseudoJoueur");

const boutonMobile =
    document.getElementById("boutonMobile");

const boutonRejouer =
    document.getElementById("boutonRejouer");

const tableauScores =
    document.getElementById("tableauScores");


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

let utilisateurConnecte = false;

let pseudo = null;


/* =========================================================
   VARIABLES DU JEU
========================================================= */

let oiseau = null;

let tuyaux = [];

let score = 0;

let meilleurScore = 0;

let niveau = 1;

let jeuCommence = false;

let jeuTermine = false;

let animationID = null;

let dernierTemps = 0;

let tempsDernierTuyau = 0;

let partieComptee = false;


/* =========================================================
   PARAMETRES
========================================================= */

const GRAVITE_BASE = 950;

const SAUT_BASE = -350;

const VITESSE_BASE = 170;

const VITESSE_MAX = 330;

const LARGEUR_OISEAU = 34;

const HAUTEUR_OISEAU = 26;

const LARGEUR_TUYAU = 65;

const HAUTEUR_SOL = 18;


let gravite = GRAVITE_BASE;

let puissanceSaut = SAUT_BASE;

let vitesse = VITESSE_BASE;

let espaceTuyaux = 155;

let intervalleTuyaux = 1.45;


/* =========================================================
   LOCAL STORAGE
========================================================= */

const CLE_VISITEUR =
    "meilleurScoreFlappy_visiteur";

const CLE_PSEUDO =
    "pseudoGameZone";

const CLE_PARTIES_VISITEUR =
    "partiesJoueesFlappy_visiteur";


function obtenirCleScoreLocal() {

    if (
        utilisateurConnecte &&
        pseudo
    ) {

        return (
            "meilleurScoreFlappy_" +
            pseudo
        );
    }

    return CLE_VISITEUR;
}


function obtenirClePartiesLocal() {

    if (
        utilisateurConnecte &&
        pseudo
    ) {

        return (
            "partiesJoueesFlappy_" +
            pseudo
        );
    }

    return CLE_PARTIES_VISITEUR;
}


/* =========================================================
   CHARGER MEILLEUR SCORE LOCAL
========================================================= */

function chargerMeilleurScoreLocal() {

    const cle =
        obtenirCleScoreLocal();

    meilleurScore =
        Number(
            localStorage.getItem(cle)
        ) || 0;

    if (meilleurScoreElement) {

        meilleurScoreElement.textContent =
            meilleurScore;
    }
}


/* =========================================================
   SAUVEGARDER MEILLEUR SCORE LOCAL
========================================================= */

function sauvegarderMeilleurScoreLocal() {

    const cle =
        obtenirCleScoreLocal();

    localStorage.setItem(
        cle,
        meilleurScore
    );

    if (meilleurScoreElement) {

        meilleurScoreElement.textContent =
            meilleurScore;
    }
}


/* =========================================================
   COMPTEUR LOCAL
========================================================= */

let partiesJouees = 0;


function chargerPartiesJouees() {

    const cle =
        obtenirClePartiesLocal();

    partiesJouees =
        Number(
            localStorage.getItem(cle)
        ) || 0;
}


async function compterPartie() {

    chargerPartiesJouees();

    partiesJouees++;

    localStorage.setItem(
        obtenirClePartiesLocal(),
        partiesJouees
    );

    await compterPartieJeu7();
}


/* =========================================================
   AFFICHAGE PSEUDO
========================================================= */

function actualiserAffichagePseudo() {

    if (!pseudoElement) {
        return;
    }

    if (
        utilisateurConnecte &&
        pseudo
    ) {

        pseudoElement.textContent =
            pseudo;

    } else {

        pseudoElement.textContent =
            "Visiteur";
    }
}


/* =========================================================
   VERIFICATION CONNEXION
========================================================= */

async function verifierConnexionFlappy() {

    /*
       Si Supabase n'est pas disponible,
       on autorise quand même le mode visiteur.
    */

    if (!supabaseClient) {

        console.warn(
            "⚠️ Supabase indisponible : mode visiteur."
        );

        utilisateurConnecte = false;

        pseudo = null;

        actualiserAffichagePseudo();

        chargerMeilleurScoreLocal();

        return true;
    }


    try {

        const resultat =
            await supabaseClient.auth.getSession();


        if (resultat.error) {

            console.warn(
                "⚠️ Erreur vérification session :",
                resultat.error
            );

            utilisateurConnecte = false;

            pseudo = null;

            actualiserAffichagePseudo();

            chargerMeilleurScoreLocal();

            return true;
        }


        const session =
            resultat.data.session;


        /* =========================
           VISITEUR
        ========================= */

        if (!session) {

            console.log(
                "👤 Flappy : mode visiteur."
            );

            utilisateurConnecte = false;

            pseudo = null;

            actualiserAffichagePseudo();

            chargerMeilleurScoreLocal();

            return true;
        }


        /* =========================
           COMPTE CONNECTE
        ========================= */

        utilisateurConnecte = true;


        pseudo =
            localStorage.getItem(
                CLE_PSEUDO
            );


        if (!pseudo) {

            pseudo =
                session.user.user_metadata?.pseudo ||
                session.user.user_metadata?.username ||
                "Joueur";
        }


        actualiserAffichagePseudo();


        /*
           Fusionner le meilleur score
           visiteur avec le compte.
        */

        await fusionnerScoreVisiteur();


        chargerMeilleurScoreLocal();


        console.log(
            "🔐 Flappy connecté :",
            pseudo
        );


        return true;

    }

    catch (erreur) {

        console.error(
            "❌ Erreur connexion Flappy :",
            erreur
        );

        utilisateurConnecte = false;

        pseudo = null;

        actualiserAffichagePseudo();

        chargerMeilleurScoreLocal();

        return true;
    }
}


/* =========================================================
   RECUPERER SCORE SUPABASE
========================================================= */

async function recupererScoreSupabase() {

    if (!supabaseClient) {
        return null;
    }

    if (!pseudo) {
        return null;
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
                    pseudo
                )
                .eq(
                    "jeu",
                    NOM_JEU
                )
                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur récupération score Flappy :",
                resultat.error
            );

            return null;
        }


        if (
            !resultat.data ||
            resultat.data.length === 0
        ) {

            return null;
        }


        return resultat.data[0];

    }

    catch (erreur) {

        console.error(
            "❌ Erreur récupération score Flappy :",
            erreur
        );

        return null;
    }
}


/* =========================================================
   FUSION SCORE VISITEUR + COMPTE
========================================================= */

async function fusionnerScoreVisiteur() {

    if (
        !utilisateurConnecte ||
        !pseudo
    ) {

        return;
    }


    const scoreVisiteur =
        Number(
            localStorage.getItem(
                CLE_VISITEUR
            )
        ) || 0;


    const cleCompte =
        "meilleurScoreFlappy_" +
        pseudo;


    const scoreCompteLocal =
        Number(
            localStorage.getItem(
                cleCompte
            )
        ) || 0;


    const ligneSupabase =
        await recupererScoreSupabase();


    const scoreSupabase =
        ligneSupabase
            ? Number(
                ligneSupabase.score
            ) || 0
            : 0;


    const meilleur =
        Math.max(
            scoreVisiteur,
            scoreCompteLocal,
            scoreSupabase
        );


    localStorage.setItem(
        cleCompte,
        meilleur
    );


    meilleurScore =
        meilleur;


    if (meilleurScoreElement) {

        meilleurScoreElement.textContent =
            meilleur;
    }


    console.log(
        "🔄 Fusion Flappy :",
        {
            visiteur: scoreVisiteur,
            compteLocal: scoreCompteLocal,
            supabase: scoreSupabase,
            meilleur: meilleur
        }
    );


    if (
        meilleur > scoreSupabase
    ) {

        await enregistrerScoreSupabase(
            meilleur
        );
    }


    /*
       Le score visiteur a été fusionné.
    */

    if (
        scoreVisiteur > 0
    ) {

        localStorage.removeItem(
            CLE_VISITEUR
        );
    }
}


/* =========================================================
   ENREGISTRER SCORE SUPABASE
========================================================= */

async function enregistrerScoreSupabase(
    scoreAEnvoyer
) {

    if (
        !utilisateurConnecte ||
        !pseudo
    ) {

        console.log(
            "👤 Visiteur : score non envoyé."
        );

        return;
    }


    if (!supabaseClient) {

        console.error(
            "❌ Supabase indisponible."
        );

        return;
    }


    const nouveauScore =
        Number(scoreAEnvoyer) || 0;


    try {

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
                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche score Flappy :"
            );

            console.error(
                "Code :",
                resultat.error.code
            );

            console.error(
                "Message :",
                resultat.error.message
            );

            console.error(
                "Details :",
                resultat.error.details
            );

            console.error(
                "Hint :",
                resultat.error.hint
            );

            return;
        }


        /* =========================
           SCORE EXISTANT
        ========================= */

        if (
            resultat.data &&
            resultat.data.length > 0
        ) {

            const ligne =
                resultat.data[0];


            const ancienScore =
                Number(
                    ligne.score
                ) || 0;


            if (
                ancienScore >= nouveauScore
            ) {

                console.log(
                    "🏆 Ancien meilleur conservé :",
                    ancienScore
                );

                return;
            }


            const miseAJour =
                await supabaseClient
                    .from("scores")
                    .update({

                        score:
                            nouveauScore

                    })
                    .eq(
                        "id",
                        ligne.id
                    );


            if (miseAJour.error) {

                console.error(
                    "❌ Erreur mise à jour score Flappy :"
                );

                console.error(
                    "Code :",
                    miseAJour.error.code
                );

                console.error(
                    "Message :",
                    miseAJour.error.message
                );

                console.error(
                    "Details :",
                    miseAJour.error.details
                );

                console.error(
                    "Hint :",
                    miseAJour.error.hint
                );

                return;
            }


            console.log(
                "✅ Nouveau record Flappy :",
                nouveauScore
            );
        }


        /* =========================
           PREMIER SCORE
        ========================= */

        else {

            const insertion =
                await supabaseClient
                    .from("scores")
                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            nouveauScore,

                        jeu:
                            NOM_JEU

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur insertion score Flappy :"
                );

                console.error(
                    "Code :",
                    insertion.error.code
                );

                console.error(
                    "Message :",
                    insertion.error.message
                );

                console.error(
                    "Details :",
                    insertion.error.details
                );

                console.error(
                    "Hint :",
                    insertion.error.hint
                );

                return;
            }


            console.log(
                "✅ Premier score Flappy :",
                nouveauScore
            );
        }


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
   INITIALISATION
========================================================= */

function initialiserJeu() {

    if (animationID !== null) {

        cancelAnimationFrame(
            animationID
        );

        animationID = null;
    }


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


    tuyaux = [];

    score = 0;

    niveau = 1;

    vitesse = VITESSE_BASE;

    gravite = GRAVITE_BASE;

    puissanceSaut = SAUT_BASE;

    espaceTuyaux = 155;

    intervalleTuyaux = 1.45;

    jeuCommence = false;

    jeuTermine = false;

    dernierTemps = 0;

    tempsDernierTuyau = 0;

    partieComptee = false;


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


    chargerMeilleurScoreLocal();

    dessiner();
}


/* =========================================================
   SAUT
========================================================= */

function sauter() {

    if (jeuTermine) {
        return;
    }


    if (!jeuCommence) {

        jeuCommence = true;


        if (!partieComptee) {

            partieComptee = true;

            compterPartie();
        }


        if (messageElement) {

            messageElement.textContent =
                "";
        }


        dernierTemps =
            performance.now();

        tempsDernierTuyau =
            dernierTemps;


        animationID =
            requestAnimationFrame(
                boucle
            );
    }


    oiseau.vitesseY =
        puissanceSaut;
}


/* =========================================================
   CONTROLES CANVAS
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
   CREER TUYAU
========================================================= */

function creerTuyau() {

    const hauteurMin = 55;

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

    niveau =
        Math.floor(
            score / 5
        ) + 1;


    if (niveauElement) {

        niveauElement.textContent =
            niveau;
    }


    vitesse =
        Math.min(
            VITESSE_MAX,
            VITESSE_BASE +
            (niveau - 1) * 20
        );


    espaceTuyaux =
        Math.max(
            112,
            155 -
            (niveau - 1) * 5
        );


    intervalleTuyaux =
        Math.max(
            0.95,
            1.45 -
            (niveau - 1) * 0.05
        );
}


/* =========================================================
   COLLISION
========================================================= */

function collision(
    oiseau,
    tuyau
) {

    const margeX = 5;

    const margeY = 4;


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

    if (jeuTermine) {
        return;
    }


    jeuTermine = true;


    if (animationID !== null) {

        cancelAnimationFrame(
            animationID
        );

        animationID = null;
    }


    /* =========================
       MEILLEUR SCORE
    ========================= */

    if (
        score >
        meilleurScore
    ) {

        meilleurScore =
            score;

        sauvegarderMeilleurScoreLocal();
    }


    /* =========================
       VISITEUR
    ========================= */

    if (!utilisateurConnecte) {

        const scoreVisiteur =
            Number(
                localStorage.getItem(
                    CLE_VISITEUR
                )
            ) || 0;


        if (
            score >
            scoreVisiteur
        ) {

            localStorage.setItem(
                CLE_VISITEUR,
                score
            );
        }


        meilleurScore =
            Math.max(
                meilleurScore,
                scoreVisiteur,
                score
            );


        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;
        }
    }


    /* =========================
       MESSAGE
    ========================= */

    if (messageElement) {

        if (utilisateurConnecte) {

            messageElement.textContent =
                "💥 Game Over ! Score : " +
                score;

        } else {

            messageElement.textContent =
                "💥 Game Over ! Score : " +
                score +
                " — 👤 Mode visiteur";
        }
    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "inline-block";
    }


    dessiner();


    /* =========================
       CLASSEMENT
    ========================= */

    if (
        utilisateurConnecte &&
        pseudo
    ) {

        await enregistrerScoreSupabase(
            meilleurScore
        );

    } else {

        console.log(
            "👤 Visiteur : score non envoyé au classement."
        );
    }
}


/* =========================================================
   CLASSEMENT TOP 10
========================================================= */

async function afficherClassement() {

    if (!tableauScores) {

        console.error(
            "❌ #tableauScores introuvable."
        );

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
                    ❌ Supabase indisponible.
                </td>
            </tr>

        `;

        return;
    }


    try {

        console.log(
            "🏆 Chargement classement :",
            NOM_JEU
        );


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


        /* =========================
           ERREUR SUPABASE
        ========================= */

        if (resultat.error) {

            console.error(
                "❌ ERREUR SUPABASE CLASSEMENT FLAPPY"
            );

            console.error(
                "Code :",
                resultat.error.code
            );

            console.error(
                "Message :",
                resultat.error.message
            );

            console.error(
                "Details :",
                resultat.error.details
            );

            console.error(
                "Hint :",
                resultat.error.hint
            );


            tableauScores.innerHTML = `

                <tr>
                    <td colspan="3">
                        ❌ Erreur lors du chargement du classement.
                    </td>
                </tr>

            `;

            return;
        }


        const scores =
            resultat.data || [];


        /* =========================
           AUCUN SCORE
        ========================= */

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


        /* =========================
           AFFICHAGE
        ========================= */

        tableauScores.innerHTML =
            "";


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


                /* POSITION */

                if (index === 0) {

                    position.textContent =
                        "🥇";

                } else if (index === 1) {

                    position.textContent =
                        "🥈";

                } else if (index === 2) {

                    position.textContent =
                        "🥉";

                } else {

                    position.textContent =
                        index + 1;
                }


                /* PSEUDO */

                pseudoCellule.textContent =
                    joueur.pseudo ||
                    "Anonyme";


                /* SCORE */

                scoreCellule.textContent =
                    Number(
                        joueur.score
                    ) || 0;


                /* =========================
                   JOUEUR CONNECTE
                ========================= */

                if (
                    utilisateurConnecte &&
                    pseudo &&
                    joueur.pseudo === pseudo
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


        console.log(
            "✅ Classement Flappy chargé :",
            scores
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur inattendue classement Flappy :",
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

    /* =========================
       PHYSIQUE
    ========================= */

    oiseau.vitesseY +=
        gravite *
        deltaSecondes;


    oiseau.y +=
        oiseau.vitesseY *
        deltaSecondes;


    /* =========================
       TUYAUX
    ========================= */

    for (
        let i = tuyaux.length - 1;
        i >= 0;
        i--
    ) {

        const tuyau =
            tuyaux[i];


        tuyau.x -=
            vitesse *
            deltaSecondes;


        /* =========================
           SCORE
        ========================= */

        if (
            !tuyau.passe &&
            tuyau.x +
            tuyau.largeur <
            oiseau.x
        ) {

            tuyau.passe = true;

            score++;


            if (scoreElement) {

                scoreElement.textContent =
                    score;
            }


            augmenterDifficulte();
        }


        /* =========================
           COLLISION
        ========================= */

        if (
            collision(
                oiseau,
                tuyau
            )
        ) {

            gameOver();

            return;
        }


        /* =========================
           SUPPRESSION
        ========================= */

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


    /* =========================
       CREATION TUYAUX
    ========================= */

    if (
        maintenant -
        tempsDernierTuyau >=
        intervalleTuyaux * 1000
    ) {

        creerTuyau();

        tempsDernierTuyau =
            maintenant;
    }


    /* =========================
       SOL
    ========================= */

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


    /* =========================
       PLAFOND
    ========================= */

    if (
        oiseau.y < 0
    ) {

        oiseau.y = 0;

        oiseau.vitesseY = 0;
    }
}


/* =========================================================
   FOND
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
   NUAGE
========================================================= */

function dessinerNuage(
    x,
    y,
    taille
) {

    ctx.save();

    ctx.globalAlpha = 0.7;

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
   TUYAU
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


    /* TUYAU HAUT */

    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        x,
        0,
        largeur,
        haut
    );


    ctx.fillStyle =
        "#22c55e";


    ctx.fillRect(
        x - 5,
        haut - 20,
        largeur + 10,
        20
    );


    /* TUYAU BAS */

    ctx.fillStyle =
        gradient;


    ctx.fillRect(
        x,
        bas,
        largeur,
        canvas.height - bas
    );


    ctx.fillStyle =
        "#22c55e";


    ctx.fillRect(
        x - 5,
        bas,
        largeur + 10,
        20
    );


    /* REFLETS */

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
            canvas.height -
            bas -
            20
        )
    );


    /* CONTOURS */

    ctx.strokeStyle =
        "#14532d";

    ctx.lineWidth = 2;


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
   OISEAU
========================================================= */

function dessinerOiseau() {

    const x =
        oiseau.x;

    const y =
        oiseau.y;


    ctx.save();


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


    /* OMBRE */

    ctx.shadowColor =
        "rgba(0,0,0,0.35)";

    ctx.shadowBlur = 7;

    ctx.shadowOffsetY = 4;


    /* CORPS */

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


    /* AILE */

    ctx.shadowBlur = 0;

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


    /* OEIL */

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


    /* BEC */

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
   SOL
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

    dessinerFond();


    for (
        const tuyau of tuyaux
    ) {

        dessinerTuyau(
            tuyau
        );
    }


    dessinerSol();


    if (oiseau) {

        dessinerOiseau();
    }


    /* =========================
       ECRAN DE DEPART
    ========================= */

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


    /* =========================
       GAME OVER
    ========================= */

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
            "Score : " + score,
            canvas.width / 2,
            canvas.height / 2 + 28
        );
    }
}


/* =========================================================
   BOUCLE
========================================================= */

function boucle(
    maintenant
) {

    if (jeuTermine) {
        return;
    }


    if (!dernierTemps) {

        dernierTemps =
            maintenant;
    }


    let deltaSecondes =
        (
            maintenant -
            dernierTemps
        ) / 1000;


    deltaSecondes =
        Math.min(
            deltaSecondes,
            0.033
        );


    dernierTemps =
        maintenant;


    mettreAJour(
        deltaSecondes,
        maintenant
    );


    dessiner();


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
   COMPTEUR GLOBAL
   JEUX DU MOMENT
========================================================= */

async function compterPartieJeu7() {

    if (!supabaseClient) {

        console.warn(
            "⚠️ Supabase indisponible : compteur non envoyé."
        );

        return;
    }


    try {

        console.log(
            "🎮 Comptage d'une partie :",
            NOM_JEU
        );


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
                "❌ Erreur recherche statistiques Flappy :"
            );

            console.error(
                "Code :",
                resultat.error.code
            );

            console.error(
                "Message :",
                resultat.error.message
            );

            console.error(
                "Details :",
                resultat.error.details
            );

            console.error(
                "Hint :",
                resultat.error.hint
            );

            return;
        }


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
                "❌ Erreur mise à jour statistiques Flappy :"
            );

            console.error(
                "Code :",
                miseAJour.error.code
            );

            console.error(
                "Message :",
                miseAJour.error.message
            );

            console.error(
                "Details :",
                miseAJour.error.details
            );

            console.error(
                "Hint :",
                miseAJour.error.hint
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

    console.log(
        "🐦 Démarrage Flappy Bird..."
    );


    await verifierConnexionFlappy();


    initialiserJeu();


    await afficherClassement();


    console.log(
        "✅ Flappy Bird prêt."
    );
}


/* =========================================================
   LANCEMENT
========================================================= */

demarrerFlappy();