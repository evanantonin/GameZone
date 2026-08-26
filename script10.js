/* =========================================================
   GAMEZONE — JEU 10
   3D RACING
   THREE.JS

   👤 VISITEUR
   🏆 CLASSEMENT SUPABASE
   💾 MEILLEUR SCORE LOCAL
   📱 MOBILE
   💻 PC
   ⏸️ PAUSE
   💀 GAME OVER
   🎮 COMPTEUR DE PARTIES
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
else {

    console.error(
        "❌ Bibliothèque Supabase non chargée."
    );

}


/* =========================================================
   IDENTIFICATION
========================================================= */

const JEU_ID = "10";

const NOM_JEU = "3D Racing";


/* =========================================================
   ELEMENTS HTML
========================================================= */

const zoneRacing =
    document.getElementById(
        "jeuRacing3D"
    );


const messageRacing =
    document.getElementById(
        "messageRacing10"
    );


const scoreElement =
    document.getElementById(
        "score10"
    );


const meilleurScoreElement =
    document.getElementById(
        "meilleurScore10"
    );


const vitesseElement =
    document.getElementById(
        "vitesse10"
    );


const pseudoAffiche =
    document.getElementById(
        "pseudoAffiche10"
    );


const boutonPause =
    document.getElementById(
        "boutonPause10"
    );


const boutonRejouer =
    document.getElementById(
        "boutonRejouer10"
    );


const boutonGauche =
    document.getElementById(
        "boutonGauche10"
    );


const boutonDroite =
    document.getElementById(
        "boutonDroite10"
    );


const listeScores =
    document.getElementById(
        "listeScores10"
    );


const statutClassement =
    document.getElementById(
        "statutClassement10"
    );


/* =========================================================
   PSEUDO
========================================================= */

let pseudo =
    localStorage.getItem(
        "pseudoGameZone"
    );


if (pseudo) {

    pseudoAffiche.textContent =
        pseudo;

}
else {

    pseudoAffiche.textContent =
        "Visiteur";

}


/* =========================================================
   MEILLEUR SCORE
========================================================= */

function obtenirCleMeilleurScore() {

    if (pseudo) {

        return (
            "meilleurScore3DRacing_" +
            pseudo
        );

    }

    return (
        "meilleurScore3DRacing_visiteur"
    );

}


const cleMeilleurScore =
    obtenirCleMeilleurScore();


let meilleurScore =
    Number(
        localStorage.getItem(
            cleMeilleurScore
        )
    ) || 0;


meilleurScoreElement.textContent =
    meilleurScore;


/* =========================================================
   THREE.JS
========================================================= */

let scene;

let camera;

let renderer;

let voiture;

let route;

let lignesRoute = [];

let voituresEnnemies = [];

let arbres = [];

let animationID;


/* =========================================================
   VARIABLES DU JEU
========================================================= */

let score = 0;

let vitesse = 0.35;

let jeuTermine = false;

let jeuEnPause = false;

let dernierTemps = 0;

let positionVoitureX = 0;

let compteurObstacle = 0;


/* =========================================================
   CONFIGURATION
========================================================= */

const LARGEUR_ROUTE = 12;

const LONGUEUR_ROUTE = 220;

const VOIES = [
    -4,
    0,
    4
];


/* =========================================================
   INITIALISATION
========================================================= */

