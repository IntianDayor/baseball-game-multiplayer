# Game Mechanics Math Reference

This document reflects the current implementation in the game engine rather than an earlier design draft. The formulas below match the logic in the pitch resolver, hit calculator, count engine, walk engine, inning engine, and fielder engine.

## 1. Pitch Movement and Location

### 1.1 Break resolution

Break values are either fixed or sampled randomly.

- Random break value:
  - $bx = \text{random}(-4, 4)$
  - $by = \text{random}(-4, 4)$

- If the pitch uses fixed break values, those values are used directly.

### 1.2 Break magnitude

The total break strength is the Euclidean magnitude of the break vector:

- $breakMagnitude = \sqrt{bx^2 + by^2}$

### 1.3 Power factor

Power scales the movement intensity between the minimum and maximum factors:

- $powerFactor = 0.75 + \left(\frac{power}{4}\right) \times (1.6 - 0.75)$

### 1.4 Spread factor

Spread also scales with power:

- $powerSpreadFactor = 0.8 + \left(\frac{power}{4}\right) \times (1.8 - 0.8)$

### 1.5 Movement scale

The movement scale combines break strength and power:

- $movementScale = (4 + breakMagnitude \times 0.5) \times powerFactor$

### 1.6 Ball movement offsets

The resulting movement in each axis is:

- $moveX = clamp(bx \times movementScale, -50, 50)$
- $moveY = clamp(-by \times movementScale, -50, 50)$

The $50$ px cap applies independently to each axis, preventing high-break
pitches from resolving outside the playable field solely because of movement.

### 1.7 Control and accuracy noise

Pitch speed is converted to a control factor:

- $speedFactor = clamp\left(\frac{speed}{10}, 0.25, 1\right)$

Control spread is then derived from speed:

- $controlSpread = clamp\left(16 \times (1 - speedFactor), 3, 14\right)$

Chaos overrides the spread:

- $controlSpread = 30$ if $chaos = true$

Disguise slightly increases the spread:

- $controlSpread = controlSpread \times 1.2$ if $disguised = true$

The spread is then multiplied by the power spread factor:

- $controlSpread = controlSpread \times powerSpreadFactor$

Random noise is added to the target location:

- $noiseX = randomRange(-controlSpread, controlSpread)$
- $noiseY = randomRange(-controlSpread, controlSpread)$

### 1.8 Final pitch position

The final ball position is:

- $final_x = aim_x + moveX + noiseX$
- $final_y = aim_y + moveY + noiseY$

### 1.9 Hint prediction

The hint position uses a reduced version of the real movement:

- $predictedX = aim_x + moveX \times 0.25$
- $predictedY = aim_y + moveY \times 0.25$

### 1.10 Hint radius

Hint uncertainty is based on chaos, disguise, and break magnitude:

- $hintRadius = 38$ if $chaos = true$
- $hintRadius = 6$ if $disguised = true$
- $hintRadius = clamp(10 + breakMagnitude \times 2.2, 8, 26)$ otherwise

---

## 2. Hit Trajectory Classification

### 2.1 Trajectory threshold

The hit trajectory is determined by comparing the vertical offset against a threshold:

- $threshold = radius \times 0.3$

Then:

- If $verticalOffset < -threshold$, result is $grounder$
- If $verticalOffset > threshold$, result is $flyball$
- Otherwise, result is $liner$

---

## 3. Contact Quality

Contact quality depends on how close the hit is to the ideal contact point.

- If $distance > radius$, result is $miss$
- If $distance \le radius \times 0.25$, result is $perfect$
- If $distance \le radius \times 0.60$, result is $good$
- Otherwise, result is $bad$

---

## 4. Timing Quality

Timing quality compares the swing timing error to a reaction-time adjustment.

- $adjusted = timingOffset - reactionTime$

Then:

- If $adjusted < -120$, result is $very\_early$
- If $adjusted < -60$, result is $early$
- If $adjusted < 60$, result is $perfect$
- If $adjusted < 120$, result is $late$
- Otherwise, result is $very\_late$

The current implementation uses:

- $PERFECT\_WINDOW\_MS = 60$
- $VERY\_LATE\_THRESHOLD\_MS = 120$

---

## 5. Hit Result Scoring

### 5.1 Distance score

The hit distance contributes a base score:

- $distanceScore = max(0, 100 - (distance \times 3))$

### 5.2 Meatball bonus

A weak-contact bonus is derived from movement scale rather than pitch power:

- $MEATBALL\_THRESHOLD = 10$
- $MEATBALL\_MULTIPLIER = 3$
- $meatballBonus = max(0, (MEATBALL\_THRESHOLD - movementScale) \times MEATBALL\_MULTIPLIER)$

### 5.3 Total contact score

The score starts as:

- $total = distanceScore + meatballBonus$

Pitch speed then rewards clean contact against faster pitches and penalizes bad
contact against them. With:

- $speedDelta = max(0, pitchSpeed - 6)$

the final score is:

