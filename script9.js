/* =========================================================
   GAMEZONE — JEU 9
   CUBE RUNNER 3D
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://pxgymcwpbesqyjochwgd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_F0af00-z9ZDemm9ch1tIaA_wSNCZb9G";

let supabaseClient3D = null;

if (
    window.supabase &&
    typeof window.supabase.createClient === "function"
) {
    supabaseClient3D =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
}


/* =========================================================
   IDENTIFICATION
========================================================= */

const JEU_ID = "9";
const NOM_JEU = "Cube Runner 3D";


/* =========================================================
   ELEMENTS HTML
========================================================= */

const zoneJeu =
    document.getElementById("jeu3d");

const message3D =
    document.getElementById("message3D");

const scoreElement3D =
    document.getElementById("score");

const meilleurScoreElement3D =
    document.getElementById("meilleurScore");

const pseudoAffiche3D =
    document.getElementById("pseudoAffiche");

const boutonPause3D =
    document.getElementById("boutonPause3D");

const boutonRejouer3D =
    document.getElementById("boutonRejouer3D");

const boutonPleinEcran3D =
    document.getElementById("boutonGrandEcran3D");

const boutonGauche3D =
    document.getElementById("boutonGauche3D");

const boutonDroite3D =
    document.getElementById("boutonDroite3D");

const boutonSaut3D =
    document.getElementById("boutonSaut3D");

const listeScores3D =
    document.getElementById("listeScores3D");

const statutClassement3D =
    document.getElementById("statutClassement3D");


/* =========================================================
   PSEUDO
========================================================= */

let pseudo =
    localStorage.getItem("pseudoGameZone");

if (
    typeof pseudo !== "string" ||
    pseudo.trim() === ""
) {
    pseudo = null;
}
else {
    pseudo = pseudo.trim();
}

if (pseudoAffiche3D) {
    pseudoAffiche3D.textContent =
        pseudo || "Visiteur";
}


/* =========================================================
   MEILLEUR SCORE LOCAL
========================================================= */

function obtenirCleMeilleurScore3D() {

    if (pseudo) {

        return (
            "meilleurScoreCubeRunner3D_" +
            pseudo
        );

    }

    return "meilleurScoreCubeRunner3D_visiteur";
}

let cleMeilleurScore3D =
    obtenirCleMeilleurScore3D();

let meilleurScore3D =
    Number(
        localStorage.getItem(
            cleMeilleurScore3D
        )
    ) || 0;

if (meilleurScoreElement3D) {

    meilleurScoreElement3D.textContent =
        meilleurScore3D;

}


/* =========================================================
   THREE.JS
========================================================= */

let scene = null;
let camera = null;
let renderer = null;
let joueur = null;
let route = null;

let obstacles = [];
let etoiles = [];

let animationID = null;


/* =========================================================
   VARIABLES DU JEU
========================================================= */

let score = 0;

let jeuTermine = false;

let jeuEnPause = false;

let jeuDemarre = false;

let scoreEnvoye = false;

let positionJoueurX = 0;

let vitesse = 0.25;

let dernierTemps = 0;

let vitesseVerticale = 0;

let peutSauter = true;


/* =========================================================
   CONFIGURATION
========================================================= */

const LARGEUR_ROUTE = 9;

const PROFONDEUR_ROUTE = 180;

const GRAVITE = -0.018;

const FORCE_SAUT = 0.34;

const VOIES = [-3, 0, 3];


/* =========================================================
   INITIALISATION
========================================================= */

