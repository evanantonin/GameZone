/* =========================================================
   GAMEZONE — JEU 10
   RACING 3D
   THREE.JS

   👤 VISITEUR
   🏆 CLASSEMENT SUPABASE
   💾 MEILLEUR SCORE LOCAL
   📱 MOBILE
   💻 PC
   ⏸️ PAUSE
   💀 GAME OVER
   🎮 COMPTEUR DE PARTIES
   ⛶ PLEIN ÉCRAN
   🏎️ VOITURES DE COURSE
========================================================= */


/* =========================================================
   SUPABASE
========================================================= */

const SUPABASE_URL =
    "https://pxgymcwpbesqyjochwgd.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_F0af00-z9ZDemm9ch1tIaA_wSNCZb9G";

let supabaseClient10 = null;

if (window.supabase) {

    supabaseClient10 =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );
}


/* =========================================================
   IDENTIFICATION DU JEU
========================================================= */

const JEU_ID = "10";
const NOM_JEU = "3D Racing";


/* =========================================================
   ELEMENTS HTML
========================================================= */

const zoneRacing =
    document.getElementById(
        "game10-canvas-zone"
    );

const messageRacing =
    document.getElementById(
        "game10-message"
    );

const scoreElement =
    document.getElementById(
        "game10-score"
    );

const meilleurScoreElement =
    document.getElementById(
        "game10-best"
    );

const pseudoAffiche =
    document.getElementById(
        "game10-pseudo"
    );

const boutonPause =
    document.getElementById(
        "game10-pause"
    );

const boutonRejouer =
    document.getElementById(
        "game10-restart"
    );

const boutonGauche =
    document.getElementById(
        "game10-left"
    );

const boutonDroite =
    document.getElementById(
        "game10-right"
    );

const boutonAccelerer =
    document.getElementById(
        "game10-accelerate"
    );

const listeScores =
    document.getElementById(
        "game10-ranking-list"
    );

const statutClassement =
    document.getElementById(
        "game10-classement-statut"
    );


/* =========================================================
   SESSION / PSEUDO
========================================================= */

let pseudo = null;
let utilisateurConnecte10 = false;


/* =========================================================
   MEILLEUR SCORE
========================================================= */

let meilleurScore = 0;

let cleMeilleurScore =
    "meilleurScore3DRacing_visiteur";


/* =========================================================
   VÉRIFIER LA SESSION
========================================================= */

async function verifierConnexion10() {

    utilisateurConnecte10 = false;
    pseudo = null;

    if (!supabaseClient10) {

        actualiserPseudo10();

        return false;
    }

    try {

        const resultat =
            await supabaseClient10.auth.getSession();

        if (resultat.error) {
            throw resultat.error;
        }

        const session =
            resultat.data?.session;

        if (
            !session ||
            !session.user
        ) {

            utilisateurConnecte10 = false;
            pseudo = null;

            actualiserPseudo10();

            return false;
        }


        /* -------------------------------------------------
           PSEUDO LOCAL
        ------------------------------------------------- */

        let pseudoActuel =
            localStorage.getItem(
                "pseudoGameZone"
            );

        if (pseudoActuel) {

            pseudoActuel =
                pseudoActuel.trim();
        }


        /* -------------------------------------------------
           PSEUDO METADATA
        ------------------------------------------------- */

        if (!pseudoActuel) {

            const pseudoMetadata =
                session.user
                    .user_metadata
                    ?.pseudo;

            if (pseudoMetadata) {

                pseudoActuel =
                    String(
                        pseudoMetadata
                    ).trim();
            }
        }


        /* -------------------------------------------------
           AUCUN PSEUDO
        ------------------------------------------------- */

        if (!pseudoActuel) {

            utilisateurConnecte10 = false;
            pseudo = null;

            actualiserPseudo10();

            return false;
        }


        /* -------------------------------------------------
           UTILISATEUR VALIDE
        ------------------------------------------------- */

        utilisateurConnecte10 = true;

        pseudo =
            pseudoActuel;

        actualiserPseudo10();

        return true;

    } catch (erreur) {

        console.error(
            "Erreur vérification session Racing :",
            erreur
        );

        utilisateurConnecte10 = false;
        pseudo = null;

        actualiserPseudo10();

        return false;
    }
}


/* =========================================================
   OBTENIR LE PSEUDO
========================================================= */

function obtenirPseudo10() {

    if (
        !utilisateurConnecte10 ||
        !pseudo
    ) {

        return null;
    }

    const pseudoNettoye =
        pseudo.trim();

    return (
        pseudoNettoye ||
        null
    );
}


/* =========================================================
   AFFICHER LE PSEUDO
========================================================= */

function actualiserPseudo10() {

    if (!pseudoAffiche) {
        return;
    }

    if (
        utilisateurConnecte10 &&
        pseudo
    ) {

        pseudoAffiche.textContent =
            pseudo;

    } else {

        pseudoAffiche.textContent =
            "Visiteur";
    }
}


/* =========================================================
   ÉCOUTER LES CHANGEMENTS DE SESSION
========================================================= */

if (supabaseClient10) {

    supabaseClient10.auth.onAuthStateChange(
        function(event, session) {

            console.log(
                "Racing Auth event :",
                event
            );


            /* ---------------------------------------------
               DÉCONNEXION
            --------------------------------------------- */

            if (
                !session ||
                !session.user
            ) {

                utilisateurConnecte10 = false;
                pseudo = null;

                actualiserPseudo10();


                /*
                 * IMPORTANT :
                 * On ne supprime pas pseudoGameZone.
                 *
                 * Le reste de GameZone peut encore
                 * l'utiliser.
                 *
                 * Racing considère simplement le joueur
                 * comme VISITEUR tant qu'il n'y a pas
                 * de session Supabase réelle.
                 */

                cleMeilleurScore =
                    "meilleurScore3DRacing_visiteur";

                meilleurScore =
                    Number(
                        localStorage.getItem(
                            cleMeilleurScore
                        )
                    ) || 0;

                if (meilleurScoreElement) {

                    meilleurScoreElement.textContent =
                        meilleurScore;
                }

                console.log(
                    "👤 Racing : déconnexion → Visiteur"
                );

                return;
            }


            /* ---------------------------------------------
               CONNEXION
            --------------------------------------------- */

            utilisateurConnecte10 = true;

            let pseudoLocal =
                localStorage.getItem(
                    "pseudoGameZone"
                );

            if (pseudoLocal) {

                pseudoLocal =
                    pseudoLocal.trim();
            }


            const pseudoMetadata =
                session.user
                    .user_metadata
                    ?.pseudo;


            if (
                !pseudoLocal &&
                pseudoMetadata
            ) {

                pseudoLocal =
                    String(
                        pseudoMetadata
                    ).trim();
            }


            if (!pseudoLocal) {

                utilisateurConnecte10 = false;
                pseudo = null;

            } else {

                pseudo =
                    pseudoLocal;
            }


            actualiserPseudo10();


            /* ---------------------------------------------
               NOUVEAU MEILLEUR SCORE LOCAL
            --------------------------------------------- */

            cleMeilleurScore =
                obtenirCleMeilleurScore10();

            meilleurScore =
                Number(
                    localStorage.getItem(
                        cleMeilleurScore
                    )
                ) || 0;

            if (meilleurScoreElement) {

                meilleurScoreElement.textContent =
                    meilleurScore;
            }

        }
    );
}


