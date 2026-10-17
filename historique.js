/* Page Historique : affichage, téléchargement, suppression */
(function () {
  var conteneur = document.getElementById("liste");
  var vide = document.getElementById("historique-vide");
  var btnToutSupprimer = document.getElementById("btn-tout-supprimer");
  var nombre = document.getElementById("nombre");

  function afficher() {
    var liste = QRExpress.lire();
    conteneur.innerHTML = "";
    nombre.textContent = liste.length + (liste.length > 1 ? " QR codes enregistrés" : " QR code enregistré");
    vide.hidden = liste.length > 0;
    btnToutSupprimer.hidden = liste.length === 0;

    liste.forEach(function (item) {
      var carte = document.createElement("article");
      carte.className = "carte";

      var canvas = document.createElement("canvas");
      canvas.className = "mini-qr";
      try {
        QRExpress.dessiner(canvas, item.texte, 220);
      } catch (e) {}

      var infos = document.createElement("div");
      infos.className = "infos";

      var date = document.createElement("span");
      date.className = "date";
      date.textContent = QRExpress.formaterDate(item.date);

      var contenu;
      if (QRExpress.estUrl(item.texte)) {
        contenu = document.createElement("a");
        contenu.href = /^www\./i.test(item.texte) ? "https://" + item.texte : item.texte;
        contenu.target = "_blank";
        contenu.rel = "noopener noreferrer";
      } else {
        contenu = document.createElement("p");
      }
      contenu.className = "contenu";
      contenu.textContent = item.texte; // textContent : pas d'injection HTML

      var actions = document.createElement("div");
      actions.className = "actions";

      var btnDl = document.createElement("button");
      btnDl.className = "btn btn-secondaire petit";
      btnDl.textContent = "Télécharger";
      btnDl.addEventListener("click", function () {
        var grand = document.createElement("canvas");
        QRExpress.dessiner(grand, item.texte, 600);
        QRExpress.telecharger(grand, "qr-express-" + item.id);
      });

      var btnRetrouver = document.createElement("a");
      btnRetrouver.className = "btn btn-secondaire petit";
      btnRetrouver.textContent = "Retrouver";
      btnRetrouver.href = "index.html?texte=" + encodeURIComponent(item.texte);

      var btnSuppr = document.createElement("button");
      btnSuppr.className = "btn btn-danger petit";
      btnSuppr.textContent = "Supprimer";
      btnSuppr.addEventListener("click", function () {
        var reste = QRExpress.lire().filter(function (x) { return x.id !== item.id; });
        QRExpress.ecrire(reste);
        afficher();
      });

      actions.appendChild(btnDl);
      actions.appendChild(btnRetrouver);
      actions.appendChild(btnSuppr);
      infos.appendChild(date);
      infos.appendChild(contenu);
      infos.appendChild(actions);
      carte.appendChild(canvas);
      carte.appendChild(infos);
      conteneur.appendChild(carte);
    });
  }

  btnToutSupprimer.addEventListener("click", function () {
    if (confirm("Supprimer tout l'historique ? Cette action est définitive.")) {
      QRExpress.ecrire([]);
      afficher();
    }
  });

  afficher();
})();
