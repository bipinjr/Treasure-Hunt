# Cavern of Code (Tech Quest)

Static site (repo root) + Supabase project `rbaibnntcgpdeybvtool` (already set up).
Live: https://treasure-hunt-seven-sigma.vercel.app/

## Pages
| URL | Who |
|---|---|
| `/` | Players: enter name, accept rules, play straight away (own 20-min timer) |
| `/leaderboard` | Projector: live podium + rankings + countdown |
| `/admin` | Organiser: time limit, reset, clue, ± time, remove players, Excel/PDF export, feedback |

Admin password: ask the organisers (change it in the admin page, under "Change password"). Never commit it to this repo.

## Run locally
```bash
python -m http.server 5173
```
Open http://localhost:5173

## Deploy
Vercel: import the repo with default settings (Framework = Other, no build command, Root Directory = `./`). Every push to `main` redeploys.

## Event flow
1. The event is always open. A student opens `/`, types their name (unique), accepts the rules and starts immediately; their own timer (default 20 min, set in `/admin`) starts at that moment. Nobody needs to press Start.
2. 4 zones × (6 monsters + 1 bonus chest) = 28 checkpoints, mostly hands-on activities: light the bulbs (binary), put it in order, crack the code, robot coder (maze), sort it out (safe/scam, AI/not AI), shooting gallery, lane racer, catch it and memory match (games start by themselves), plus a few quick 2nd PU common-sense questions. Each zone opens with a short guide and has its own scenery; the knight levels up (new armour) after every zone.
3. 2 tries per monster (each miss +10 s). Bonus chest: 1 try, right = −20 s and ⭐⭐. Boss: pick easy/medium/hard damage, 100 HP. Then the chest with the clue.
4. Stars: ⭐ per monster beaten on the first try, ⭐⭐ per bonus chest, ⭐ per boss hit.
5. Rank: finished players by total time (time + penalties − bonuses; tie: more stars, fewer wrong, earlier finish), then unfinished players by progress.
6. `/admin`: live players, descent map, scorecards, Excel/PDF export, feedback. Results stay saved for every participant until someone types RESET in **Reset all**. The projector lists everyone and auto-scrolls.

The landing page has an "Organiser login" link at the bottom.

**Tab-switch policy:** leaving the game tab (switching tabs or minimising) during a round is a strike, with a warning each time. The 3rd strike sends the player back to checkpoint 1; bonuses are lost and the clock keeps running. Strikes are counted on the server, so refreshing doesn't reset them. The admin page shows strikes and restarts per player.

Extras: chiptune sound effects (🔊 button in the HUD to mute), combo streaks, letters that drop into a rune bar, a confetti chest at the end. Fonts (Fredoka, plus Press Start 2P for rune letters) are bundled in `fonts/`.

**Feedback:** after the chest (or when time runs out) players answer 6 questions about the college, the event and its organisers: overall experience (required), the BCA Tech Quest event overall (required), event organisation, organisers and volunteers (all 1–5 stars), would they consider BCA at this college (Yes/Maybe/No), and an optional suggestion. Answers are stored separately with the player's name, shown in the admin page's Player feedback panel, and exported with **Feedback CSV**. Reset all keeps feedback; use Clear feedback to delete it.

## Edit questions
`js/questions.js`. `answer` must match one of `choices` exactly.

## Tests
```bash
node --test tests/content.test.mjs tests/html-scripts.test.mjs
```
Checks the question file matches the server stage layout, every activity is solvable, and every page script parses.

## Docs
Original design document and technical proposal: `docs/`.
