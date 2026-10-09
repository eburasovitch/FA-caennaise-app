// Visite 3D de la salle : scan Gaussian splat affiché avec Spark (three.js).
// Tout est piloté par salle/config.json (fichier du scan, caméra, matériel cliquable).
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

const $ = (id) => document.getElementById(id);
const stage = $("stage");
const canvas = $("scene");
const overlay = $("overlay");
const status = $("status");
const startBtn = $("start");
const hotspotLayer = $("hotspots");
const card = $("card");
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

const config = await fetch("salle/config.json").then((r) => r.json());

// Liste du matériel en texte : toujours visible, même sans 3D.
$("list").innerHTML = config.materiel
  .map((m) => `<li><h3>${m.nom}</h3><p>${m.detail}</p></li>`)
  .join("");
$("weight").textContent = `Environ ${config.scan.taille} à télécharger`;

function webglAvailable() {
  try {
    return !!document.createElement("canvas").getContext("webgl2");
  } catch {
    return false;
  }
}

if (!webglAvailable()) {
  status.textContent = "Votre navigateur ne peut pas afficher la 3D. Le matériel est listé ci-dessous.";
  startBtn.hidden = true;
} else {
  startBtn.addEventListener("click", start, { once: true });
}

function showCard(item) {
  $("card-title").textContent = item.nom;
  $("card-text").textContent = item.detail;
  card.hidden = false;
  for (const b of hotspotLayer.children) b.setAttribute("aria-pressed", String(b.dataset.id === item.id));
}
$("card-close").addEventListener("click", () => {
  card.hidden = true;
  for (const b of hotspotLayer.children) b.setAttribute("aria-pressed", "false");
});

async function start() {
  startBtn.disabled = true;
  status.textContent = "Chargement du scan… 0 %";

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0b0b0b");
  const camera = new THREE.PerspectiveCamera(55, 1, 0.05, 200);
  camera.position.fromArray(config.camera.position);
  // Écran en portrait (téléphone) : on recule la caméra pour voir toute la salle.
  if (stage.clientWidth < stage.clientHeight) {
    const target = new THREE.Vector3().fromArray(config.camera.cible);
    camera.position.sub(target).multiplyScalar(1.7).add(target);
  }

  scene.add(new SparkRenderer({ renderer }));

  const controls = new OrbitControls(camera, canvas);
  controls.target.fromArray(config.camera.cible);
  controls.enableDamping = true;
  controls.maxPolarAngle = Math.PI * 0.49; // ne pas passer sous le sol
  controls.minDistance = 0.8;
  controls.maxDistance = 14;
  controls.autoRotate = !reduceMotion;
  controls.autoRotateSpeed = 0.4;
  // La rotation automatique s'arrête dès que le visiteur interagit, pour que les points restent cliquables.
  const stopRotate = () => (controls.autoRotate = false);
  controls.addEventListener("start", stopRotate);
  stage.addEventListener("pointerenter", stopRotate);
  stage.addEventListener("focusin", stopRotate);
  controls.update();

  const splat = new SplatMesh({
    url: config.scan.url,
    onProgress: (e) => {
      if (e.lengthComputable) status.textContent = `Chargement du scan… ${Math.round((e.loaded / e.total) * 100)} %`;
    },
  });
  splat.rotation.fromArray(config.scan.rotation);
  splat.position.fromArray(config.scan.position);
  splat.scale.setScalar(config.scan.echelle);
  scene.add(splat);

  try {
    await splat.initialized;
  } catch (err) {
    console.error(err);
    status.textContent = "Le scan n’a pas pu être chargé. Le matériel est listé ci-dessous.";
    return;
  }
  overlay.hidden = true;

  // Points cliquables : un bouton HTML par poste, repositionné à chaque image.
  const anchors = config.materiel.map((item) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "hotspot";
    b.dataset.id = item.id;
    b.setAttribute("aria-label", item.nom);
    b.setAttribute("aria-pressed", "false");
    b.innerHTML = `<span>${item.nom}</span>`;
    b.addEventListener("click", () => showCard(item));
    hotspotLayer.append(b);
    return { el: b, pos: new THREE.Vector3().fromArray(item.position) };
  });

  const v = new THREE.Vector3();
  function placeHotspots(w, h) {
    for (const a of anchors) {
      v.copy(a.pos).project(camera);
      const visible = v.z < 1 && Math.abs(v.x) < 1.05 && Math.abs(v.y) < 1.05;
      const t = `translate(${Math.round(((v.x + 1) / 2) * w)}px, ${Math.round(((1 - v.y) / 2) * h)}px)`;
      a.el.style.visibility = visible ? "visible" : "hidden";
      if (a.el.style.transform !== t) a.el.style.transform = t;
    }
  }

  function resize() {
    const { clientWidth: w, clientHeight: h } = stage;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  new ResizeObserver(resize).observe(stage);
  resize();

  renderer.setAnimationLoop(() => {
    controls.update();
    renderer.render(scene, camera);
    placeHotspots(stage.clientWidth, stage.clientHeight);
  });
}
