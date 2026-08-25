/* =====================================================
   GAMEZONE — DEVINE LE NOMBRE
   script2.js

   MODE VISITEUR :
   - Meilleur score sauvegardé dans localStorage

   MODE COMPTE :
   - Meilleur score sauvegardé dans Supabase

   TRANSFERT :
   - Le meilleur score visiteur est transféré
     automatiquement lorsqu'un pseudo est détecté.
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


const boutonValider =
    document.getElementById(
        "boutonValider"
    );


const boutonNouvellePartie =
    document.getElementById(
        "boutonNouvellePartie"
    );


const messageElement =
    document.getElementById(
        "message"
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

function obtenirPseudo() {

    return localStorage.getItem(
        "pseudoGameZone"
    );

}


const pseudo =
    obtenirPseudo();


/* =====================================================
   AFFICHAGE PSEUDO
===================================================== */

if (pseudoAffiche) {

    pseudoAffiche.textContent =
        pseudo || "👻 Visiteur";

}


/* =====================================================
   MODE
===================================================== */

const modeVisiteur =
    !pseudo;


/* =====================================================
   LOCAL STORAGE
===================================================== */

/*
   Meilleur score du visiteur.

   Cette valeur reste dans le navigateur
   même après fermeture de la page.
*/

const CLE_MEILLEUR_VISITEUR =
    "meilleurScoreJeux2Visiteur";


/*
   Meilleur score associé au pseudo.

   Cela permet également de garder
   une sauvegarde locale.
*/

const CLE_MEILLEUR_PSEUDO =
    pseudo
        ? "meilleurScoreJeux2_" + pseudo
        : null;


/* =====================================================
   RECUPERER MEILLEUR SCORE
===================================================== */

function recupererMeilleurLocal() {

    let valeur = 0;


    /*
       VISITEUR
    */

    if (!pseudo) {

        valeur =
            Number(
                localStorage.getItem(
                    CLE_MEILLEUR_VISITEUR
                )
            ) || 0;

    }


    /*
       COMPTE
    */

    else {

        valeur =
            Number(
                localStorage.getItem(
                    CLE_MEILLEUR_PSEUDO
                )
            ) || 0;

    }


    return valeur;

}


/* =====================================================
   MEILLEUR SCORE
===================================================== */

let meilleurScore =
    recupererMeilleurLocal();


/* =====================================================
   VARIABLES DU JEU
===================================================== */

let score = 3;

let maximumPartie = 3;

let nombreSecret = 0;

let partieTerminee = false;

let scoreEnregistre = false;

let partieComptee = false;


/* =====================================================
   GENERER UN NOMBRE
===================================================== */

function genererNombre() {

    return Math.floor(
        Math.random() * 3
    ) + 1;

}


/* =====================================================
   NOUVELLE PARTIE
===================================================== */

function nouvellePartie() {

    nombreSecret =
        genererNombre();


    score =
        3;


    maximumPartie =
        3;


    partieTerminee =
        false;


    scoreEnregistre =
        false;


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }


    if (maximumPartieElement) {

        maximumPartieElement.textContent =
            maximumPartie;

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


    if (messageElement) {

        messageElement.textContent =
            "🎯 Trouve le nombre entre 1 et 3 !";

    }


    compterPartieJeu2();

}


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


    const proposition =
        Number(
            nombreInput.value
        );


    /*
       Vérification entrée
    */

    if (
        !Number.isInteger(proposition) ||
        proposition < 1 ||
        proposition > 3
    ) {

        if (messageElement) {

            messageElement.textContent =
                "⚠️ Entre un nombre entre 1 et 3.";

        }

        return;

    }


    /*
       BONNE REPONSE
    */

    if (proposition === nombreSecret) {

        score++;


        /*
           Maximum de la partie
        */

        if (score > maximumPartie) {

            maximumPartie =
                score;

        }


        /*
           Meilleur score
        */

        if (score > meilleurScore) {

            meilleurScore =
                score;


            sauvegarderMeilleurLocal();


            if (meilleurScoreElement) {

                meilleurScoreElement.textContent =
                    meilleurScore;

            }


            /*
               Si connecté :
               envoyer immédiatement le record
               vers Supabase.
            */

            if (pseudo) {

                enregistrerMeilleurScore();

            }

        }


        if (scoreElement) {

            scoreElement.textContent =
                score;

        }


        if (maximumPartieElement) {

            maximumPartieElement.textContent =
                maximumPartie;

        }


        if (messageElement) {

            messageElement.textContent =
                "🎉 Bravo ! Tu as trouvé ! +1 point !";

        }


        nombreSecret =
            genererNombre();


        nombreInput.value =
            "";

        return;

    }


    /*
       MAUVAISE REPONSE
    */

    score--;


    if (scoreElement) {

        scoreElement.textContent =
            score;

    }


    /*
       PARTIE TERMINEE
    */

    if (score <= 0) {

        terminerPartie();

        return;

    }


    if (messageElement) {

        messageElement.textContent =
            "❌ Mauvaise réponse ! Il te reste " +
            score +
            " point(s).";

    }


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


    if (nombreInput) {

        nombreInput.disabled =
            true;

    }


    if (boutonValider) {

        boutonValider.disabled =
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


    if (messageElement) {

        messageElement.textContent =
            "💥 Partie terminée ! Ton maximum était de " +
            maximumPartie +
            ".";

    }


    /*
       Sauvegarde locale
    */

    sauvegarderMeilleurLocal();


    /*
       Si connecté :
       sauvegarde Supabase.
    */

    if (pseudo) {

        enregistrerMeilleurScore();

    }

}


