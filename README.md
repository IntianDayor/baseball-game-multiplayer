# Baseball Game

A two-player, turn-based baseball game built with React, Vite, Tailwind CSS, and Supabase realtime tables.

## Quick Start

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file with Supabase credentials:

   ```bash
   VITE_SUPABASE_URL=your-project-url
   VITE_SUPABASE_KEY=your-anon-key
   ```

3. Start the local dev server:

   ```bash
   npm run dev
   ```

4. Open the Vite URL shown in the terminal.

## Scripts

- `npm run dev`: start the Vite development server.
- `npm run build`: create a production build.
- `npm run preview`: serve the production build locally.
- `npm run lint`: run ESLint across the project.

## Architecture

The app is a client-only React game. Supabase stores rooms, pitches, swings, scores, base runners, counts, innings, and player roles. Realtime subscriptions keep both players synchronized.

`src/App.jsx` owns top-level screen routing:

- `menu`: match entry point.
- `lobby`: room creation and joining.
- `game`: coin toss, pitching, batting, scoring, and inning flow.
- `gameover`: final result screen.

`src/components/Game.jsx` bridges the Supabase room state into React state. It listens for room updates, assigns the local player role, assigns each player their pitch set, updates the scoreboard, and sends the app to the game-over screen when regulation ends with a winner.

`src/lib/rooms.js` is the Supabase API layer. It creates and joins rooms, records coin toss choices, records pitches and swings, updates game state, and swaps roles between batting and pitching.

## Source Layout

```text
src/
  App.jsx
  main.jsx
  index.css
  components/
    BattingField.jsx
    BattingSelector.jsx
    Game.jsx
    GameOver.jsx
    LastPitchVisual.jsx
    Loading.jsx
    Lobby.jsx
    MainMenu.jsx
    MiniMap.jsx
    PitchingField.jsx
    PitchSelector.jsx
    ScoreBoard.jsx
    StrikeZone.jsx
  data/
    bats.js
    pitches.js
  hooks/
    key-selector.js
  lib/
    supabase.js
    rooms.js
    engines/
      counts.js
      fielder.js
      hint-calculator.js
      hit-calculator.js
      innings.js
      runners.js
      walks.js
```

## Gameplay Flow

1. A player starts from the main menu and creates or joins a lobby.
2. The host creates a Supabase room with generated pitch sets for both players.
3. The guest chooses heads or tails.
4. The coin toss winner chooses whether to bat or pitch first.
5. The pitcher selects a pitch, aims, charges power, and throws.
6. The batter receives a location hint, swings with the selected bat type, or takes the pitch.
7. The swing result updates counts, walks, runners, outs, innings, and score.
8. Three outs swaps player roles and clears the bases.
9. The game ends after the ninth inning once one side is ahead.

## Game Engines

- `counts.js`: updates balls, strikes, and outs for pitch outcomes.
- `walks.js`: handles walks and forced runner advancement.
- `runners.js`: advances runners and scores runs for hits and sacrifice bunts.
- `innings.js`: advances inning frames and formats inning display text.
- `hit-calculator.js`: turns contact distance, timing, pitch speed, pitch power, and swing type into a hit result.
- `fielder.js`: applies catch probability to eligible hits.
- `hint-calculator.js`: generates imperfect batting hints from pitch movement.

## Supabase Tables

The client expects at least these tables:

- `rooms`: room status, coin state, player ids, roles, pitch sets, counts, inning state, runners, and scores.
- `pitches`: one row per thrown pitch, including type, aim, power, strike-zone result, and timestamp.
- `swings`: one row per swing or take, including pitch id, room id, swing position, swing type, and result.

Enable Row Level Security before shipping publicly, then add policies that limit room, pitch, and swing access to the two players in the room.

## Controls

Pitching:

- `Q`: fastball.
- `W`: first randomized secondary pitch.
- `E`: second randomized secondary pitch.
- Mouse move: aim.
- Mouse hold and release: charge and throw.

Batting:

- `Q`: power swing.
- `W`: contact swing.
- `E`: bunt.
- Mouse move: aim swing location.
- Click: swing when the pitch is hittable.

## Development Notes

The game currently uses browser-side Supabase calls only. Any production deployment should harden the database with RLS policies, validate allowed state transitions, and consider a server-authoritative game loop for anti-cheat protection.
