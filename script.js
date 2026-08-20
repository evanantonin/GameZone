
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
    document.getElementById("authContainer");

const contenuConnecte =
    document.getElementById("contenuConnecte");

const messageAuth =
    document.getElementById("messageAuth");


/* =====================================================
   AFFICHER INSCRIPTION
===================================================== */

function afficherInscription() {

    const inscription =
        document.getElementById("formInscription");

    const connexion =
        document.getElementById("formConnexion");

    if (inscription) {
        inscription.style.display = "block";
    }

    if (connexion) {
        connexion.style.display = "none";
    }

    if (messageAuth) {
        messageAuth.textContent = "";
    }

}


/* =====================================================
   AFFICHER CONNEXION
===================================================== */

function afficherConnexion() {

    const inscription =
        document.getElementById("formInscription");

    const connexion =
        document.getElementById("formConnexion");

    if (inscription) {
        inscription.style.display = "none";
    }

    if (connexion) {
        connexion.style.display = "block";
    }

    if (messageAuth) {
        messageAuth.textContent = "";
    }

}


/* =====================================================
   CREER UN COMPTE
===================================================== */

async function creerCompte() {

    const pseudoElement =
        document.getElementById("pseudoInscription");

    const emailElement =
        document.getElementById("emailInscription");

    const motDePasseElement =
        document.getElementById("motDePasseInscription");

    const confirmationElement =
        document.getElementById("confirmationMotDePasse");


    if (
        !pseudoElement ||
        !emailElement ||
        !motDePasseElement ||
        !confirmationElement
    ) {

        return;

    }


    const pseudo =
        pseudoElement.value.trim();

    const email =
        emailElement.value.trim();

    const motDePasse =
        motDePasseElement.value;

    const confirmation =
        confirmationElement.value;


    /* =================================================
       VERIFICATIONS
    ================================================= */

    if (!pseudo) {

        afficherMessage(
            "⚠️ Entre un pseudo.",
            "#ffaa00"
        );

        return;

    }


    if (pseudo.length < 3) {

        afficherMessage(
            "⚠️ Le pseudo doit contenir au moins 3 caractères.",
            "#ffaa00"
        );

        return;

    }


    if (!email) {

        afficherMessage(
            "⚠️ Entre ton adresse email.",
            "#ffaa00"
        );

        return;

    }


    if (motDePasse.length < 6) {

        afficherMessage(
            "⚠️ Le mot de passe doit contenir au moins 6 caractères.",
            "#ffaa00"
        );

        return;

    }


    if (motDePasse !== confirmation) {

        afficherMessage(
            "⚠️ Les deux mots de passe ne correspondent pas.",
            "#ffaa00"
        );

        return;

    }


    const bouton =
        document.getElementById("boutonInscription");


    if (bouton) {

        bouton.disabled = true;

        bouton.textContent =
            "⏳ Création...";

    }


    afficherMessage("", "");


    try {

        const resultat =
            await supabaseClient.auth.signUp({

                email: email,

                password: motDePasse,

                options: {

                    data: {

                        pseudo: pseudo

                    },

                    emailRedirectTo:
                        window.location.origin +
                        window.location.pathname

                }

            });


        if (resultat.error) {

            throw resultat.error;

        }


        afficherMessage(
            "📧 Compte créé ! Vérifie ton adresse email pour confirmer ton compte.",
            "#00ff88"
        );


        pseudoElement.value = "";
        emailElement.value = "";
        motDePasseElement.value = "";
        confirmationElement.value = "";


    }

    catch (erreur) {

        console.error(
            "Erreur inscription :",
            erreur
        );


        afficherMessage(
            "❌ " + traduireErreur(erreur.message),
            "#ff4444"
        );

    }

    finally {

        if (bouton) {

            bouton.disabled = false;

            bouton.textContent =
                "Créer mon compte";

        }

    }

}


/* =====================================================
   SE CONNECTER
===================================================== */

async function seConnecter() {

    const emailElement =
        document.getElementById("emailConnexion");

    const motDePasseElement =
        document.getElementById("motDePasseConnexion");


    if (
        !emailElement ||
        !motDePasseElement
    ) {

        return;

    }


    const email =
        emailElement.value.trim();

    const motDePasse =
        motDePasseElement.value;


    if (!email) {

        afficherMessage(
            "⚠️ Entre ton adresse email.",
            "#ffaa00"
        );

        return;

    }


    if (!motDePasse) {

        afficherMessage(
            "⚠️ Entre ton mot de passe.",
            "#ffaa00"
        );

        return;

    }


    const bouton =
        document.getElementById("boutonConnexion");


    if (bouton) {

        bouton.disabled = true;

        bouton.textContent =
            "⏳ Connexion...";

    }


    afficherMessage("", "");


    try {

        const resultat =
            await supabaseClient.auth.signInWithPassword({

                email: email,

                password: motDePasse

            });


        if (resultat.error) {

            throw resultat.error;

        }


        afficherMessage(
            "✅ Connexion réussie !",
            "#00ff88"
        );


        await afficherUtilisateur(
            resultat.data.user
        );

    }

    catch (erreur) {

        console.error(
            "Erreur connexion :",
            erreur
        );


        afficherMessage(
            "❌ " + traduireErreur(erreur.message),
            "#ff4444"
        );

    }

    finally {

        if (bouton) {

            bouton.disabled = false;

            bouton.textContent =
                "Se connecter";

        }

    }

}


