


/* =====================================================
   IDENTIFICATION DU JEU
===================================================== */

const JEU =
    "jeux";


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

const pseudoJoueur =
    document.getElementById(
        "pseudoJoueur"
    );

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

const tempsElement =
    document.getElementById(
        "temps"
    );

const boutonJeu =
    document.getElementById(
        "boutonJeu"
    );

const boutonRejouer =
    document.getElementById(
        "rejouer"
    );

const zoneEnregistrement =
    document.getElementById(
        "zoneEnregistrement"
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
   VARIABLES
===================================================== */

let score = 0;

let meilleurScore =
    Number(
        localStorage.getItem(
            "meilleurScore"
        )
    ) || 0;

let temps = 30;

let chrono = null;

let jeuTermine = false;

let scoreEnregistre = false;


/* =====================================================
   AFFICHER LE PSEUDO
===================================================== */

if (pseudo) {

    pseudoJoueur.textContent =
        pseudo;

    pseudoAffiche.textContent =
        pseudo;

}

else {

    pseudoJoueur.textContent =
        "Aucun pseudo";

    pseudoAffiche.textContent =
        "Aucun pseudo";

}


/* =====================================================
   AFFICHER MEILLEUR SCORE
===================================================== */

meilleurScoreElement.textContent =
    meilleurScore;


/* =====================================================
   AJOUTER UN POINT
===================================================== */

function ajouterPoint() {


    /*
     Empêcher de jouer après
     la fin du chrono
    */

    if (jeuTermine) {

        return;

    }


    score++;


    scoreElement.textContent =
        score;


    /*
     Nouveau record local
    */

    if (
        score >
        meilleurScore
    ) {

        meilleurScore =
            score;


        meilleurScoreElement.textContent =
            meilleurScore;


        localStorage.setItem(
            "meilleurScore",
            meilleurScore
        );

    }

}


/* =====================================================
   CHRONOMÈTRE
===================================================== */

function demarrerChrono() {


    clearInterval(
        chrono
    );


    chrono =
        setInterval(
            function() {


                temps--;


                tempsElement.textContent =
                    temps;


                /*
                 FIN DE PARTIE
                */

                if (
                    temps <= 0
                ) {


                    clearInterval(
                        chrono
                    );


                    jeuTermine =
                        true;


                    boutonJeu.disabled =
                        true;


                    boutonRejouer.style.display =
                        "inline-block";


                    zoneEnregistrement.style.display =
                        "block";


                    messageEnregistrement.textContent =
                        "";


                    alert(

                        "⏱️ Temps écoulé !\n\n" +

                        "Ton score : " +

                        score

                    );

                }


            },
            1000
        );

}


/* =====================================================
   REJOUER
===================================================== */

function rejouer() {


    clearInterval(
        chrono
    );


    score =
        0;


    temps =
        30;


    jeuTermine =
        false;


    scoreEnregistre =
        false;


    scoreElement.textContent =
        "0";


    tempsElement.textContent =
        "30";


    boutonJeu.disabled =
        false;


    boutonRejouer.style.display =
        "none";


    zoneEnregistrement.style.display =
        "none";


    messageEnregistrement.textContent =
        "";


    demarrerChrono();

}


/* =====================================================
   ENREGISTRER LE SCORE
===================================================== */

async function enregistrerMeilleurScore() {


    const message =
        messageEnregistrement;


    /*
     Vérifier le pseudo
    */

    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        message.textContent =
            "❌ Aucun pseudo trouvé. Retourne à l'accueil.";

        return;

    }


    /*
     Le score doit être supérieur à 0
    */

    if (
        score <= 0
    ) {

        message.textContent =
            "⚠️ Ton score doit être supérieur à 0.";

        return;

    }


    /*
     Empêcher plusieurs clics
    */

    if (
        scoreEnregistre
    ) {

        message.textContent =
            "ℹ️ Ce score a déjà été enregistré.";

        return;

    }


    scoreEnregistre =
        true;


    message.textContent =
        "⏳ Enregistrement...";


    try {


        /* =================================================
           CHERCHER LE SCORE EXISTANT
        ================================================= */

        const {

            data: ancienScore,

            error: erreurRecherche

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


        if (
            erreurRecherche
        ) {

            console.error(
                "Erreur recherche :",
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

            ancienScore &&

            ancienScore.length > 0

        ) {


            const scoreExistant =
                Number(
                    ancienScore[0].score
                );


            /*
             Nouveau record
            */

            if (
                score >
                scoreExistant
            ) {


                const {

                    error: erreurUpdate

                } =
                    await supabaseClient

                        .from("scores")

                        .update({

                            score:
                                score,

                            date_creation:
                                new Date()
                                    .toISOString()

                        })

                        .eq(
                            "pseudo",
                            pseudoActuel
                        )

                        .eq(
                            "jeu",
                            JEU
                        );


                if (
                    erreurUpdate
                ) {

                    console.error(
                        "Erreur update :",
                        erreurUpdate
                    );


                    scoreEnregistre =
                        false;


                    throw new Error(
                        "Modification impossible."
                    );

                }


                message.textContent =
                    "🏆 Nouveau record enregistré !";

            }


            else {

                message.textContent =
                    "ℹ️ Ton ancien score est meilleur ou égal.";

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
                            pseudoActuel,

                        score:
                            score,

                        jeu:
                            JEU,

                        date_creation:
                            new Date()
                                .toISOString()

                    });


            if (
                erreurInsertion
            ) {

                console.error(
                    "Erreur insertion :",
                    erreurInsertion
                );


                scoreEnregistre =
                    false;


                throw new Error(
                    "Insertion impossible."
                );

            }


            message.textContent =
                "✅ Score enregistré !";

        }


        /*
         Actualiser le classement
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


        message.textContent =
            "❌ Erreur lors de l'enregistrement.";

    }

}


/* =====================================================
   CHARGER LE TOP 10
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


        if (error) {

            console.error(
                "Erreur classement :",
                error
            );


            throw new Error(
                "Classement impossible."
            );

        }


        /*
         Aucun score
        */

        if (

            !data ||

            data.length === 0

        ) {


            classementBody.innerHTML = `

                <tr>

                    <td colspan="3">

                        Aucun score pour ce jeu.

                    </td>

                </tr>

            `;


            messageClassement.textContent =
                "🌍 Aucun score enregistré pour le moment.";

            return;

        }


        /*
         Vider le tableau
        */

        classementBody.innerHTML =
            "";


        /*
         Afficher les joueurs
        */

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


        messageClassement.textContent =
            "🌍 Classement actualisé.";


    }


    catch (erreur) {


        console.error(
            "Erreur classement :",
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
            "❌ Erreur lors du chargement du classement.";

    }

}


/* =====================================================
   DÉMARRAGE
===================================================== */

demarrerChrono();


/* =====================================================
   CHARGER LE CLASSEMENT
===================================================== */

chargerClassement();



