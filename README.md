# ⚾ Baseball Game

A real-time, turn-based baseball game for two players. Challenge a friend online in strategic pitching and batting gameplay with physics-based ball movement and dynamic fielding.

## 🎮 Features

- **Real-Time Multiplayer**: Play live against another player with instant game synchronization
- **Strategic Gameplay**: Master different pitch types and bat selections to outplay your opponent
- **Dynamic Ball Physics**: Realistic pitch breaks and movement based on power, speed, and spin
- **Interactive UI**: Visual strike zone, pitch hints, and swing feedback
- **9-Inning Matches**: Classic baseball format with full inning management
- **Coin Toss System**: Fair selection for who bats first
- **Skill-Based Mechanics**: Precise timing and aim determine swing success

## 🚀 Getting Started

### Requirements

- Node.js 16+ and npm
- Modern web browser (Chrome, Firefox, Safari, Edge)
- Internet connection for online play

### Installation

1. **Clone the repository** (or download the project):
   ```bash
   git clone <repository-url>
   cd baseball-game
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   Create a `.env` file in the root directory:
   ```
   VITE_SUPABASE_URL=your-supabase-project-url
   VITE_SUPABASE_KEY=your-supabase-anon-key
   ```

4. **Start the game**:
   ```bash
   npm run dev
   ```
   
   Open the URL displayed in your terminal (typically `http://localhost:5173`)

## 🕹️ How to Play

### Game Flow

1. **Main Menu**: Start a new game
2. **Create or Join a Lobby**: 
   - **Host**: Generate a room code to share with your friend
   - **Guest**: Enter the room code to join
3. **Coin Toss**: Winner decides whether to bat or pitch first
4. **Gameplay**:
   - **Pitcher**: Select pitch type, aim at the strike zone, charge power (tier 0-4), and throw
   - **Batter**: Watch for a location hint, select your bat type (Q/W/E), and click to swing or take the pitch
5. **Results**: Each swing result updates the count, score, and game state
6. **Win Condition**: Most runs after 9 innings wins

### Pitcher Controls

- **Aim**: Move your cursor to position the pitch
- **Power**: Hold down to charge power (visual tier indicator shows 0-4)
- **Throw**: Release to pitch

### Batter Controls

- **Bat Selection**: Press Q (Power), W (Speed), or E (Bunt)
- **Position**: Cursor position = swing target
- **Swing**: Click to swing or wait to take the pitch

## 📋 System Requirements

- **Minimum**:
  - 2GB RAM
  - 100MB free disk space
  - 5 Mbps internet connection
  
- **Recommended**:
  - 4GB+ RAM
  - 200MB free disk space
  - 10+ Mbps internet connection

## 🆘 Troubleshooting

**Connection Issues?**
- Ensure both players have stable internet
- Try refreshing the page
- Check that room codes are entered correctly

**Can't join a room?**
- Verify the room code is correct and hasn't expired
- Room code must be shared by the host before joining

**Laggy gameplay?**
- Close other browser tabs and applications
- Move closer to your router
- Check your internet connection speed

## 📝 Development

For developers looking to modify or extend the game:

- **Build**: `npm run build` - Create an optimized production build
- **Preview**: `npm run preview` - Test the production build locally
- **Lint**: `npm run lint` - Run code quality checks

## 📄 License

This project is provided as-is. All rights reserved.

## 🤝 Support

Having issues? Please check the Troubleshooting section above or contact support.

---

**Enjoy the game!** ⚾

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
