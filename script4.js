

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

const JEU = "jeux4";


/* =====================================================
   PSEUDO
===================================================== */

const pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


document.getElementById(
    "pseudoJoueur"
).textContent =
    pseudo;


document.getElementById(
    "pseudoAffiche"
).textContent =
    pseudo;


/* =====================================================
   CANVAS
===================================================== */

const canvas =
    document.getElementById("jeu");


const ctx =
    canvas.getContext("2d");


/* =====================================================
   VARIABLES
===================================================== */

const tailleCase = 20;


const nombreCases =
    canvas.width / tailleCase;


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

let score = 0;


let meilleurScore =
    Number(
        localStorage.getItem(
            "meilleurScoreJeux4"
        )
    ) || 0;


document.getElementById(
    "meilleurScore"
).textContent =
    meilleurScore;


/* =====================================================
   ÉTAT DU JEU
===================================================== */

let jeuTermine = false;


let jeuEnPause = false;


let intervalleJeu = null;


let scoreEnregistre = false;


/* =====================================================
   NOUVELLE NOURRITURE
===================================================== */

function nouvelleNourriture() {

    let positionValide = false;


    while (!positionValide) {

        nourriture.x =
            Math.floor(
                Math.random() * nombreCases
            ) * tailleCase;


        nourriture.y =
            Math.floor(
                Math.random() * nombreCases
            ) * tailleCase;


        positionValide = true;


        for (
            let partie of serpent
        ) {

            if (
                partie.x === nourriture.x &&
                partie.y === nourriture.y
            ) {

                positionValide = false;

                break;

            }

        }

    }

}


/* =====================================================
   DESSIN
===================================================== */

function dessiner() {

    /* Fond */

    ctx.fillStyle = "white";

    ctx.fillRect(
        0,
        0,
        canvas.width,
        canvas.height
    );


    /* Nourriture */

    ctx.fillStyle = "red";

    ctx.fillRect(
        nourriture.x,
        nourriture.y,
        tailleCase,
        tailleCase
    );


    /* Serpent */

    serpent.forEach(
        function(partie, index) {

            if (index === 0) {

                ctx.fillStyle = "#00ff00";

            }

            else {

                ctx.fillStyle = "#00aa00";

            }


            ctx.fillRect(
                partie.x,
                partie.y,
                tailleCase,
                tailleCase
            );


            ctx.strokeStyle = "#111";

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


    const tete =
        {
            x: serpent[0].x,
            y: serpent[0].y
        };


    /* Déplacement */

    if (
        direction === "haut"
    ) {

        tete.y -= tailleCase;

    }


    if (
        direction === "bas"
    ) {

        tete.y += tailleCase;

    }


    if (
        direction === "gauche"
    ) {

        tete.x -= tailleCase;

    }


    if (
        direction === "droite"
    ) {

        tete.x += tailleCase;

    }


    /* =================================================
       PASSAGE À TRAVERS LES BORDS
    ================================================= */

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

        tete.x = 0;

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

        tete.y = 0;

    }


    /* =================================================
       COLLISION AVEC SOI-MÊME
    ================================================= */

    for (
        let i = 0;
        i < serpent.length;
        i++
    ) {

        if (
            tete.x === serpent[i].x &&
            tete.y === serpent[i].y
        ) {

            terminerJeu();

            return;

        }

    }


    /* Ajouter la tête */

    serpent.unshift(
        tete
    );


    /* =================================================
       MANGER
    ================================================= */

    if (
        tete.x === nourriture.x &&
        tete.y === nourriture.y
    ) {

        score++;


        document.getElementById(
            "score"
        ).textContent =
            score;


        /* Nouveau meilleur score */

        if (
            score > meilleurScore
        ) {

            meilleurScore =
                score;


            document.getElementById(
                "meilleurScore"
            ).textContent =
                meilleurScore;


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

            changerDirection("haut");

            event.preventDefault();

        }


        else if (
            touche === "s" ||
            touche === "arrowdown"
        ) {

            changerDirection("bas");

            event.preventDefault();

        }


        else if (
            touche === "q" ||
            touche === "arrowleft"
        ) {

            changerDirection("gauche");

            event.preventDefault();

        }


        else if (
            touche === "d" ||
            touche === "arrowright"
        ) {

            changerDirection("droite");

            event.preventDefault();

        }


        /* Espace = pause */

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


    const message =
        document.getElementById(
            "messageSnake"
        );


    if (jeuEnPause) {

        bouton.textContent =
            "▶️ Reprendre";


        message.textContent =
            "⏸️ Jeu en pause";

    }

    else {

        bouton.textContent =
            "⏸️ Pause";


        message.textContent =
            "";

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


    document.getElementById(
        "messageSnake"
    ).textContent =
        "💥 Game Over ! Score : " +
        score;


    document.getElementById(
        "zoneEnregistrement"
    ).style.display =
        "block";

}


/* =====================================================
   RECOMMENCER
===================================================== */

function recommencer() {

    clearInterval(
        intervalleJeu
    );


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


    score = 0;


    jeuTermine =
        false;


    jeuEnPause =
        false;


    scoreEnregistre =
        false;


    document.getElementById(
        "score"
    ).textContent =
        "0";


    document.getElementById(
        "messageSnake"
    ).textContent =
        "";


    document.getElementById(
        "boutonPause"
    ).textContent =
        "⏸️ Pause";


    document.getElementById(
        "zoneEnregistrement"
    ).style.display =
        "none";


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


        /* =================================================
           RECHERCHER LE SCORE
        ================================================= */

        const {
            data: ancienScore,
            error: erreurRecherche
        } =
            await supabaseClient

                .from("scores")

                .select(
                    "pseudo,score,jeu"
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
                            "pseudo",
                            pseudoActuel
                        )

                        .eq(
                            "jeu",
                            JEU
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


        await chargerClassement();


    }

    catch (erreur) {

        console.error(
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

chargerClassement();

