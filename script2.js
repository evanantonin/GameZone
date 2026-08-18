


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

const JEU = "jeux2";


/* =====================================================
   ELEMENTS
===================================================== */

const pseudoAffiche =
    document.getElementById(
        "pseudoAffiche"
    );


const scoreElement =
    document.getElementById(
        "score"
    );


const meilleurScoreElement =
    document.getElementById(
        "meilleurScore"
    );


const maximumPartieElement =
    document.getElementById(
        "maximumPartie"
    );


const maximumFinalElement =
    document.getElementById(
        "maximumFinal"
    );


const nombreInput =
    document.getElementById(
        "nombre"
    );


const message =
    document.getElementById(
        "message"
    );


const boutonValider =
    document.getElementById(
        "boutonValider"
    );


const zoneEnregistrement =
    document.getElementById(
        "zoneEnregistrement"
    );


const messageEnregistrement =
    document.getElementById(
        "messageEnregistrement"
    );


const listeScores =
    document.getElementById(
        "listeScores"
    );


const statutClassement =
    document.getElementById(
        "statutClassement"
    );


/* =====================================================
   PSEUDO
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


if (pseudo) {

    pseudoAffiche.textContent =
        pseudo;

}


/* =====================================================
   VARIABLES DU JEU
===================================================== */


/*
   Le joueur commence avec 3 points.
*/

let score = 3;


/*
   Maximum atteint pendant
   cette partie.
*/

let maximumPartie = 3;


/*
   Meilleur score enregistré
   localement.
*/

let meilleurScore =
    Number(
        localStorage.getItem(
            "meilleurScoreJeux2"
        )
    ) || 0;


/*
   Partie terminée ?
*/

let partieTerminee = false;


/*
   Empêche plusieurs enregistrements.
*/

let scoreEnregistre = false;


/* =====================================================
   AFFICHAGE INITIAL
===================================================== */

scoreElement.textContent =
    score;


maximumPartieElement.textContent =
    maximumPartie;


meilleurScoreElement.textContent =
    meilleurScore;


/* =====================================================
   NOMBRE SECRET
===================================================== */

let nombreSecret =
    nouveauNombre();


function nouveauNombre() {

    return Math.floor(
        Math.random() * 3
    ) + 1;

}


/* =====================================================
   VERIFIER
===================================================== */

function verifier() {


    /* =========================
       PARTIE TERMINÉE
    ========================= */

    if (partieTerminee) {

        return;

    }


    /* =========================
       RÉCUPÉRER LE NOMBRE
    ========================= */

    const choix =
        Number(
            nombreInput.value
        );


    /* =========================
       VÉRIFICATION
    ========================= */

    if (

        !Number.isInteger(choix) ||

        choix < 1 ||

        choix > 3

    ) {

        message.textContent =
            "⚠️ Entre un nombre entier entre 1 et 3.";

        return;

    }


    /* =================================================
       BONNE RÉPONSE
    ================================================= */

    if (choix === nombreSecret) {


        score++;


        scoreElement.textContent =
            score;


        message.textContent =
            "🎉 Bravo ! +1 point !";


        /*
           Vérifier si on a dépassé
           le maximum de la partie.
        */

        if (
            score > maximumPartie
        ) {

            maximumPartie =
                score;


            maximumPartieElement.textContent =
                maximumPartie;

        }


        /*
           Vérifier le record local.
        */

        if (
            score > meilleurScore
        ) {

            meilleurScore =
                score;


            meilleurScoreElement.textContent =
                meilleurScore;


            localStorage.setItem(

                "meilleurScoreJeux2",

                meilleurScore

            );

        }

    }


    /* =================================================
       MAUVAISE RÉPONSE
    ================================================= */

    else {


        score--;


        scoreElement.textContent =
            score;


        message.textContent =

            "❌ Raté ! Le nombre était " +

            nombreSecret +

            ". -1 point !";


        /*
           Si le score arrive à 0,
           la partie est terminée.
        */

        if (score <= 0) {

            score = 0;

            scoreElement.textContent =
                "0";


            terminerPartie();


            return;

        }

    }


    /*
       Nouveau nombre après
       chaque tentative.
    */

    nombreSecret =
        nouveauNombre();


    nombreInput.value =
        "";


    nombreInput.focus();

}


/* =====================================================
   FIN DE PARTIE
===================================================== */

function terminerPartie() {


    partieTerminee =
        true;


    boutonValider.disabled =
        true;


    nombreInput.disabled =
        true;


    maximumFinalElement.textContent =
        maximumPartie;


    zoneEnregistrement.style.display =
        "block";


    message.textContent =

        "💀 Partie terminée ! " +

        "Tu es arrivé à 0 point.";


    /*
       Si le maximum est supérieur
       au meilleur score local,
       on le sauvegarde.
    */

    if (
        maximumPartie > meilleurScore
    ) {

        meilleurScore =
            maximumPartie;


        meilleurScoreElement.textContent =
            meilleurScore;


        localStorage.setItem(

            "meilleurScoreJeux2",

            meilleurScore

        );


        messageEnregistrement.textContent =

            "🔥 Nouveau record !";

    }

    else {

        messageEnregistrement.textContent =
            "";

    }


    nombreInput.value = "";


}


