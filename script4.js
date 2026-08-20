
/* =====================================================
   SUPABASE
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

const JEU = "jeux4";

const NOM_JEU_STATISTIQUE =
    "Snake";


/* =====================================================
   PSEUDO
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


const pseudoJoueurElement =
    document.getElementById(
        "pseudoJoueur"
    );


const pseudoAfficheElement =
    document.getElementById(
        "pseudoAffiche"
    );


if (pseudo) {

    if (pseudoJoueurElement) {

        pseudoJoueurElement.textContent =
            pseudo;

    }


    if (pseudoAfficheElement) {

        pseudoAfficheElement.textContent =
            pseudo;

    }

}

else {

    if (pseudoJoueurElement) {

        pseudoJoueurElement.textContent =
            "Joueur";

    }


    if (pseudoAfficheElement) {

        pseudoAfficheElement.textContent =
            "Joueur";

    }

}


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById(
        "jeu"
    );


const ctx =
    canvas.getContext(
        "2d"
    );


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


let meilleurScore =
    Number(
        localStorage.getItem(
            "meilleurScoreJeux4"
        )
    ) || 0;


const scoreElement =
    document.getElementById(
        "score"
    );


const meilleurScoreElement =
    document.getElementById(
        "meilleurScore"
    );


if (scoreElement) {

    scoreElement.textContent =
        score;

}


if (meilleurScoreElement) {

    meilleurScoreElement.textContent =
        meilleurScore;

}


/* =====================================================
   ÉTAT DU JEU
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
   COMPTER UNE PARTIE
===================================================== */

/* =========================================================
   STATISTIQUES — JEU 4
========================================================= */

async function compterPartieJeu4() {

    try {

        const recherche = await fetch(
            SUPABASE_URL +
            "/rest/v1/statistiques_jeux" +
            "?nom_jeu=eq.Snake" +
            "&select=id,nom_jeu,nombre_parties",
            {
                method: "GET",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY,
                    "Accept": "application/json"
                }
            }
        );

        if (!recherche.ok) {
            throw new Error(await recherche.text());
        }

        const statistiques =
            await recherche.json();

        if (!statistiques.length) {
            console.error(
                "❌ Snake n'existe pas dans statistiques_jeux"
            );
            return;
        }

        const jeu = statistiques[0];

        const nouveauNombre =
            Number(jeu.nombre_parties || 0) + 1;

        const miseAJour = await fetch(
            SUPABASE_URL +
            "/rest/v1/statistiques_jeux" +
            "?id=eq." + jeu.id,
            {
                method: "PATCH",

                headers: {
                    "apikey": SUPABASE_KEY,
                    "Authorization": "Bearer " + SUPABASE_KEY,
                    "Content-Type": "application/json",
                    "Prefer": "return=minimal"
                },

                body: JSON.stringify({
                    nombre_parties: nouveauNombre
                })
            }
        );

        if (!miseAJour.ok) {
            throw new Error(await miseAJour.text());
        }

        console.log(
            "✅ Snake : " +
            nouveauNombre +
            " parties"
        );

    } catch (erreur) {

        console.error(
            "❌ Erreur statistiques Jeu 4 :",
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


    while (
        !positionValide
    ) {

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
   DÉPLACEMENT
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


    /*
     Déplacement
    */

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
     Passage à travers les bords
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
     Collision avec soi-même
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


    /*
     Ajouter la tête
    */

    serpent.unshift(
        tete
    );


    /*
     Manger
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
         Nouveau meilleur score
        */

        if (
            score > meilleurScore
        ) {

            meilleurScore =
                score;


            if (meilleurScoreElement) {

                meilleurScoreElement.textContent =
                    meilleurScore;

            }


            localStorage.setItem(

                "meilleurScoreJeux4",

                meilleurScore

            );

        }


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


        /*
         Espace = pause
        */

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


    const messageSnake =
        document.getElementById(
            "messageSnake"
        );


    if (messageSnake) {

        messageSnake.textContent =
            "💥 Game Over ! Score : " +
            score;

    }


    const zoneEnregistrement =
        document.getElementById(
            "zoneEnregistrement"
        );


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "block";

    }

}


/* =====================================================
   RECOMMENCER
===================================================== */

function recommencer() {
   compterPartieJeu4();

    clearInterval(
        intervalleJeu
    );


    /*
     Une nouvelle partie =
     +1 dans les statistiques.
    */

  


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


    const zoneEnregistrement =
        document.getElementById(
            "zoneEnregistrement"
        );


    if (zoneEnregistrement) {

        zoneEnregistrement.style.display =
            "none";

    }


    const messageEnregistrement =
        document.getElementById(
            "messageEnregistrement"
        );


    if (messageEnregistrement) {

        messageEnregistrement.textContent =
            "";

    }


    nouvelleNourriture();


    dessiner();


    demarrerJeu();

}


/* =====================================================
   DÉMARRER LE JEU
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
   ENREGISTRER LE MEILLEUR SCORE
===================================================== */

async function enregistrerMeilleurScore() {

    const message =
        document.getElementById(
            "messageEnregistrement"
        );


    const pseudoActuel =
        localStorage.getItem(
            "pseudoGameZone"
        );


    if (!pseudoActuel) {

        message.textContent =
            "❌ Aucun compte trouvé.";

        return;

    }


    if (score <= 0) {

        message.textContent =
            "⚠️ Ton score doit être supérieur à 0.";

        return;

    }


    if (scoreEnregistre) {

        message.textContent =
            "ℹ️ Ce score a déjà été enregistré.";

        return;

    }


    scoreEnregistre =
        true;


    message.textContent =
        "⏳ Enregistrement...";


    try {

        /*
         Rechercher le score existant
        */

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


        /*
         Score existant
        */

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
                score > scoreExistant
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
                            "id",
                            ancienScore[0].id
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


                message.textContent =
                    "🏆 Nouveau record enregistré !";

            }

            else {

                message.textContent =
                    "ℹ️ Ton ancien score est meilleur ou égal.";

            }

        }


        /*
         Premier score
        */

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
   CLASSEMENT TOP 10
===================================================== */

async function chargerClassement() {

    const tbody =
        document.getElementById(
            "classementBody"
        );


    if (!tbody) {

        return;

    }


    tbody.innerHTML = `

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

            tbody.innerHTML = `

                <tr>

                    <td colspan="3">

                        Aucun score pour Snake.

                    </td>

                </tr>

            `;


            return;

        }


        /*
         Afficher les scores
        */

        tbody.innerHTML =
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


                /*
                 Position
                */

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


                /*
                 Pseudo
                */

                const pseudoCell =
                    document.createElement(
                        "td"
                    );


                pseudoCell.textContent =
                    joueur.pseudo;


                /*
                 Score
                */

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


                tbody.appendChild(
                    ligne
                );

            }

        );

    }

    catch (erreur) {

        console.error(
            erreur
        );


        tbody.innerHTML = `

            <tr>

                <td colspan="3">

                    ❌ Impossible de charger
                    le classement.

                </td>

            </tr>

        `;

    }

}


/* =====================================================
   INITIALISATION
===================================================== */

nouvelleNourriture();

dessiner();

demarrerJeu();


/*
 La partie est comptée au lancement
 de la page.
*/
compterPartieJeu4();


/*
 Charger le classement.
*/

chargerClassement();

