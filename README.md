# Cavern of Code (Tech Quest)

Static site in `app/` + Supabase project `rbaibnntcgpdeybvtool` (already set up).

## Pages
| URL | Who |
|---|---|
| `/` | Players: enter name, wait, play |
| `/leaderboard.html` | Projector: live podium + rankings + countdown |
| `/admin.html` | Organiser: start/end/reset round, clue, remove players |

Admin password: `bcaquest` (change it in the admin page, under "Change password").

## Run locally
```bash
python -m http.server 5173 --directory app
```
Open http://localhost:5173

## Deploy (Vercel)
```bash
cd app && npx vercel --prod
```
Or: Vercel dashboard → Add New Project → import the repo → **Root Directory = `app`**, Framework = Other, no build command.

## Event flow
1. Players open `/` on each PC and type their name (they land in the waiting room).
2. Organiser opens `/admin.html`, sets minutes (default 20), presses **Start round**: every PC starts at once.
3. 12 monsters (wrong = +10 s, moves on) → boss (pick easy 20 / medium 30 / hard 50 damage, 100 HP) → chest with the clue.
4. Rank: finished players by total time (tie: fewer wrong); unfinished players by progress.
5. After the event: **Reset all** clears players for the next batch.

Extras: chiptune sound effects (🔊 button in the HUD to mute), combo streaks, a 3-2-1 countdown, letters that drop into a rune bar, and a confetti chest at the end.

## Edit questions
`app/js/questions.js`. `answer` must match one of `choices` exactly.
