/* =====================================================
   GAMEZONE — SNAKE
   script4.js

   MODE VISITEUR :
   - Meilleur score sauvegardé dans localStorage
   - Aucun score visiteur envoyé dans Supabase

   MODE COMPTE :
   - Récupération du meilleur score local
   - Comparaison avec le score Supabase
   - Le meilleur score est automatiquement enregistré
===================================================== */


/* =====================================================
   SUPABASE
===================================================== */

const SUPABASE_URL =
    "https://pxgymcwpbesqyjochwgd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_F0af00-z9ZDemm9ch1tIaA_wSNCZb9G";


const supabaseClient =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


/* =====================================================
   IDENTIFICATION DU JEU
===================================================== */

const JEU =
    "jeux4";

const NOM_JEU_STATISTIQUE =
    "Snake";


/* =====================================================
   ELEMENTS HTML
===================================================== */

const canvas =
    document.getElementById("jeu");

const ctx =
    canvas.getContext("2d");


const pseudoJoueurElement =
    document.getElementById("pseudoJoueur");


const pseudoAfficheElement =
    document.getElementById("pseudoAffiche");


const scoreElement =
    document.getElementById("score");


const meilleurScoreElement =
    document.getElementById("meilleurScore");


const scoreFinalElement =
    document.getElementById("scoreFinal");


const zoneEnregistrement =
    document.getElementById("zoneEnregistrement");


const zoneVisiteur =
    document.getElementById("zoneVisiteur");


const zoneCompte =
    document.getElementById("zoneCompte");


const messageEnregistrement =
    document.getElementById("messageEnregistrement");


const classementBody =
    document.getElementById("classementBody");


const messageClassement =
    document.getElementById("messageClassement");


/* =====================================================
   IDENTIFICATION UTILISATEUR
===================================================== */

let pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


let utilisateurConnecte =
    !!pseudo;


/* =====================================================
   AFFICHAGE DU PSEUDO
===================================================== */

function actualiserPseudo() {

    pseudo =
        localStorage.getItem(
            "pseudoGameZone"
        );

    utilisateurConnecte =
        !!pseudo;


    if (pseudoJoueurElement) {

        pseudoJoueurElement.textContent =
            utilisateurConnecte
                ? pseudo
                : "Visiteur";

    }


    if (pseudoAfficheElement) {

        pseudoAfficheElement.textContent =
            utilisateurConnecte
                ? pseudo
                : "Visiteur";

    }

}


actualiserPseudo();


/* =====================================================
   VARIABLES DU JEU
===================================================== */

const tailleCase =
    20;


const nombreCases =
    canvas.width /
    tailleCase;


/* =====================================================
   SERPENT
===================================================== */

let serpent = [

    {
        x: 200,
        y: 200
    },

    {
        x: 180,
        y: 200
    },

    {
        x: 160,
        y: 200
    }

];


let direction =
    "droite";


let prochaineDirection =
    "droite";


/* =====================================================
   NOURRITURE
===================================================== */

let nourriture = {

    x: 300,
    y: 200

};


/* =====================================================
   SCORE
===================================================== */

let score =
    0;


/*
   IMPORTANT :

   Cette clé appartient à Snake.

   Elle fonctionne aussi pour les visiteurs.
*/

const CLE_MEILLEUR_SCORE =
    "meilleurScoreJeux4";


let meilleurScore =
    Number(
        localStorage.getItem(
            CLE_MEILLEUR_SCORE
        )
    ) || 0;


/* =====================================================
   AFFICHAGE INITIAL DU SCORE
===================================================== */

if (scoreElement) {

    scoreElement.textContent =
        score;

}


if (meilleurScoreElement) {

    meilleurScoreElement.textContent =
        meilleurScore;

}


/* =====================================================
   ETAT DU JEU
===================================================== */

let jeuTermine =
    false;


let jeuEnPause =
    false;


let intervalleJeu =
    null;


let scoreEnregistre =
    false;


/* =====================================================
   SAUVEGARDER LE MEILLEUR SCORE LOCAL
===================================================== */

function sauvegarderMeilleurScoreLocal() {

    localStorage.setItem(

        CLE_MEILLEUR_SCORE,

        meilleurScore.toString()

    );

}


/* =====================================================
   METTRE A JOUR LE MEILLEUR SCORE
===================================================== */

function mettreAJourMeilleurScore() {

    if (
        score > meilleurScore
    ) {

        meilleurScore =
            score;


        sauvegarderMeilleurScoreLocal();


        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;

        }

    }

}