/* =====================================================
   NOUVELLE PARTIE
===================================================== */

function nouvellePartie() {


    score = 3;


    maximumPartie = 3;


    partieTerminee =
        false;


    scoreEnregistre =
        false;


    nombreSecret =
        nouveauNombre();


    scoreElement.textContent =
        "3";


    maximumPartieElement.textContent =
        "3";


    nombreInput.value =
        "";


    nombreInput.disabled =
        false;


    boutonValider.disabled =
        false;


    zoneEnregistrement.style.display =
        "none";


    message.textContent =
        "🎲 Nouvelle partie !";


    messageEnregistrement.textContent =
        "";


    nombreInput.focus();

}


/* =====================================================
   TOUCHE ENTRÉE
===================================================== */

nombreInput.addEventListener(

    "keydown",

    function(event) {


        if (
            event.key === "Enter"
        ) {

            verifier();

        }

    }

);


/* =====================================================
   ENREGISTRER LE MEILLEUR SCORE
===================================================== */

async function enregistrerMeilleurScore() {


    if (!pseudo) {

        messageEnregistrement.textContent =
            "❌ Aucun pseudo trouvé.";

        return;

    }


    if (maximumPartie <= 0) {

        messageEnregistrement.textContent =
            "⚠️ Aucun score à enregistrer.";

        return;

    }


    if (scoreEnregistre) {

        messageEnregistrement.textContent =
            "ℹ️ Ce score a déjà été enregistré.";

        return;

    }


    scoreEnregistre =
        true;


    messageEnregistrement.textContent =
        "⏳ Enregistrement...";


    try {


        /* =================================================
           CHERCHER LE SCORE EXISTANT
        ================================================= */

        const {

            data: anciensScores,

            error: erreurRecherche

        } =

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
                    JEU
                )

                .limit(1);


        if (erreurRecherche) {

            console.error(
                erreurRecherche
            );


            scoreEnregistre =
                false;


            throw new Error(
                "Recherche impossible."
            );

        }


        /* =================================================
           SCORE EXISTANT
        ================================================= */

        if (

            anciensScores &&

            anciensScores.length > 0

        ) {


            const ancienScore =
                Number(
                    anciensScores[0].score
                );


            /*
               Seulement si le nouveau
               maximum est supérieur.
            */

            if (

                maximumPartie >
                ancienScore

            ) {


                const id =
                    anciensScores[0].id;


                const {

                    error: erreurUpdate

                } =

                    await supabaseClient

                        .from("scores")

                        .update({

                            score:
                                maximumPartie,

                            date_creation:
                                new Date()
                                    .toISOString()

                        })

                        .eq(
                            "id",
                            id
                        );


                if (erreurUpdate) {

                    console.error(
                        erreurUpdate
                    );


                    scoreEnregistre =
                        false;


                    throw new Error(
                        "Modification impossible."
                    );

                }


                messageEnregistrement.textContent =

                    "🏆 Nouveau record enregistré !";

            }

            else {

                messageEnregistrement.textContent =

                    "ℹ️ Ton ancien record est meilleur ou égal.";

            }

        }


        /* =================================================
           PREMIER SCORE
        ================================================= */

        else {


            const {

                error: erreurInsertion

            } =

                await supabaseClient

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            maximumPartie,

                        jeu:
                            JEU,

                        date_creation:
                            new Date()
                                .toISOString()

                    });


            if (erreurInsertion) {

                console.error(
                    erreurInsertion
                );


                scoreEnregistre =
                    false;


                throw new Error(
                    "Insertion impossible."
                );

            }


            messageEnregistrement.textContent =

                "✅ Score enregistré !";

        }


        /*
           Actualiser le classement.
        */

        await chargerClassement();


    }

    catch (erreur) {


        console.error(
            "Erreur :",
            erreur
        );


        scoreEnregistre =
            false;


        messageEnregistrement.textContent =

            "❌ Erreur lors de l'enregistrement.";

    }

}


/* =====================================================
   CHARGER TOP 10
===================================================== */

async function chargerClassement() {


    listeScores.innerHTML = `

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

            console.error(
                error
            );


            throw new Error(
                "Classement impossible."
            );

        }


        /* =================================================
           AUCUN SCORE
        ================================================= */

        if (

            !data ||

            data.length === 0

        ) {


            listeScores.innerHTML = `

                <tr>

                    <td colspan="3">

                        Aucun score pour ce jeu.

                    </td>

                </tr>

            `;


            statutClassement.textContent =
                "🌍 Aucun score pour le moment.";


            return;

        }


        /* =================================================
           AFFICHER TOP 10
        ================================================= */

        listeScores.innerHTML =
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


                listeScores.appendChild(
                    ligne
                );

            }

        );


        statutClassement.textContent =
            "🌍 Classement actualisé.";


    }

    catch (erreur) {


        console.error(
            erreur
        );


        listeScores.innerHTML = `

            <tr>

                <td colspan="3">

                    ❌ Impossible de charger le classement.

                </td>

            </tr>

        `;


        statutClassement.textContent =
            "❌ Erreur lors du chargement.";

    }

}


/* =====================================================
   DÉMARRAGE
===================================================== */

chargerClassement();

