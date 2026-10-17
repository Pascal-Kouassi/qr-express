/* Fonctions partagées entre les deux pages */
var QRExpress = (function () {
  var CLE = "qrexpress_historique";
  var MAX = 30; // nombre maximum d'entrées conservées

  function lire() {
    try {
      return JSON.parse(localStorage.getItem(CLE)) || [];
    } catch (e) {
      return [];
    }
  }

  function ecrire(liste) {
    try {
      localStorage.setItem(CLE, JSON.stringify(liste.slice(0, MAX)));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Dessine le QR code dans un <canvas> (taille en pixels, marge de 4 modules)
  function dessiner(canvas, texte, taille) {
    var qr = QRCodeLib.create(texte);
    var marge = 4;
    var total = qr.count + marge * 2;
    var module = Math.max(1, Math.floor(taille / total));
    var px = module * total;
    canvas.width = px;
    canvas.height = px;
    var ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, px, px);
    ctx.fillStyle = "#0a2540";
    for (var r = 0; r < qr.count; r++) {
      for (var c = 0; c < qr.count; c++) {
        if (qr.isDark(r, c)) {
          ctx.fillRect((c + marge) * module, (r + marge) * module, module, module);
        }
      }
    }
  }

  function telecharger(canvas, nom) {
    var lien = document.createElement("a");
    lien.download = (nom || "qr-express") + ".png";
    lien.href = canvas.toDataURL("image/png");
    document.body.appendChild(lien);
    lien.click();
    document.body.removeChild(lien);
  }

  function estUrl(texte) {
    return /^(https?:\/\/|www\.)\S+$/i.test(texte.trim());
  }

  function formaterDate(ts) {
    return new Date(ts).toLocaleString("fr-FR", {
      day: "2-digit", month: "short", year: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  }

  return { lire: lire, ecrire: ecrire, dessiner: dessiner, telecharger: telecharger, estUrl: estUrl, formaterDate: formaterDate, MAX: MAX };
})();