/* =====================================================
   COMPTER UNE PARTIE
===================================================== */

async function compterPartieJeu4() {

    /*
       Les statistiques générales peuvent
       continuer à être enregistrées dans
       Supabase.

       Cela ne sauvegarde PAS le score
       du visiteur.
    */

    try {

        const recherche =
            await fetch(

                SUPABASE_URL +
                "/rest/v1/statistiques_jeux" +
                "?nom_jeu=eq." +
                encodeURIComponent(
                    NOM_JEU_STATISTIQUE
                ) +
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


        const statistiques =
            await recherche.json();


        if (

            !statistiques ||

            statistiques.length === 0

        ) {

            console.error(
                "❌ Snake n'existe pas dans statistiques_jeux"
            );

            return;

        }


        const jeu =
            statistiques[0];


        const nouveauNombre =
            Number(
                jeu.nombre_parties || 0
            ) + 1;


        const miseAJour =
            await fetch(

                SUPABASE_URL +
                "/rest/v1/statistiques_jeux" +
                "?id=eq." +
                jeu.id,

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
            "✅ Snake : " +
            nouveauNombre +
            " parties"
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur statistiques Snake :",
            erreur
        );

    }

}


/* =====================================================
   NOUVELLE NOURRITURE
===================================================== */

function nouvelleNourriture() {

    let positionValide =
        false;


    while (!positionValide) {

        nourriture.x =
            Math.floor(
                Math.random() *
                nombreCases
            ) *
            tailleCase;


        nourriture.y =
            Math.floor(
                Math.random() *
                nombreCases
            ) *
            tailleCase;


        positionValide =
            true;


        for (
            let partie of serpent
        ) {

            if (

                partie.x ===
                nourriture.x &&

                partie.y ===
                nourriture.y

            ) {

                positionValide =
                    false;

                break;

            }

        }

    }

}


/* =====================================================
   DESSIN
===================================================== */

function dessiner() {

    /*
       Fond
    */

    ctx.fillStyle =
        "white";


    ctx.fillRect(

        0,
        0,
        canvas.width,
        canvas.height

    );


    /*
       Nourriture
    */

    ctx.fillStyle =
        "red";


    ctx.fillRect(

        nourriture.x,
        nourriture.y,
        tailleCase,
        tailleCase

    );


    /*
       Serpent
    */

    serpent.forEach(

        function(
            partie,
            index
        ) {

            if (
                index === 0
            ) {

                ctx.fillStyle =
                    "#00ff00";

            }

            else {

                ctx.fillStyle =
                    "#00aa00";

            }


            ctx.fillRect(

                partie.x,
                partie.y,
                tailleCase,
                tailleCase

            );


            ctx.strokeStyle =
                "#111";


            ctx.strokeRect(

                partie.x,
                partie.y,
                tailleCase,
                tailleCase

            );

        }

    );

}


/* =====================================================
   DEPLACEMENT
===================================================== */

function avancer() {

    if (

        jeuTermine ||
        jeuEnPause

    ) {

        return;

    }


    direction =
        prochaineDirection;


    const tete = {

        x:
            serpent[0].x,

        y:
            serpent[0].y

    };


    if (
        direction === "haut"
    ) {

        tete.y -=
            tailleCase;

    }


    if (
        direction === "bas"
    ) {

        tete.y +=
            tailleCase;

    }


    if (
        direction === "gauche"
    ) {

        tete.x -=
            tailleCase;

    }


    if (
        direction === "droite"
    ) {

        tete.x +=
            tailleCase;

    }


    /*
       Traverser les bords
    */

    if (
        tete.x < 0
    ) {

        tete.x =
            canvas.width -
            tailleCase;

    }


    if (
        tete.x >= canvas.width
    ) {

        tete.x =
            0;

    }


    if (
        tete.y < 0
    ) {

        tete.y =
            canvas.height -
            tailleCase;

    }


    if (
        tete.y >= canvas.height
    ) {

        tete.y =
            0;

    }


    /*
       Collision avec le serpent
    */

    for (

        let i = 0;

        i < serpent.length;

        i++

    ) {

        if (

            tete.x ===
            serpent[i].x &&

            tete.y ===
            serpent[i].y

        ) {

            terminerJeu();

            return;

        }

    }


    serpent.unshift(
        tete
    );


    /*
       Nourriture
    */

    if (

        tete.x ===
        nourriture.x &&

        tete.y ===
        nourriture.y

    ) {

        score++;


        if (scoreElement) {

            scoreElement.textContent =
                score;

        }


        /*
           Nouveau record.

           Toujours sauvegardé localement,
           même en mode visiteur.
        */

        mettreAJourMeilleurScore();


        nouvelleNourriture();

    }

    else {

        serpent.pop();

    }


    dessiner();

}


/* =====================================================
   CHANGER DIRECTION
===================================================== */

function changerDirection(
    nouvelleDirection
) {

    if (

        nouvelleDirection === "haut" &&

        direction !== "bas"

    ) {

        prochaineDirection =
            "haut";

    }


    if (

        nouvelleDirection === "bas" &&

        direction !== "haut"

    ) {

        prochaineDirection =
            "bas";

    }


    if (

        nouvelleDirection === "gauche" &&

        direction !== "droite"

    ) {

        prochaineDirection =
            "gauche";

    }


    if (

        nouvelleDirection === "droite" &&

        direction !== "gauche"

    ) {

        prochaineDirection =
            "droite";

    }

}


/* =====================================================
   CLAVIER
===================================================== */

document.addEventListener(

    "keydown",

    function(event) {

        const touche =
            event.key.toLowerCase();


        if (

            touche === "z" ||
            touche === "arrowup"

        ) {

            changerDirection(
                "haut"
            );

            event.preventDefault();

        }


        else if (

            touche === "s" ||
            touche === "arrowdown"

        ) {

            changerDirection(
                "bas"
            );

            event.preventDefault();

        }


        else if (

            touche === "q" ||
            touche === "arrowleft"

        ) {

            changerDirection(
                "gauche"
            );

            event.preventDefault();

        }


        else if (

            touche === "d" ||
            touche === "arrowright"

        ) {

            changerDirection(
                "droite"
            );

            event.preventDefault();

        }


        else if (
            event.code === "Space"
        ) {

            pauseJeu();

            event.preventDefault();

        }

    }

);


/* =====================================================
   PAUSE
===================================================== */

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


    const messageSnake =
        document.getElementById(
            "messageSnake"
        );


    if (jeuEnPause) {

        if (bouton) {

            bouton.textContent =
                "▶️ Reprendre";

        }


        if (messageSnake) {

            messageSnake.textContent =
                "⏸️ Jeu en pause";

        }

    }

    else {

        if (bouton) {

            bouton.textContent =
                "⏸️ Pause";

        }


        if (messageSnake) {

            messageSnake.textContent =
                "";

        }

    }

}


