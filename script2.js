
/* =====================================================
   GAMEZONE — JEU 2
   script2.js
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
    "jeux2";

const NOM_JEU_STATISTIQUE =
    "Jeu 2";


/* =====================================================
   PSEUDO
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


/* =====================================================
   ELEMENTS HTML
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
   AFFICHER LE PSEUDO
===================================================== */

if (pseudoAffiche) {

    pseudoAffiche.textContent =
        pseudo || "Aucun pseudo";

}


/* =====================================================
   VARIABLES DU JEU
===================================================== */

let score = 3;

let maximumPartie = 3;

let meilleurScore =
    Number(
        localStorage.getItem(
            "meilleurScoreJeux2"
        )
    ) || 0;

let partieTerminee =
    false;

let scoreEnregistre =
    false;


/* =====================================================
   AFFICHAGE INITIAL
===================================================== */

if (scoreElement) {

    scoreElement.textContent =
        score;

}


if (maximumPartieElement) {

    maximumPartieElement.textContent =
        maximumPartie;

}


if (meilleurScoreElement) {

    meilleurScoreElement.textContent =
        meilleurScore;

}


/* =====================================================
   NOMBRE SECRET
===================================================== */

function nouveauNombre() {

    return Math.floor(
        Math.random() * 3
    ) + 1;

}


let nombreSecret =
    nouveauNombre();


/* =====================================================
   COMPTER UNE PARTIE
   TABLE : statistiques_jeux
===================================================== */

async function compterPartieJeu2() {

    try {

        console.log(
            "🎮 Comptage : Devine le nombre"
        );

        const {
            data,
            error
        } = await supabaseClient
            .from("statistiques_jeux")
            .select("id,nombre_parties")
            .eq(
                "nom_jeu",
                "Devine le nombre"
            )
            .maybeSingle();


        if (error) {

            console.error(
                "❌ Erreur récupération statistiques :",
                error
            );

            return;

        }


        /*
         La ligne doit déjà exister.
         On ne fait JAMAIS de INSERT ici.
        */

        if (!data) {

            console.error(
                "❌ La ligne 'Devine le nombre' n'existe pas dans statistiques_jeux."
            );

            return;

        }


        const nouveauNombre =
            Number(
                data.nombre_parties || 0
            ) + 1;


        const {
            error: erreurUpdate
        } = await supabaseClient
            .from("statistiques_jeux")
            .update({

                nombre_parties:
                    nouveauNombre

            })
            .eq(
                "id",
                data.id
            );


        if (erreurUpdate) {

            console.error(
                "❌ Erreur mise à jour statistiques :",
                erreurUpdate
            );

            return;

        }


        console.log(
            "✅ Devine le nombre :",
            nouveauNombre,
            "parties"
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur statistiques :",
            erreur
        );

    }

}


async function compterPartie() {

    await compterPartieJeu2();

}
window.compterPartie = compterPartie;

/* =====================================================
   VERIFIER LE NOMBRE
===================================================== */

function verifier() {

    if (partieTerminee) {

        return;

    }


    if (!nombreInput) {

        return;

    }


    const choix =
        Number(
            nombreInput.value
        );


    /* =================================================
       VERIFICATION
    ================================================= */

    if (

        !Number.isInteger(choix) ||

        choix < 1 ||

        choix > 3

    ) {

        if (message) {

            message.textContent =
                "⚠️ Entre un nombre entier entre 1 et 3.";

        }

        return;

    }


    /* =================================================
       BONNE REPONSE
    ================================================= */

    if (
        choix === nombreSecret
    ) {

        score++;


        if (scoreElement) {

            scoreElement.textContent =
                score;

        }


        if (message) {

            message.textContent =
                "🎉 Bravo ! +1 point !";

        }


        if (
            score >
            maximumPartie
        ) {

            maximumPartie =
                score;


            if (maximumPartieElement) {

                maximumPartieElement.textContent =
                    maximumPartie;

            }

        }


        if (
            score >
            meilleurScore
        ) {

            meilleurScore =
                score;


            if (meilleurScoreElement) {

                meilleurScoreElement.textContent =
                    meilleurScore;

            }


            localStorage.setItem(
                "meilleurScoreJeux2",
                meilleurScore
            );

        }

    }


    /* =================================================
       MAUVAISE REPONSE
    ================================================= */

    else {

        score--;


        if (scoreElement) {

            scoreElement.textContent =
                score;

        }


        if (message) {

            message.textContent =
                "❌ Raté ! Le nombre était " +
                nombreSecret +
                ". -1 point !";

        }


        if (
            score <= 0
        ) {

            score =
                0;


            if (scoreElement) {

                scoreElement.textContent =
                    "0";

            }


            terminerPartie();

            return;

        }

    }


    /* =================================================
       NOUVEAU NOMBRE
    ================================================= */

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


    if (boutonValider) {

        boutonValider.disabled =
            true;

    }


    if (nombreInput) {

        nombreInput.disabled =
            true;

    }


    if (maximumFinalElement) {

        maximumFinalElement.textContent =
            maximumPartie;

    }


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "block";

    }


    if (message) {

        message.textContent =
            "💀 Partie terminée ! Tu es arrivé à 0 point.";

    }


    if (
        maximumPartie >
        meilleurScore
    ) {

        meilleurScore =
            maximumPartie;


        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;

        }


        localStorage.setItem(
            "meilleurScoreJeux2",
            meilleurScore
        );


        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "🔥 Nouveau record !";

        }

    }

    else {

        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "";

        }

    }


    if (nombreInput) {

        nombreInput.value =
            "";

    }

}


