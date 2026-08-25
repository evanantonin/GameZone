/* =====================================================
   GAMEZONE — JEU DE CLICS
   script1.js
   MODE VISITEUR + LOCAL STORAGE + SUPABASE
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
    "jeux";

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

const messageEnregistrement =
    document.getElementById("messageEnregistrement");

const classementBody =
    document.getElementById("classementBody");

const messageClassement =
    document.getElementById("messageClassement");


/* =====================================================
   PSEUDO / MODE VISITEUR
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


const estVisiteur =
    !pseudo;


/* =====================================================
   AFFICHAGE DU PSEUDO
===================================================== */

if (pseudoJoueur) {

    pseudoJoueur.textContent =
        pseudo || "👻 Visiteur";

}


if (pseudoAffiche) {

    pseudoAffiche.textContent =
        pseudo || "👻 Visiteur";

}


/* =====================================================
   CLE LOCAL STORAGE
===================================================== */

/*
   Pour le visiteur :

   meilleurScoreJeu1Visiteur

   Pour un compte :

   meilleurScoreJeu1_<pseudo>

   Cela permet de conserver le meilleur score
   même si plusieurs personnes utilisent le même ordinateur.
*/

const CLE_SCORE_VISITEUR =
    "meilleurScoreJeu1Visiteur";


function obtenirCleScoreCompte(pseudoCompte) {

    return (
        "meilleurScoreJeu1_" +
        pseudoCompte
    );

}


/* =====================================================
   RECUPERER LE MEILLEUR SCORE LOCAL
===================================================== */

function obtenirMeilleurScoreLocal() {

    let scoreLocal = 0;


    /* =================================================
       MODE VISITEUR
    ================================================= */

    if (!pseudo) {

        scoreLocal =
            Number(
                localStorage.getItem(
                    CLE_SCORE_VISITEUR
                )
            ) || 0;

    }


    /* =================================================
       MODE COMPTE
    ================================================= */

    else {

        scoreLocal =
            Number(
                localStorage.getItem(
                    obtenirCleScoreCompte(
                        pseudo
                    )
                )
            ) || 0;

    }


    return scoreLocal;

}


/* =====================================================
   VARIABLES
===================================================== */

let score = 0;

let meilleurScore =
    obtenirMeilleurScoreLocal();

let temps = 30;

let chrono = null;

let jeuTermine = false;

let scoreEnregistre = false;


/* =====================================================
   AFFICHER LE MEILLEUR SCORE
===================================================== */

if (meilleurScoreElement) {

    meilleurScoreElement.textContent =
        meilleurScore;

}


/* =====================================================
   SAUVEGARDER LE MEILLEUR SCORE LOCAL
===================================================== */

function sauvegarderMeilleurScoreLocal() {

    /* =================================================
       VISITEUR
    ================================================= */

    if (!pseudo) {

        localStorage.setItem(
            CLE_SCORE_VISITEUR,
            meilleurScore
        );

        return;

    }


    /* =================================================
       COMPTE
    ================================================= */

    localStorage.setItem(

        obtenirCleScoreCompte(
            pseudo
        ),

        meilleurScore

    );

}


/* =====================================================
   COMPTER UNE PARTIE
   TABLE : statistiques_jeux
===================================================== */

