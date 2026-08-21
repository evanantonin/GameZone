/* =====================================================
   GAMEZONE — JEU DE CLICS
   script1.js
   MODE CONNECTÉ + MODE VISITEUR
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

const JEU = "jeux";

const NOM_JEU_STATISTIQUE =
    "Jeu de clics";


/* =====================================================
   ELEMENTS HTML
===================================================== */

const pseudoJoueur =
    document.getElementById("pseudoJoueur");

const pseudoAffiche =
    document.getElementById("pseudoAffiche");

const scoreElement =
    document.getElementById("score");

const meilleurScoreElement =
    document.getElementById("meilleurScore");

const tempsElement =
    document.getElementById("temps");

const boutonJeu =
    document.getElementById("boutonJeu");

const boutonRejouer =
    document.getElementById("rejouer");

const zoneEnregistrement =
    document.getElementById("zoneEnregistrement");

const boutonEnregistrer =
    document.getElementById("enregistrerScore");

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


/* =====================================================
   MODE VISITEUR
===================================================== */

const modeVisiteur =
    !pseudo;


/* =====================================================
   AFFICHAGE DU PSEUDO
===================================================== */

if (pseudoJoueur) {

    pseudoJoueur.textContent =
        pseudo ||
        "👻 Visiteur";

}


if (pseudoAffiche) {

    pseudoAffiche.textContent =
        pseudo ||
        "👻 Visiteur";

}


/* =====================================================
   MEILLEUR SCORE
   CONNECTÉ :
   meilleurScore

   VISITEUR :
   meilleurScoreVisiteur
===================================================== */

const cleMeilleurScore =
    pseudo
        ? "meilleurScore_" + pseudo
        : "meilleurScoreVisiteur";


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


/* =====================================================
   VARIABLES
===================================================== */

let score = 0;

let temps = 30;

let chrono = null;

let jeuTermine = false;

let scoreEnregistre = false;


/* =====================================================
   COMPTER UNE PARTIE
   POUR TOUS LES JOUEURS,
   VISITEURS COMPRIS
===================================================== */

async function compterPartieJeu1() {

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
                "❌ Erreur statistiques :",
                error
            );

            return;

        }


        /* -------------------------------------------------
           LE JEU EXISTE
        ------------------------------------------------- */

        if (data) {

            const nouveauNombre =
                Number(
                    data.nombre_parties || 0
                ) + 1;


            const {
                error: erreurUpdate
            } =
                await supabaseClient
                    .from(
                        "statistiques_jeux"
                    )
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
                    "❌ Erreur mise à jour :",
                    erreurUpdate
                );

                return;

            }


            console.log(
                "🎮 Jeu de clics :",
                nouveauNombre,
                "parties"
            );


            return;

        }


        /* -------------------------------------------------
           LE JEU N'EXISTE PAS
        ------------------------------------------------- */

        const {
            error: erreurInsert
        } =
            await supabaseClient
                .from(
                    "statistiques_jeux"
                )
                .insert({

                    nom_jeu:
                        NOM_JEU_STATISTIQUE,

                    nombre_parties:
                        1

                });


        if (erreurInsert) {

            console.error(
                "❌ Erreur création statistiques :",
                erreurInsert
            );

            return;

        }


        console.log(
            "🎮 Jeu de clics : première partie"
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

    await compterPartieJeu1();

}


/* =====================================================
   AJOUTER UN POINT
===================================================== */

function ajouterPoint() {

    if (jeuTermine) {

        return;

    }


    score++;


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }


    /* -------------------------------------------------
       NOUVEAU MEILLEUR SCORE
    ------------------------------------------------- */

    if (score > meilleurScore) {

        meilleurScore =
            score;


        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;

        }


        localStorage.setItem(
            cleMeilleurScore,
            meilleurScore
        );

    }

}


/* =====================================================
   CHRONOMETRE
===================================================== */

