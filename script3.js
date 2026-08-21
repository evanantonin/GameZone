/* =====================================================
   GAMEZONE — JEU 3
   PIERRE FEUILLE CISEAUX
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
    "pierre-feuille-ciseaux";


/* =====================================================
   ELEMENTS HTML
===================================================== */

const pseudoJoueurElement =
    document.getElementById(
        "pseudoJoueur"
    );


const scoreJoueurElement =
    document.getElementById(
        "scoreJoueur"
    );


const scoreOrdinateurElement =
    document.getElementById(
        "scoreOrdinateur"
    );


const manchesJoueurElement =
    document.getElementById(
        "manchesJoueur"
    );


const manchesOrdinateurElement =
    document.getElementById(
        "manchesOrdinateur"
    );


const choixJoueurElement =
    document.getElementById(
        "choixJoueur"
    );


const choixOrdinateurElement =
    document.getElementById(
        "choixOrdinateur"
    );


const message =
    document.getElementById(
        "message"
    );


const boutonNouvelleManche =
    document.getElementById(
        "boutonNouvelleManche"
    );


const zoneEnregistrement =
    document.getElementById(
        "zoneEnregistrement"
    );


const manchesFinales =
    document.getElementById(
        "manchesFinales"
    );


const messageEnregistrement =
    document.getElementById(
        "messageEnregistrement"
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
   PSEUDO / VISITEUR
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


if (pseudoJoueurElement) {

    pseudoJoueurElement.textContent =
        pseudo || "👤 Visiteur";

}


/* =====================================================
   VARIABLES
===================================================== */

let scoreJoueur = 0;

let scoreOrdinateur = 0;

let manchesGagneesJoueur = 0;

let manchesGagneesOrdinateur = 0;

let mancheTerminee = false;

let scoreEnregistre = false;


/*
    Permet de compter une seule fois
    la manche terminée.
*/

let partieComptee = false;


/* =====================================================
   AFFICHAGE INITIAL
===================================================== */

actualiserAffichage();


/* =====================================================
   AFFICHAGE
===================================================== */

function actualiserAffichage() {

    if (scoreJoueurElement) {

        scoreJoueurElement.textContent =
            scoreJoueur;

    }


    if (scoreOrdinateurElement) {

        scoreOrdinateurElement.textContent =
            scoreOrdinateur;

    }


    if (manchesJoueurElement) {

        manchesJoueurElement.textContent =
            manchesGagneesJoueur;

    }


    if (manchesOrdinateurElement) {

        manchesOrdinateurElement.textContent =
            manchesGagneesOrdinateur;

    }

}


/* =====================================================
   CHOIX ORDINATEUR
===================================================== */

function choixOrdinateur() {

    const choix = [

        "pierre",

        "feuille",

        "ciseaux"

    ];


    const hasard =
        Math.floor(
            Math.random() *
            choix.length
        );


    return choix[hasard];

}


/* =====================================================
   AFFICHER CHOIX
===================================================== */

function afficherChoix(choix) {

    if (choix === "pierre") {

        return "✊ Pierre";

    }


    if (choix === "feuille") {

        return "📄 Feuille";

    }


    if (choix === "ciseaux") {

        return "✂️ Ciseaux";

    }


    return "-";

}


/* =====================================================
   JOUER
===================================================== */

function jouer(choix) {

    if (mancheTerminee) {

        return;

    }


    const ordinateur =
        choixOrdinateur();


    if (choixJoueurElement) {

        choixJoueurElement.textContent =
            "👤 Ton choix : " +
            afficherChoix(choix);

    }


    if (choixOrdinateurElement) {

        choixOrdinateurElement.textContent =
            "🤖 Choix ordinateur : " +
            afficherChoix(ordinateur);

    }


    /* =================================================
       EGALITE
    ================================================= */

    if (choix === ordinateur) {

        if (message) {

            message.textContent =
                "🤝 Égalité !";

        }

        return;

    }


    /* =================================================
       JOUEUR GAGNE LE POINT
    ================================================= */

    if (

        (
            choix === "pierre" &&
            ordinateur === "ciseaux"
        )

        ||

        (
            choix === "feuille" &&
            ordinateur === "pierre"
        )

        ||

        (
            choix === "ciseaux" &&
            ordinateur === "feuille"
        )

    ) {

        scoreJoueur++;


        if (message) {

            message.textContent =
                "🎉 Tu gagnes le point !";

        }

    }


    /* =================================================
       ORDINATEUR GAGNE LE POINT
    ================================================= */

    else {

        scoreOrdinateur++;


        if (message) {

            message.textContent =
                "🤖 L'ordinateur gagne le point !";

        }

    }


    actualiserAffichage();


    /* =================================================
       JOUEUR ARRIVE À 5
    ================================================= */

    if (scoreJoueur >= 5) {

        terminerManche(true);

        return;

    }


    /* =================================================
       ORDINATEUR ARRIVE À 5
    ================================================= */

    if (scoreOrdinateur >= 5) {

        terminerManche(false);

        return;

    }

}


/* =====================================================
   TERMINER UNE MANCHE
===================================================== */

async function terminerManche(
    joueurGagne
) {

    mancheTerminee = true;


    if (boutonNouvelleManche) {

        boutonNouvelleManche.style.display =
            "inline-block";

    }


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "block";

    }


    /* =================================================
       JOUEUR GAGNE
    ================================================= */

    if (joueurGagne) {

        manchesGagneesJoueur++;


        if (message) {

            message.textContent =
                "🏆 Tu as gagné cette manche ! " +
                "🎉 Tu as maintenant " +
                manchesGagneesJoueur +
                " manche(s) gagnée(s).";

        }

    }


    /* =================================================
       ORDINATEUR GAGNE
    ================================================= */

    else {

        manchesGagneesOrdinateur++;


        if (message) {

            message.textContent =
                "💀 L'ordinateur a gagné cette manche !";

        }

    }


    actualiserAffichage();


    if (manchesFinales) {

        manchesFinales.textContent =
            manchesGagneesJoueur;

    }


    /* =================================================
       COMPTER LA PARTIE
    ================================================= */

    if (!partieComptee) {

        partieComptee = true;

        await compterPartieJeu3();

    }

}


