


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

const JEU = "jeux3";


/* =====================================================
   ELEMENTS
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
   PSEUDO
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


pseudoJoueurElement.textContent =
    pseudo || "Joueur";


/* =====================================================
   VARIABLES
===================================================== */

/*
   Score de la manche actuelle
*/

let scoreJoueur = 0;

let scoreOrdinateur = 0;


/*
   Nombre de manches gagnées
*/

let manchesGagneesJoueur = 0;

let manchesGagneesOrdinateur = 0;


/*
   État de la manche
*/

let mancheTerminee = false;


/*
   Empêche plusieurs enregistrements
*/

let scoreEnregistre = false;


/* =====================================================
   AFFICHAGE INITIAL
===================================================== */

actualiserAffichage();


/* =====================================================
   AFFICHAGE
===================================================== */

function actualiserAffichage() {

    scoreJoueurElement.textContent =
        scoreJoueur;


    scoreOrdinateurElement.textContent =
        scoreOrdinateur;


    manchesJoueurElement.textContent =
        manchesGagneesJoueur;


    manchesOrdinateurElement.textContent =
        manchesGagneesOrdinateur;

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


    /*
       Si la manche est terminée,
       on ne joue plus.
    */

    if (mancheTerminee) {

        return;

    }


    const ordinateur =
        choixOrdinateur();


    choixJoueurElement.textContent =
        "👤 Ton choix : " +
        afficherChoix(choix);


    choixOrdinateurElement.textContent =
        "🤖 Choix ordinateur : " +
        afficherChoix(ordinateur);


    /* =================================================
       ÉGALITÉ
    ================================================= */

    if (choix === ordinateur) {

        message.textContent =
            "🤝 Égalité !";

        return;

    }


    /* =================================================
       JOUEUR GAGNE LE POINT
    ================================================= */

    if (

        (choix === "pierre" &&
            ordinateur === "ciseaux")

        ||

        (choix === "feuille" &&
            ordinateur === "pierre")

        ||

        (choix === "ciseaux" &&
            ordinateur === "feuille")

    ) {


        scoreJoueur++;


        message.textContent =
            "🎉 Tu gagnes le point !";


    }


    /* =================================================
       ORDINATEUR GAGNE LE POINT
    ================================================= */

    else {


        scoreOrdinateur++;


        message.textContent =
            "🤖 L'ordinateur gagne le point !";

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

function terminerManche(joueurGagne) {


    mancheTerminee =
        true;


    boutonNouvelleManche.style.display =
        "inline-block";


    zoneEnregistrement.style.display =
        "block";


    if (joueurGagne) {


        /*
           UNE SEULE MANCHE GAGNÉE
           = +1 manche pour le joueur
        */

        manchesGagneesJoueur++;


        message.textContent =

            "🏆 Tu as gagné cette manche !";


        message.textContent +=

            " 🎉 Tu as maintenant " +

            manchesGagneesJoueur +

            " manche(s) gagnée(s).";


    }


    else {


        manchesGagneesOrdinateur++;


        message.textContent =

            "💀 L'ordinateur a gagné cette manche !";

    }


    actualiserAffichage();


    manchesFinales.textContent =
        manchesGagneesJoueur;


    /*
       Le score de la manche reste visible
       jusqu'au clic sur Nouvelle manche.
    */

}


/* =====================================================
   NOUVELLE MANCHE
===================================================== */

function nouvelleManche() {


    /*
       IMPORTANT :
       On ne remet PAS les manches gagnées à zéro.
    */


    scoreJoueur =
        0;


    scoreOrdinateur =
        0;


    mancheTerminee =
        false;


    scoreEnregistre =
        false;


    actualiserAffichage();


    choixJoueurElement.textContent =
        "👤 Ton choix : -";


    choixOrdinateurElement.textContent =
        "🤖 Choix ordinateur : -";


    message.textContent =
        "🎮 Nouvelle manche !";


    boutonNouvelleManche.style.display =
        "none";


    zoneEnregistrement.style.display =
        "none";


    messageEnregistrement.textContent =
        "";

}


/* =====================================================
   ENREGISTRER LES MANCHES GAGNÉES
===================================================== */

async function enregistrerManches() {


    if (!pseudo) {

        messageEnregistrement.textContent =
            "❌ Aucun pseudo trouvé.";

        return;

    }


    /*
       On ne peut enregistrer que si
       le joueur a gagné au moins une manche.
    */

    if (manchesGagneesJoueur <= 0) {

        messageEnregistrement.textContent =
            "⚠️ Tu dois gagner au moins une manche.";

        return;

    }


    if (scoreEnregistre) {

        messageEnregistrement.textContent =
            "ℹ️ Ton résultat a déjà été enregistré.";

        return;

    }


    scoreEnregistre =
        true;


    messageEnregistrement.textContent =
        "⏳ Enregistrement...";


    try {


        /* =================================================
           RECHERCHER LE JOUEUR
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
           JOUEUR EXISTANT
        ================================================= */

        if (

            anciensScores &&

            anciensScores.length > 0

        ) {


            const ancienNombreManches =
                Number(
                    anciensScores[0].score
                );


            /*
               On ajoute les manches gagnées
               à celles déjà enregistrées.
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
                    erreurUpdate
                );


                scoreEnregistre =
                    false;


                throw new Error(
                    "Modification impossible."
                );

            }


            messageEnregistrement.textContent =

                "🏆 Résultat enregistré ! " +

                "Tu as maintenant " +

                nouveauNombreManches +

                " manche(s) gagnée(s) au classement.";

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
                    erreurInsertion
                );


                scoreEnregistre =
                    false;


                throw new Error(
                    "Insertion impossible."
                );

            }


            messageEnregistrement.textContent =

                "✅ " +

                manchesGagneesJoueur +

                " manche(s) gagnée(s) enregistrée(s) !";

        }


        await chargerClassement();


    }

    catch (erreur) {


        console.error(
            erreur
        );


        scoreEnregistre =
            false;


        messageEnregistrement.textContent =

            "❌ Erreur lors de l'enregistrement.";

    }

}


/* =====================================================
   CLASSEMENT TOP 10
===================================================== */

async function chargerClassement() {


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


            messageClassement.textContent =
                "🌍 Aucun score pour le moment.";


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


                /* POSITION */

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


                /* PSEUDO */

                const pseudoCell =
                    document.createElement(
                        "td"
                    );


                pseudoCell.textContent =
                    joueur.pseudo;


                /* MANCHES */

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


        messageClassement.textContent =
            "🌍 Classement actualisé.";


    }

    catch (erreur) {


        console.error(
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


        messageClassement.textContent =
            "❌ Erreur lors du chargement.";

    }

}


/* =====================================================
   DÉMARRAGE
===================================================== */

chargerClassement();