/* =====================================================
   FIN DU JEU
===================================================== */

function terminerJeu() {

    jeuTermine =
        true;


    clearInterval(
        intervalleJeu
    );


    /*
       Toujours sauvegarder le record
       localement avant toute autre chose.
    */

    mettreAJourMeilleurScore();


    const messageSnake =
        document.getElementById(
            "messageSnake"
        );


    if (messageSnake) {

        messageSnake.textContent =
            "💥 Game Over ! Score : " +
            score;

    }


    if (scoreFinalElement) {

        scoreFinalElement.textContent =
            score;

    }


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "block";

    }


    /*
       VISITEUR
    */

    if (!utilisateurConnecte) {

        if (zoneVisiteur) {

            zoneVisiteur.style.display =
                "block";

        }


        if (zoneCompte) {

            zoneCompte.style.display =
                "none";

        }

    }


    /*
       COMPTE CONNECTÉ
    */

    else {

        if (zoneVisiteur) {

            zoneVisiteur.style.display =
                "none";

        }


        if (zoneCompte) {

            zoneCompte.style.display =
                "block";

        }

    }

}


/* =====================================================
   RECOMMENCER
===================================================== */

function recommencer() {

    /*
       Une nouvelle partie.
    */

    compterPartieJeu4();


    clearInterval(
        intervalleJeu
    );


    serpent = [

        {
            x: 200,
            y: 200
        },

        {
            x: 180,
            y: 200
        },

        {
            x: 160,
            y: 200
        }

    ];


    direction =
        "droite";


    prochaineDirection =
        "droite";


    score =
        0;


    jeuTermine =
        false;


    jeuEnPause =
        false;


    scoreEnregistre =
        false;


    if (scoreElement) {

        scoreElement.textContent =
            "0";

    }


    if (scoreFinalElement) {

        scoreFinalElement.textContent =
            "0";

    }


    const messageSnake =
        document.getElementById(
            "messageSnake"
        );


    if (messageSnake) {

        messageSnake.textContent =
            "";

    }


    const boutonPause =
        document.getElementById(
            "boutonPause"
        );


    if (boutonPause) {

        boutonPause.textContent =
            "⏸️ Pause";

    }


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "none";

    }


    if (zoneVisiteur) {

        zoneVisiteur.style.display =
            "none";

    }


    if (zoneCompte) {

        zoneCompte.style.display =
            "none";

    }


    if (messageEnregistrement) {

        messageEnregistrement.textContent =
            "";

    }


    nouvelleNourriture();


    dessiner();


    demarrerJeu();

}