function initialiser3D() {

    if (!zoneJeu) {

        console.error(
            "❌ #jeu3d introuvable."
        );

        return false;
    }

    if (typeof THREE === "undefined") {

        console.error(
            "❌ Three.js non chargé."
        );

        return false;
    }


    /* =====================================================
       SCENE
    ===================================================== */

    scene =
        new THREE.Scene();

    scene.background =
        new THREE.Color(0x03030c);

    scene.fog =
        new THREE.Fog(
            0x03030c,
            25,
            150
        );


    /* =====================================================
       DIMENSIONS
    ===================================================== */

    const largeur =
        Math.max(
            zoneJeu.clientWidth,
            320
        );

    const hauteur =
        Math.max(
            zoneJeu.clientHeight,
            400
        );


    /* =====================================================
       CAMERA
    ===================================================== */

    camera =
        new THREE.PerspectiveCamera(
            70,
            largeur / hauteur,
            0.1,
            300
        );

    camera.position.set(
        0,
        4,
        8
    );

    camera.lookAt(
        0,
        1,
        -20
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    renderer =
        new THREE.WebGLRenderer({

            antialias: true,

            powerPreference:
                "high-performance"

        });

    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );

    renderer.setSize(
        largeur,
        hauteur
    );

    renderer.domElement.style.display =
        "block";

    renderer.domElement.style.width =
        "100%";

    renderer.domElement.style.height =
        "100%";


    /* =====================================================
       IMPORTANT :
       ON VIDE LE CANVAS EXISTANT
       POUR EVITER DEUX ECRANS
    ===================================================== */

    zoneJeu.innerHTML = "";

    zoneJeu.appendChild(
        renderer.domElement
    );


    /* =====================================================
       LUMIERES
    ===================================================== */

    const lumiere =
        new THREE.HemisphereLight(
            0xffffff,
            0x222244,
            1.5
        );

    scene.add(
        lumiere
    );


    const lumiereDirectionnelle =
        new THREE.DirectionalLight(
            0xffffff,
            1
        );

    lumiereDirectionnelle.position.set(
        5,
        10,
        5
    );

    scene.add(
        lumiereDirectionnelle
    );


    /* =====================================================
       CREATION MONDE
    ===================================================== */

    creerRoute();

    creerJoueur();

    creerObstacles();

    creerEtoiles();


    /* =====================================================
       RESIZE
    ===================================================== */

    window.addEventListener(
        "resize",
        redimensionner3D
    );


    renderer.render(
        scene,
        camera
    );

    return true;
}


/* =========================================================
   ROUTE
========================================================= */

function creerRoute() {

    const geometrie =
        new THREE.BoxGeometry(
            LARGEUR_ROUTE,
            0.5,
            PROFONDEUR_ROUTE
        );

    const materiau =
        new THREE.MeshStandardMaterial({
            color: 0x111122
        });

    route =
        new THREE.Mesh(
            geometrie,
            materiau
        );

    route.position.set(
        0,
        -0.4,
        -70
    );

    scene.add(
        route
    );


    for (
        let x = -3;
        x <= 3;
        x += 3
    ) {

        const geometrieLigne =
            new THREE.BoxGeometry(
                0.08,
                0.03,
                PROFONDEUR_ROUTE
            );

        const materiauLigne =
            new THREE.MeshBasicMaterial({
                color: 0x00ffff
            });

        const ligne =
            new THREE.Mesh(
                geometrieLigne,
                materiauLigne
            );

        ligne.position.set(
            x,
            -0.12,
            -70
        );

        scene.add(
            ligne
        );
    }
}


/* =========================================================
   JOUEUR
========================================================= */

function creerJoueur() {

    const geometrie =
        new THREE.BoxGeometry(
            1.2,
            1.2,
            1.2
        );

    const materiau =
        new THREE.MeshStandardMaterial({

            color: 0x00eaff,

            emissive: 0x003344

        });

    joueur =
        new THREE.Mesh(
            geometrie,
            materiau
        );

    joueur.position.set(
        0,
        0.6,
        3
    );

    scene.add(
        joueur
    );
}


/* =========================================================
   OBSTACLES
========================================================= */

function creerObstacles() {

    for (
        let i = 0;
        i < 25;
        i++
    ) {

        creerObstacle(
            -20 - i * 7
        );
    }
}


/* =========================================================
   CREER OBSTACLE
========================================================= */

function creerObstacle(z) {

    const geometrie =
        new THREE.BoxGeometry(
            1.5,
            1.5,
            1.5
        );

    const materiau =
        new THREE.MeshStandardMaterial({

            color: 0xff2255,

            emissive: 0x440011

        });

    const obstacle =
        new THREE.Mesh(
            geometrie,
            materiau
        );

    const voie =
        VOIES[
            Math.floor(
                Math.random() *
                VOIES.length
            )
        ];

    obstacle.position.set(
        voie,
        0.75,
        z
    );

    scene.add(
        obstacle
    );

    obstacles.push(
        obstacle
    );
}