/* =====================================================
   AFFICHER UN MESSAGE
===================================================== */

function afficherMessage(
    texte,
    couleur
) {

    if (!messageAuth) {
        return;
    }

    messageAuth.textContent =
        texte;

    if (couleur) {

        messageAuth.style.color =
            couleur;

    }

}


/* =====================================================
   RECUPERER / CREER LE PROFIL
===================================================== */

async function recupererProfil(user) {

    if (!user) {

        return null;

    }


    /* =================================================
       CHERCHER LE PROFIL
    ================================================= */

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


    /* =================================================
       PROFIL EXISTANT
    ================================================= */

    if (recherche.data) {

        return recherche.data;

    }


    /* =================================================
       RECUPERER LE PSEUDO
    ================================================= */

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


    /* =================================================
       CREER LE PROFIL
    ================================================= */

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

        console.error(
            "Erreur création profil :",
            insertion.error
        );

        return null;

    }


    return insertion.data;

}


/* =====================================================
   AFFICHER L'UTILISATEUR CONNECTE SUR L'ACCUEIL
===================================================== */

async function afficherUtilisateur(user) {

    if (!user) {

        return;

    }


    /*
       Récupérer ou créer le profil.
    */

    const profil =
        await recupererProfil(user);


    if (!profil) {

        afficherMessage(
            "❌ Impossible de récupérer ton profil.",
            "#ff4444"
        );

        return;

    }


    /*
       Sauvegarder le pseudo.
       Les jeux existants peuvent continuer
       à utiliser cette valeur.
    */

    localStorage.setItem(
        "pseudoGameZone",
        profil.pseudo
    );


    /*
       L'ancien bloc pseudoAffiche
       n'existe plus sur l'accueil.

       On vérifie donc uniquement
       si les éléments existent encore.
    */

    const pseudoJoueur =
        document.getElementById("pseudoJoueur");

    const pseudoAffiche =
        document.getElementById("pseudoAffiche");


    if (pseudoJoueur) {

        pseudoJoueur.textContent =
            profil.pseudo;

    }


    if (pseudoAffiche) {

        pseudoAffiche.style.display =
            "block";

    }


    /*
       Cacher le formulaire de connexion
       sur l'accueil.
    */

    if (authContainer) {

        authContainer.style.display =
            "none";

    }


    /*
       Afficher le contenu réservé
       aux utilisateurs connectés.
    */

    if (contenuConnecte) {

        contenuConnecte.style.display =
            "block";

    }

}


/* =====================================================
   DECONNEXION
===================================================== */

async function seDeconnecter() {

    try {

        const resultat =
            await supabaseClient.auth.signOut();


        if (resultat.error) {

            throw resultat.error;

        }


        /*
           Supprimer le pseudo local.
        */

        localStorage.removeItem(
            "pseudoGameZone"
        );


        /*
           Retourner à l'accueil.
        */

        if (contenuConnecte) {

            contenuConnecte.style.display =
                "none";

        }


        if (authContainer) {

            authContainer.style.display =
                "block";

        }


        const pseudoAffiche =
            document.getElementById(
                "pseudoAffiche"
            );


        if (pseudoAffiche) {

            pseudoAffiche.style.display =
                "none";

        }


        afficherConnexion();


        afficherMessage(
            "👋 Tu es déconnecté.",
            "#ffffff"
        );

    }

    catch (erreur) {

        console.error(
            "Erreur déconnexion :",
            erreur
        );

        afficherMessage(
            "❌ Impossible de se déconnecter.",
            "#ff4444"
        );

    }

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


    if (
        texte.includes(
            "duplicate key"
        )
    ) {

        return "⚠️ Ce pseudo est déjà utilisé.";

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

            if (authContainer) {

                authContainer.style.display =
                    "block";

            }


            if (contenuConnecte) {

                contenuConnecte.style.display =
                    "none";

            }

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

            if (contenuConnecte) {

                contenuConnecte.style.display =
                    "none";

            }


            if (authContainer) {

                authContainer.style.display =
                    "block";

            }

        }

    }
);


/* =====================================================
   DEMARRAGE
===================================================== */

verifierSession();


/* =====================================================
   COMPTER UNE PARTIE
===================================================== */

async function compterPartie(nomJeu) {

    if (!nomJeu) {
        return;
    }

    try {

        const resultat =
            await supabaseClient.rpc(
                "incrementer_parties",
                {
                    nom_du_jeu: nomJeu
                }
            );

        if (resultat.error) {

            console.error(
                "Erreur compteur de parties :",
                resultat.error
            );

            return;
        }

        console.log(
            "🎮 Partie comptabilisée :",
            nomJeu
        );

    }

    catch (erreur) {

        console.error(
            "Erreur statistiques :",
            erreur
        );

    }
}