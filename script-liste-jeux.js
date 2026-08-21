/* =========================================================
   GAMEZONE — MODE VISITEUR
========================================================= */

/*
   Aucun blocage ici.

   Un visiteur peut accéder à la liste des jeux
   même s'il n'a pas de pseudo ou de compte.
*/


/* =========================================================
   PSEUDO
========================================================= */

const pseudo =
    localStorage.getItem("pseudoGameZone");


/* =========================================================
   AFFICHER LE MODE ACTUEL
========================================================= */

if (pseudo) {

    console.log(
        "👤 Joueur connecté : " + pseudo
    );

} else {

    console.log(
        "👀 Mode visiteur"
    );

}