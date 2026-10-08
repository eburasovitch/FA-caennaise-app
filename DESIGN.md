# DESIGN.md · Force Athlétique Caennaise

Site vitrine d'une association de force athlétique (squat, développé couché, soulevé de terre) à Caen.
Public : adultes et jeunes qui veulent découvrir la discipline, compétiteurs, parents.

## Identité

- Ton : direct, chaleureux, sans jargon. Phrases courtes, vouvoiement quand on s'adresse au visiteur.
- Univers du logo : casque viking, bouclier, barre chargée. On en garde la force et les couleurs, pas le décor (pas de runes, pas de cornes en décoration).
- Logo : `src/img/logo-fac.png` (provisoire, 200 × 152 px avec fond). À remplacer par une version HD sur fond transparent (SVG ou PNG 1000 px).

## Couleurs

Thème sombre unique (salle de force, fonte, rouge du logo). Pas de bascule claire/sombre.

| Jeton | Valeur | Usage |
|---|---|---|
| `--ink` | `#141111` | Fond de page |
| `--surface` | `#1d1917` | Fonds de sections secondaires |
| `--line` | `#3a3330` | Filets, bordures |
| `--bone` | `#f2ebe0` | Texte principal |
| `--muted` | `#b9aea2` | Texte secondaire (contraste 8:1 sur `--ink`) |
| `--blood` | `#8a1f1d` | Rouge du logo. Grands aplats uniquement (hero, bandeau), jamais pour du petit texte |
| `--bronze` | `#c9a46a` | Seul accent interactif : boutons, liens, focus |

Règle : le rouge est une **surface de marque**, le bronze est le **seul accent**. Un bouton est toujours bronze sur encre (texte `--ink`), jamais rouge.

## Typographie

- Titres : **Barlow Condensed** 800, majuscules, interlettrage -0,01em. Évoque les plaques et les tableaux de compétition.
- Sous-titres et boutons : Barlow Condensed 600, majuscules, interlettrage 0,04em.
- Texte : **Barlow** 400/500, 1,0625rem, interligne 1,6, 65 caractères max.
- Polices auto-hébergées dans `src/fonts/` (woff2, `font-display: swap`).
- Échelle : h1 `clamp(2.75rem, 7vw, 5.5rem)`, h2 `clamp(2rem, 4.5vw, 3.5rem)`, h3 1,5rem.

## Espacements et grille

- Conteneur 1200 px max, gouttière 1rem (mobile) à 2rem (desktop).
- Sections : `padding-block: clamp(4rem, 9vw, 7rem)`.
- Grille CSS ; tout passe sur une colonne sous 768 px.

## Composants

- **Angles vifs partout** (rayon 0) : boutons, images, blocs. Comme une plaque de fonte.
- Bouton principal : fond bronze, texte encre, majuscules condensées, flèche à droite. Au survol : légère montée ; à l'appui : `translateY(1px)`.
- Bouton secondaire : contour 2 px `--bone`, texte `--bone`.
- Un seul libellé par intention : « Venir essayer » (contact/inscription), « Instagram » (réseaux).
- Pas de cartes ombrées : on sépare par l'espace et des filets `--line`.

## Images et icônes

- Photos réelles du club uniquement (entraînements, compétitions, salle). Pas de banque d'images.
- Icônes : Phosphor, graisse *bold*, en sprite SVG inline.

## Animations

- Intensité faible : transitions de survol (180 ms) et apparition douce des sections au chargement.
- Tout est désactivé sous `prefers-reduced-motion: reduce`.

## Responsive

- Mobile d'abord. Points de rupture : 768 px et 1024 px.
- Navigation : une ligne sur desktop, liens réduits à l'essentiel sur mobile.