/* =====================================================
   STATISTIQUES — JEU 3
===================================================== */

async function compterPartieJeu3() {

    const nomJeu =
        "Pierre Feuille Ciseaux";


    try {

        console.log(
            "🎮 Comptage de la partie :",
            nomJeu
        );


        const recherche =
            await fetch(

                SUPABASE_URL +
                "/rest/v1/statistiques_jeux" +
                "?nom_jeu=eq." +
                encodeURIComponent(nomJeu) +
                "&select=id,nom_jeu,nombre_parties",

                {

                    method: "GET",

                    headers: {

                        "apikey":
                            SUPABASE_ANON_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_ANON_KEY,

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

            !Array.isArray(
                statistiques
            )

            ||

            statistiques.length === 0

        ) {

            console.error(
                "❌ Pierre Feuille Ciseaux n'existe pas dans statistiques_jeux"
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
                encodeURIComponent(
                    jeu.id
                ),

                {

                    method: "PATCH",

                    headers: {

                        "apikey":
                            SUPABASE_ANON_KEY,

                        "Authorization":
                            "Bearer " +
                            SUPABASE_ANON_KEY,

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
            "✅ Pierre Feuille Ciseaux : " +
            nouveauNombre +
            " parties"
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur statistiques Jeu 3 :",
            erreur
        );

    }

}


/* =====================================================
   NOUVELLE MANCHE
===================================================== */

function nouvelleManche() {

    compterPartieJeu3();


    scoreJoueur = 0;

    scoreOrdinateur = 0;

    mancheTerminee = false;

    scoreEnregistre = false;

    partieComptee = false;


    actualiserAffichage();


    if (choixJoueurElement) {

        choixJoueurElement.textContent =
            "👤 Ton choix : -";

    }


    if (choixOrdinateurElement) {

        choixOrdinateurElement.textContent =
            "🤖 Choix ordinateur : -";

    }


    if (message) {

        message.textContent =
            "🎮 Nouvelle manche !";

    }


    if (boutonNouvelleManche) {

        boutonNouvelleManche.style.display =
            "none";

    }


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "none";

    }


    if (messageEnregistrement) {

        messageEnregistrement.textContent =
            "";

    }

}


/* =====================================================
   ENREGISTRER LES MANCHES GAGNÉES
===================================================== */

async function enregistrerManches() {

    /*
       VISITEUR
    */

    if (!pseudo) {

        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "👤 Tu joues actuellement en visiteur. Crée un compte pour enregistrer ton score dans le classement mondial.";

        }

        return;

    }


    /*
       Aucun résultat
    */

    if (manchesGagneesJoueur <= 0) {

        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "⚠️ Tu dois gagner au moins une manche.";

        }

        return;

    }


    /*
       Score déjà enregistré
    */

    if (scoreEnregistre) {

        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "ℹ️ Ton résultat a déjà été enregistré.";

        }

        return;

    }


    scoreEnregistre = true;


    if (messageEnregistrement) {

        messageEnregistrement.textContent =
            "⏳ Enregistrement...";

    }


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
                "❌ Erreur recherche :",
                erreurRecherche
            );

            throw new Error(
                "Recherche impossible."
            );

        }


        /* =================================================
           JOUEUR EXISTANT
        ================================================= */

        if (

            anciensScores &&

            anciensScores.length > 0

        ) {

            const ancienNombreManches =
                Number(
                    anciensScores[0].score || 0
                );


            /*
               On conserve le fonctionnement
               de ton ancien système :
               les nouvelles manches gagnées
               sont ajoutées au total.
            */

            const nouveauNombreManches =
                ancienNombreManches +
                manchesGagneesJoueur;


            const id =
                anciensScores[0].id;


            const {

                error: erreurUpdate

            } =

                await supabaseClient

                    .from("scores")

                    .update({

                        score:
                            nouveauNombreManches,

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
                    "❌ Erreur modification score :",
                    erreurUpdate
                );

                throw new Error(
                    "Modification impossible."
                );

            }


            if (messageEnregistrement) {

                messageEnregistrement.textContent =
                    "🏆 Résultat enregistré ! " +
                    "Tu as maintenant " +
                    nouveauNombreManches +
                    " manche(s) gagnée(s) au classement.";

            }

        }


        /* =================================================
           PREMIER ENREGISTREMENT
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
                            manchesGagneesJoueur,

                        jeu:
                            JEU,

                        date_creation:
                            new Date()
                                .toISOString()

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


            if (messageEnregistrement) {

                messageEnregistrement.textContent =
                    "✅ " +
                    manchesGagneesJoueur +
                    " manche(s) gagnée(s) enregistrée(s) !";

            }

        }


        await chargerClassement();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur enregistrement :",
            erreur
        );


        scoreEnregistre = false;


        if (messageEnregistrement) {

            messageEnregistrement.textContent =
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

            console.error(
                "❌ Erreur classement :",
                error
            );

            throw new Error(
                "Classement impossible."
            );

        }


        /* =================================================
           AUCUN JOUEUR
        ================================================= */

        if (

            !data ||

            data.length === 0

        ) {

            classementBody.innerHTML = `

                <tr>

                    <td colspan="3">

                        Aucun joueur classé.

                    </td>

                </tr>

            `;


            if (messageClassement) {

                messageClassement.textContent =
                    "🌍 Aucun score pour le moment.";

            }

            return;

        }


        /* =================================================
           AFFICHER TOP 10
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


                const manchesCell =
                    document.createElement(
                        "td"
                    );


                manchesCell.textContent =
                    joueur.score;


                ligne.appendChild(
                    position
                );


                ligne.appendChild(
                    pseudoCell
                );


                ligne.appendChild(
                    manchesCell
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
   RENDRE LES FONCTIONS ACCESSIBLES AU HTML
===================================================== */

window.jouer =
    jouer;


window.nouvelleManche =
    nouvelleManche;


window.enregistrerManches =
    enregistrerManches;


window.chargerClassement =
    chargerClassement;


/* =====================================================
   DEMARRAGE
===================================================== */

chargerClassement();