/* =========================================================
   ETOILES
========================================================= */

function creerEtoiles() {

    const geometrie =
        new THREE.SphereGeometry(
            0.05,
            6,
            6
        );

    const materiau =
        new THREE.MeshBasicMaterial({
            color: 0xffffff
        });

    for (
        let i = 0;
        i < 180;
        i++
    ) {

        const etoile =
            new THREE.Mesh(
                geometrie,
                materiau
            );

        etoile.position.set(

            (Math.random() - 0.5) * 100,

            Math.random() * 60,

            -Math.random() * 180

        );

        scene.add(
            etoile
        );

        etoiles.push(
            etoile
        );
    }
}


/* =========================================================
   GAUCHE
========================================================= */

function allerGauche() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {
        return;
    }

    positionJoueurX =
        Math.max(
            -3,
            positionJoueurX - 3
        );
}


/* =========================================================
   DROITE
========================================================= */

function allerDroite() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {
        return;
    }

    positionJoueurX =
        Math.min(
            3,
            positionJoueurX + 3
        );
}


/* =========================================================
   SAUT
========================================================= */

function sauter() {

    if (
        jeuTermine ||
        jeuEnPause ||
        !peutSauter
    ) {
        return;
    }

    vitesseVerticale =
        FORCE_SAUT;

    peutSauter =
        false;
}


/* =========================================================
   CLAVIER
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        /* ================================================
           ESPACE APRÈS GAME OVER = REJOUER
        ================================================= */

        if (
            event.code === "Space" &&
            jeuTermine
        ) {

            event.preventDefault();

            rejouer3D();

            return;
        }


        const touche =
            event.key.toLowerCase();


        /* ================================================
           GAUCHE
        ================================================= */

        if (
            touche === "q" ||
            touche === "a" ||
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();

            allerGauche();

            return;
        }


        /* ================================================
           DROITE
        ================================================= */

        if (
            touche === "d" ||
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

            allerDroite();

            return;
        }


        /* ================================================
           SAUT
           ESPACE UNIQUEMENT SI PARTIE EN COURS
        ================================================= */

        if (
            touche === "z" ||
            event.key === "ArrowUp" ||
            event.code === "Space"
        ) {

            event.preventDefault();

            sauter();

            return;
        }


        /* ================================================
           PAUSE
        ================================================= */

        if (touche === "p") {

            event.preventDefault();

            basculerPause();

        }

    }
);


/* =========================================================
   CONTROLES MOBILE
========================================================= */

function ajouterControleMobile(
    bouton,
    action
) {

    if (!bouton) {
        return;
    }


    bouton.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            action();

        },
        {
            passive: false
        }
    );


    bouton.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            action();

        }
    );
}


ajouterControleMobile(
    boutonGauche3D,
    allerGauche
);

ajouterControleMobile(
    boutonDroite3D,
    allerDroite
);

ajouterControleMobile(
    boutonSaut3D,
    sauter
);


/* =========================================================
   COLLISION
========================================================= */

function verifierCollision(obstacle) {

    if (
        !joueur ||
        !obstacle
    ) {
        return false;
    }

    const distanceX =
        Math.abs(
            joueur.position.x -
            obstacle.position.x
        );

    const distanceY =
        Math.abs(
            joueur.position.y -
            obstacle.position.y
        );

    const distanceZ =
        Math.abs(
            joueur.position.z -
            obstacle.position.z
        );

    return (
        distanceX < 1.15 &&
        distanceY < 1.25 &&
        distanceZ < 1.25
    );
}


/* =========================================================
   SCORE
========================================================= */

function augmenterScore(valeur) {

    score += valeur;

    const scoreEntier =
        Math.floor(score);


    if (scoreElement3D) {

        scoreElement3D.textContent =
            scoreEntier;
    }


    if (
        scoreEntier >
        meilleurScore3D
    ) {

        meilleurScore3D =
            scoreEntier;


        if (meilleurScoreElement3D) {

            meilleurScoreElement3D.textContent =
                meilleurScore3D;
        }


        localStorage.setItem(
            cleMeilleurScore3D,
            meilleurScore3D
        );
    }
}


