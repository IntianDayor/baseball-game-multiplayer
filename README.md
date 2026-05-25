# SIMPLE WEBGAME BASEBALL BACK AND FORTH

## 2 Player Game
### HTML JAVASCRIPT CSS
### BaaS (NO BACKEND IF POSSIBLE)
### STYLYZED ART BY ME KRITA
### Sound/Music could be outsourced or made by me

## MAIN MENU

⇒ Choose if want to play with random or friend
	=> Random
		⇒ Fetch random players also queing
	=>  Friend
		⇒ Create a room for friend to join

## GAMEPLAY LOOP

 ⇒ Coin Toss Whoever wins
	=> Chooses First to Pitch or First to Bat

⇒ PITCHING
=> Player chooses pitch aims using cursor holds mouse to determine throw strength
=> Player chooses fastball(default Q) and randomized breaking balls (W, E)

⇒ BATTING
	=> Player sees a hint where the ball will hit but not reveal the break/speed/strength
	=> Player chooses power/contact/bunt (Q,W,E keys) player didnt hit strike if within   strikezone ball if not
 
⇒ Whole Game
	=> loops like baseball game after three outs retires batter with three strikeouts or if outed
	=> the fielders only visualized at a mini map as circles(colored) and will rng if CAUGHT/FAILED


## Responsive UI so can be played both mobile or any viewport

 StrikeZone ⇒ One box with nine grid boxes that ball will trigger if strike or not
	=> Strike if strikezone
	=> Ball if Not
	=> Strike if swing and miss regardless if the ball is strikezone or not


## OPTIONAL FEAT:
	⇒ POWERUP PITCHING / BATTING
		=> Pitching ⇒
			=> Impossible to hit Ball of choice will be triggered if certain condition
		=> Batting ⇒ 
			=> SURE HOMERUN and HIT will be triggered if certain condition
	


 # FLOW

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
Winner chooses Pitch or Bat
   ↓
INNING LOOP:
   Pitch → Bat → Resolve → Outs
   ↓
3 Outs → Swap Roles
   ↓
Final Inning Complete?
   ├─ No → Next Inning
   └─ Yes → Winner Screen