/* =========================================================
   THREE.JS
========================================================= */

let scene = null;
let camera = null;
let renderer = null;

let voiture = null;

let voituresEnnemies = [];

let lignesRoute = [];
let bandesRoute = [];

let vibreursGauche = [];
let vibreursDroite = [];

let arbres = [];
let lampes = [];
let panneaux = [];

let nuages = [];

let animationID = null;


/* =========================================================
   VARIABLES DU JEU
========================================================= */

let score = 0;

let vitesse = 0.45;

let jeuTermine = false;

let jeuEnPause = false;

let dernierTemps = 0;

let positionVoitureX = 0;

let accelerationActive = false;


/* =========================================================
   CONFIGURATION
========================================================= */

const LARGEUR_ROUTE = 14;

const LONGUEUR_ROUTE = 300;

const VOIES = [
    -4.2,
    0,
    4.2
];


/* =========================================================
   COULEURS
========================================================= */

const COULEUR_CIEL =
    0x6fa8dc;

const COULEUR_ROUTE =
    0x252525;

const COULEUR_BORD =
    0xffffff;

const COULEUR_HERBE =
    0x183d20;


/* =========================================================
   PLEIN ÉCRAN
========================================================= */

let boutonPleinEcran10 = null;

let boutonQuitterPleinEcran10 = null;


/* =========================================================
   CRÉER LES BOUTONS PLEIN ÉCRAN
========================================================= */

function creerBoutonsPleinEcran10() {

    if (!zoneRacing) {
        return;
    }


    /* -----------------------------------------------------
       BOUTON ENTRER PLEIN ÉCRAN
    ----------------------------------------------------- */

    boutonPleinEcran10 =
        document.getElementById(
            "game10-fullscreen"
        );


    if (!boutonPleinEcran10) {

        boutonPleinEcran10 =
            document.createElement(
                "button"
            );

        boutonPleinEcran10.id =
            "game10-fullscreen";

        boutonPleinEcran10.type =
            "button";

        boutonPleinEcran10.textContent =
            "⛶ Plein écran";


        Object.assign(
            boutonPleinEcran10.style,
            {
                position: "fixed",
                right: "20px",
                bottom: "20px",
                zIndex: "2147483647",
                padding: "12px 18px",
                border: "2px solid rgba(255,255,255,.3)",
                borderRadius: "12px",
                background: "rgba(10,15,25,.95)",
                color: "white",
                fontSize: "15px",
                fontWeight: "bold",
                cursor: "pointer",
                backdropFilter: "blur(8px)",
                boxShadow: "0 5px 25px rgba(0,0,0,.5)",
                display: "block"
            }
        );


        boutonPleinEcran10.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                basculerPleinEcran10();
            }
        );


        document.body.appendChild(
            boutonPleinEcran10
        );
    }


    /* -----------------------------------------------------
       BOUTON QUITTER PLEIN ÉCRAN
    ----------------------------------------------------- */

    boutonQuitterPleinEcran10 =
        document.getElementById(
            "game10-exit-fullscreen"
        );


    if (!boutonQuitterPleinEcran10) {

        boutonQuitterPleinEcran10 =
            document.createElement(
                "button"
            );

        boutonQuitterPleinEcran10.id =
            "game10-exit-fullscreen";

        boutonQuitterPleinEcran10.type =
            "button";

        boutonQuitterPleinEcran10.textContent =
            "✕ Quitter plein écran";


        Object.assign(
            boutonQuitterPleinEcran10.style,
            {
                position: "fixed",
                top: "15px",
                right: "15px",
                zIndex: "2147483647",
                padding: "11px 15px",
                border: "2px solid rgba(255,255,255,.35)",
                borderRadius: "12px",
                background: "rgba(10,15,25,.95)",
                color: "white",
                fontSize: "14px",
                fontWeight: "bold",
                cursor: "pointer",
                boxShadow: "0 5px 25px rgba(0,0,0,.5)",
                display: "none"
            }
        );


        boutonQuitterPleinEcran10.addEventListener(
            "click",
            function(event) {

                event.preventDefault();
                event.stopPropagation();

                quitterPleinEcran10();
            }
        );


        document.body.appendChild(
            boutonQuitterPleinEcran10
        );
    }


    mettreAJourBoutonsPleinEcran10();
}


/* =========================================================
   BASCULER PLEIN ÉCRAN
========================================================= */

async function basculerPleinEcran10() {

    if (!zoneRacing) {
        return;
    }


    try {

        if (!estEnPleinEcran10()) {

            if (
                zoneRacing.requestFullscreen
            ) {

                await zoneRacing.requestFullscreen();

            }

            else if (
                zoneRacing.webkitRequestFullscreen
            ) {

                zoneRacing.webkitRequestFullscreen();

            }

            else {

                activerFauxPleinEcran10();
            }

        }

        else {

            await quitterPleinEcran10();
        }

    } catch (erreur) {

        console.warn(
            "API plein écran indisponible :",
            erreur
        );

        if (!estEnPleinEcran10()) {

            activerFauxPleinEcran10();

        } else {

            desactiverFauxPleinEcran10();
        }
    }
}


/* =========================================================
   QUITTER PLEIN ÉCRAN
========================================================= */

async function quitterPleinEcran10() {

    try {

        if (document.fullscreenElement) {

            if (
                document.exitFullscreen
            ) {

                await document.exitFullscreen();

            }

            else if (
                document.webkitExitFullscreen
            ) {

                document.webkitExitFullscreen();
            }

        }

        else if (
            document.webkitFullscreenElement
        ) {

            if (
                document.webkitExitFullscreen
            ) {

                document.webkitExitFullscreen();
            }

        }

        else {

            desactiverFauxPleinEcran10();
        }

    } catch (erreur) {

        console.error(
            "Erreur sortie plein écran :",
            erreur
        );

        desactiverFauxPleinEcran10();
    }
}


/* =========================================================
   DÉTECTER LE PLEIN ÉCRAN
========================================================= */

function estEnPleinEcran10() {

    return (
        document.fullscreenElement === zoneRacing ||
        document.webkitFullscreenElement === zoneRacing ||
        (
            zoneRacing &&
            zoneRacing.classList.contains(
                "game10-faux-fullscreen"
            )
        )
    );
}


/* =========================================================
   FALLBACK MOBILE
========================================================= */

function activerFauxPleinEcran10() {

    if (!zoneRacing) {
        return;
    }


    zoneRacing.classList.add(
        "game10-faux-fullscreen"
    );

    document.body.classList.add(
        "game10-body-fullscreen"
    );


    mettreAJourBoutonsPleinEcran10();


    setTimeout(
        redimensionnerRacing,
        150
    );
}


function desactiverFauxPleinEcran10() {

    if (!zoneRacing) {
        return;
    }


    zoneRacing.classList.remove(
        "game10-faux-fullscreen"
    );

    document.body.classList.remove(
        "game10-body-fullscreen"
    );


    mettreAJourBoutonsPleinEcran10();


    setTimeout(
        redimensionnerRacing,
        150
    );
}