/* =========================================================
   GAME OVER
========================================================= */

async function gameOver3D() {

    if (jeuTermine) {
        return;
    }

    jeuTermine =
        true;


    const scoreFinal =
        Math.floor(score);


    if (message3D) {

        message3D.textContent =
            "💀 GAME OVER — Score : " +
            scoreFinal +
            " — ESPACE pour rejouer";

        message3D.style.display =
            "block";
    }


    if (boutonPause3D) {

        boutonPause3D.style.display =
            "none";
    }


    if (boutonRejouer3D) {

        boutonRejouer3D.style.display =
            "inline-block";
    }


    /* =====================================================
       VISITEUR
    ===================================================== */

    if (!pseudo) {

        if (statutClassement3D) {

            statutClassement3D.textContent =
                "👤 Visiteur : ton score reste uniquement sur cet appareil.";
        }

        return;
    }


    /* =====================================================
       JOUEUR CONNECTE
    ===================================================== */

    await enregistrerScore3D();
}


/* =========================================================
   ENREGISTRER SCORE
========================================================= */

async function enregistrerScore3D() {

    if (scoreEnvoye) {
        return;
    }

    if (
        !pseudo ||
        !supabaseClient3D
    ) {
        return;
    }


    scoreEnvoye =
        true;


    try {

        if (statutClassement3D) {

            statutClassement3D.textContent =
                "⏳ Enregistrement du score...";
        }


        const resultat =
            await supabaseClient3D

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
                    NOM_JEU
                )

                .order(
                    "score",
                    {
                        ascending: false
                    }
                )

                .limit(1);


        if (resultat.error) {

            console.error(
                "❌ Erreur recherche score :",
                resultat.error
            );

            scoreEnvoye =
                false;

            return;
        }


        const anciens =
            resultat.data || [];

        const scoreActuel =
            Math.floor(score);


        /* =================================================
           AUCUN SCORE
        ================================================= */

        if (
            anciens.length === 0
        ) {

            const insertion =
                await supabaseClient3D

                    .from("scores")

                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            scoreActuel,

                        jeu:
                            NOM_JEU

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur insertion :",
                    insertion.error
                );

                scoreEnvoye =
                    false;

                return;
            }


            if (statutClassement3D) {

                statutClassement3D.textContent =
                    "🏆 Premier score enregistré !";
            }

        }


        /* =================================================
           SCORE EXISTANT
        ================================================= */

        else {

            const ancienScore =
                Number(
                    anciens[0].score
                ) || 0;


            if (
                scoreActuel >
                ancienScore
            ) {

                const miseAJour =
                    await supabaseClient3D

                        .from("scores")

                        .update({

                            score:
                                scoreActuel

                        })

                        .eq(
                            "id",
                            anciens[0].id
                        );


                if (miseAJour.error) {

                    console.error(
                        "❌ Erreur mise à jour :",
                        miseAJour.error
                    );

                    scoreEnvoye =
                        false;

                    return;
                }


                if (statutClassement3D) {

                    statutClassement3D.textContent =
                        "🔥 NOUVEAU RECORD !";
                }

            }

            else {

                if (statutClassement3D) {

                    statutClassement3D.textContent =
                        "ℹ️ Ton meilleur score reste " +
                        ancienScore;
                }
            }
        }


        await chargerClassement3D();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur score 3D :",
            erreur
        );

        scoreEnvoye =
            false;
    }
}


/* =========================================================
   CLASSEMENT
========================================================= */