/* =====================================================
   NOUVELLE PARTIE
===================================================== */

function nouvellePartie() {

    compterPartie();

    score = 3;

    maximumPartie = 3;

    partieTerminee = false;

    scoreEnregistre = false;

    nombreSecret = nouveauNombre();

    if (scoreElement) {
        scoreElement.textContent = "3";
    }

    if (maximumPartieElement) {
        maximumPartieElement.textContent = "3";
    }

    if (nombreInput) {
        nombreInput.value = "";
        nombreInput.disabled = false;
        nombreInput.focus();
    }

    if (boutonValider) {
        boutonValider.disabled = false;
    }

    if (zoneEnregistrement) {
        zoneEnregistrement.style.display = "none";
    }

    if (message) {
        message.textContent = "🎲 Nouvelle partie !";
    }

    if (messageEnregistrement) {
        messageEnregistrement.textContent = "";
    }
}


    if (nombreInput) {

        nombreInput.focus();

    }




/* =====================================================
   TOUCHE ENTREE
===================================================== */

if (nombreInput) {

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

}


/* =====================================================
   ENREGISTRER LE MEILLEUR SCORE
===================================================== */

async function enregistrerMeilleurScore() {

    if (!messageEnregistrement) {

        return;

    }


    if (!pseudo) {

        messageEnregistrement.textContent =
            "❌ Aucun pseudo trouvé.";

        return;

    }


    if (
        maximumPartie <= 0
    ) {

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
                "❌ Erreur recherche score :",
                erreurRecherche
            );


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
                    anciensScores[0].score || 0
                );


            if (
                maximumPartie >
                ancienScore
            ) {

                const {
                    error: erreurUpdate
                } =
                    await supabaseClientJeu2
                        .from("scores")
                        .update({

                            score:
                                maximumPartie

                        })
                        .eq(
                            "id",
                            anciensScores[0].id
                        );


                if (erreurUpdate) {

                    console.error(
                        "❌ Erreur update score :",
                        erreurUpdate
                    );


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
                await supabaseClientJeu2
                    .from("scores")
                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            maximumPartie,

                        jeu:
                            JEU

                    });


            if (erreurInsertion) {

                console.error(
                    "❌ Erreur insertion score :",
                    erreurInsertion
                );


                throw new Error(
                    "Insertion impossible."
                );

            }


            messageEnregistrement.textContent =
                "✅ Score enregistré !";

        }


        await chargerClassement();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur enregistrement :",
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

    if (!listeScores) {

        return;

    }


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
                "❌ Erreur classement :",
                error
            );


            throw error;

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


            if (statutClassement) {

                statutClassement.textContent =
                    "🌍 Aucun score pour le moment.";

            }


            return;

        }


        /* =================================================
           AFFICHER LES SCORES
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


        if (statutClassement) {

            statutClassement.textContent =
                "🌍 Classement actualisé.";

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur classement :",
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
                "❌ Erreur lors du chargement.";

        }

    }

}


/* =====================================================
   RENDRE LES FONCTIONS ACCESSIBLES AU HTML
===================================================== */

window.verifier = verifier;
window.nouvellePartie = nouvellePartie;
window.enregistrerMeilleurScore = enregistrerMeilleurScore;
window.chargerClassement = chargerClassement;
window.compterPartie = compterPartie;

compterPartie();
chargerClassement();