function initialiserRacing() {

    scene =
        new THREE.Scene();


    scene.background =
        new THREE.Color(
            0x101827
        );


    scene.fog =
        new THREE.Fog(
            0x101827,
            30,
            180
        );


    /* =====================================================
       CAMERA
    ===================================================== */

    camera =
        new THREE.PerspectiveCamera(
            65,
            zoneRacing.clientWidth /
            zoneRacing.clientHeight,
            0.1,
            300
        );


    camera.position.set(
        0,
        5,
        10
    );


    camera.lookAt(
        0,
        1,
        -25
    );


    /* =====================================================
       RENDERER
    ===================================================== */

    renderer =
        new THREE.WebGLRenderer({
            antialias: true
        });


    renderer.setPixelRatio(
        Math.min(
            window.devicePixelRatio,
            2
        )
    );


    renderer.setSize(
        zoneRacing.clientWidth,
        zoneRacing.clientHeight
    );


    zoneRacing.appendChild(
        renderer.domElement
    );


    /* =====================================================
       LUMIERES
    ===================================================== */

    const lumiereAmbiante =
        new THREE.HemisphereLight(
            0xffffff,
            0x333344,
            1.6
        );


    scene.add(
        lumiereAmbiante
    );


    const lumiere =
        new THREE.DirectionalLight(
            0xffffff,
            1.2
        );


    lumiere.position.set(
        5,
        12,
        5
    );


    scene.add(
        lumiere
    );


    /* =====================================================
       CREATION DU MONDE
    ===================================================== */

    creerRoute();

    creerVoiture();

    creerVoituresEnnemies();

    creerDecor();


    /* =====================================================
       RESIZE
    ===================================================== */

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
   ROUTE
========================================================= */

function creerRoute() {

    const geometrie =
        new THREE.BoxGeometry(
            LARGEUR_ROUTE,
            0.3,
            LONGUEUR_ROUTE
        );


    const materiau =
        new THREE.MeshStandardMaterial({
            color: 0x222222
        });


    route =
        new THREE.Mesh(
            geometrie,
            materiau
        );


    route.position.set(
        0,
        -0.25,
        -90
    );


    scene.add(
        route
    );


    /* =====================================================
       BORDS
    ===================================================== */

    const geometrieBord =
        new THREE.BoxGeometry(
            0.3,
            0.3,
            LONGUEUR_ROUTE
        );


    const materiauBord =
        new THREE.MeshStandardMaterial({
            color: 0xff3333
        });


    const bordGauche =
        new THREE.Mesh(
            geometrieBord,
            materiauBord
        );


    bordGauche.position.set(
        -6,
        0,
        -90
    );


    scene.add(
        bordGauche
    );


    const bordDroite =
        new THREE.Mesh(
            geometrieBord,
            materiauBord
        );


    bordDroite.position.set(
        6,
        0,
        -90
    );


    scene.add(
        bordDroite
    );


    /* =====================================================
       LIGNES CENTRALES
    ===================================================== */

    for (
        let i = 0;
        i < 30;
        i++
    ) {

        const geometrieLigne =
            new THREE.BoxGeometry(
                0.15,
                0.04,
                4
            );


        const materiauLigne =
            new THREE.MeshBasicMaterial({
                color: 0xffffff
            });


        const ligne =
            new THREE.Mesh(
                geometrieLigne,
                materiauLigne
            );


        ligne.position.set(
            0,
            -0.08,
            -i * 7
        );


        scene.add(
            ligne
        );


        lignesRoute.push(
            ligne
        );

    }

}


/* =========================================================
   VOITURE DU JOUEUR
========================================================= */

function creerVoiture() {

    voiture =
        new THREE.Group();


    /* =====================================================
       CARROSSERIE
    ===================================================== */

    const geometrieCarrosserie =
        new THREE.BoxGeometry(
            2.2,
            0.7,
            3.8
        );


    const materiauCarrosserie =
        new THREE.MeshStandardMaterial({
            color: 0x00aaff,
            metalness: 0.5,
            roughness: 0.3
        });


    const carrosserie =
        new THREE.Mesh(
            geometrieCarrosserie,
            materiauCarrosserie
        );


    carrosserie.position.y =
        0.7;


    voiture.add(
        carrosserie
    );


    /* =====================================================
       TOIT
    ===================================================== */

    const geometrieToit =
        new THREE.BoxGeometry(
            1.6,
            0.55,
            1.7
        );


    const materiauToit =
        new THREE.MeshStandardMaterial({
            color: 0x1166aa,
            metalness: 0.4
        });


    const toit =
        new THREE.Mesh(
            geometrieToit,
            materiauToit
        );


    toit.position.set(
        0,
        1.25,
        0
    );


    voiture.add(
        toit
    );


    /* =====================================================
       ROUES
    ===================================================== */

    creerRoue(
        voiture,
        -1.15,
        0.45,
        -1.15
    );


    creerRoue(
        voiture,
        1.15,
        0.45,
        -1.15
    );


    creerRoue(
        voiture,
        -1.15,
        0.45,
        1.15
    );


    creerRoue(
        voiture,
        1.15,
        0.45,
        1.15
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

function creerRoue(
    parent,
    x,
    y,
    z
) {

    const geometrie =
        new THREE.CylinderGeometry(
            0.42,
            0.42,
            0.28,
            16
        );


    const materiau =
        new THREE.MeshStandardMaterial({
            color: 0x050505
        });


    const roue =
        new THREE.Mesh(
            geometrie,
            materiau
        );


    roue.rotation.z =
        Math.PI / 2;


    roue.position.set(
        x,
        y,
        z
    );


    parent.add(
        roue
    );

}


/* =========================================================
   VOITURES ENNEMIES
========================================================= */

function creerVoituresEnnemies() {

    for (
        let i = 0;
        i < 8;
        i++
    ) {

        creerVoitureEnnemie(
            -25 -
            i * 22
        );

    }

}


/* =========================================================
   CREER UNE VOITURE ENNEMIE
========================================================= */

function creerVoitureEnnemie(
    z
) {

    const ennemi =
        new THREE.Group();


    const geometrie =
        new THREE.BoxGeometry(
            2.2,
            0.8,
            3.5
        );


    const couleurs = [
        0xff2222,
        0xff8800,
        0xffdd00,
        0xaa22ff,
        0x22dd66
    ];


    const couleur =
        couleurs[
            Math.floor(
                Math.random() *
                couleurs.length
            )
        ];


    const materiau =
        new THREE.MeshStandardMaterial({
            color: couleur,
            metalness: 0.4,
            roughness: 0.4
        });


    const carrosserie =
        new THREE.Mesh(
            geometrie,
            materiau
        );


    carrosserie.position.y =
        0.7;


    ennemi.add(
        carrosserie
    );


    const toit =
        new THREE.Mesh(
            new THREE.BoxGeometry(
                1.5,
                0.5,
                1.5
            ),
            new THREE.MeshStandardMaterial({
                color: 0x222222
            })
        );


    toit.position.y =
        1.25;


    ennemi.add(
        toit
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
   DECOR
========================================================= */

function creerDecor() {

    for (
        let i = 0;
        i < 40;
        i++
    ) {

        creerArbre(
            -i * 6 - 10,
            -10
        );


        creerArbre(
            -i * 6 - 13,
            10
        );

    }

}


/* =========================================================
   ARBRE
========================================================= */

function creerArbre(
    z,
    x
) {

    const arbre =
        new THREE.Group();


    const tronc =
        new THREE.Mesh(
            new THREE.CylinderGeometry(
                0.25,
                0.35,
                2,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x663311
            })
        );


    tronc.position.y =
        1;


    arbre.add(
        tronc
    );


    const feuillage =
        new THREE.Mesh(
            new THREE.ConeGeometry(
                1.4,
                3,
                8
            ),
            new THREE.MeshStandardMaterial({
                color: 0x16833b
            })
        );


    feuillage.position.y =
        3;


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
            -4,
            positionVoitureX - 4
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
            4,
            positionVoitureX + 4
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
            touche === "p"
        ) {

            basculerPause10();

        }

    }
);


/* =========================================================
   MOBILE
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
   COLLISION
========================================================= */

function verifierCollision10(
    ennemi
) {

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
        distanceX < 1.8 &&
        distanceZ < 2.4
    );

}


/* =========================================================
   SCORE
========================================================= */

function augmenterScore10(
    valeur
) {

    score += valeur;


    scoreElement.textContent =
        Math.floor(score);


    if (
        Math.floor(score) >
        meilleurScore
    ) {

        meilleurScore =
            Math.floor(score);


        meilleurScoreElement.textContent =
            meilleurScore;


        localStorage.setItem(
            cleMeilleurScore,
            meilleurScore
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


    jeuTermine = true;


    messageRacing.textContent =
        "💀 GAME OVER — Score : " +
        Math.floor(score);


    messageRacing.style.display =
        "block";


    boutonPause.style.display =
        "none";


    boutonRejouer.style.display =
        "inline-block";


    if (!pseudo) {

        statutClassement.textContent =
            "👤 Visiteur : ton score reste sur cet appareil.";

        return;

    }


    await enregistrerScore10();

}


/* =========================================================
   ENREGISTRER SCORE
========================================================= */

async function enregistrerScore10() {

    if (
        !pseudo ||
        !supabaseClient10
    ) {

        return;

    }


    try {

        statutClassement.textContent =
            "⏳ Enregistrement du score...";


        const resultat =
            await supabaseClient10
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
                "❌ Recherche score :",
                resultat.error
            );

            return;

        }


        const anciens =
            resultat.data || [];


        const scoreFinal =
            Math.floor(score);


        /* =================================================
           PREMIER SCORE
        ================================================= */

        if (
            anciens.length === 0
        ) {

            const insertion =
                await supabaseClient10
                    .from("scores")
                    .insert({

                        pseudo:
                            pseudo,

                        score:
                            scoreFinal,

                        jeu:
                            NOM_JEU

                    });


            if (insertion.error) {

                console.error(
                    "❌ Insertion score :",
                    insertion.error
                );

                return;

            }


            statutClassement.textContent =
                "🏆 Score enregistré !";

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
                scoreFinal >
                ancienScore
            ) {

                const miseAJour =
                    await supabaseClient10
                        .from("scores")
                        .update({

                            score:
                                scoreFinal

                        })
                        .eq(
                            "id",
                            anciens[0].id
                        );


                if (miseAJour.error) {

                    console.error(
                        "❌ Mise à jour score :",
                        miseAJour.error
                    );

                    return;

                }


                statutClassement.textContent =
                    "🔥 NOUVEAU RECORD !";

            }

            else {

                statutClassement.textContent =
                    "ℹ️ Ton meilleur score reste " +
                    ancienScore;

            }

        }


        await chargerClassement10();

    }

    catch (erreur) {

        console.error(
            "❌ Erreur score :",
            erreur
        );

    }

}