async function chargerClassement3D() {

    if (!listeScores3D) {
        return;
    }


    if (!supabaseClient3D) {

        listeScores3D.innerHTML = `
            <tr>
                <td colspan="3">
                    ⚠️ Supabase indisponible.
                </td>
            </tr>
        `;

        return;
    }


    try {

        const resultat =
            await supabaseClient3D

                .from("scores")

                .select(
                    "pseudo,score,jeu"
                )

                .eq(
                    "jeu",
                    NOM_JEU
                )

                .order(
                    "score",
                    {
                        ascending: false
                    }
                )

                .limit(10);


        if (resultat.error) {

            console.error(
                "❌ Erreur classement :",
                resultat.error
            );

            listeScores3D.innerHTML = `
                <tr>
                    <td colspan="3">
                        ❌ Erreur de chargement.
                    </td>
                </tr>
            `;

            return;
        }


        const scores =
            resultat.data || [];


        listeScores3D.innerHTML =
            "";


        if (
            scores.length === 0
        ) {

            listeScores3D.innerHTML = `
                <tr>
                    <td colspan="3">
                        Aucun score pour le moment.
                    </td>
                </tr>
            `;

            return;
        }


        scores.forEach(
            function(
                joueurScore,
                index
            ) {

                const ligne =
                    document.createElement(
                        "tr"
                    );


                const numero =
                    document.createElement(
                        "td"
                    );


                if (index === 0) {

                    numero.textContent =
                        "🥇";

                }

                else if (index === 1) {

                    numero.textContent =
                        "🥈";

                }

                else if (index === 2) {

                    numero.textContent =
                        "🥉";

                }

                else {

                    numero.textContent =
                        index + 1;

                }


                const pseudoCellule =
                    document.createElement(
                        "td"
                    );

                pseudoCellule.textContent =
                    joueurScore.pseudo ||
                    "Anonyme";


                const scoreCellule =
                    document.createElement(
                        "td"
                    );

                scoreCellule.textContent =
                    Number(
                        joueurScore.score
                    ) || 0;


                if (
                    pseudo &&
                    joueurScore.pseudo ===
                    pseudo
                ) {

                    pseudoCellule.classList.add(
                        "mon-score"
                    );

                    scoreCellule.classList.add(
                        "mon-score"
                    );
                }


                ligne.appendChild(
                    numero
                );

                ligne.appendChild(
                    pseudoCellule
                );

                ligne.appendChild(
                    scoreCellule
                );


                listeScores3D.appendChild(
                    ligne
                );

            }
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur classement 3D :",
            erreur
        );

        listeScores3D.innerHTML = `
            <tr>
                <td colspan="3">
                    ❌ Impossible de charger le classement.
                </td>
            </tr>
        `;
    }
}


/* =========================================================
   COMPTEUR DE PARTIES
========================================================= */

async function compterPartieJeu9() {

    if (!supabaseClient3D) {
        return;
    }


    try {

        const resultat =
            await supabaseClient3D

                .from("statistiques_jeux")

                .select(
                    "nombre_parties"
                )

                .eq(
                    "nom_jeu",
                    NOM_JEU
                )

                .maybeSingle();


        if (resultat.error) {

            console.error(
                "❌ Erreur récupération compteur :",
                resultat.error
            );

            return;
        }


        if (!resultat.data) {

            const insertion =
                await supabaseClient3D

                    .from("statistiques_jeux")

                    .insert({

                        nom_jeu:
                            NOM_JEU,

                        nombre_parties:
                            1

                    });


            if (insertion.error) {

                console.error(
                    "❌ Erreur création compteur :",
                    insertion.error
                );

            }

            return;
        }


        const nouveauNombre =
            Number(
                resultat.data.nombre_parties
            ) + 1;


        const miseAJour =
            await supabaseClient3D

                .from("statistiques_jeux")

                .update({

                    nombre_parties:
                        nouveauNombre

                })

                .eq(
                    "nom_jeu",
                    NOM_JEU
                );


        if (miseAJour.error) {

            console.error(
                "❌ Erreur mise à jour compteur :",
                miseAJour.error
            );

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur compteur :",
            erreur
        );

    }
}


/* =========================================================
   PAUSE
========================================================= */

function basculerPause() {

    if (jeuTermine) {
        return;
    }


    jeuEnPause =
        !jeuEnPause;


    if (jeuEnPause) {

        if (boutonPause3D) {

            boutonPause3D.textContent =
                "▶️ Reprendre";
        }


        if (message3D) {

            message3D.textContent =
                "⏸️ PAUSE";

            message3D.style.display =
                "block";
        }

    }

    else {

        if (boutonPause3D) {

            boutonPause3D.textContent =
                "⏸️ Pause";
        }


        if (message3D) {

            message3D.style.display =
                "none";
        }


        dernierTemps =
            performance.now();
    }
}