/* =========================================================
   METTRE À JOUR LES BOUTONS
========================================================= */

function mettreAJourBoutonsPleinEcran10() {

    const pleinEcran =
        estEnPleinEcran10();


    if (boutonPleinEcran10) {

        boutonPleinEcran10.style.display =
            pleinEcran
                ? "none"
                : "block";
    }


    if (boutonQuitterPleinEcran10) {

        boutonQuitterPleinEcran10.style.display =
            pleinEcran
                ? "block"
                : "none";
    }


    setTimeout(
        redimensionnerRacing,
        100
    );
}


/* =========================================================
   ÉVÉNEMENTS PLEIN ÉCRAN
========================================================= */

document.addEventListener(
    "fullscreenchange",
    mettreAJourBoutonsPleinEcran10
);

document.addEventListener(
    "webkitfullscreenchange",
    mettreAJourBoutonsPleinEcran10
);


/* =========================================================
   INITIALISATION THREE.JS
========================================================= */

function initialiserRacing() {

    if (
        !zoneRacing ||
        renderer
    ) {

        return;
    }


    /* -----------------------------------------------------
       SCÈNE
    ----------------------------------------------------- */

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            COULEUR_CIEL
        );


    scene.fog =
        new THREE.Fog(
            COULEUR_CIEL,
            45,
            230
        );


    /* -----------------------------------------------------
       CAMERA
    ----------------------------------------------------- */

    const largeur =
        Math.max(
            zoneRacing.clientWidth,
            1
        );

    const hauteur =
        Math.max(
            zoneRacing.clientHeight,
            1
        );


    camera =
        new THREE.PerspectiveCamera(
            62,
            largeur / hauteur,
            0.1,
            400
        );


    camera.position.set(
        0,
        4.4,
        10
    );


    camera.lookAt(
        0,
        1,
        -35
    );


    /* -----------------------------------------------------
       RENDERER
    ----------------------------------------------------- */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true
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


    renderer.shadowMap.enabled =
        true;


    renderer.shadowMap.type =
        THREE.PCFSoftShadowMap;


    if (
        "outputEncoding" in renderer &&
        typeof THREE.sRGBEncoding !==
            "undefined"
    ) {

        renderer.outputEncoding =
            THREE.sRGBEncoding;
    }


    renderer.domElement.style.display =
        "block";

    renderer.domElement.style.width =
        "100%";

    renderer.domElement.style.height =
        "100%";


    zoneRacing.appendChild(
        renderer.domElement
    );


    /* -----------------------------------------------------
       LUMIÈRE
    ----------------------------------------------------- */

    const lumiereCiel =
        new THREE.HemisphereLight(
            0xddeeff,
            0x203020,
            2
        );


    scene.add(
        lumiereCiel
    );


    const soleil =
        new THREE.DirectionalLight(
            0xffffff,
            2.2
        );


    soleil.position.set(
        -40,
        80,
        30
    );


    soleil.castShadow =
        true;


    soleil.shadow.mapSize.width =
        2048;

    soleil.shadow.mapSize.height =
        2048;


    soleil.shadow.camera.left =
        -80;

    soleil.shadow.camera.right =
        80;

    soleil.shadow.camera.top =
        80;

    soleil.shadow.camera.bottom =
        -80;


    scene.add(
        soleil
    );


    /* -----------------------------------------------------
       MONDE
    ----------------------------------------------------- */

    creerSol();

    creerRoute();

    creerVoiture();

    creerVoituresEnnemies();

    creerDecor();

    creerLampes();

    creerPanneaux();

    creerNuages();


    /* -----------------------------------------------------
       PLEIN ÉCRAN
    ----------------------------------------------------- */

    creerBoutonsPleinEcran10();


    /* -----------------------------------------------------
       RESIZE
    ----------------------------------------------------- */

    window.addEventListener(
        "resize",
        redimensionnerRacing
    );


    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   SOL
========================================================= */

function creerSol() {

    const geometrie =
        new THREE.PlaneGeometry(
            500,
            500
        );


    const materiau =
        new THREE.MeshStandardMaterial({
            color: COULEUR_HERBE,
            roughness: 1
        });


    const sol =
        new THREE.Mesh(
            geometrie,
            materiau
        );


    sol.rotation.x =
        -Math.PI / 2;

    sol.position.y =
        -0.45;

    sol.position.z =
        -100;


    sol.receiveShadow =
        true;


    scene.add(
        sol
    );
}


/* =========================================================
   ROUTE
========================================================= */

function creerRoute() {

    const geometrie =
        new THREE.BoxGeometry(
            LARGEUR_ROUTE,
            0.35,
            LONGUEUR_ROUTE
        );


    const materiau =
        new THREE.MeshStandardMaterial({
            color: COULEUR_ROUTE,
            roughness: 0.85
        });


    const route =
        new THREE.Mesh(
            geometrie,
            materiau
        );


    route.position.set(
        0,
        -0.2,
        -120
    );


    route.receiveShadow =
        true;


    scene.add(
        route
    );


    /* -----------------------------------------------------
       ACCOTEMENTS
    ----------------------------------------------------- */

    const geometrieAccotement =
        new THREE.BoxGeometry(
            1.5,
            0.08,
            LONGUEUR_ROUTE
        );


    const materiauAccotement =
        new THREE.MeshStandardMaterial({
            color: 0x333333
        });


    const accotementGauche =
        new THREE.Mesh(
            geometrieAccotement,
            materiauAccotement
        );


    accotementGauche.position.set(
        -7.7,
        -0.05,
        -120
    );


    scene.add(
        accotementGauche
    );


    const accotementDroite =
        accotementGauche.clone();


    accotementDroite.position.x =
        7.7;


    scene.add(
        accotementDroite
    );


    /* -----------------------------------------------------
       LIGNES CENTRALES
    ----------------------------------------------------- */

    for (
        let i = 0;
        i < 45;
        i++
    ) {

        const ligne =
            new THREE.Mesh(

                new THREE.BoxGeometry(
                    0.18,
                    0.04,
                    5
                ),

                new THREE.MeshBasicMaterial({
                    color: 0xffffff
                })
            );


        ligne.position.set(
            0,
            0.01,
            -i * 7
        );


        scene.add(
            ligne
        );


        lignesRoute.push(
            ligne
        );
    }


    /* -----------------------------------------------------
       LIGNES DE VOIES
    ----------------------------------------------------- */

    [-2, 2].forEach(
        function(x) {

            for (
                let i = 0;
                i < 35;
                i++
            ) {

                const bande =
                    new THREE.Mesh(

                        new THREE.BoxGeometry(
                            0.06,
                            0.025,
                            3
                        ),

                        new THREE.MeshBasicMaterial({
                            color: 0xdddddd
                        })
                    );


                bande.position.set(
                    x,
                    0.015,
                    -i * 9 - 3
                );


                scene.add(
                    bande
                );


                bandesRoute.push(
                    bande
                );
            }
        }
    );


    /* -----------------------------------------------------
       VIBREURS
    ----------------------------------------------------- */

    for (
        let i = 0;
        i < 55;
        i++
    ) {

        creerVibreur(
            -6.7,
            -i * 5
        );

        creerVibreur(
            6.7,
            -i * 5
        );
    }
}