function demarrerChrono() {

    clearInterval(
        chrono
    );


    chrono =
        setInterval(
            function() {

                if (jeuTermine) {

                    return;

                }


                temps--;


                if (tempsElement) {

                    tempsElement.textContent =
                        temps;

                }


                if (temps <= 0) {

                    clearInterval(
                        chrono
                    );


                    jeuTermine =
                        true;


                    if (boutonJeu) {

                        boutonJeu.disabled =
                            true;

                    }


                    if (boutonRejouer) {

                        boutonRejouer.style.display =
                            "inline-block";

                    }


                    if (zoneEnregistrement) {

                        zoneEnregistrement.style.display =
                            "block";

                    }


                    /* -------------------------------------------------
                       VISITEUR
                    ------------------------------------------------- */

                    if (modeVisiteur) {

                        if (boutonEnregistrer) {

                            boutonEnregistrer.style.display =
                                "none";

                        }


                        if (messageEnregistrement) {

                            messageEnregistrement.textContent =
                                "👻 Mode visiteur : connecte-toi pour enregistrer ton score dans le classement.";

                        }

                    }


                    console.log(
                        "⏱️ Partie terminée. Score :",
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


    /* Nouvelle partie */

    compterPartieJeu1();


    score =
        0;


    temps =
        30;


    jeuTermine =
        false;


    scoreEnregistre =
        false;


    if (scoreElement) {

        scoreElement.textContent =
            "0";

    }


    if (tempsElement) {

        tempsElement.textContent =
            "30";

    }


    if (boutonJeu) {

        boutonJeu.disabled =
            false;

    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
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


    demarrerChrono();

}


/* =====================================================
   ENREGISTRER LE SCORE
===================================================== */

async function enregistrerMeilleurScore() {

    /* -------------------------------------------------
       VISITEUR
    ------------------------------------------------- */

    if (modeVisiteur) {

        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "👻 Tu es en mode visiteur. Connecte-toi pour enregistrer ton score mondial.";

        }

        return;

    }


    if (!messageEnregistrement) {

        return;

    }


    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        messageEnregistrement.textContent =
            "❌ Aucun pseudo trouvé.";

        return;

    }


    if (score <= 0) {

        messageEnregistrement.textContent =
            "⚠️ Ton score doit être supérieur à 0.";

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


        /* -------------------------------------------------
           SCORE EXISTANT
        ------------------------------------------------- */

        if (
            data &&
            data.length > 0
        ) {

            const ancienScore =
                Number(
                    data[0].score || 0
                );


            if (score > ancienScore) {

                const {
                    error: erreurUpdate
                } =
                    await supabaseClient
                        .from("scores")
                        .update({

                            score:
                                score

                        })
                        .eq(
                            "id",
                            data[0].id
                        );


                if (erreurUpdate) {

                    throw erreurUpdate;

                }


                messageEnregistrement.textContent =
                    "🏆 Nouveau record enregistré !";

            }

            else {

                messageEnregistrement.textContent =
                    "ℹ️ Ton ancien score est meilleur ou égal.";

            }

        }


        /* -------------------------------------------------
           PREMIER SCORE
        ------------------------------------------------- */

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
            "❌ Erreur enregistrement score :",
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
                        ascending:
                            false
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

            classementBody.innerHTML = `

                <tr>

                    <td colspan="3">
                        Aucun score pour ce jeu.
                    </td>

                </tr>

            `;


            if (messageClassement) {

                messageClassement.textContent =
                    "🌍 Aucun score enregistré pour le moment.";

            }


            return;

        }


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
                "❌ Erreur lors du chargement du classement.";

        }

    }

}


/* =====================================================
   FONCTIONS DISPONIBLES DANS HTML
===================================================== */

window.ajouterPoint =
    ajouterPoint;

window.rejouer =
    rejouer;

window.enregistrerMeilleurScore =
    enregistrerMeilleurScore;

window.compterPartie =
    compterPartie;

window.chargerClassement =
    chargerClassement;


/* =====================================================
   DEMARRAGE
===================================================== */

compterPartieJeu1();

demarrerChrono();

chargerClassement();