/* =====================================================
   SAUVEGARDER MEILLEUR SCORE LOCAL
===================================================== */

function sauvegarderMeilleurLocal() {

    /*
       VISITEUR
    */

    if (!pseudo) {

        localStorage.setItem(
            CLE_MEILLEUR_VISITEUR,
            meilleurScore
        );

    }


    /*
       COMPTE
    */

    else {

        localStorage.setItem(
            CLE_MEILLEUR_PSEUDO,
            meilleurScore
        );

    }

}


/* =====================================================
   AFFICHER MEILLEUR SCORE
===================================================== */

if (meilleurScoreElement) {

    meilleurScoreElement.textContent =
        meilleurScore;

}


/* =====================================================
   COMPTER UNE PARTIE
===================================================== */

async function compterPartieJeu2() {

    /*
       On ne compte qu'une fois par partie.
    */

    if (partieComptee) {

        return;

    }


    partieComptee =
        true;


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
                "❌ Erreur statistiques Jeu 2 :",
                resultat.error
            );

            return;

        }


        /*
           Le jeu existe
        */

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

            }

            return;

        }


        /*
           Le jeu n'existe pas
        */

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

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur compterPartieJeu2 :",
            erreur
        );

    }

}


/* =====================================================
   ENREGISTRER LE MEILLEUR SCORE
===================================================== */

async function enregistrerMeilleurScore() {

    /*
       VISITEUR
       -------------------------
       Aucun envoi Supabase.
       Le score reste dans localStorage.
    */

    if (!pseudo) {

        sauvegarderMeilleurLocal();


        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "👻 Mode visiteur : ton meilleur score est sauvegardé sur cet appareil.";

        }


        return;

    }


    /*
       Protection
    */

    if (meilleurScore <= 0) {

        return;

    }


    try {

        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "⏳ Enregistrement du meilleur score...";
        }


        /*
           Chercher le score du joueur
        */

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
                    JEU
                )

                .limit(1);


        if (resultat.error) {

            throw resultat.error;

        }


        /*
           SCORE EXISTANT
        */

        if (
            resultat.data &&
            resultat.data.length > 0
        ) {

            const ancienScore =
                Number(
                    resultat.data[0].score || 0
                );


            /*
               Seulement si le nouveau score
               est meilleur.
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


                if (messageEnregistrement) {

                    messageEnregistrement.textContent =
                        "🏆 Nouveau record enregistré dans le classement !";

                }

            }

            else {

                if (messageEnregistrement) {

                    messageEnregistrement.textContent =
                        "ℹ️ Ton ancien record est meilleur ou égal.";

                }

            }

        }


        /*
           PREMIER SCORE
        */

        else {

            const insertion =
                await supabaseClient

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            meilleurScore,

                        jeu:
                            JEU

                    });


            if (insertion.error) {

                throw insertion.error;

            }


            if (messageEnregistrement) {

                messageEnregistrement.textContent =
                    "✅ Ton meilleur score a été ajouté au classement !";

            }

        }


        /*
           Actualiser le classement
        */

        await chargerClassement();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur enregistrement score Jeu 2 :",
            erreur
        );


        if (messageEnregistrement) {

            messageEnregistrement.textContent =
                "❌ Impossible d'enregistrer le score.";

        }

    }

}


/* =====================================================
   TRANSFERT DU SCORE VISITEUR
===================================================== */