/* =========================================================
   VIBREUR
========================================================= */

function creerVibreur(
    x,
    z
) {

    const couleur =
        Math.floor(
            Math.abs(z / 5)
        ) % 2 === 0
            ? 0xffffff
            : 0xd71919;


    const vibreur =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.65,
                0.12,
                2.5
            ),

            new THREE.MeshStandardMaterial({
                color: couleur,
                roughness: 0.7
            })
        );


    vibreur.position.set(
        x,
        -0.01,
        z
    );


    scene.add(
        vibreur
    );


    if (x < 0) {

        vibreursGauche.push(
            vibreur
        );

    } else {

        vibreursDroite.push(
            vibreur
        );
    }
}


/* =========================================================
   VOITURE JOUEUR
========================================================= */

function creerVoiture() {

    voiture =
        new THREE.Group();


    /* -----------------------------------------------------
       CHASSIS
    ----------------------------------------------------- */

    const chassis =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2.25,
                0.38,
                4.4
            ),

            new THREE.MeshStandardMaterial({
                color: 0xe10600,
                metalness: 0.75,
                roughness: 0.2
            })
        );


    chassis.position.y =
        0.58;

    chassis.castShadow =
        true;


    voiture.add(
        chassis
    );


    /* -----------------------------------------------------
       NEZ
    ----------------------------------------------------- */

    const nez =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                1.45,
                0.32,
                1.5
            ),

            new THREE.MeshStandardMaterial({
                color: 0xc90000,
                metalness: 0.7,
                roughness: 0.2
            })
        );


    nez.position.set(
        0,
        0.72,
        -1.65
    );


    nez.castShadow =
        true;


    voiture.add(
        nez
    );


    /* -----------------------------------------------------
       COCKPIT
    ----------------------------------------------------- */

    const cockpit =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.9,
                20,
                12
            ),

            new THREE.MeshStandardMaterial({
                color: 0x101820,
                metalness: 0.4,
                roughness: 0.15
            })
        );


    cockpit.scale.set(
        0.8,
        0.45,
        1.15
    );


    cockpit.position.set(
        0,
        1.05,
        0.25
    );


    cockpit.castShadow =
        true;


    voiture.add(
        cockpit
    );


    /* -----------------------------------------------------
       AILERON
    ----------------------------------------------------- */

    const supportGauche =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.12,
                0.65,
                0.12
            ),

            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );


    supportGauche.position.set(
        -0.7,
        1.0,
        1.75
    );


    voiture.add(
        supportGauche
    );


    const supportDroite =
        supportGauche.clone();


    supportDroite.position.x =
        0.7;


    voiture.add(
        supportDroite
    );


    const aileron =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2.8,
                0.16,
                0.45
            ),

            new THREE.MeshStandardMaterial({
                color: 0x151515,
                metalness: 0.5,
                roughness: 0.3
            })
        );


    aileron.position.set(
        0,
        1.28,
        1.8
    );


    aileron.castShadow =
        true;


    voiture.add(
        aileron
    );


    /* -----------------------------------------------------
       ROUES
    ----------------------------------------------------- */

    creerRoueCourse(
        voiture,
        -1.18,
        0.45,
        -1.25
    );

    creerRoueCourse(
        voiture,
        1.18,
        0.45,
        -1.25
    );

    creerRoueCourse(
        voiture,
        -1.18,
        0.45,
        1.25
    );

    creerRoueCourse(
        voiture,
        1.18,
        0.45,
        1.25
    );


    voiture.position.set(
        0,
        0,
        5
    );


    scene.add(
        voiture
    );
}


/* =========================================================
   ROUE
========================================================= */

function creerRoueCourse(
    parent,
    x,
    y,
    z
) {

    const pneu =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.48,
                0.48,
                0.34,
                24
            ),

            new THREE.MeshStandardMaterial({
                color: 0x090909,
                roughness: 0.9
            })
        );


    pneu.rotation.z =
        Math.PI / 2;


    pneu.position.set(
        x,
        y,
        z
    );


    pneu.castShadow =
        true;


    parent.add(
        pneu
    );


    const jante =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.22,
                0.22,
                0.36,
                16
            ),

            new THREE.MeshStandardMaterial({
                color: 0xbfc4c8,
                metalness: 0.9,
                roughness: 0.2
            })
        );


    jante.rotation.z =
        Math.PI / 2;


    jante.position.set(
        x,
        y,
        z
    );


    parent.add(
        jante
    );
}


/* =========================================================
   VOITURES ENNEMIES
========================================================= */

function creerVoituresEnnemies() {

    for (
        let i = 0;
        i < 9;
        i++
    ) {

        creerVoitureEnnemie(
            -35 - i * 25
        );
    }
}


/* =========================================================
   VOITURE ENNEMIE
========================================================= */

function creerVoitureEnnemie(
    z
) {

    const ennemi =
        new THREE.Group();


    const couleurs = [
        0x0066ff,
        0xffcc00,
        0xffffff,
        0x111111,
        0x22aa55,
        0xff6600
    ];


    const couleur =
        couleurs[
            Math.floor(
                Math.random() *
                couleurs.length
            )
        ];


    const carrosserie =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2.15,
                0.55,
                4
            ),

            new THREE.MeshStandardMaterial({
                color: couleur,
                metalness: 0.7,
                roughness: 0.22
            })
        );


    carrosserie.position.y =
        0.62;

    carrosserie.castShadow =
        true;


    ennemi.add(
        carrosserie
    );


    const cockpit =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.8,
                18,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x111111,
                roughness: 0.15,
                metalness: 0.3
            })
        );


    cockpit.scale.set(
        0.8,
        0.42,
        1.1
    );


    cockpit.position.set(
        0,
        1.02,
        0
    );


    ennemi.add(
        cockpit
    );


    const aileron =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2.6,
                0.15,
                0.4
            ),

            new THREE.MeshStandardMaterial({
                color: 0x181818
            })
        );


    aileron.position.set(
        0,
        1.2,
        1.65
    );


    ennemi.add(
        aileron
    );


    creerRoueCourse(
        ennemi,
        -1.12,
        0.43,
        -1.15
    );

    creerRoueCourse(
        ennemi,
        1.12,
        0.43,
        -1.15
    );

    creerRoueCourse(
        ennemi,
        -1.12,
        0.43,
        1.15
    );

    creerRoueCourse(
        ennemi,
        1.12,
        0.43,
        1.15
    );


    ennemi.position.set(

        VOIES[
            Math.floor(
                Math.random() *
                VOIES.length
            )
        ],

        0,

        z
    );


    scene.add(
        ennemi
    );


    voituresEnnemies.push(
        ennemi
    );
}


/* =========================================================
   DÉCOR
========================================================= */

function creerDecor() {

    for (
        let i = 0;
        i < 45;
        i++
    ) {

        creerArbre(
            -10,
            -i * 7 - 10
        );

        creerArbre(
            10,
            -i * 7 - 13
        );
    }
}