if (boutonPause3D) {

    boutonPause3D.addEventListener(
        "click",
        basculerPause
    );
}


/* =========================================================
   REJOUER
========================================================= */

async function rejouer3D(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();
    }


    /* =====================================================
       SUPPRIMER ANCIENS OBSTACLES
    ===================================================== */

    if (
        obstacles &&
        obstacles.length > 0
    ) {

        obstacles.forEach(
            function(obstacle) {

                scene.remove(
                    obstacle
                );


                if (obstacle.geometry) {

                    obstacle.geometry.dispose();
                }


                if (obstacle.material) {

                    obstacle.material.dispose();
                }

            }
        );
    }


    obstacles = [];


    /* =====================================================
       RESET
    ===================================================== */

    score = 0;

    positionJoueurX = 0;

    vitesseVerticale = 0;

    vitesse = 0.25;

    peutSauter = true;

    jeuTermine = false;

    jeuEnPause = false;

    scoreEnvoye = false;


    /* =====================================================
       RESET JOUEUR
    ===================================================== */

    if (joueur) {

        joueur.position.set(
            0,
            0.6,
            3
        );

        joueur.rotation.set(
            0,
            0,
            0
        );
    }


    /* =====================================================
       SCORE
    ===================================================== */

    if (scoreElement3D) {

        scoreElement3D.textContent =
            "0";
    }


    /* =====================================================
       MESSAGE
    ===================================================== */

    if (message3D) {

        message3D.textContent =
            "🏃 Évite les obstacles !";

        message3D.style.display =
            "none";
    }


    /* =====================================================
       BOUTON PAUSE
    ===================================================== */

    if (boutonPause3D) {

        boutonPause3D.style.display =
            "inline-block";

        boutonPause3D.textContent =
            "⏸️ Pause";
    }


    /* =====================================================
       BOUTON REJOUER
    ===================================================== */

    if (boutonRejouer3D) {

        boutonRejouer3D.style.display =
            "none";
    }


    /* =====================================================
       NOUVEAUX OBSTACLES
    ===================================================== */

    creerObstacles();


    /* =====================================================
       COMPTEUR
    ===================================================== */

    compterPartieJeu9();


    /* =====================================================
       TEMPS
    ===================================================== */

    dernierTemps =
        performance.now();
}


/* =========================================================
   BOUTON REJOUER
========================================================= */

if (boutonRejouer3D) {

    boutonRejouer3D.addEventListener(
        "click",
        rejouer3D
    );
}


/* =========================================================
   GRAND ECRAN
========================================================= */

async function basculerGrandEcran3D() {

    /*
       On met le CANVAS lui-même en plein écran.
       Cela évite d'avoir une deuxième zone de jeu.
    */

    const element =
        renderer &&
        renderer.domElement
            ? renderer.domElement
            : zoneJeu;


    if (!element) {
        return;
    }


    try {

        if (
            document.fullscreenElement
        ) {

            await document.exitFullscreen();

            return;
        }


        if (
            element.requestFullscreen
        ) {

            await element.requestFullscreen();

        }

        else if (
            element.webkitRequestFullscreen
        ) {

            element.webkitRequestFullscreen();

        }

    }

    catch (erreur) {

        console.error(
            "❌ Erreur grand écran :",
            erreur
        );

    }
}


/* =========================================================
   BOUTON GRAND ECRAN
========================================================= */

if (boutonPleinEcran3D) {

    boutonPleinEcran3D.addEventListener(
        "click",
        basculerGrandEcran3D
    );
}


/* =========================================================
   CHANGEMENT PLEIN ECRAN
========================================================= */

document.addEventListener(
    "fullscreenchange",
    function() {

        if (boutonPleinEcran3D) {

            if (
                document.fullscreenElement
            ) {

                boutonPleinEcran3D.textContent =
                    "✕ QUITTER";

            }

            else {

                boutonPleinEcran3D.textContent =
                    "⛶ GRAND ÉCRAN";

            }
        }


        setTimeout(
            redimensionner3D,
            100
        );

    }
);


/* =========================================================
   BOUCLE DU JEU
========================================================= */