/* =====================================================
   DEMARRER LE JEU
===================================================== */

function demarrerJeu() {

    clearInterval(
        intervalleJeu
    );


    intervalleJeu =
        setInterval(

            avancer,

            120

        );

}


/* =====================================================
   RECUPERER LE SCORE DU COMPTE
===================================================== */

async function recupererScoreCompte(
    pseudoActuel
) {

    try {

        const {

            data,
            error

        } =
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


        if (error) {

            throw error;

        }


        if (
            data &&
            data.length > 0
        ) {

            return data[0];

        }


        return null;

    }

    catch (erreur) {

        console.error(
            "❌ Erreur récupération score Snake :",
            erreur
        );


        return null;

    }

}


/* =====================================================
   SYNCHRONISER LE SCORE LOCAL AVEC LE COMPTE
===================================================== */

async function synchroniserScoreLocalAvecCompte() {

    /*
       Vérifier qu'un compte existe.
    */

    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        return;

    }


    utilisateurConnecte =
        true;


    pseudo =
        pseudoActuel;


    actualiserPseudo();


    /*
       Récupération du meilleur score
       sauvegardé localement.
    */

    const scoreLocal =
        Number(
            localStorage.getItem(
                CLE_MEILLEUR_SCORE
            )
        ) || 0;


    /*
       Récupération du score Supabase.
    */

    const scoreCompte =
        await recupererScoreCompte(
            pseudoActuel
        );


    let scoreSupabase =
        0;


    if (scoreCompte) {

        scoreSupabase =
            Number(
                scoreCompte.score || 0
            );

    }


    /*
       On garde le meilleur des deux.
    */

    const meilleur =
        Math.max(
            scoreLocal,
            scoreSupabase
        );


    meilleurScore =
        meilleur;


    /*
       Toujours sauvegarder le meilleur
       localement.
    */

    sauvegarderMeilleurScoreLocal();


    if (meilleurScoreElement) {

        meilleurScoreElement.textContent =
            meilleurScore;

    }


    /*
       Aucun score à enregistrer.
    */

    if (meilleur <= 0) {

        console.log(
            "ℹ️ Aucun score Snake à synchroniser."
        );

        return;

    }


    /*
       Aucun score Supabase :
       création.
    */

    if (!scoreCompte) {

        try {

            const {

                error

            } =
                await supabaseClient

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudoActuel,

                        score:
                            meilleur,

                        jeu:
                            JEU,

                        date_creation:
                            new Date()
                                .toISOString()

                    });


            if (error) {

                throw error;

            }


            console.log(
                "✅ Meilleur score visiteur transféré vers Supabase :",
                meilleur
            );

        }

        catch (erreur) {

            console.error(
                "❌ Erreur transfert score visiteur :",
                erreur
            );

        }

        return;

    }


    /*
       Le score local est meilleur :
       mise à jour Supabase.
    */

    if (
        scoreLocal > scoreSupabase
    ) {

        try {

            const {

                error

            } =
                await supabaseClient

                    .from("scores")

                    .update({

                        score:
                            scoreLocal,

                        date_creation:
                            new Date()
                                .toISOString()

                    })

                    .eq(
                        "id",
                        scoreCompte.id
                    );


            if (error) {

                throw error;

            }


            console.log(
                "🏆 Nouveau meilleur score Snake transféré :",
                scoreLocal
            );

        }

        catch (erreur) {

            console.error(
                "❌ Erreur mise à jour score Snake :",
                erreur
            );

        }

    }

    else {

        console.log(
            "ℹ️ Le score Supabase est déjà meilleur ou égal."
        );

    }

}


/* =====================================================
   ENREGISTRER MANUELLEMENT LE SCORE
===================================================== */

