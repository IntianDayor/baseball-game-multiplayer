# Baseball Game - 2 Player Web Game

A stylized, turn-based baseball game for two players built with modern web technologies.

## Overview

**Tech Stack:**
- Frontend: HTML, JavaScript, React
- Backend: BaaS (Supabase - no custom backend needed)
- Art: Krita (custom stylized sprites)
- Audio: TBD (outsourced or custom)

**Features:** Cross-platform responsive UI (desktop & mobile)

---

## Main Menu

Players can choose their match type:
- **Quick Match** - Find a random opponent from the matchmaking queue
- **Play With Friend** - Create a room to share with a friend

---

## Gameplay Loop

### Coin Toss
- Determines who goes first
- Winner chooses to either **Pitch** or **Bat** first

### Pitching Phase
- Player aims the pitch using the cursor
- Hold mouse to determine throw strength
- Pitch selection:
  - **Q** - Fastball (default)
  - **W** - Breaking ball #1 (randomized)
  - **E** - Breaking ball #2 (randomized)

### Batting Phase
- Player sees a visual hint indicating where the ball will land (without revealing speed/break/strength)
- Batting options:
  - **Q** - Power swing
  - **W** - Contact swing
  - **E** - Bunt
- Hit result determined by whether swing connects within the strike zone

### Strike Zone
- 9-grid strike zone box that determines:
  - **Strike** - Ball lands within strike zone
  - **Ball** - Ball lands outside strike zone
  - **Strike** - Any swing and miss (regardless of zone)

### Game Progression
- 3 outs per inning retires the batting side
- 3 strikeouts automatically outs the batter
- Fielders displayed as colored circles on mini-map
- Fielder catches/misses determined by RNG

---

## Optional Features

### Power-Ups

**Pitching Power-Up:**
- Throws an impossible-to-hit ball when triggered under certain conditions

**Batting Power-Up:**
- Guarantees a home run or hit when triggered under certain conditions

---

## Game Flow

```
OPEN GAME
   ↓
MAIN MENU → PLAY
   ↓
SELECT MATCH TYPE
   ├─ Quick Match
   └─ Play With Friend
   ↓
ROOM CREATED / MATCH FOUND
   ↓
COIN TOSS
   ↓
Winner Chooses Pitch or Bat
   ↓
INNING LOOP:
   Pitch → Bat → Resolve → Outs
   ↓
3 Outs → Swap Roles
   ↓
Final Inning Complete?
   ├─ No → Next Inning
   └─ Yes → Winner Screen
```