function boucle3D(tempsActuel) {

    animationID =
        requestAnimationFrame(
            boucle3D
        );


    if (
        !renderer ||
        !scene ||
        !camera ||
        !joueur
    ) {
        return;
    }


    if (!dernierTemps) {

        dernierTemps =
            tempsActuel;
    }


    const delta =
        Math.min(
            tempsActuel -
            dernierTemps,
            50
        );


    dernierTemps =
        tempsActuel;


    /* =====================================================
       PAUSE / GAME OVER
    ===================================================== */

    if (
        jeuEnPause ||
        jeuTermine
    ) {

        renderer.render(
            scene,
            camera
        );

        return;
    }


    /* =====================================================
       SCORE
    ===================================================== */

    augmenterScore(
        delta * 0.01
    );


    /* =====================================================
       DIFFICULTE
    ===================================================== */

    vitesse =
        0.25 +
        Math.min(
            0.5,
            score / 2000
        );


    /* =====================================================
       POSITION X
    ===================================================== */

    joueur.position.x +=

        (
            positionJoueurX -
            joueur.position.x
        ) * 0.18;


    /* =====================================================
       GRAVITE
    ===================================================== */

    vitesseVerticale +=
        GRAVITE;

    joueur.position.y +=
        vitesseVerticale;


    /* =====================================================
       SOL
    ===================================================== */

    if (
        joueur.position.y <=
        0.6
    ) {

        joueur.position.y =
            0.6;

        vitesseVerticale =
            0;

        peutSauter =
            true;
    }


    /* =====================================================
       ROTATION JOUEUR
    ===================================================== */

    joueur.rotation.x +=
        0.04;

    joueur.rotation.z +=
        0.03;


    /* =====================================================
       OBSTACLES
    ===================================================== */

    obstacles.forEach(
        function(obstacle) {

            obstacle.position.z +=

                vitesse *
                delta /
                16;


            obstacle.rotation.x +=
                0.02;

            obstacle.rotation.y +=
                0.03;


            /* =============================================
               COLLISION
            ============================================= */

            if (
                verifierCollision(
                    obstacle
                )
            ) {

                gameOver3D();

            }


            /* =============================================
               REPOSITIONNEMENT
            ============================================= */

            if (
                obstacle.position.z >
                12
            ) {

                obstacle.position.z =

                    -150 -
                    Math.random() * 30;


                obstacle.position.x =

                    VOIES[
                        Math.floor(
                            Math.random() *
                            VOIES.length
                        )
                    ];
            }

        }
    );


    /* =====================================================
       CAMERA
    ===================================================== */

    camera.position.x +=

        (
            joueur.position.x -
            camera.position.x
        ) * 0.05;


    camera.lookAt(
        joueur.position.x * 0.15,
        1,
        -20
    );


    /* =====================================================
       RENDU
    ===================================================== */

    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   REDIMENSIONNEMENT
========================================================= */

function redimensionner3D() {

    if (
        !renderer ||
        !camera ||
        !zoneJeu
    ) {
        return;
    }


    let largeur;
    let hauteur;


    /* =====================================================
       SI LE CANVAS EST EN GRAND ECRAN
    ===================================================== */

    if (
        document.fullscreenElement ===
        renderer.domElement
    ) {

        largeur =
            window.innerWidth;

        hauteur =
            window.innerHeight;

    }

    else {

        largeur =
            Math.max(
                zoneJeu.clientWidth,
                320
            );

        hauteur =
            Math.max(
                zoneJeu.clientHeight,
                400
            );

    }


    camera.aspect =
        largeur /
        hauteur;

    camera.updateProjectionMatrix();


    renderer.setSize(
        largeur,
        hauteur
    );
}


/* =========================================================
   DEMARRAGE
========================================================= */

async function demarrerJeu3D() {

    const initialise =
        initialiser3D();


    if (!initialise) {
        return;
    }


    await chargerClassement3D();


    jeuDemarre =
        true;

    jeuTermine =
        false;

    jeuEnPause =
        false;


    dernierTemps =
        performance.now();


    animationID =
        requestAnimationFrame(
            boucle3D
        );


    console.log(
        "🎮 Cube Runner 3D démarré !"
    );
}


/* =========================================================
   LANCEMENT
========================================================= */

demarrerJeu3D();