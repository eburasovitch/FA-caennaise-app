# Site FA Caen

Site statique (HTML + CSS, sans framework). Les sources sont dans `src/` et sont publiées telles quelles sur GitHub Pages à chaque push sur `main`.

## Règles de design

- Lire `DESIGN.md` avant toute modification visuelle et s'y tenir (couleurs, polices, espacements, composants).
- Créer et retoucher les pages avec le skill `design-taste-frontend`.
- Après chaque changement visuel : servir `src/` en local (`npx serve src` ou `python3 -m http.server -d src`), puis avec `playwright-cli` prendre une capture mobile (390 px) et desktop (1440 px), les regarder et corriger.
- Avant de proposer une modification : passer `web-design-guidelines` sur les fichiers touchés, puis `/impeccable audit` et `/impeccable polish` si besoin.
- Mobile d'abord, accessible (contraste AA, navigation clavier, textes alternatifs), pas de dépendance JavaScript inutile.
- Textes du site en français.
