# Cavern of Code (Tech Quest)

Static site (repo root) + Supabase project `rbaibnntcgpdeybvtool` (already set up).
Live: https://treasure-hunt-seven-sigma.vercel.app/

## Pages
| URL | Who |
|---|---|
| `/` | Players: enter name, practice or wait, then play |
| `/leaderboard` | Projector: live podium + rankings + countdown |
| `/admin` | Organiser: start/end/reset round, clue, ± time, remove players, CSV export |

Admin password: `bcaquest` (change it in the admin page, under "Change password").

## Run locally
```bash
python -m http.server 5173
```
Open http://localhost:5173

## Deploy
Vercel: import the repo with default settings (Framework = Other, no build command, Root Directory = `./`). Every push to `main` redeploys.

## Event flow
1. Players open `/` on each PC and type their name. They can try the **practice run** first (its own warm-up questions, never on the leaderboard) or enter the cavern and wait.
2. Organiser opens `/admin`, sets minutes (default 20), presses **Start round**: every PC starts at once with a 3-2-1 countdown.
3. 12 monsters (wrong = +10 s, moves on) → boss (pick easy 20 / medium 30 / hard 50 damage, 100 HP) → chest with the clue.
4. Rank: finished players by total time (tie: fewer wrong, then earlier finish); unfinished players by progress.
5. Export CSV from the admin page, then **Reset all** clears players for the next batch.

Extras: chiptune sound effects (🔊 button in the HUD to mute), combo streaks, letters that drop into a rune bar, a confetti chest at the end. Fonts are bundled in `fonts/`, so nothing depends on Google Fonts.

## Edit questions
`js/questions.js`. `answer` must match one of `choices` exactly.

## Docs
Original design document and technical proposal: `docs/`.
