# CCTV Detective — Grand Hotel Mysteries

A kid-friendly browser detective game built for GitHub Pages.

## What changed in V2

- **Replayable cases** — every new case shuffles the missing object, culprit, and route.
- **Looping CCTV videos** — each camera now uses a lightweight looping MP4 instead of a static still.
- **Tap clues immediately** — you no longer need to wait for the exact timeline second. The clue hotspot is tappable right away.
- **Timeline clue marker** — the `CLUE` button jumps close to the important moment in the feed.
- **Recurring moving suspects** — suspect badges move through the hotel feed to make the scenes feel more alive.
- **Difficulty modes** — Junior Detective, Detective, and Master Detective.

## Files

- `index.html` — main game shell
- `styles.css` — styling
- `app.js` — replayable case logic and gameplay
- `assets/videos/*.mp4` — looping CCTV feeds
- `assets/detective.svg` — hero art

## Deploy on GitHub Pages

1. Push the folder contents to the repo root.
2. In GitHub repo settings, enable **Pages**.
3. Set source to **Deploy from branch** → `main` → `/root`.
4. Open the Pages URL after deployment.

## Notes

The game is fully client-side and requires no backend.