async function enregistrerMeilleurScore() {

    const message =
        document.getElementById(
            "messageEnregistrement"
        );


    /*
       Vérifier le compte.
    */

    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        if (message) {

            message.textContent =
                "🔐 Connecte-toi pour enregistrer ton score.";

        }

        return;

    }


    utilisateurConnecte =
        true;


    pseudo =
        pseudoActuel;


    actualiserPseudo();


    /*
       Toujours utiliser le meilleur score
       local + score actuel.
    */

    mettreAJourMeilleurScore();


    const scoreLocal =
        Number(
            localStorage.getItem(
                CLE_MEILLEUR_SCORE
            )
        ) || 0;


    if (scoreLocal <= 0) {

        if (message) {

            message.textContent =
                "⚠️ Aucun score à enregistrer.";

        }

        return;

    }


    if (message) {

        message.textContent =
            "⏳ Vérification du meilleur score...";

    }


    try {

        const ancienScore =
            await recupererScoreCompte(
                pseudoActuel
            );


        /*
           Pas encore de score.
        */

        if (!ancienScore) {

            const {

                error

            } =
                await supabaseClient

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudoActuel,

                        score:
                            scoreLocal,

                        jeu:
                            JEU,

                        date_creation:
                            new Date()
                                .toISOString()

                    });


            if (error) {

                throw error;

            }


            if (message) {

                message.textContent =
                    "✅ Ton meilleur score a été enregistré !";

            }

        }


        /*
           Score existant.
        */

        else {

            const scoreSupabase =
                Number(
                    ancienScore.score || 0
                );


            /*
               Nouveau record.
            */

            if (
                scoreLocal > scoreSupabase
            ) {

                const {

                    error

                } =
                    await supabaseClient

                        .from("scores")

                        .update({

                            score:
                                scoreLocal,

                            date_creation:
                                new Date()
                                    .toISOString()

                        })

                        .eq(
                            "id",
                            ancienScore.id
                        );


                if (error) {

                    throw error;

                }


                if (message) {

                    message.textContent =
                        "🏆 Nouveau record enregistré !";

                }

            }

            else {

                if (message) {

                    message.textContent =
                        "ℹ️ Ton meilleur score est déjà enregistré.";

                }

            }

        }


        scoreEnregistre =
            true;


        await chargerClassement();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur enregistrement score :",
            erreur
        );


        scoreEnregistre =
            false;


        if (message) {

            message.textContent =
                "❌ Erreur lors de l'enregistrement.";

        }

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

        const {

            data,
            error

        } =
            await supabaseClient

                .from("scores")

                .select(
                    "pseudo,score"
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


        if (error) {

            throw error;

        }


        /*
           Aucun score.
        */

        if (

            !data ||

            data.length === 0

        ) {

            classementBody.innerHTML = `

                <tr>

                    <td colspan="3">

                        Aucun score pour Snake.

                    </td>

                </tr>

            `;


            if (messageClassement) {

                messageClassement.textContent =
                    "🌍 Aucun score pour le moment.";

            }

            return;

        }


        /*
           Affichage.
        */

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


                const pseudoCell =
                    document.createElement(
                        "td"
                    );


                pseudoCell.textContent =
                    joueur.pseudo;


                const scoreCell =
                    document.createElement(
                        "td"
                    );


                scoreCell.textContent =
                    joueur.score;


                ligne.appendChild(
                    position
                );


                ligne.appendChild(
                    pseudoCell
                );


                ligne.appendChild(
                    scoreCell
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
            "❌ Erreur classement :",
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
   FONCTIONS DISPONIBLES DANS LE HTML
===================================================== */

window.changerDirection =
    changerDirection;


window.pauseJeu =
    pauseJeu;


window.recommencer =
    recommencer;


window.enregistrerMeilleurScore =
    enregistrerMeilleurScore;


window.chargerClassement =
    chargerClassement;


/* =====================================================
   INITIALISATION
===================================================== */

nouvelleNourriture();

dessiner();

demarrerJeu();


/*
   Compter la partie actuelle.
*/

compterPartieJeu4();


/*
   Charger le classement.
*/

chargerClassement();


/*
   IMPORTANT :

   Si un compte est déjà connecté au moment
   du chargement de Snake, on synchronise
   automatiquement le meilleur score local
   avec Supabase.
*/

if (utilisateurConnecte) {

    synchroniserScoreLocalAvecCompte();

}