/* =========================================================
   ARBRE
========================================================= */

function creerArbre(
    x,
    z
) {

    const arbre =
        new THREE.Group();


    const tronc =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.25,
                0.35,
                2.5,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x5b351f
            })
        );


    tronc.position.y =
        1.1;


    tronc.castShadow =
        true;


    arbre.add(
        tronc
    );


    const feuillage =
        new THREE.Mesh(

            new THREE.ConeGeometry(
                1.8,
                4,
                10
            ),

            new THREE.MeshStandardMaterial({
                color: 0x126b35,
                roughness: 1
            })
        );


    feuillage.position.y =
        3.6;


    feuillage.castShadow =
        true;


    arbre.add(
        feuillage
    );


    arbre.position.set(
        x,
        0,
        z
    );


    scene.add(
        arbre
    );


    arbres.push(
        arbre
    );
}


/* =========================================================
   LAMPES
========================================================= */

function creerLampes() {

    for (
        let i = 0;
        i < 20;
        i++
    ) {

        creerLampe(
            -9,
            -i * 15 - 15
        );

        creerLampe(
            9,
            -i * 15 - 22
        );
    }
}


function creerLampe(
    x,
    z
) {

    const groupe =
        new THREE.Group();


    const poteau =
        new THREE.Mesh(

            new THREE.CylinderGeometry(
                0.08,
                0.12,
                5,
                8
            ),

            new THREE.MeshStandardMaterial({
                color: 0x444444,
                metalness: 0.8
            })
        );


    poteau.position.y =
        2.5;


    groupe.add(
        poteau
    );


    const lampe =
        new THREE.Mesh(

            new THREE.SphereGeometry(
                0.25,
                12,
                8
            ),

            new THREE.MeshBasicMaterial({
                color: 0xffffcc
            })
        );


    lampe.position.set(
        0,
        5,
        0
    );


    groupe.add(
        lampe
    );


    groupe.position.set(
        x,
        0,
        z
    );


    scene.add(
        groupe
    );


    lampes.push(
        groupe
    );
}


/* =========================================================
   PANNEAUX
========================================================= */

function creerPanneaux() {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        creerPanneau(
            -9.2,
            -i * 25 - 20
        );
    }
}


function creerPanneau(
    x,
    z
) {

    const groupe =
        new THREE.Group();


    const poteau =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                0.15,
                3,
                0.15
            ),

            new THREE.MeshStandardMaterial({
                color: 0x555555
            })
        );


    poteau.position.y =
        1.5;


    groupe.add(
        poteau
    );


    const panneau =
        new THREE.Mesh(

            new THREE.BoxGeometry(
                2.5,
                1.1,
                0.12
            ),

            new THREE.MeshStandardMaterial({
                color: 0xffd400
            })
        );


    panneau.position.y =
        3;


    groupe.add(
        panneau
    );


    groupe.position.set(
        x,
        0,
        z
    );


    scene.add(
        groupe
    );


    panneaux.push(
        groupe
    );
}


/* =========================================================
   NUAGES
========================================================= */

function creerNuages() {

    for (
        let i = 0;
        i < 12;
        i++
    ) {

        const nuage =
            new THREE.Group();


        for (
            let j = 0;
            j < 4;
            j++
        ) {

            const boule =
                new THREE.Mesh(

                    new THREE.SphereGeometry(
                        3 + Math.random() * 2,
                        12,
                        8
                    ),

                    new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.65
                    })
                );


            boule.position.x =
                j * 3;


            boule.position.y =
                Math.random() * 2;


            nuage.add(
                boule
            );
        }


        nuage.position.set(
            Math.random() * 160 - 80,
            35 + Math.random() * 15,
            -Math.random() * 200
        );


        scene.add(
            nuage
        );


        nuages.push(
            nuage
        );
    }
}


/* =========================================================
   GAUCHE
========================================================= */

function allerGauche10() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;
    }


    positionVoitureX =
        Math.max(
            -4.2,
            positionVoitureX - 4.2
        );
}


/* =========================================================
   DROITE
========================================================= */

function allerDroite10() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;
    }


    positionVoitureX =
        Math.min(
            4.2,
            positionVoitureX + 4.2
        );
}


/* =========================================================
   ACCÉLÉRATION
========================================================= */

function activerAcceleration10() {

    if (
        jeuTermine ||
        jeuEnPause
    ) {

        return;
    }


    accelerationActive =
        true;
}


function desactiverAcceleration10() {

    accelerationActive =
        false;
}


/* =========================================================
   PAUSE
========================================================= */

function basculerPause10() {

    if (jeuTermine) {
        return;
    }


    jeuEnPause =
        !jeuEnPause;


    if (jeuEnPause) {

        accelerationActive =
            false;


        if (boutonPause) {

            boutonPause.textContent =
                "▶️ Reprendre";
        }


        if (messageRacing) {

            messageRacing.textContent =
                "⏸️ PAUSE";

            messageRacing.style.display =
                "block";
        }

    } else {

        if (boutonPause) {

            boutonPause.textContent =
                "⏸️ Pause";
        }


        if (messageRacing) {

            messageRacing.style.display =
                "none";
        }


        dernierTemps =
            performance.now();
    }
}


/* =========================================================
   BOUTON PAUSE
========================================================= */

if (boutonPause) {

    boutonPause.addEventListener(
        "click",
        function(event) {

            event.preventDefault();

            basculerPause10();
        }
    );
}


/* =========================================================
   CLAVIER
========================================================= */

document.addEventListener(
    "keydown",
    function(event) {

        const touche =
            event.key.toLowerCase();


        if (
            touche === "q" ||
            touche === "a" ||
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();

            allerGauche10();

        }

        else if (
            touche === "d" ||
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

            allerDroite10();

        }

        else if (
            event.key === "ArrowUp" ||
            touche === "z" ||
            event.code === "Space"
        ) {

            event.preventDefault();

            activerAcceleration10();

        }

        else if (
            touche === "p"
        ) {

            event.preventDefault();

            basculerPause10();

        }

        else if (
            touche === "f"
        ) {

            event.preventDefault();

            basculerPleinEcran10();
        }
    }
);


/* =========================================================
   KEYUP
========================================================= */

document.addEventListener(
    "keyup",
    function(event) {

        if (
            event.key === "ArrowUp" ||
            event.key.toLowerCase() === "z" ||
            event.code === "Space"
        ) {

            desactiverAcceleration10();
        }
    }
);


/* =========================================================
   CONTROLES MOBILE
========================================================= */