/*
   Si le joueur était visiteur avant de créer
   son compte, son meilleur score visiteur
   est récupéré ici.
*/

async function transfererScoreVisiteur() {

    /*
       Pas de transfert sans compte.
    */

    if (!pseudo) {

        return;

    }


    const scoreVisiteur =
        Number(
            localStorage.getItem(
                CLE_MEILLEUR_VISITEUR
            )
        ) || 0;


    /*
       Aucun score visiteur.
    */

    if (scoreVisiteur <= 0) {

        return;

    }


    console.log(
        "🔄 Score visiteur trouvé :",
        scoreVisiteur
    );


    /*
       Récupérer le score actuel du compte
    */

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
                    JEU
                )

                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche transfert :",
                resultat.error
            );

            return;

        }


        /*
           COMPTE EXISTANT
        */

        if (
            resultat.data &&
            resultat.data.length > 0
        ) {

            const scoreCompte =
                Number(
                    resultat.data[0].score || 0
                );


            /*
               Le score visiteur est meilleur
            */

            if (
                scoreVisiteur >
                scoreCompte
            ) {

                const miseAJour =
                    await supabaseClient

                        .from("scores")

                        .update({

                            score:
                                scoreVisiteur

                        })

                        .eq(
                            "id",
                            resultat.data[0].id
                        );


                if (miseAJour.error) {

                    console.error(
                        "❌ Erreur transfert score :",
                        miseAJour.error
                    );

                    return;

                }


                meilleurScore =
                    scoreVisiteur;


                sauvegarderMeilleurLocal();


                console.log(
                    "🏆 Score visiteur transféré :",
                    scoreVisiteur
                );

            }

            else {

                /*
                   Le score du compte est déjà meilleur.
                */

                meilleurScore =
                    scoreCompte;


                sauvegarderMeilleurLocal();

            }

        }


        /*
           AUCUN SCORE POUR LE COMPTE
        */

        else {

            const insertion =
                await supabaseClient

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            scoreVisiteur,

                        jeu:
                            JEU

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur création score transféré :",
                    insertion.error
                );

                return;

            }


            meilleurScore =
                scoreVisiteur;


            sauvegarderMeilleurLocal();


            console.log(
                "✅ Meilleur score visiteur transféré vers Supabase :",
                scoreVisiteur
            );

        }


        /*
           Supprimer seulement la sauvegarde
           visiteur après transfert réussi.
        */

        localStorage.removeItem(
            CLE_MEILLEUR_VISITEUR
        );


        /*
           Mettre à jour l'affichage
        */

        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;

        }


        await chargerClassement();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur transfert score visiteur :",
            erreur
        );

    }

}


/* =====================================================
   CLASSEMENT TOP 10
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


        /*
           Aucun score
        */

        if (
            !data ||
            data.length === 0
        ) {

            listeScores.innerHTML = `

                <tr>

                    <td colspan="3">

                        🏆 Aucun score enregistré.

                    </td>

                </tr>

            `;


            if (statutClassement) {

                statutClassement.textContent =
                    "🌍 Aucun joueur classé pour le moment.";

            }


            return;

        }


        /*
           Affichage
        */

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
            "❌ Erreur classement Jeu 2 :",
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
                "❌ Erreur lors du chargement du classement.";

        }

    }

}


/* =====================================================
   ENTREE CLAVIER
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
   FONCTIONS DISPONIBLES DANS HTML
===================================================== */

window.verifier =
    verifier;


window.nouvellePartie =
    nouvellePartie;


window.enregistrerMeilleurScore =
    enregistrerMeilleurScore;


window.chargerClassement =
    chargerClassement;


window.compterPartieJeu2 =
    compterPartieJeu2;


/* =====================================================
   INITIALISATION
===================================================== */

async function initialiserJeu2() {

    /*
       Affichage du meilleur score local
    */

    if (meilleurScoreElement) {

        meilleurScoreElement.textContent =
            meilleurScore;

    }


    /*
       Pour un compte :
       transfert éventuel du score visiteur.
    */

    if (pseudo) {

        await transfererScoreVisiteur();

    }


    /*
       Charger le classement
    */

    await chargerClassement();


    /*
       Démarrer une partie
    */

    nouvellePartie();

}


/* =====================================================
   DEMARRAGE
===================================================== */

initialiserJeu2();


console.log(
    "✅ script2.js chargé correctement."
);


console.log(
    pseudo
        ? "👤 Compte connecté : " + pseudo
        : "👻 Mode visiteur"
);