/* =========================================================
   CLASSEMENT TOP 10
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

            console.error(
                "❌ Erreur classement :",
                resultat.error
            );

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


                const pseudoCellule =
                    document.createElement(
                        "td"
                    );


                pseudoCellule.textContent =
                    joueurScore.pseudo;


                const scoreCellule =
                    document.createElement(
                        "td"
                    );


                scoreCellule.textContent =
                    Number(
                        joueurScore.score
                    );


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

    }

    catch (erreur) {

        console.error(
            "❌ Erreur classement 3D Racing :",
            erreur
        );

    }

}


/* =========================================================
   COMPTER UNE PARTIE
========================================================= */

async function compterPartieJeu10() {

    if (!supabaseClient10) {

        console.warn(
            "⚠️ Supabase indisponible pour le compteur 3D Racing."
        );

        return;

    }


    try {

        const resultat =
            await supabaseClient10
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
                "❌ Erreur compteur 3D Racing :",
                resultat.error
            );

            return;

        }


        /* =================================================
           PREMIERE PARTIE
        ================================================= */

        if (!resultat.data) {

            const insertion =
                await supabaseClient10
                    .from("statistiques_jeux")
                    .insert({

                        nom_jeu:
                            NOM_JEU,

                        nombre_parties:
                            1

                    });


            if (insertion.error) {

                console.error(
                    "❌ Création compteur :",
                    insertion.error
                );

                return;

            }


            console.log(
                "🎮 Première partie 3D Racing enregistrée."
            );

            return;

        }


        /* =================================================
           INCREMENT
        ================================================= */

        const nouveauNombre =
            (
                Number(
                    resultat.data.nombre_parties
                ) || 0
            ) + 1;


        const miseAJour =
            await supabaseClient10
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

            return;

        }


        console.log(
            "🎮 Partie 3D Racing comptée :",
            nouveauNombre
        );

    }

    catch (erreur) {

        console.error(
            "❌ Erreur compteur 3D Racing :",
            erreur
        );

    }

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

        boutonPause.textContent =
            "▶️ Reprendre";


        messageRacing.textContent =
            "⏸️ PAUSE";


        messageRacing.style.display =
            "block";

    }

    else {

        boutonPause.textContent =
            "⏸️ Pause";


        messageRacing.style.display =
            "none";


        dernierTemps =
            performance.now();

    }

}