function ajouterControle10(
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


ajouterControle10(
    boutonGauche,
    allerGauche10
);


ajouterControle10(
    boutonDroite,
    allerDroite10
);


/* =========================================================
   ACCÉLÉRATION MOBILE
========================================================= */

if (boutonAccelerer) {

    boutonAccelerer.addEventListener(
        "touchstart",
        function(event) {

            event.preventDefault();

            activerAcceleration10();

        },
        {
            passive: false
        }
    );


    boutonAccelerer.addEventListener(
        "touchend",
        function(event) {

            event.preventDefault();

            desactiverAcceleration10();

        },
        {
            passive: false
        }
    );


    boutonAccelerer.addEventListener(
        "touchcancel",
        function() {

            desactiverAcceleration10();
        }
    );


    boutonAccelerer.addEventListener(
        "mousedown",
        function() {

            activerAcceleration10();
        }
    );


    boutonAccelerer.addEventListener(
        "mouseup",
        function() {

            desactiverAcceleration10();
        }
    );


    boutonAccelerer.addEventListener(
        "mouseleave",
        function() {

            desactiverAcceleration10();
        }
    );
}


/* =========================================================
   COLLISION
========================================================= */

function verifierCollision10(
    ennemi
) {

    if (
        !voiture ||
        !ennemi
    ) {

        return false;
    }


    const distanceX =
        Math.abs(
            voiture.position.x -
            ennemi.position.x
        );


    const distanceZ =
        Math.abs(
            voiture.position.z -
            ennemi.position.z
        );


    return (
        distanceX < 1.75 &&
        distanceZ < 2.7
    );
}


/* =========================================================
   SCORE
========================================================= */

function augmenterScore10(
    valeur
) {

    score +=
        valeur;


    const scoreEntier =
        Math.floor(score);


    if (scoreElement) {

        scoreElement.textContent =
            scoreEntier;
    }


    if (
        scoreEntier >
        meilleurScore
    ) {

        meilleurScore =
            scoreEntier;


        if (meilleurScoreElement) {

            meilleurScoreElement.textContent =
                meilleurScore;
        }


        localStorage.setItem(
            cleMeilleurScore,
            String(meilleurScore)
        );
    }
}


/* =========================================================
   GAME OVER
========================================================= */

async function gameOver10() {

    if (jeuTermine) {
        return;
    }


    jeuTermine =
        true;


    accelerationActive =
        false;


    const scoreFinal =
        Math.floor(score);


    if (messageRacing) {

        messageRacing.textContent =
            "💥 ACCIDENT — Score : " +
            scoreFinal;

        messageRacing.style.display =
            "block";
    }


    if (boutonPause) {

        boutonPause.style.display =
            "none";
    }


    if (boutonRejouer) {

        boutonRejouer.style.display =
            "inline-block";
    }


    /* -----------------------------------------------------
       VÉRIFICATION DE LA SESSION AU MOMENT DU SCORE
    ----------------------------------------------------- */

    const connecte =
        await verifierConnexion10();


    /* -----------------------------------------------------
       VISITEUR
    ----------------------------------------------------- */

    if (!connecte) {

        console.log(
            "👤 Visiteur : score NON envoyé à Supabase."
        );


        if (statutClassement) {

            statutClassement.textContent =
                "👤 Visiteur : ton score reste uniquement sur cet appareil.";
        }


        return;
    }


    /* -----------------------------------------------------
       COMPTE CONNECTÉ
    ----------------------------------------------------- */

    console.log(
        "🏆 Score envoyé pour :",
        pseudo
    );


    await enregistrerScore10();
}


/* =========================================================
   ENREGISTRER LE SCORE
========================================================= */

async function enregistrerScore10() {

    if (!supabaseClient10) {

        console.log(
            "❌ Supabase indisponible : score non envoyé."
        );

        return;
    }


    try {

        /* -------------------------------------------------
           SESSION
        ------------------------------------------------- */

        const resultatSession =
            await supabaseClient10.auth.getSession();


        if (resultatSession.error) {

            console.error(
                "Erreur vérification session :",
                resultatSession.error
            );

            return;
        }


        const session =
            resultatSession.data?.session;


        /* -------------------------------------------------
           PAS DE SESSION
        ------------------------------------------------- */

        if (
            !session ||
            !session.user
        ) {

            utilisateurConnecte10 =
                false;

            pseudo =
                null;


            actualiserPseudo10();


            if (statutClassement) {

                statutClassement.textContent =
                    "👤 Visiteur : ton score reste uniquement sur cet appareil.";
            }


            console.log(
                "👤 Visiteur : score NON envoyé à Supabase."
            );


            return;
        }


        /* -------------------------------------------------
           PSEUDO ACTUEL
        ------------------------------------------------- */

        let pseudoActuel =
            localStorage.getItem(
                "pseudoGameZone"
            );


        if (pseudoActuel) {

            pseudoActuel =
                pseudoActuel.trim();
        }


        /* -------------------------------------------------
           MÉTADONNÉES SI NÉCESSAIRE
        ------------------------------------------------- */

        if (!pseudoActuel) {

            const pseudoMetadata =
                session.user
                    .user_metadata
                    ?.pseudo;


            if (pseudoMetadata) {

                pseudoActuel =
                    String(
                        pseudoMetadata
                    ).trim();
            }
        }


        /* -------------------------------------------------
           AUCUN PSEUDO
        ------------------------------------------------- */

        if (!pseudoActuel) {

            utilisateurConnecte10 =
                false;

            pseudo =
                null;


            actualiserPseudo10();


            console.log(
                "❌ Aucun pseudo associé : score non envoyé."
            );


            return;
        }


        /* -------------------------------------------------
           IDENTITÉ VALIDÉE
        ------------------------------------------------- */

        utilisateurConnecte10 =
            true;

        pseudo =
            pseudoActuel;


        actualiserPseudo10();


        /* -------------------------------------------------
           SCORE FINAL
        ------------------------------------------------- */

        const scoreFinal =
            Math.floor(score);


        if (statutClassement) {

            statutClassement.textContent =
                "⏳ Enregistrement du score...";
        }


        console.log(
            "🏎️ Score 3D Racing :",
            scoreFinal
        );


        console.log(
            "👤 Pseudo :",
            pseudoActuel
        );


        /* -------------------------------------------------
           CHERCHER LE MEILLEUR SCORE
        ------------------------------------------------- */

        const resultat =
            await supabaseClient10
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
                "Erreur recherche score :",
                resultat.error
            );


            if (statutClassement) {

                statutClassement.textContent =
                    "❌ Impossible de vérifier ton score.";
            }


            return;
        }


        /* -------------------------------------------------
           SCORE EXISTANT
        ------------------------------------------------- */

        const scoreExistant =
            resultat.data &&
            resultat.data.length > 0
                ? Number(
                    resultat.data[0].score
                )
                : 0;


        /* -------------------------------------------------
           SCORE PAS MEILLEUR
        ------------------------------------------------- */

        if (
            scoreFinal <=
            scoreExistant
        ) {

            if (statutClassement) {

                statutClassement.textContent =
                    "🏆 Ton meilleur score reste : " +
                    scoreExistant;
            }


            await chargerClassement10();

            return;
        }


        /* -------------------------------------------------
           NOUVEAU RECORD
        ------------------------------------------------- */

        console.log(
            "🎉 Nouveau record !",
            scoreFinal
        );


        /* -------------------------------------------------
           MISE À JOUR
        ------------------------------------------------- */

        if (
            resultat.data &&
            resultat.data.length > 0
        ) {

            const idScore =
                resultat.data[0].id;


            const miseAJour =
                await supabaseClient10
                    .from("scores")
                    .update({
                        score: scoreFinal
                    })
                    .eq(
                        "id",
                        idScore
                    );


            if (miseAJour.error) {

                console.error(
                    "Erreur mise à jour score :",
                    miseAJour.error
                );


                if (statutClassement) {

                    statutClassement.textContent =
                        "❌ Impossible d'enregistrer le nouveau record.";
                }


                return;
            }

        } else {

            /* ---------------------------------------------
               PREMIER SCORE
            --------------------------------------------- */

            const insertion =
                await supabaseClient10
                    .from("scores")
                    .insert([
                        {
                            pseudo:
                                pseudoActuel,

                            score:
                                scoreFinal,

                            jeu:
                                NOM_JEU
                        }
                    ]);


            if (insertion.error) {

                console.error(
                    "Erreur insertion score :",
                    insertion.error
                );


                if (statutClassement) {

                    statutClassement.textContent =
                        "❌ Impossible d'enregistrer le score.";
                }


                return;
            }
        }


        /* -------------------------------------------------
           SUCCÈS
        ------------------------------------------------- */

        if (statutClassement) {

            statutClassement.textContent =
                "🏆 Nouveau record : " +
                scoreFinal +
                " points !";
        }


        console.log(
            "✅ Score enregistré sur Supabase :",
            pseudoActuel,
            scoreFinal
        );


        await chargerClassement10();


    } catch (erreur) {

        console.error(
            "❌ Erreur score 3D Racing :",
            erreur
        );


        if (statutClassement) {

            statutClassement.textContent =
                "❌ Une erreur est survenue lors de l'enregistrement.";
        }
    }
}


