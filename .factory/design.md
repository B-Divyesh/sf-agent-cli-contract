# Visual thesis — topographic cartography

Agent CLI Contract treats a command as terrain that maintainers must survey before agents can cross it. The visual system borrows contour lines, survey marks, field notebooks, and safety-orange route flags. It avoids the dark dashboard and generic gradient language common to developer tools.

## Palette

The site uses one explicit light treatment, like an annotated field map. Dark terminal surfaces are reserved for command output.

| Token | Value | Use |
| --- | --- | --- |
| `--paper` | `#F3EFDF` | map-paper page background |
| `--paper-raised` | `#FFFDF5` | quiet raised surfaces |
| `--ink` | `#152C28` | primary type and rules |
| `--muted` | `#4D625D` | secondary type |
| `--moss` | `#245B4A` | contour lines and links |
| `--signal` | `#C94224` | route markers and primary action |
| `--signal-dark` | `#8D2A18` | hover and accessible text accents |
| `--pass` | `#1F6A46` | passing checks, paired with text |
| `--warn` | `#8A5A05` | cautions, paired with text |
| `--danger` | `#A62F26` | failures, paired with text |
| `--terminal` | `#10221F` | recorded CLI surface |
| `--terminal-ink` | `#E7F0DD` | recorded CLI type |

Text combinations meet WCAG AA. Color never carries status without a word or symbol.

## Type

- Display and body: `Avenir Next`, `Segoe UI`, system sans-serif. The sturdy geometry reads like modern survey signage and avoids a font download.
- Code and measurements: `ui-monospace`, `SFMono-Regular`, Consolas. Tabular figures keep exits, durations, and counts aligned.
- Scale: 14, 16, 18, 24, 36, 56 px. Body stays at 16 px or larger.

No font files or third-party font hosts are required.

## Spacing and shape

- Base unit: 8 px. Major section spacing: 64–112 px. Text measure: 68 characters.
- Layout follows a survey sheet: a narrow coordinate rail, an irregular two-column hero, and ruled report bands.
- Corners are clipped rather than softly rounded. Buttons use a 2 px radius; report frames use an 8 px radius.
- Hairline contour curves sit behind content. Route markers use circles, crosses, and numbered flags.

## Interaction grammar

- The primary action is a signal-orange route flag.
- Hover moves the flag 2 px east and raises its survey shadow. Press returns it to the paper.
- Focus uses a 3 px ink outline plus a paper gap.
- Result rows reveal from top to bottom as if a survey is being plotted.
- Links remain underlined. Buttons always have filled or ruled boundaries.

## Motion policy

One signature motion draws a short route across the hero map once on first view. UI changes use 180–240 ms opacity and transform transitions. Nothing loops. With `prefers-reduced-motion: reduce`, the route is fully drawn at load and all movement becomes instant.

## Asset plan and provenance

- `site/public/topographic-run.webp`: original generated editorial map artwork. It shows a CLI route crossing nested contour lines and arriving at three contract checkpoints. It carries no text, logos, or UI labels. Generated for this project with `/opt/fleet/lib/gen-image.sh` using the factory image deployment, then converted to WebP at or below 300 KB.
- `site/public/social-card.webp`: a 1200×630 crop/composition derived from the same original art, with the product name added in HTML-equivalent brand styling during build-time image composition.
- `site/public/favicon.svg`: hand-authored route-and-checkpoint mark using the product palette.
- `site/public/terminal-recording.svg`: generated locally from the real `agent-contract demo` output by `npm run generate:recording`. It uses the terminal palette and contains no invented fixture results.

Generation prompt:

> Use case: stylized-concept. Asset type: wide landing-page hero illustration. Primary request: an editorial topographic survey map showing a single precise route through nested terrain contours, crossing three small geometric checkpoints before reaching a crisp destination pin. Scene: abstract map only, no real country or place. Style: screen-printed cartography on warm cream archival paper, fine forest-green contour lines, sparse rust-orange route marks, subtle paper grain, exact technical drafting. Composition: 3:2 landscape, visual interest on the right and lower middle, calm negative space on the upper left. Mood: precise, trustworthy, field-tested. Constraints: no words, no letters, no numbers, no logos, no gradients, no glowing effects, no people, no devices, no watermark.

Generated output is an original factory asset. The site uses no stock art.

## Why it fits

The product detects where a CLI contract shifts under automation. Survey language makes invisible differences legible: contour lines represent changing output, checkpoints represent assertions, and the route represents a repeatable command. The system feels technical without copying an IDE.