boutonPause.addEventListener(
    "click",
    basculerPause10
);


/* =========================================================
   REJOUER
========================================================= */

function rejouer10(event) {

    if (event) {

        event.preventDefault();

        event.stopPropagation();

    }


    console.log(
        "🔄 Nouvelle partie 3D Racing"
    );


    /* =====================================================
       RESET OBSTACLES
    ===================================================== */

    voituresEnnemies.forEach(
        function(ennemi) {

            scene.remove(
                ennemi
            );

        }
    );


    voituresEnnemies = [];


    /* =====================================================
       RESET
    ===================================================== */

    score = 0;

    vitesse = 0.35;

    positionVoitureX = 0;

    jeuTermine = false;

    jeuEnPause = false;


    /* =====================================================
       RESET VOITURE
    ===================================================== */

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


    /* =====================================================
       RESET AFFICHAGE
    ===================================================== */

    scoreElement.textContent =
        "0";


    vitesseElement.textContent =
        "0";


    messageRacing.style.display =
        "none";


    boutonPause.style.display =
        "inline-block";


    boutonPause.textContent =
        "⏸️ Pause";


    boutonRejouer.style.display =
        "none";


    /* =====================================================
       RECREER ENNEMIS
    ===================================================== */

    creerVoituresEnnemies();


    /* =====================================================
       COMPTER NOUVELLE PARTIE
    ===================================================== */

    compterPartieJeu10();


    dernierTemps =
        performance.now();


    console.log(
        "✅ Nouvelle partie 3D Racing lancée !"
    );

}


