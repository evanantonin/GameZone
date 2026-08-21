
/* =====================================================
   GAMEZONE — JEU 2
   DEVINE LE NOMBRE
   script2.js

   Système :
   - Visiteur = peut jouer
   - Compte = peut jouer + enregistrer ses scores
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
    "Devine le nombre";


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
   VARIABLES
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

let nombreSecret =
    nouveauNombre();


/* =====================================================
   VISITEUR / COMPTE
===================================================== */

let utilisateurConnecte =
    null;


/* =====================================================
   VERIFIER LA SESSION
===================================================== */

async function verifierSession() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient.auth.getUser();


        if (
            error ||
            !data ||
            !data.user
        ) {

            utilisateurConnecte =
                null;

            afficherVisiteur();

            return;

        }


        utilisateurConnecte =
            data.user;


        await afficherUtilisateur();


    }

    catch (erreur) {

        console.error(
            "❌ Erreur session :",
            erreur
        );

        utilisateurConnecte =
            null;

        afficherVisiteur();

    }

}


/* =====================================================
   AFFICHER VISITEUR
===================================================== */

function afficherVisiteur() {

    if (!pseudoAffiche) {

        return;

    }


    pseudoAffiche.textContent =
        "Visiteur 👤";

}


/* =====================================================
   AFFICHER UTILISATEUR CONNECTÉ
===================================================== */

async function afficherUtilisateur() {

    if (!pseudoAffiche) {

        return;

    }


    let pseudo =
        "Joueur";


    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("profils")
                .select("pseudo")
                .eq(
                    "id",
                    utilisateurConnecte.id
                )
                .maybeSingle();


        if (
            !error &&
            data &&
            data.pseudo
        ) {

            pseudo =
                data.pseudo;

        }

        else if (
            utilisateurConnecte.user_metadata &&
            utilisateurConnecte.user_metadata.pseudo
        ) {

            pseudo =
                utilisateurConnecte
                    .user_metadata
                    .pseudo;

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur récupération pseudo :",
            erreur
        );

    }


    pseudoAffiche.textContent =
        pseudo + " 👤";

}


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


/* =====================================================
   COMPTER UNE PARTIE
===================================================== */

async function compterPartieJeu2() {

    try {

        const {
            data,
            error
        } =
            await supabaseClient
                .from("statistiques_jeux")
                .select(
                    "id,nombre_parties"
                )
                .eq(
                    "nom_jeu",
                    NOM_JEU_STATISTIQUE
                )
                .maybeSingle();


        if (error) {

            console.error(
                "❌ Erreur récupération statistiques :",
                error
            );

            return;

        }


        if (!data) {

            console.error(
                "❌ La ligne 'Devine le nombre' n'existe pas."
            );

            return;

        }


        const nouveauNombreParties =
            Number(
                data.nombre_parties || 0
            ) + 1;


        const {
            error: erreurUpdate
        } =
            await supabaseClient
                .from("statistiques_jeux")
                .update({

                    nombre_parties:
                        nouveauNombreParties

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
            nouveauNombreParties,
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


/* =====================================================
   FONCTION GENERALE
===================================================== */

async function compterPartie() {

    await compterPartieJeu2();

}


window.compterPartie =
    compterPartie;


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
       VALIDATION
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

            score = 0;


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

    }


    if (messageEnregistrement) {

        messageEnregistrement.textContent =
            "";

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


    score =
        3;

    maximumPartie =
        3;

    partieTerminee =
        false;

    scoreEnregistre =
        false;

    nombreSecret =
        nouveauNombre();


    if (scoreElement) {

        scoreElement.textContent =
            "3";

    }


    if (maximumPartieElement) {

        maximumPartieElement.textContent =
            "3";

    }


    if (nombreInput) {

        nombreInput.value =
            "";

        nombreInput.disabled =
            false;

        nombreInput.focus();

    }


    if (boutonValider) {

        boutonValider.disabled =
            false;

    }


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "none";

    }


    if (message) {

        message.textContent =
            "🎲 Nouvelle partie !";

    }


    if (messageEnregistrement) {

        messageEnregistrement.textContent =
            "";

    }

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


    /* =================================================
       VISITEUR
    ================================================= */

    if (!utilisateurConnecte) {

        messageEnregistrement.innerHTML =

            `🔐 Tu joues actuellement en visiteur.<br><br>

             Crée un compte ou connecte-toi pour
             enregistrer ton score dans le classement.<br><br>

             <a href="compte.html"
                class="bouton-compte">

                👤 Créer un compte / Se connecter

             </a>`;

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

        /* =================================================
           RÉCUPÉRER LE PSEUDO DU COMPTE
        ================================================= */

        let pseudoCompte =
            "Joueur";


        const {
            data: profil,
            error: erreurProfil
        } =
            await supabaseClient
                .from("profils")
                .select("pseudo")
                .eq(
                    "id",
                    utilisateurConnecte.id
                )
                .maybeSingle();


        if (
            !erreurProfil &&
            profil &&
            profil.pseudo
        ) {

            pseudoCompte =
                profil.pseudo;

        }

        else if (
            utilisateurConnecte.user_metadata &&
            utilisateurConnecte.user_metadata.pseudo
        ) {

            pseudoCompte =
                utilisateurConnecte
                    .user_metadata
                    .pseudo;

        }


        /* =================================================
           RECHERCHE DU SCORE
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
                    pseudoCompte
                )
                .eq(
                    "jeu",
                    JEU
                )
                .limit(1);


        if (erreurRecherche) {

            throw erreurRecherche;

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
                    await supabaseClient
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

                    throw erreurUpdate;

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
                            pseudoCompte,

                        score:
                            maximumPartie,

                        jeu:
                            JEU

                    });


            if (erreurInsertion) {

                throw erreurInsertion;

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

            throw error;

        }


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

window.verifier =
    verifier;

window.nouvellePartie =
    nouvellePartie;

window.enregistrerMeilleurScore =
    enregistrerMeilleurScore;

window.chargerClassement =
    chargerClassement;

window.compterPartie =
    compterPartie;


/* =====================================================
   DEMARRAGE
===================================================== */

verifierSession();

compterPartie();

chargerClassement();