- $total = total + speedDelta \times 3$ for $perfect$ or $good$ contact
- $total = total - speedDelta \times 4$ for $bad$ contact
- $total$ is unchanged for other contact qualities

### 5.4 Swing-type thresholds

#### Power swing (Q)

- If $total \ge 115$, result is $homerun$
- If $total \ge 90$, result is $double$
- If $total \ge 60$, result is $single$
- If $total \ge 40$, result is $foul$
- Otherwise, result is $out$

#### Contact swing (W)

- If $total \ge 110$, result is $double$
- If $total \ge 70$, result is $single$
- If $total \ge 45$, result is $foul$
- Otherwise, result is $out$

#### Bunt swing (E)

- If $total \ge 75$, result is $single$
- If $total \ge 45$, result is $sac\_bunt$
- Otherwise, result is $foul$

### 5.5 Result modifiers

A few special-case overrides are applied after the threshold check:

- If $trajectory = grounder$ and base result is $homerun$, it becomes $single$
- If $quality = bad$ and base result is $homerun$, it becomes $single$
- If $quality = good$ and base result is $homerun$, it becomes $double$

---

## 6. Timing Modifiers

Timing errors can downgrade or alter the result.

### 6.1 Early/late timing

For $early$ or $late$ timing:

- If base result is $homerun$, it becomes $double$
- If base result is $double$, it becomes $foul$ with $40\%$ probability, otherwise $single$
- If base result is $single$, it becomes $foul$ with $60\%$ probability, otherwise $single$

### 6.2 Very early/very late timing

For $very\_early$ or $very\_late$ timing:

- With $25\%$ probability, result becomes $swing\_miss$
- If base result is $homerun$, result becomes $single$
- If base result is $double$, result becomes $foul$
- If base result is $single$, result becomes $foul$

### 6.3 Perfect timing

If timing is perfect, no modifier is applied.

---

## 7. Effective Pitch Speed

Pitch power does not scale speed. The effective speed is the selected pitch's
base speed:

- $effectivePitchSpeed(baseSpeed) = baseSpeed$

It drives the batter's timing window. For speeds $2$ through $10$:

- $speedT = clamp\left(\frac{effectiveSpeed - 2}{10 - 2}, 0, 1\right)$
- $reactionTime = round(2000 + (1000 - 2000) \times speedT)$ ms

The ball arrives at this reaction time, and timing quality is measured against
that arrival point. The pre-pitch hint delay is also speed-based before being
limited to $400$--$500$ ms:

- $readDelay = round((10 - effectiveSpeed) \times 100 + 200)$ ms
- $hintDuration = clamp(readDelay, 400, 500)$ ms

---

## 8. Count Logic

### 8.1 Hit result reset

On a hit, the count resets:

- $strikes = 0$
- $balls = 0$

This applies to $single$, $double$, and $homerun$.

### 8.2 Strike result

For a strike outcome such as $swing\_miss$ or $called\_strike$:

- $strikes = strikes + 1$

If the count reaches 3 strikes:

- $strikes = 0$
- $balls = 0$
- $outs = outs + 1$

### 8.3 Ball result

For a ball:

- $balls = balls + 1$

### 8.4 Foul result

For a foul:

- If $strikes < 2$, then $strikes = strikes + 1$

### 8.5 Out result

For $out$ or $sac\_bunt$:

- $outs = outs + 1$
- $strikes = 0$
- $balls = 0$

---

## 9. Walk Logic

Walks are handled by a separate engine. The current behavior is:

- If $balls < 4$, no state change occurs
- If $balls \ge 4$:
  - $balls = 0$
  - $strikes = 0$
  - result becomes $walk$

The runner engine runs immediately afterwards. A walk forces runners only as
needed: the batter takes first; each occupied base pushes its runner one base;
and a bases-loaded walk scores exactly one run.

---

## 10. Runner Advancement

Runner resolution occurs after the count and walk engines.

- **Single:** runner on third scores; runners on first and second advance one
  base; batter takes first.
- **Double:** runners on second and third score; runner on first advances to
  third; batter takes second.
- **Home run:** every existing runner plus the batter scores; all bases clear.
- **Sacrifice bunt:** runner on third scores; runners on first and second
  advance one base; the batter is out.

---

## 11. Inning Progression

When 3 outs are reached:

- $outs = 0$
- $runnerFirst = false$
- $runnerSecond = false$
- $runnerThird = false$

Then the inning frame advances:

- If $inningFrame = bottom$, then $inning = inning + 1$ and $inningFrame = top$
- Otherwise, $inningFrame = bottom$

This is implemented in the inning engine with $outs \ge 3$.

---

## 12. Fielder Catch Chance

The fielder uses a probability threshold:

- $caught = random() < chance$

Where the chance table is:

- $single$: $Q = 0.30$, $W = 0.45$, $E = 0.80$
- $double$: $Q = 0.15$, $W = 0.25$, $E = 0.00$
- $homerun$: all $0.00$
- $out$: all $1.00$

If the fielder catches the ball, the result becomes $out$; otherwise, it stays as the original hit outcome.
