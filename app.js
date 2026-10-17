/* Page d'accueil : génération, téléchargement, effacement */
(function () {
  var champ = document.getElementById("texte");
  var compteur = document.getElementById("compteur");
  var btnGenerer = document.getElementById("btn-generer");
  var btnEffacer = document.getElementById("btn-effacer");
  var btnTelecharger = document.getElementById("btn-telecharger");
  var message = document.getElementById("message");
  var apercu = document.getElementById("apercu");
  var zoneResultat = document.getElementById("resultat");
  var vide = document.getElementById("apercu-vide");
  var canvas = document.getElementById("qr-canvas");
  var avertissement = document.getElementById("avertissement");
  var MAX_CARACTERES = 1000;

  function afficherMessage(texte, type) {
    message.textContent = texte;
    message.className = "message " + (type || "");
    message.hidden = !texte;
  }

  function reinitialiserApercu() {
    zoneResultat.hidden = true;
    vide.hidden = false;
    avertissement.hidden = true;
  }

  function generer() {
    var texte = champ.value.trim();

    if (!texte) {
      afficherMessage("Veuillez saisir un texte ou un lien avant de générer le QR code.", "erreur");
      reinitialiserApercu();
      champ.focus();
      return;
    }
    if (texte.length > MAX_CARACTERES) {
      afficherMessage("Le texte est trop long (maximum " + MAX_CARACTERES + " caractères).", "erreur");
      return;
    }
    // Un lien sans http(s) est complété pour que le scan ouvre bien la page
    if (/^www\./i.test(texte)) {
      texte = "https://" + texte;
      champ.value = texte;
    }

    try {
      QRExpress.dessiner(canvas, texte, 320);
    } catch (e) {
      afficherMessage("Impossible de générer ce QR code. Essayez avec un texte plus court.", "erreur");
      reinitialiserApercu();
      return;
    }

    vide.hidden = true;
    zoneResultat.hidden = false;
    avertissement.hidden = !QRExpress.estUrl(texte);
    afficherMessage("QR code généré avec succès ✔", "succes");

    // Sauvegarde dans l'historique (sans doublon consécutif)
    var liste = QRExpress.lire();
    if (!liste.length || liste[0].texte !== texte) {
      liste.unshift({ id: Date.now(), texte: texte, date: Date.now() });
      if (!QRExpress.ecrire(liste)) {
        afficherMessage("QR code généré, mais l'historique n'a pas pu être enregistré.", "erreur");
      }
    }
  }

  function effacer() {
    champ.value = "";
    compteur.textContent = "0 / " + MAX_CARACTERES;
    afficherMessage("");
    reinitialiserApercu();
    champ.focus();
  }

  champ.addEventListener("input", function () {
    compteur.textContent = champ.value.length + " / " + MAX_CARACTERES;
  });
  champ.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) generer();
  });
  btnGenerer.addEventListener("click", generer);
  btnEffacer.addEventListener("click", effacer);
  btnTelecharger.addEventListener("click", function () {
    QRExpress.telecharger(canvas, "qr-express-" + Date.now());
  });

  // Si on arrive depuis l'historique avec ?texte=...
  var params = new URLSearchParams(location.search);
  if (params.get("texte")) {
    champ.value = params.get("texte");
    compteur.textContent = champ.value.length + " / " + MAX_CARACTERES;
    try {
      QRExpress.dessiner(canvas, champ.value, 320);
      vide.hidden = true;
      zoneResultat.hidden = false;
      avertissement.hidden = !QRExpress.estUrl(champ.value);
    } catch (e) {}
  }
})();
