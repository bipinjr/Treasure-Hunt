# Cavern of Code (Tech Quest)

Static site (repo root) + Supabase project `rbaibnntcgpdeybvtool` (already set up).
Live: https://treasure-hunt-seven-sigma.vercel.app/

## Pages
| URL | Who |
|---|---|
| `/` | Players: enter name, practice or wait, then play |
| `/leaderboard` | Projector: live podium + rankings + countdown |
| `/admin` | Organiser: start/end/reset round, clue, ± time, remove players, CSV export |

Admin password: ask the organisers (change it in the admin page, under "Change password"). Never commit it to this repo.

## Run locally
```bash
python -m http.server 5173
```
Open http://localhost:5173

## Deploy
Vercel: import the repo with default settings (Framework = Other, no build command, Root Directory = `./`). Every push to `main` redeploys.

## Event flow
1. Players open `/` on each PC and type their name (names must be unique). They accept the **rules screen**, then wait in the lobby. They can also try the **practice run** first (its own warm-up questions, never on the leaderboard).
2. Organiser opens `/admin`, sets minutes (default 20), presses **Start round**: every PC starts at once with a 3-2-1 countdown.
3. 4 zones × (6 monsters + 1 bonus chest) = 28 checkpoints, each zone opens with a short guide. Each monster allows **2 attempts**, every wrong attempt +10 s; miss twice and it escapes. Bonus chest: 1 attempt, right = −20 s, wrong/skip = free. Then the boss (pick easy 20 / medium 30 / hard 50 damage, 100 HP) → chest with the clue. Sized for about 15–20 minutes.
4. Rank: finished players by total time = time + penalties − bonuses (tie: fewer wrong, then earlier finish); unfinished players by progress.
5. Admin dashboard shows who is online, where everyone is (descent map) and live times. Export **CSV** or **PDF** (print dialog → Save as PDF), then **Reset all** clears players for the next batch.

The landing page has an "Organiser login" link at the bottom.

**Tab-switch policy:** leaving the game tab (switching tabs or minimising) during a round is a strike, with a warning each time. The 3rd strike sends the player back to checkpoint 1; bonuses are lost and the clock keeps running. Strikes are counted on the server, so refreshing doesn't reset them. The admin page shows strikes and restarts per player.

Extras: chiptune sound effects (🔊 button in the HUD to mute), combo streaks, letters that drop into a rune bar, a confetti chest at the end. Fonts are bundled in `fonts/`, so nothing depends on Google Fonts.

**Feedback:** after the chest (or when time runs out) players answer 6 questions about the college, the event and its organisers: overall experience (required), the BCA Tech Quest event overall (required), event organisation, organisers and volunteers (all 1–5 stars), would they consider BCA at this college (Yes/Maybe/No), and an optional suggestion. Answers are stored separately with the player's name, shown in the admin page's Player feedback panel, and exported with **Feedback CSV**. Reset all keeps feedback; use Clear feedback to delete it.

## Edit questions
`js/questions.js`. `answer` must match one of `choices` exactly.

## Tests
```bash
node --test tests/content.test.mjs
```
Checks that the question file matches the server's stage layout and that every answer is one of its choices.

## Docs
Original design document and technical proposal: `docs/`.
