# Game Mechanics Math Reference

This document captures the core math formulas used by the baseball game simulation so they can be tuned for balance.

## 1. Pitch Movement and Location

### 1.1 Break resolution

Break values are either fixed or sampled randomly.

- Random break value:
  - $bx = \text{random}( -4, 4 )$
  - $by = \text{random}( -4, 4 )$

- If the pitch has fixed break values, those values are used directly.

### 1.2 Break magnitude

The total break strength is the Euclidean magnitude of the break vector:

- $breakMagnitude = \sqrt{bx^2 + by^2}$

### 1.3 Power factor

Power scales the movement intensity between minimum and maximum values:

- $powerFactor = 0.75 + \left(\frac{power}{4}\right) \times (1.6 - 0.75)$

### 1.4 Spread factor

Spread also scales with power:

- $powerSpreadFactor = 0.8 + \left(\frac{power}{4}\right) \times (1.8 - 0.8)$

### 1.5 Movement scale

The movement scale combines break strength and power:

- $movementScale = (4 + breakMagnitude \times 1.8) \times powerFactor$

### 1.6 Ball movement offsets

The resulting movement in each axis is:

- $moveX = bx \times movementScale$
- $moveY = by \times movementScale$

### 1.7 Control and accuracy noise

Pitch speed is converted to a control factor:

- $speedFactor = clamp\left(\frac{speed}{10}, 0.25, 1\right)$

Control spread is then derived from speed:

- $controlSpread = clamp\left(16 \times (1 - speedFactor), 3, 14\right)$

Chaos overrides the spread:

- $controlSpread = 30$ if $chaos = true$

Disguise slightly increases the spread:

- $controlSpread = controlSpread \times 1.2$ if $disguised = true$

Random noise is added to the target location:

- $noiseX = randomRange(-controlSpread, controlSpread)$
- $noiseY = randomRange(-controlSpread, controlSpread)$

### 1.8 Final pitch position

The final ball position is:

- $final_x = aim_x + moveX + noiseX$
- $final_y = aim_y + moveY + noiseY$

### 1.9 Hint prediction

The hint location is a reduced version of the real movement:

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
- If $adjusted < -40$, result is $early$
- If $adjusted < 40$, result is $perfect$
- If $adjusted < 120$, result is $late$
- Otherwise, result is $very\_late$

Here, $PERFECT_WINDOW_MS = 40$.

---

## 5. Hit Result Scoring

### 5.1 Distance score

The hit distance contributes a base score:

- $distanceScore = max(0, 100 - (distance \times 3))$

### 5.2 Meatball bonus

Lower pitch power increases the chance of a weak contact result:

- $meatballBonus = max(0, 20 - pitchPower)$

### 5.3 Total contact score

The total score used for hit outcome decisions is:

- $total = distanceScore + meatballBonus$

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

Pitch speed is adjusted by power:

- $effectivePitchSpeed = baseSpeed \times 0.5 + baseSpeed \times 0.5 \times \left(\frac{power}{100}\right)$

This is equivalent to:

- $effectivePitchSpeed = baseSpeed \times \left(0.5 + 0.005 \times power\right)$

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

A walk only occurs if the batter has accumulated 4 balls:

- If $balls < 4$, no state change occurs
- If $balls \ge 4$:
  - $balls = 0$
  - $strikes = 0$
  - result becomes $walk$

---

## 10. Inning Progression

When 3 outs are reached:

- $outs = 0$
- $runnerFirst = false$
- $runnerSecond = false$
- $runnerThird = false$

Then the inning frame advances:

- If $inningFrame = bottom$, then $inning = inning + 1$ and $inningFrame = top$
- Otherwise, $inningFrame = bottom$

---

## 11. Fielder Catch Chance

The fielder uses a probability threshold:

- $caught = random() < chance$

Where the chance table is:

- $single$: $Q = 0.30$, $W = 0.45$, $E = 0.80$
- $double$: $Q = 0.15$, $W = 0.25$, $E = 0.00$
- $homerun$: all $0.00$
- $out$: all $1.00$

If the fielder catches the ball, the result becomes $out$; otherwise, it stays as the original hit outcome.
