


        /* =====================================================
           CONFIGURATION SUPABASE
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
           ELEMENTS HTML
        ===================================================== */

        const authContainer =
            document.getElementById(
                "authContainer"
            );

        const contenuConnecte =
            document.getElementById(
                "contenuConnecte"
            );

        const pseudoAffiche =
            document.getElementById(
                "pseudoAffiche"
            );

        const pseudoJoueur =
            document.getElementById(
                "pseudoJoueur"
            );

        const messageAuth =
            document.getElementById(
                "messageAuth"
            );


        /* =====================================================
           AFFICHER INSCRIPTION
        ===================================================== */

        function afficherInscription() {

            document.getElementById(
                "formInscription"
            ).style.display = "block";

            document.getElementById(
                "formConnexion"
            ).style.display = "none";

            messageAuth.textContent = "";

        }


        /* =====================================================
           AFFICHER CONNEXION
        ===================================================== */

        function afficherConnexion() {

            document.getElementById(
                "formInscription"
            ).style.display = "none";

            document.getElementById(
                "formConnexion"
            ).style.display = "block";

            messageAuth.textContent = "";

        }


        /* =====================================================
           CREER UN COMPTE
        ===================================================== */

        async function creerCompte() {

            const pseudo =
                document
                    .getElementById(
                        "pseudoInscription"
                    )
                    .value
                    .trim();

            const email =
                document
                    .getElementById(
                        "emailInscription"
                    )
                    .value
                    .trim();

            const motDePasse =
                document
                    .getElementById(
                        "motDePasseInscription"
                    )
                    .value;

            const confirmation =
                document
                    .getElementById(
                        "confirmationMotDePasse"
                    )
                    .value;


            /* =========================
               VERIFICATIONS
            ========================= */

            if (!pseudo) {

                messageAuth.textContent =
                    "⚠️ Entre un pseudo.";

                return;

            }


            if (pseudo.length < 3) {

                messageAuth.textContent =
                    "⚠️ Le pseudo doit contenir au moins 3 caractères.";

                return;

            }


            if (!email) {

                messageAuth.textContent =
                    "⚠️ Entre ton adresse email.";

                return;

            }


            if (motDePasse.length < 6) {

                messageAuth.textContent =
                    "⚠️ Le mot de passe doit contenir au moins 6 caractères.";

                return;

            }


            if (motDePasse !== confirmation) {

                messageAuth.textContent =
                    "⚠️ Les deux mots de passe ne correspondent pas.";

                return;

            }


            const bouton =
                document.getElementById(
                    "boutonInscription"
                );


            bouton.disabled = true;

            bouton.textContent =
                "⏳ Création...";


            messageAuth.textContent =
                "";


            try {

                /*
                 IMPORTANT :

                 Le pseudo est envoyé dans
                 user_metadata.

                 Comme la confirmation email
                 est activée, Supabase ne crée
                 pas immédiatement une session.

                 Le profil sera créé lors
                 de la première connexion.
                */

                const resultat =
                    await supabaseClient.auth.signUp({

                        email: email,

                        password: motDePasse,

                        options: {

                            data: {

                                pseudo: pseudo

                            },

                            emailRedirectTo:
                                "https://evanantonin.github.io/GameZone/index.html"

                        }

                    });


                if (resultat.error) {

                    throw resultat.error;

                }


                messageAuth.textContent =
                    "📧 Compte créé ! Vérifie ton adresse email pour confirmer ton compte.";

                messageAuth.style.color =
                    "#008000";


                document
                    .getElementById(
                        "pseudoInscription"
                    )
                    .value = "";

                document
                    .getElementById(
                        "emailInscription"
                    )
                    .value = "";

                document
                    .getElementById(
                        "motDePasseInscription"
                    )
                    .value = "";

                document
                    .getElementById(
                        "confirmationMotDePasse"
                    )
                    .value = "";


            }

            catch (erreur) {

                console.error(
                    "Erreur inscription :",
                    erreur
                );


                messageAuth.textContent =
                    "❌ " + traduireErreur(erreur.message);

                messageAuth.style.color =
                    "#dc3545";

            }

            finally {

                bouton.disabled = false;

                bouton.textContent =
                    "Créer mon compte";

            }

        }


        /* =====================================================
           SE CONNECTER
        ===================================================== */

        async function seConnecter() {

            const email =
                document
                    .getElementById(
                        "emailConnexion"
                    )
                    .value
                    .trim();

            const motDePasse =
                document
                    .getElementById(
                        "motDePasseConnexion"
                    )
                    .value;


            if (!email) {

                messageAuth.textContent =
                    "⚠️ Entre ton adresse email.";

                return;

            }


            if (!motDePasse) {

                messageAuth.textContent =
                    "⚠️ Entre ton mot de passe.";

                return;

            }


            const bouton =
                document.getElementById(
                    "boutonConnexion"
                );


            bouton.disabled = true;

            bouton.textContent =
                "⏳ Connexion...";


            messageAuth.textContent =
                "";


            try {

                const resultat =
                    await supabaseClient.auth.signInWithPassword({

                        email: email,

                        password: motDePasse

                    });


                if (resultat.error) {

                    throw resultat.error;

                }


                messageAuth.textContent =
                    "✅ Connexion réussie !";

                messageAuth.style.color =
                    "#008000";


                await afficherUtilisateur(
                    resultat.data.user
                );

            }

            catch (erreur) {

                console.error(
                    "Erreur connexion :",
                    erreur
                );


                messageAuth.textContent =
                    "❌ " + traduireErreur(erreur.message);

                messageAuth.style.color =
                    "#dc3545";

            }

            finally {

                bouton.disabled = false;

                bouton.textContent =
                    "Se connecter";

            }

        }


        /* =====================================================
           CREER / RECUPERER LE PROFIL
        ===================================================== */

        async function recupererProfil(user) {

            if (!user) {

                return null;

            }


            /*
             Chercher le profil.
            */

            const recherche =
                await supabaseClient
                    .from("profils")
                    .select("id,pseudo")
                    .eq("id", user.id)
                    .maybeSingle();


            if (recherche.error) {

                console.error(
                    "Erreur recherche profil :",
                    recherche.error
                );

                return null;

            }


            /*
             Profil déjà existant.
            */

            if (recherche.data) {

                return recherche.data;

            }


            /*
             Aucun profil :
             on récupère le pseudo
             enregistré pendant l'inscription.
            */

            let pseudo =
                user.user_metadata?.pseudo;


            if (!pseudo) {

                pseudo =
                    user.email
                        ? user.email.split("@")[0]
                        : "Joueur";

            }


            pseudo =
                pseudo
                    .trim()
                    .substring(0, 20);


            /*
             Créer le profil.
            */

            const insertion =
                await supabaseClient
                    .from("profils")
                    .insert({

                        id: user.id,

                        pseudo: pseudo

                    })
                    .select("id,pseudo")
                    .single();


            if (insertion.error) {

                /*
                 Si le pseudo est déjà utilisé,
                 on affiche une erreur.
                */

                console.error(
                    "Erreur création profil :",
                    insertion.error
                );

                return null;

            }


            return insertion.data;

        }


        /* =====================================================
           AFFICHER L'UTILISATEUR CONNECTE
        ===================================================== */

        async function afficherUtilisateur(user) {

            if (!user) {

                return;

            }


            /*
             Récupérer ou créer son profil.
            */

            const profil =
                await recupererProfil(user);


            if (!profil) {

                messageAuth.textContent =
                    "❌ Impossible de récupérer ton profil.";

                messageAuth.style.color =
                    "#dc3545";

                return;

            }


            /*
             Afficher le pseudo.
            */

            pseudoJoueur.textContent =
                profil.pseudo;


            pseudoAffiche.style.display =
                "block";


            /*
             Sauvegarder aussi le pseudo
             pour que tes jeux actuels
             puissent encore l'utiliser.
            */

            localStorage.setItem(
                "pseudoGameZone",
                profil.pseudo
            );


            /*
             Cacher le formulaire.
            */

            authContainer.style.display =
                "none";


            /*
             Afficher le contenu.
            */

            contenuConnecte.style.display =
                "block";

        }


        /* =====================================================
           DECONNEXION
        ===================================================== */

        async function seDeconnecter() {

            const resultat =
                await supabaseClient.auth.signOut();


            if (resultat.error) {

                console.error(
                    "Erreur déconnexion :",
                    resultat.error
                );

                return;

            }


            /*
             Supprimer le pseudo local.
            */

            localStorage.removeItem(
                "pseudoGameZone"
            );


            /*
             Revenir à l'inscription.
            */

            contenuConnecte.style.display =
                "none";

            authContainer.style.display =
                "block";

            pseudoAffiche.style.display =
                "none";

            afficherConnexion();

            messageAuth.textContent =
                "👋 Tu es déconnecté.";

            messageAuth.style.color =
                "#222";

        }


        /* =====================================================
           TRADUCTION DES ERREURS SUPABASE
        ===================================================== */

        function traduireErreur(message) {

            if (!message) {

                return "Une erreur est survenue.";

            }


            const texte =
                message.toLowerCase();


            if (
                texte.includes(
                    "invalid login credentials"
                )
            ) {

                return "Email ou mot de passe incorrect.";

            }


            if (
                texte.includes(
                    "email not confirmed"
                )
            ) {

                return "📧 Ton email n'est pas encore confirmé. Vérifie ta boîte mail.";

            }


            if (
                texte.includes(
                    "user already registered"
                )
            ) {

                return "⚠️ Cette adresse email possède déjà un compte.";

            }


            if (
                texte.includes(
                    "password should be at least"
                )
            ) {

                return "⚠️ Le mot de passe est trop court.";

            }


            if (
                texte.includes(
                    "invalid email"
                )
            ) {

                return "⚠️ L'adresse email n'est pas valide.";

            }


            if (
                texte.includes(
                    "rate limit"
                )
            ) {

                return "⚠️ Trop de tentatives. Réessaie plus tard.";

            }


            return message;

        }


        /* =====================================================
           VERIFIER LA SESSION AU CHARGEMENT
        ===================================================== */

        async function verifierSession() {

            try {

                const resultat =
                    await supabaseClient.auth.getUser();


                if (
                    resultat.error ||
                    !resultat.data.user
                ) {

                    /*
                     Aucun utilisateur connecté.
                    */

                    authContainer.style.display =
                        "block";

                    contenuConnecte.style.display =
                        "none";

                    return;

                }


                /*
                 Utilisateur connecté.
                */

                await afficherUtilisateur(
                    resultat.data.user
                );

            }

            catch (erreur) {

                console.error(
                    "Erreur vérification session :",
                    erreur
                );

            }

        }


        /* =====================================================
           ECOUTER LES CHANGEMENTS D'AUTHENTIFICATION
        ===================================================== */

        supabaseClient.auth.onAuthStateChange(
            async function(event, session) {

                console.log(
                    "Auth event :",
                    event
                );


                if (
                    session &&
                    session.user
                ) {

                    await afficherUtilisateur(
                        session.user
                    );

                }

                else {

                    contenuConnecte.style.display =
                        "none";

                    authContainer.style.display =
                        "block";

                }

            }
        );


        /* =====================================================
           DEMARRAGE
        ===================================================== */

        verifierSession();