boutonRejouer.addEventListener(
    "click",
    rejouer10
);


/* =========================================================
   BOUCLE DU JEU
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

    augmenterScore10(
        delta * 0.015
    );


    /* =====================================================
       VITESSE
    ===================================================== */

    vitesse =
        0.35 +
        Math.min(
            1.2,
            score / 1000
        );


    vitesseElement.textContent =
        Math.floor(
            vitesse * 100
        );


    /* =====================================================
       DEPLACEMENT VOITURE
    ===================================================== */

    voiture.position.x +=
        (
            positionVoitureX -
            voiture.position.x
        ) * 0.15;


    /* =====================================================
       ROTATION LEGERE
    ===================================================== */

    voiture.rotation.z =
        (
            positionVoitureX -
            voiture.position.x
        ) * -0.05;


    /* =====================================================
       LIGNES ROUTE
    ===================================================== */

    lignesRoute.forEach(
        function(ligne) {

            ligne.position.z +=
                vitesse *
                delta /
                16;


            if (
                ligne.position.z > 10
            ) {

                ligne.position.z -=
                    210;

            }

        }
    );


    /* =====================================================
       VOITURES ENNEMIES
    ===================================================== */

    voituresEnnemies.forEach(
        function(ennemi) {

            ennemi.position.z +=
                vitesse *
                delta /
                16;


            ennemi.rotation.y =
                Math.sin(
                    tempsActuel * 0.001
                ) * 0.01;


            if (
                verifierCollision10(
                    ennemi
                )
            ) {

                gameOver10();

            }


            if (
                ennemi.position.z > 15
            ) {

                ennemi.position.z =
                    -180 -
                    Math.random() * 40;


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


    /* =====================================================
       DECOR
    ===================================================== */

    arbres.forEach(
        function(arbre) {

            arbre.position.z +=
                vitesse *
                delta /
                16;


            if (
                arbre.position.z > 15
            ) {

                arbre.position.z =
                    -220;

            }

        }
    );


    /* =====================================================
       CAMERA
    ===================================================== */

    camera.position.x +=
        (
            voiture.position.x -
            camera.position.x
        ) * 0.04;


    camera.lookAt(
        voiture.position.x,
        1,
        -25
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

function redimensionnerRacing() {

    if (
        !renderer ||
        !camera
    ) {

        return;

    }


    const largeur =
        zoneRacing.clientWidth;


    const hauteur =
        zoneRacing.clientHeight;


    if (
        hauteur <= 0
    ) {

        return;

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

async function demarrerRacing() {

    /* =====================================================
       INITIALISATION
    ===================================================== */

    initialiserRacing();


    /* =====================================================
       MESSAGE DE DEPART CACHÉ
    ===================================================== */

    if (messageRacing) {

        messageRacing.style.display =
            "none";

    }


    /* =====================================================
       CLASSEMENT
    ===================================================== */

    await chargerClassement10();


    /* =====================================================
       COMPTER LA PREMIERE PARTIE
    ===================================================== */

    compterPartieJeu10();


    /* =====================================================
       LANCER LE JEU
    ===================================================== */

    dernierTemps =
        performance.now();


    animationID =
        requestAnimationFrame(
            boucleRacing
        );


    console.log(
        "🏎️ 3D Racing démarré !"
    );

}


/* =========================================================
   LANCEMENT
========================================================= */

demarrerRacing();