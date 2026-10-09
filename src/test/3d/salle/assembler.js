// Assemblage manuel de deux scans : le premier reste fixe, le second se règle (rotation autour de la verticale, position).
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { SparkRenderer, SplatMesh } from "@sparkjsdev/spark";

const $ = (id) => document.getElementById(id);
const SCANS = { bureau: "salle/chambre.spz.b64.txt", lit: "salle/lit.spz.b64.txt" };
// Sols mesurés dans les scans : -0.905 (bureau) et -0.945 (lit), d'où 4 cm de hauteur.
const pose = { r: 180, x: -0.1, z: 1.1, y: 0.04 };
const LIMITS = { r: [-180, 180], x: [-4, 4], z: [-4, 4], y: [-0.5, 0.5] };
const meshes = {};

function fmt() {
  return { r: `${pose.r}°`, x: `${pose.x.toFixed(2)} m`, z: `${pose.z.toFixed(2)} m`, y: `${(pose.y * 100).toFixed(1)} cm` };
}
function apply() {
  const f = fmt();
  for (const k of Object.keys(pose)) { $(k).value = pose[k]; $(`${k}-o`).textContent = f[k]; }
  $("vals").textContent = `Rotation ${f.r} · gauche/droite ${f.x} · avant/arrière ${f.z} · hauteur ${f.y}`;
  if (meshes.lit) {
    meshes.lit.rotation.set(0, THREE.MathUtils.degToRad(pose.r), 0);
    meshes.lit.position.set(pose.x, pose.y, pose.z);
  }
}
const clamp = (k, v) => Math.min(LIMITS[k][1], Math.max(LIMITS[k][0], v));
for (const k of Object.keys(pose)) $(k).addEventListener("input", (e) => { pose[k] = Number(e.target.value); apply(); });
document.querySelectorAll(".nudge button").forEach((b) => b.addEventListener("click", () => {
  const k = b.dataset.k; let v = pose[k] + Number(b.dataset.d);
  if (k === "r") v = ((v + 540) % 360) - 180;
  pose[k] = Math.round(clamp(k, v) * 1000) / 1000; apply();
}));
$("copy").addEventListener("click", async () => {
  try { await navigator.clipboard.writeText($("vals").textContent); $("copy").textContent = "Réglage copié"; }
  catch { getSelection().selectAllChildren($("vals")); $("copy").textContent = "Texte sélectionné, copie-le"; }
  setTimeout(() => ($("copy").textContent = "Copier le réglage"), 2500);
});
apply();

let view = () => {};
$("start").addEventListener("click", async () => {
  $("start").hidden = true;
  const canvas = $("scene"), stage = $("stage");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#171717");
  const camera = new THREE.PerspectiveCamera(55, 1, 0.05, 200);
  scene.add(new SparkRenderer({ renderer }));
  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;
  controls.maxDistance = 14;
  view = (top) => {
    controls.target.set(-0.3, -0.9, 0.8);
    camera.position.set(top ? -0.3 : -2.6, top ? 4.2 : 1.6, top ? 0.81 : 3.6);
    controls.update();
  };
  $("v-top").onclick = () => view(true);
  $("v-side").onclick = () => view(false);
  view(true);
  try {
    let i = 0;
    for (const [id, url] of Object.entries(SCANS)) {
      i++;
      const prog = (e) => { if (e.lengthComputable) $("status").textContent = `Chargement du scan ${i} sur 2… ${Math.round((e.loaded / e.total) * 100)} %`; };
      const m = new SplatMesh({ fileBytes: await fetchBase64(url, prog) });
      $("status").textContent = `Préparation du scan ${i} sur 2…`;
      meshes[id] = m; apply(); scene.add(m); await m.initialized;
    }
  } catch (e) { console.error(e); $("status").textContent = `Les scans n’ont pas pu être chargés (${e.message || e}).`; return; }
  apply();
  $("overlay").hidden = true;
  document.querySelectorAll("[data-show]").forEach((b) => b.addEventListener("click", () => {
    document.querySelectorAll("[data-show]").forEach((o) => o.setAttribute("aria-pressed", String(o === b)));
    const s = b.dataset.show; meshes.bureau.visible = s !== "lit"; meshes.lit.visible = s !== "bureau";
  }));
  const resize = () => { const { clientWidth: w, clientHeight: h } = stage; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  new ResizeObserver(resize).observe(stage); resize();
  renderer.setAnimationLoop(() => { controls.update(); renderer.render(scene, camera); });
});

// Le scan est servi encodé en base64 dans un .txt (l'hébergeur ne sert pas les .spz).
async function fetchBase64(url, onProgress) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${url} : ${res.status}`);
  const total = Number(res.headers.get("content-length")) || 0;
  const reader = res.body.getReader();
  const parts = [];
  let loaded = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    parts.push(value); loaded += value.length;
    onProgress({ lengthComputable: total > 0, loaded, total });
  }
  const bin = atob(new TextDecoder().decode(await new Blob(parts).arrayBuffer()).trim());
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}