/* =========================================================
   CLASSEMENT
========================================================= */

async function chargerClassement10() {

    if (
        !listeScores ||
        !supabaseClient10
    ) {

        return;
    }


    try {

        const resultat =
            await supabaseClient10
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

            listeScores.innerHTML = `
                <tr>
                    <td colspan="3">
                        ❌ Erreur de chargement
                    </td>
                </tr>
            `;

            return;
        }


        const scores =
            resultat.data || [];


        listeScores.innerHTML =
            "";


        if (
            scores.length === 0
        ) {

            listeScores.innerHTML = `
                <tr>
                    <td colspan="3">
                        Aucun score.
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


                const position =
                    document.createElement(
                        "td"
                    );


                if (index === 0) {

                    position.textContent =
                        "🥇";

                } else if (index === 1) {

                    position.textContent =
                        "🥈";

                } else if (index === 2) {

                    position.textContent =
                        "🥉";

                } else {

                    position.textContent =
                        index + 1;
                }


                const pseudoCellule =
                    document.createElement(
                        "td"
                    );


                pseudoCellule.textContent =
                    joueurScore.pseudo ||
                    "Inconnu";


                const scoreCellule =
                    document.createElement(
                        "td"
                    );


                scoreCellule.textContent =
                    Number(
                        joueurScore.score
                    ) || 0;


                if (
                    utilisateurConnecte10 &&
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
                    position
                );

                ligne.appendChild(
                    pseudoCellule
                );

                ligne.appendChild(
                    scoreCellule
                );


                listeScores.appendChild(
                    ligne
                );
            }
        );

    } catch (erreur) {

        console.error(
            "Erreur classement :",
            erreur
        );
    }
}


/* =========================================================
   COMPTEUR DE PARTIES
========================================================= */

async function compterPartieJeu10() {

    if (!supabaseClient10) {
        return;
    }


    try {

        const resultat =
            await supabaseClient10.rpc(
                "incrementer_parties_jeu",
                {
                    nom_du_jeu:
                        NOM_JEU
                }
            );


        if (resultat.error) {

            console.error(
                "Erreur compteur :",
                resultat.error
            );

            return;
        }


        console.log(
            "🎮 Partie 3D Racing comptée :",
            resultat.data
        );

    } catch (erreur) {

        console.error(
            "Erreur compteur :",
            erreur
        );
    }
}


/* =========================================================
   REJOUER
========================================================= */

function rejouer10(event) {

    if (event) {

        event.preventDefault();
        event.stopPropagation();
    }


    /* -----------------------------------------------------
       SUPPRIMER LES ENNEMIS
    ----------------------------------------------------- */

    voituresEnnemies.forEach(
        function(ennemi) {

            if (scene) {

                scene.remove(
                    ennemi
                );
            }
        }
    );


    voituresEnnemies =
        [];


    /* -----------------------------------------------------
       RESET
    ----------------------------------------------------- */

    score =
        0;


    vitesse =
        0.45;


    positionVoitureX =
        0;


    jeuTermine =
        false;


    jeuEnPause =
        false;


    accelerationActive =
        false;


    /* -----------------------------------------------------
       VOITURE
    ----------------------------------------------------- */

    if (voiture) {

        voiture.position.set(
            0,
            0,
            5
        );


        voiture.rotation.set(
            0,
            0,
            0
        );
    }


    /* -----------------------------------------------------
       SCORE
    ----------------------------------------------------- */

    if (scoreElement) {

        scoreElement.textContent =
            "0";
    }


    /* -----------------------------------------------------
       MESSAGE
    ----------------------------------------------------- */

    if (messageRacing) {

        messageRacing.style.display =
            "none";
    }


    /* -----------------------------------------------------
       PAUSE
    ----------------------------------------------------- */

    if (boutonPause) {

        boutonPause.style.display =
            "inline-block";


        boutonPause.textContent =
            "⏸️ Pause";
    }


    /* -----------------------------------------------------
       REJOUER
    ----------------------------------------------------- */

    if (boutonRejouer) {

        boutonRejouer.style.display =
            "none";
    }


    /* -----------------------------------------------------
       NOUVEAUX ENNEMIS
    ----------------------------------------------------- */

    creerVoituresEnnemies();


    /* -----------------------------------------------------
       COMPTEUR
    ----------------------------------------------------- */

    compterPartieJeu10();


    dernierTemps =
        performance.now();
}


/* =========================================================
   BOUTON REJOUER
========================================================= */

if (boutonRejouer) {

    boutonRejouer.addEventListener(
        "click",
        rejouer10
    );
}


/* =========================================================
   BOUCLE PRINCIPALE
========================================================= */

function boucleRacing(
    tempsActuel
) {

    animationID =
        requestAnimationFrame(
            boucleRacing
        );


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


    if (
        !renderer ||
        !scene ||
        !camera
    ) {

        return;
    }


    /* -----------------------------------------------------
       PAUSE / GAME OVER
    ----------------------------------------------------- */

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


    /* -----------------------------------------------------
       SCORE
    ----------------------------------------------------- */

    augmenterScore10(
        delta * 0.018
    );


    /* -----------------------------------------------------
       VITESSE
    ----------------------------------------------------- */

    vitesse =
        0.42 +
        Math.min(
            1.35,
            score / 800
        );


    if (accelerationActive) {

        vitesse +=
            1.1;
    }


    /* -----------------------------------------------------
       VOITURE
    ----------------------------------------------------- */

    if (voiture) {

        const anciennePosition =
            voiture.position.x;


        voiture.position.x +=
            (
                positionVoitureX -
                voiture.position.x
            ) * 0.13;


        voiture.rotation.z =
            (
                anciennePosition -
                voiture.position.x
            ) * 0.15;


        voiture.rotation.y =
            (
                anciennePosition -
                voiture.position.x
            ) * 0.025;
    }


    const mouvement =
        vitesse *
        delta /
        16;


    /* -----------------------------------------------------
       LIGNES
    ----------------------------------------------------- */

    lignesRoute.forEach(
        function(ligne) {

            ligne.position.z +=
                mouvement;


            if (
                ligne.position.z > 15
            ) {

                ligne.position.z -=
                    315;
            }
        }
    );


    /* -----------------------------------------------------
       BANDES
    ----------------------------------------------------- */

    bandesRoute.forEach(
        function(bande) {

            bande.position.z +=
                mouvement;


            if (
                bande.position.z > 15
            ) {

                bande.position.z -=
                    315;
            }
        }
    );


    /* -----------------------------------------------------
       VIBREURS
    ----------------------------------------------------- */

    [
        ...vibreursGauche,
        ...vibreursDroite
    ].forEach(
        function(vibreur) {

            vibreur.position.z +=
                mouvement;


            if (
                vibreur.position.z > 15
            ) {

                vibreur.position.z -=
                    280;
            }
        }
    );


    /* -----------------------------------------------------
       ENNEMIS
    ----------------------------------------------------- */

    voituresEnnemies.forEach(
        function(ennemi) {

            if (!ennemi) {
                return;
            }


            ennemi.position.z +=
                mouvement;


            ennemi.rotation.y =
                Math.sin(
                    tempsActuel * 0.001
                ) * 0.015;


            if (
                verifierCollision10(
                    ennemi
                )
            ) {

                gameOver10();
            }


            if (
                ennemi.position.z > 18
            ) {

                ennemi.position.z =
                    -210 -
                    Math.random() * 80;


                ennemi.position.x =
                    VOIES[
                        Math.floor(
                            Math.random() *
                            VOIES.length
                        )
                    ];
            }
        }
    );


    /* -----------------------------------------------------
       ARBRES
    ----------------------------------------------------- */

    arbres.forEach(
        function(arbre) {

            arbre.position.z +=
                mouvement;


            if (
                arbre.position.z > 20
            ) {

                arbre.position.z =
                    -300;
            }
        }
    );


    /* -----------------------------------------------------
       LAMPES
    ----------------------------------------------------- */

    lampes.forEach(
        function(lampe) {

            lampe.position.z +=
                mouvement;


            if (
                lampe.position.z > 20
            ) {

                lampe.position.z =
                    -300;
            }
        }
    );


    /* -----------------------------------------------------
       PANNEAUX
    ----------------------------------------------------- */

    panneaux.forEach(
        function(panneau) {

            panneau.position.z +=
                mouvement;


            if (
                panneau.position.z > 20
            ) {

                panneau.position.z =
                    -300;
            }
        }
    );


    /* -----------------------------------------------------
       NUAGES
    ----------------------------------------------------- */

    nuages.forEach(
        function(nuage) {

            nuage.position.x +=
                0.003 * delta;


            if (
                nuage.position.x > 100
            ) {

                nuage.position.x =
                    -100;
            }
        }
    );


    /* -----------------------------------------------------
       CAMERA
    ----------------------------------------------------- */

    if (voiture) {

        camera.position.x +=
            (
                voiture.position.x -
                camera.position.x
            ) * 0.035;


        camera.position.y =
            4.4 +
            Math.sin(
                tempsActuel * 0.004
            ) * 0.025;


        camera.lookAt(
            voiture.position.x,
            0.9,
            -30
        );
    }


    /* -----------------------------------------------------
       RENDU
    ----------------------------------------------------- */

    renderer.render(
        scene,
        camera
    );
}


/* =========================================================
   REDIMENSIONNEMENT
========================================================= */

function redimensionnerRacing() {

    if (
        !renderer ||
        !camera ||
        !zoneRacing
    ) {

        return;
    }


    let largeur;
    let hauteur;


    const pleinEcran =
        estEnPleinEcran10();


    if (pleinEcran) {

        largeur =
            window.innerWidth;

        hauteur =
            window.innerHeight;

    } else {

        largeur =
            zoneRacing.clientWidth;

        hauteur =
            zoneRacing.clientHeight;
    }


    largeur =
        Math.max(
            Math.floor(largeur),
            1
        );


    hauteur =
        Math.max(
            Math.floor(hauteur),
            1
        );


    camera.aspect =
        largeur /
        hauteur;


    camera.updateProjectionMatrix();


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio || 1,
            2
        )
    );


    renderer.setSize(
        largeur,
        hauteur,
        false
    );
}


/* =========================================================
   ORIENTATION MOBILE
========================================================= */

window.addEventListener(
    "orientationchange",
    function() {

        setTimeout(
            redimensionnerRacing,
            300
        );
    }
);


/* =========================================================
   RESIZE FENÊTRE
========================================================= */

window.addEventListener(
    "resize",
    function() {

        setTimeout(
            redimensionnerRacing,
            100
        );
    }
);


/* =========================================================
   CLÉ DU MEILLEUR SCORE
========================================================= */

function obtenirCleMeilleurScore10() {

    const pseudoActuel =
        obtenirPseudo10();


    if (pseudoActuel) {

        return (
            "meilleurScore3DRacing_" +
            pseudoActuel
        );
    }


    return (
        "meilleurScore3DRacing_visiteur"
    );
}


/* =========================================================
   DÉMARRAGE DU JEU
========================================================= */

async function demarrerRacing() {

    console.log(
        "🏁 Démarrage de 3D Racing..."
    );


    /* -----------------------------------------------------
       SESSION
    ----------------------------------------------------- */

    await verifierConnexion10();


    /* -----------------------------------------------------
       INITIALISATION THREE.JS
    ----------------------------------------------------- */

    initialiserRacing();


    /* -----------------------------------------------------
       MESSAGE
    ----------------------------------------------------- */

    if (messageRacing) {

        messageRacing.style.display =
            "none";
    }


    /* -----------------------------------------------------
       PSEUDO
    ----------------------------------------------------- */

    actualiserPseudo10();


    /* -----------------------------------------------------
       MEILLEUR SCORE
    ----------------------------------------------------- */

    cleMeilleurScore =
        obtenirCleMeilleurScore10();


    meilleurScore =
        Number(
            localStorage.getItem(
                cleMeilleurScore
            )
        ) || 0;


    if (meilleurScoreElement) {

        meilleurScoreElement.textContent =
            meilleurScore;
    }


    /* -----------------------------------------------------
       CLASSEMENT
    ----------------------------------------------------- */

    await chargerClassement10();


    /* -----------------------------------------------------
       COMPTEUR
    ----------------------------------------------------- */

    compterPartieJeu10();


    /* -----------------------------------------------------
       BOUCLE
    ----------------------------------------------------- */

    dernierTemps =
        performance.now();


    if (!animationID) {

        animationID =
            requestAnimationFrame(
                boucleRacing
            );
    }


    console.log(
        "✅ 3D Racing démarré."
    );
}


/* =========================================================
   LANCEMENT
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        demarrerRacing
    );

} else {

    demarrerRacing();
}