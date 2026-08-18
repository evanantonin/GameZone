



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
           ELEMENTS
        ===================================================== */

        const canvas =
            document.getElementById(
                "jeuFlappy"
            );

        const ctx =
            canvas.getContext("2d");


        const scoreElement =
            document.getElementById(
                "score"
            );

        const meilleurScoreElement =
            document.getElementById(
                "meilleurScore"
            );

        const niveauElement =
            document.getElementById(
                "niveau"
            );

        const messageElement =
            document.getElementById(
                "message"
            );

        const pseudoElement =
            document.getElementById(
                "pseudoJoueur"
            );

        const boutonMobile =
            document.getElementById(
                "boutonMobile"
            );

        const boutonRejouer =
            document.getElementById(
                "boutonRejouer"
            );

        const tableauScores =
            document.getElementById(
                "tableauScores"
            );


        /* =====================================================
           PSEUDO
        ===================================================== */

        const pseudo =
            localStorage.getItem(
                "pseudoGameZone"
            );


        if (pseudo) {

            pseudoElement.textContent =
                pseudo;

        }
        else {

            pseudoElement.textContent =
                "Joueur";

            messageElement.textContent =
                "⚠️ Connecte-toi depuis l'accueil pour enregistrer ton score.";

        }


        /* =====================================================
           VARIABLES
        ===================================================== */

        let oiseau;

        let tuyaux = [];

        let score = 0;

        let niveau = 1;

        let jeuCommence = false;

        let jeuTermine = false;

        let animationID;

        let dernierTemps = 0;

        let tempsDernierTuyau = 0;


        let vitesse = 2.8;

        let gravite = 0.34;

        let puissanceSaut = -5.5;

        let espaceTuyaux = 155;

        let intervalleTuyaux = 1450;


        /* =====================================================
           MEILLEUR SCORE LOCAL
        ===================================================== */

        const cleMeilleurScore =
            "meilleurScoreFlappy_" +
            (pseudo || "joueur");


        let meilleurScore =
            Number(
                localStorage.getItem(
                    cleMeilleurScore
                )
            ) || 0;


        meilleurScoreElement.textContent =
            meilleurScore;


        /* =====================================================
           INITIALISATION
        ===================================================== */

        function initialiserJeu() {

            cancelAnimationFrame(
                animationID
            );


            oiseau = {

                x: 120,

                y: canvas.height / 2,

                largeur: 34,

                hauteur: 26,

                vitesseY: 0

            };


            tuyaux = [];

            score = 0;

            niveau = 1;

            vitesse = 2.8;

            gravite = 0.34;

            puissanceSaut = -5.5;

            espaceTuyaux = 155;

            intervalleTuyaux = 1450;

            jeuCommence = false;

            jeuTermine = false;

            dernierTemps = 0;

            tempsDernierTuyau = 0;


            scoreElement.textContent =
                "0";

            niveauElement.textContent =
                "1";


            messageElement.textContent =
                "Clique pour commencer !";


            dessiner();

        }


        /* =====================================================
           SAUT
        ===================================================== */

        function sauter() {

            if (jeuTermine) {

                return;
            }


            if (!jeuCommence) {

                jeuCommence = true;

                messageElement.textContent =
                    "";

                dernierTemps =
                    performance.now();

                animationID =
                    requestAnimationFrame(
                        boucle
                    );
            }


            oiseau.vitesseY =
                puissanceSaut;

        }


        /* =====================================================
           CONTROLES
        ===================================================== */

        canvas.addEventListener(
            "pointerdown",
            function(event) {

                event.preventDefault();

                sauter();

            },
            {
                passive: false
            }
        );


        boutonMobile.addEventListener(
            "pointerdown",
            function(event) {

                event.preventDefault();

                sauter();

            },
            {
                passive: false
            }
        );


        /* =====================================================
           TUYAUX
        ===================================================== */

        function creerTuyau() {

            const hauteurMin = 60;


            const hauteurMax =
                canvas.height -
                espaceTuyaux -
                60;


            const hauteurHaut =
                Math.floor(
                    Math.random() *
                    (hauteurMax - hauteurMin)
                ) +
                hauteurMin;


            tuyaux.push({

                x: canvas.width,

                largeur: 65,

                hauteurHaut:
                    hauteurHaut,

                espace:
                    espaceTuyaux,

                passe: false

            });

        }


        /* =====================================================
           DIFFICULTE
        ===================================================== */

        function augmenterDifficulte() {

            niveau =
                Math.floor(
                    score / 5
                ) + 1;


            niveauElement.textContent =
                niveau;


            vitesse =
                Math.min(
                    5.5,
                    2.8 +
                    (niveau - 1) *
                    0.3
                );


            espaceTuyaux =
                Math.max(
                    115,
                    155 -
                    (niveau - 1) *
                    5
                );


            intervalleTuyaux =
                Math.max(
                    950,
                    1450 -
                    (niveau - 1) *
                    45
                );

        }


        /* =====================================================
           COLLISION
        ===================================================== */

        function collision(
            oiseau,
            tuyau
        ) {

            const marge = 4;


            const gauche =
                oiseau.x +
                marge;

            const droite =
                oiseau.x +
                oiseau.largeur -
                marge;

            const haut =
                oiseau.y +
                marge;

            const bas =
                oiseau.y +
                oiseau.hauteur -
                marge;


            const tuyauGauche =
                tuyau.x;

            const tuyauDroite =
                tuyau.x +
                tuyau.largeur;


            const hautBas =
                tuyau.hauteurHaut;

            const basHaut =
                tuyau.hauteurHaut +
                tuyau.espace;


            if (
                droite > tuyauGauche &&
                gauche < tuyauDroite
            ) {

                if (
                    haut < hautBas ||
                    bas > basHaut
                ) {

                    return true;

                }

            }


            return false;

        }


        /* =====================================================
           GAME OVER
        ===================================================== */

        async function gameOver() {

            if (jeuTermine) {

                return;
            }


            jeuTermine = true;


            cancelAnimationFrame(
                animationID
            );


            /* MEILLEUR SCORE PERSONNEL */

            if (
                score >
                meilleurScore
            ) {

                meilleurScore =
                    score;


                localStorage.setItem(
                    cleMeilleurScore,
                    meilleurScore
                );


                meilleurScoreElement.textContent =
                    meilleurScore;

            }


            messageElement.textContent =
                "💥 Game Over ! Score : " +
                score;


            dessiner();


            /* ENVOI SUPABASE */

            if (pseudo) {

                await enregistrerScoreSupabase();

            }

        }


        /* =====================================================
           ENREGISTRER SCORE SUPABASE
        ===================================================== */

        async function enregistrerScoreSupabase() {

            try {

                /*
                 On récupère le score actuel
                 du joueur.
                */

                const recherche =
                    await supabaseClient
                        .from("scores_flappy")
                        .select("score")
                        .eq(
                            "pseudo",
                            pseudo
                        )
                        .maybeSingle();


                if (recherche.error) {

                    console.error(
                        "Erreur recherche score :",
                        recherche.error
                    );

                    return;

                }


                /*
                 Le joueur possède déjà
                 un score.
                */

                if (recherche.data) {

                    const ancienScore =
                        Number(
                            recherche.data.score
                        );


                    /*
                     On ne remplace
                     que si le nouveau
                     score est meilleur.
                    */

                    if (
                        score >
                        ancienScore
                    ) {

                        const modification =
                            await supabaseClient
                                .from("scores_flappy")
                                .update({

                                    score: score

                                })
                                .eq(
                                    "pseudo",
                                    pseudo
                                );


                        if (
                            modification.error
                        ) {

                            console.error(
                                "Erreur mise à jour :",
                                modification.error
                            );

                        }

                    }

                }


                /*
                 Aucun score :
                 on crée le joueur.
                */

                else {

                    const insertion =
                        await supabaseClient
                            .from("scores_flappy")
                            .insert({

                                pseudo:
                                    pseudo,

                                score:
                                    score

                            });


                    if (
                        insertion.error
                    ) {

                        console.error(
                            "Erreur insertion :",
                            insertion.error
                        );

                    }

                }


                /*
                 Actualiser le classement.
                */

                await afficherClassement();

            }

            catch (erreur) {

                console.error(
                    "Erreur Supabase :",
                    erreur
                );

            }

        }


        /* =====================================================
           CLASSEMENT SUPABASE
        ===================================================== */

        async function afficherClassement() {

            tableauScores.innerHTML = `

                <tr>

                    <td colspan="3">
                        ⏳ Chargement...
                    </td>

                </tr>

            `;


            try {

                const resultat =
                    await supabaseClient
                        .from("scores_flappy")
                        .select("pseudo,score")
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


                const scores =
                    resultat.data || [];


                if (scores.length === 0) {

                    tableauScores.innerHTML = `

                        <tr>

                            <td colspan="3">
                                Aucun score pour le moment.
                            </td>

                        </tr>

                    `;

                    return;

                }


                tableauScores.innerHTML =
                    "";


                scores.forEach(
                    function(
                        joueur,
                        index
                    ) {

                        const ligne =
                            document.createElement(
                                "tr"
                            );


                        const estMoi =
                            pseudo &&
                            joueur.pseudo ===
                            pseudo;


                        ligne.innerHTML = `

                            <td>
                                ${
                                    index === 0
                                    ? "🥇"
                                    : index === 1
                                    ? "🥈"
                                    : index === 2
                                    ? "🥉"
                                    : index + 1
                                }
                            </td>

                            <td class="${
                                estMoi
                                ? "mon-score"
                                : ""
                            }">

                                ${
                                    joueur.pseudo
                                }

                                ${
                                    estMoi
                                    ? " 👈"
                                    : ""
                                }

                            </td>

                            <td class="${
                                estMoi
                                ? "mon-score"
                                : ""
                            }">

                                ${
                                    joueur.score
                                }

                            </td>

                        `;


                        tableauScores.appendChild(
                            ligne
                        );

                    }
                );

            }

            catch (erreur) {

                console.error(
                    "Erreur chargement classement :",
                    erreur
                );


                tableauScores.innerHTML = `

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
           MISE A JOUR
        ===================================================== */

        function mettreAJour(
            deltaTime,
            maintenant
        ) {

            oiseau.vitesseY +=
                gravite *
                deltaTime;


            oiseau.y +=
                oiseau.vitesseY *
                deltaTime;


            for (
                let i =
                    tuyaux.length - 1;
                i >= 0;
                i--
            ) {

                const tuyau =
                    tuyaux[i];


                tuyau.x -=
                    vitesse *
                    deltaTime;


                /* SCORE */

                if (
                    !tuyau.passe &&
                    tuyau.x +
                    tuyau.largeur <
                    oiseau.x
                ) {

                    tuyau.passe = true;

                    score++;


                    scoreElement.textContent =
                        score;


                    augmenterDifficulte();

                }


                /* COLLISION */

                if (
                    collision(
                        oiseau,
                        tuyau
                    )
                ) {

                    gameOver();

                    return;

                }


                /* SUPPRESSION */

                if (
                    tuyau.x +
                    tuyau.largeur <
                    0
                ) {

                    tuyaux.splice(
                        i,
                        1
                    );

                }

            }


            /* NOUVEAU TUYAU */

            if (
                maintenant -
                tempsDernierTuyau >
                intervalleTuyaux
            ) {

                creerTuyau();

                tempsDernierTuyau =
                    maintenant;

            }


            /* SOL */

            if (
                oiseau.y +
                oiseau.hauteur >=
                canvas.height
            ) {

                oiseau.y =
                    canvas.height -
                    oiseau.hauteur;


                gameOver();

                return;

            }


            /* PLAFOND */

            if (
                oiseau.y < 0
            ) {

                oiseau.y = 0;

                oiseau.vitesseY = 0;

            }

        }


        /* =====================================================
           FOND
        ===================================================== */

        function dessinerFond() {

            const gradient =
                ctx.createLinearGradient(
                    0,
                    0,
                    0,
                    canvas.height
                );


            gradient.addColorStop(
                0,
                "#38bdf8"
            );

            gradient.addColorStop(
                0.55,
                "#60a5fa"
            );

            gradient.addColorStop(
                1,
                "#dbeafe"
            );


            ctx.fillStyle =
                gradient;


            ctx.fillRect(
                0,
                0,
                canvas.width,
                canvas.height
            );


            dessinerNuage(
                80,
                75,
                1
            );


            dessinerNuage(
                390,
                55,
                0.8
            );


            dessinerNuage(
                520,
                135,
                0.65
            );


            /* SOLEIL */

            const soleil =
                ctx.createRadialGradient(
                    510,
                    65,
                    5,
                    510,
                    65,
                    55
                );


            soleil.addColorStop(
                0,
                "rgba(255,255,210,0.95)"
            );


            soleil.addColorStop(
                1,
                "rgba(255,240,100,0)"
            );


            ctx.fillStyle =
                soleil;


            ctx.beginPath();


            ctx.arc(
                510,
                65,
                55,
                0,
                Math.PI * 2
            );


            ctx.fill();

        }


        /* =====================================================
           NUAGE
        ===================================================== */

        function dessinerNuage(
            x,
            y,
            taille
        ) {

            ctx.save();


            ctx.globalAlpha =
                0.7;


            ctx.fillStyle =
                "#ffffff";


            ctx.beginPath();


            ctx.arc(
                x,
                y,
                22 * taille,
                0,
                Math.PI * 2
            );


            ctx.arc(
                x + 25 * taille,
                y - 10 * taille,
                28 * taille,
                0,
                Math.PI * 2
            );


            ctx.arc(
                x + 55 * taille,
                y,
                22 * taille,
                0,
                Math.PI * 2
            );


            ctx.fill();


            ctx.restore();

        }


        /* =====================================================
           TUYAU
        ===================================================== */

        function dessinerTuyau(
            tuyau
        ) {

            const x =
                tuyau.x;


            const largeur =
                tuyau.largeur;


            const haut =
                tuyau.hauteurHaut;


            const bas =
                tuyau.hauteurHaut +
                tuyau.espace;


            const gradient =
                ctx.createLinearGradient(
                    x,
                    0,
                    x + largeur,
                    0
                );


            gradient.addColorStop(
                0,
                "#166534"
            );


            gradient.addColorStop(
                0.35,
                "#22c55e"
            );


            gradient.addColorStop(
                0.7,
                "#4ade80"
            );


            gradient.addColorStop(
                1,
                "#15803d"
            );


            ctx.fillStyle =
                gradient;


            /* TUYAU HAUT */

            ctx.fillRect(
                x,
                0,
                largeur,
                haut
            );


            ctx.fillStyle =
                "#22c55e";


            ctx.fillRect(
                x - 5,
                haut - 20,
                largeur + 10,
                20
            );


            /* TUYAU BAS */

            ctx.fillStyle =
                gradient;


            ctx.fillRect(
                x,
                bas,
                largeur,
                canvas.height - bas
            );


            ctx.fillStyle =
                "#22c55e";


            ctx.fillRect(
                x - 5,
                bas,
                largeur + 10,
                20
            );


            /* REFLET */

            ctx.fillStyle =
                "rgba(255,255,255,0.22)";


            ctx.fillRect(
                x + 9,
                0,
                8,
                haut - 20
            );


            ctx.fillRect(
                x + 9,
                bas + 20,
                8,
                canvas.height -
                bas -
                20
            );


            /* CONTOURS */

            ctx.strokeStyle =
                "#14532d";


            ctx.lineWidth = 2;


            ctx.strokeRect(
                x,
                0,
                largeur,
                haut
            );


            ctx.strokeRect(
                x,
                bas,
                largeur,
                canvas.height -
                bas
            );

        }


        /* =====================================================
           OISEAU
        ===================================================== */

        function dessinerOiseau() {

            const x =
                oiseau.x;


            const y =
                oiseau.y;


            ctx.save();


            let angle =
                oiseau.vitesseY *
                0.07;


            angle =
                Math.max(
                    -0.35,
                    Math.min(
                        0.7,
                        angle
                    )
                );


            ctx.translate(
                x +
                oiseau.largeur / 2,
                y +
                oiseau.hauteur / 2
            );


            ctx.rotate(angle);


            /* OMBRE */

            ctx.shadowColor =
                "rgba(0,0,0,0.35)";


            ctx.shadowBlur = 7;

            ctx.shadowOffsetY = 4;


            /* CORPS */

            const gradient =
                ctx.createLinearGradient(
                    -18,
                    -15,
                    18,
                    15
                );


            gradient.addColorStop(
                0,
                "#fef08a"
            );


            gradient.addColorStop(
                0.5,
                "#facc15"
            );


            gradient.addColorStop(
                1,
                "#f59e0b"
            );


            ctx.fillStyle =
                gradient;


            ctx.beginPath();


            ctx.ellipse(
                0,
                0,
                18,
                14,
                0,
                0,
                Math.PI * 2
            );


            ctx.fill();


            /* AILE */

            ctx.shadowBlur = 0;

            ctx.fillStyle =
                "#f97316";


            ctx.beginPath();


            ctx.ellipse(
                -5,
                5,
                10,
                6,
                -0.3,
                0,
                Math.PI * 2
            );


            ctx.fill();


            /* OEIL */

            ctx.fillStyle =
                "white";


            ctx.beginPath();


            ctx.arc(
                10,
                -7,
                6,
                0,
                Math.PI * 2
            );


            ctx.fill();


            ctx.fillStyle =
                "#111";


            ctx.beginPath();


            ctx.arc(
                12,
                -7,
                2.5,
                0,
                Math.PI * 2
            );


            ctx.fill();


            /* BEC */

            ctx.fillStyle =
                "#ef4444";


            ctx.beginPath();


            ctx.moveTo(
                16,
                0
            );


            ctx.lineTo(
                30,
                5
            );


            ctx.lineTo(
                16,
                9
            );


            ctx.closePath();


            ctx.fill();


            ctx.restore();

        }


        /* =====================================================
           SOL
        ===================================================== */

        function dessinerSol() {

            const hauteurSol =
                18;


            const y =
                canvas.height -
                hauteurSol;


            const gradient =
                ctx.createLinearGradient(
                    0,
                    y,
                    0,
                    canvas.height
                );


            gradient.addColorStop(
                0,
                "#84cc16"
            );


            gradient.addColorStop(
                1,
                "#365314"
            );


            ctx.fillStyle =
                gradient;


            ctx.fillRect(
                0,
                y,
                canvas.width,
                hauteurSol
            );

        }


        /* =====================================================
           DESSIN
        ===================================================== */

        function dessiner() {

            dessinerFond();


            for (
                const tuyau of tuyaux
            ) {

                dessinerTuyau(
                    tuyau
                );

            }


            dessinerSol();


            if (oiseau) {

                dessinerOiseau();

            }


            /* DEPART */

            if (
                !jeuCommence &&
                !jeuTermine
            ) {

                ctx.fillStyle =
                    "rgba(0,0,0,0.18)";


                ctx.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                ctx.fillStyle =
                    "white";


                ctx.font =
                    "bold 28px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "CLIQUE POUR JOUER",
                    canvas.width / 2,
                    canvas.height / 2
                );

            }


            /* GAME OVER */

            if (jeuTermine) {

                ctx.fillStyle =
                    "rgba(0,0,0,0.42)";


                ctx.fillRect(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );


                ctx.fillStyle =
                    "white";


                ctx.font =
                    "bold 38px Arial";


                ctx.textAlign =
                    "center";


                ctx.fillText(
                    "GAME OVER",
                    canvas.width / 2,
                    canvas.height / 2 - 10
                );


                ctx.font =
                    "bold 20px Arial";


                ctx.fillText(
                    "Score : " + score,
                    canvas.width / 2,
                    canvas.height / 2 + 28
                );

            }

        }


        /* =====================================================
           BOUCLE
        ===================================================== */

        function boucle(
            maintenant
        ) {

            if (jeuTermine) {

                return;

            }


            if (!dernierTemps) {

                dernierTemps =
                    maintenant;

            }


            let deltaTime =
                (
                    maintenant -
                    dernierTemps
                ) / 16.67;


            deltaTime =
                Math.min(
                    deltaTime,
                    2
                );


            dernierTemps =
                maintenant;


            mettreAJour(
                deltaTime,
                maintenant
            );


            dessiner();


            if (!jeuTermine) {

                animationID =
                    requestAnimationFrame(
                        boucle
                    );

            }

        }


        /* =====================================================
           REJOUER
        ===================================================== */

        boutonRejouer.addEventListener(
            "click",
            function() {

                initialiserJeu();

            }
        );


        /* =====================================================
           DEMARRAGE
        ===================================================== */

        initialiserJeu();


        /*
         Charger immédiatement
         le classement Supabase.
        */

        afficherClassement();