async function compterPartieJeu1() {

    try {

        const resultat =
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


        if (resultat.error) {

            console.error(
                "❌ Erreur statistiques Jeu 1 :",
                resultat.error
            );

            return;

        }


        /* =================================================
           LE JEU EXISTE
        ================================================= */

        if (resultat.data) {

            const nouveauNombre =
                Number(
                    resultat.data.nombre_parties || 0
                ) + 1;


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
                    "❌ Erreur mise à jour statistiques :",
                    miseAJour.error
                );

                return;

            }


            console.log(
                "✅ Jeu de clics :",
                nouveauNombre,
                "parties"
            );

            return;

        }


        /* =================================================
           LE JEU N'EXISTE PAS
        ================================================= */

        const insertion =
            await supabaseClient

                .from("statistiques_jeux")

                .insert({

                    nom_jeu:
                        NOM_JEU_STATISTIQUE,

                    nombre_parties:
                        1

                });


        if (insertion.error) {

            console.error(
                "❌ Erreur création statistiques :",
                insertion.error
            );

            return;

        }


        console.log(
            "✅ Jeu de clics : 1 partie"
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur statistiques Jeu 1 :",
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


    /* =================================================
       NOUVEAU MEILLEUR SCORE
    ================================================= */

    if (score > meilleurScore) {

        meilleurScore =
            score;


        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;

        }


        /*
           Sauvegarde immédiate dans localStorage.
        */

        sauvegarderMeilleurScoreLocal();

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


                    /*
                       Le visiteur peut voir son score
                       mais ne peut pas l'envoyer
                       dans le classement mondial.
                    */

                    if (zoneEnregistrement) {

                        zoneEnregistrement.style.display =
                            "block";

                    }


                    if (pseudo) {

                        if (messageEnregistrement) {

                            messageEnregistrement.textContent =
                                "🏆 Ton meilleur score peut être enregistré dans le classement.";

                        }

                    }

                    else {

                        if (messageEnregistrement) {

                            messageEnregistrement.textContent =
                                "👻 Mode visiteur : ton meilleur score est sauvegardé sur cet appareil.";

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


    /*
       Une nouvelle partie commence.
    */

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
   ENREGISTRER LE MEILLEUR SCORE
===================================================== */

async function enregistrerMeilleurScore() {

    if (!messageEnregistrement) {

        return;

    }


    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    /* =================================================
       VISITEUR
    ================================================= */

    if (!pseudoActuel) {

        messageEnregistrement.textContent =
            "👻 Mode visiteur : ton score est déjà sauvegardé sur cet appareil. Crée un compte pour l'envoyer dans le classement mondial.";

        return;

    }


    /* =================================================
       SCORE INVALIDE
    ================================================= */

    if (meilleurScore <= 0) {

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

        /* =================================================
           RECUPERER LE SCORE ACTUEL DU JOUEUR
        ================================================= */

        const resultat =
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


        if (resultat.error) {

            throw resultat.error;

        }


        /* =================================================
           SCORE EXISTANT
        ================================================= */

        if (
            resultat.data &&
            resultat.data.length > 0
        ) {

            const ancienScore =
                Number(
                    resultat.data[0].score || 0
                );


            /*
               On garde toujours le meilleur.
            */

            if (
                meilleurScore >
                ancienScore
            ) {

                const miseAJour =
                    await supabaseClient

                        .from("scores")

                        .update({

                            score:
                                meilleurScore

                        })

                        .eq(
                            "id",
                            resultat.data[0].id
                        );


                if (miseAJour.error) {

                    throw miseAJour.error;

                }


                messageEnregistrement.textContent =
                    "🏆 Nouveau record enregistré dans le classement !";

            }

            else {

                messageEnregistrement.textContent =
                    "ℹ️ Ton ancien score est meilleur ou égal.";

            }

        }


        /* =================================================
           PREMIER SCORE
        ================================================= */

        else {

            const insertion =
                await supabaseClient

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudoActuel,

                        score:
                            meilleurScore,

                        jeu:
                            JEU

                    });


            if (insertion.error) {

                throw insertion.error;

            }


            messageEnregistrement.textContent =
                "✅ Meilleur score enregistré dans le classement !";

        }


        /*
           Sauvegarde également le score
           sous le pseudo du compte.
        */

        localStorage.setItem(

            obtenirCleScoreCompte(
                pseudoActuel
            ),

            meilleurScore

        );


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
   RECUPERER UN ANCIEN SCORE VISITEUR
===================================================== */

/*
   Cette fonction permet de récupérer le score
   qui était sauvegardé avant la création du compte.

   Exemple :

   Visiteur :
   meilleurScoreJeu1Visiteur = 42

   Puis création du compte "Evan"

   Le score 42 devient le meilleur score local
   du compte Evan.

   Ensuite il peut être envoyé vers Supabase.
*/

function recupererScoreVisiteurPourCompte() {

    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        return;

    }


    const scoreVisiteur =
        Number(
            localStorage.getItem(
                CLE_SCORE_VISITEUR
            )
        ) || 0;


    if (scoreVisiteur <= 0) {

        return;

    }


    const cleCompte =
        obtenirCleScoreCompte(
            pseudoActuel
        );


    const scoreCompte =
        Number(
            localStorage.getItem(
                cleCompte
            )
        ) || 0;


    /*
       On conserve le meilleur des deux.
    */

    const meilleur =
        Math.max(
            scoreVisiteur,
            scoreCompte
        );


    if (meilleur > 0) {

        localStorage.setItem(
            cleCompte,
            meilleur
        );


        /*
           On utilise également ce score
           pour la partie actuelle.
        */

        if (
            meilleur >
            meilleurScore
        ) {

            meilleurScore =
                meilleur;


            if (meilleurScoreElement) {

                meilleurScoreElement.textContent =
                    meilleurScore;

            }

        }

    }


    /*
       Le score visiteur peut maintenant être
       supprimé pour éviter de le récupérer
       plusieurs fois.
    */

    localStorage.removeItem(
        CLE_SCORE_VISITEUR
    );


    console.log(
        "✅ Ancien score visiteur récupéré :",
        meilleur
    );

}


/* =====================================================
   CHARGER LE TOP 10
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

        const resultat =
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


        if (resultat.error) {

            throw resultat.error;

        }


        const data =
            resultat.data;


        /* =================================================
           AUCUN SCORE
        ================================================= */

        if (
            !data ||
            data.length === 0
        ) {

            classementBody.innerHTML = `

                <tr>

                    <td colspan="3">

                        🏆 Aucun score
                        enregistré pour le moment.

                    </td>

                </tr>

            `;


            if (messageClassement) {

                messageClassement.textContent =
                    "🌍 Aucun score enregistré pour le moment.";

            }

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
   RENDRE LES FONCTIONS DISPONIBLES AU HTML
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
   RECUPERATION DU SCORE VISITEUR
===================================================== */

/*
   Si un pseudo existe déjà, on vérifie si un ancien
   meilleur score avait été sauvegardé en mode visiteur.

   Cela permet de transférer le meilleur score
   après création/connexion du compte.
*/

if (pseudo) {

    recupererScoreVisiteurPourCompte();

}


/* =====================================================
   DEMARRAGE
===================================================== */

/*
   La première ouverture du jeu compte comme une partie.
*/

compterPartieJeu1();


/*
   Démarrage du chrono.
*/

demarrerChrono();


/*
   Chargement du classement mondial.
*/

chargerClassement();


/* =====================================================
   MESSAGE CONSOLE
===================================================== */

console.log(
    "✅ script1.js chargé correctement."
);


console.log(
    pseudo
        ? "👤 Mode connecté : " + pseudo
        : "👻 Mode visiteur"
);


console.log(
    "🏆 Meilleur score actuel :",
    meilleurScore
);