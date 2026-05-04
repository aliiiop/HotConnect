import { useCallback, useEffect, useRef, useState } from 'react'
import { BOSSES } from '../data/bosses'
import { clamp, percent, rand } from '../utils/gameUtils'
import './BattleScene.css'

const DEFAULT_ARENA = { width: 560, height: 280 }
const SOUL_RADIUS = 14
const INVULN_MS = 650
const TIMING_LIMIT_MS = 4600
const DEFAULT_CALM_TO_WIN = 4
const BLUE_GRAVITY = 1320
const BLUE_JUMP_VELOCITY = -560
const BLUE_FAST_FALL = 780
const BLUE_AIR_CONTROL = 0.9

function makeId() {
  return `${Date.now()}-${Math.random()}`
}

function applyBattleBonus(boss, flags) {
  let enemyHpBonus = 0
  let playerHpBonus = 0
  let calmBonus = 0
  const items = []

  if (boss.id === 'printer' && flags.paperSuccess) {
    enemyHpBonus -= 4
    calmBonus += 1
    items.push({ label: 'Журнал-щит', heal: 6, message: 'Журнал ловит удар.' })
  }

  if (boss.id === 'librarian' && flags.paperSuccess) {
    enemyHpBonus -= 3
    calmBonus += 1
  }

  if (boss.id === 'security' && flags.coffeeSuccess) {
    playerHpBonus += 3
  }

  if (boss.id === 'methodist' && flags.coffeeSuccess) {
    enemyHpBonus -= 3
    calmBonus += 1
  }

  if (boss.id === 'chat' && flags.coffeeSuccess) {
    playerHpBonus += 2
    enemyHpBonus -= 4
  }

  if (boss.id === 'final' && flags.paperSuccess && flags.coffeeSuccess) {
    enemyHpBonus -= 6
    playerHpBonus += 4
    calmBonus += 1
    items.push({ label: 'Фартук Гоши', heal: 8, message: 'Гоша выглядит как баг.' })
  }

  return { enemyHpBonus, playerHpBonus, calmBonus, items }
}

function getSoulSpeed(boss) {
  if (!boss.soulSpeed) {
    return 215
  }

  return boss.soulSpeed < 1 ? boss.soulSpeed * 760 : boss.soulSpeed
}

function createBattleState(boss, flags) {
  const bonus = applyBattleBonus(boss, flags)
  const playerMaxHp = boss.playerMaxHp + bonus.playerHpBonus
  const enemyMaxHp = Math.max(1, boss.enemyMaxHp + bonus.enemyHpBonus)

  return {
    boss,
    playerMaxHp,
    playerHp: playerMaxHp,
    enemyMaxHp,
    enemyHp: enemyMaxHp,
    calm: bonus.calmBonus,
    turn: 0,
    items: [...boss.baseItems, ...bonus.items],
    acts: boss.acts,
    attacks: boss.attacks,
    projectiles: [],
    soul: {
      x: DEFAULT_ARENA.width / 2,
      y: DEFAULT_ARENA.height / 2,
      vx: 0,
      vy: 0,
      speed: getSoulSpeed(boss),
      mode: 'red',
      onGround: false,
      jumpQueued: false,
    },
    invulnUntil: 0,
    quietCounter: 0,
    attackStartedAt: 0,
    currentAttack: null,
  }
}

function projectile(attack, props) {
  return {
    id: makeId(),
    width: 20,
    height: 20,
    damage: attack.damage,
    type: 'paper',
    vx: 0,
    vy: attack.speed,
    ax: 0,
    ay: 0,
    rotation: 0,
    spin: 0,
    age: 0,
    hitboxScale: 1,
    hit: false,
    ...props,
  }
}

function lane(index, count, max, margin = 28) {
  if (count <= 1) {
    return max / 2
  }

  return margin + (index * (max - margin * 2)) / (count - 1)
}

function normalizeAngle(angle) {
  return angle * (Math.PI / 180)
}

function velocityFromAngle(angle, speed) {
  const radians = normalizeAngle(angle)

  return {
    vx: Math.cos(radians) * speed,
    vy: Math.sin(radians) * speed,
  }
}

function fromSide(attack, bounds, type, size = {}) {
  const fromLeft = Math.random() > 0.5
  const width = size.width || 24
  const height = size.height || 14

  return projectile(attack, {
    type,
    width,
    height,
    x: fromLeft ? -width : bounds.width + width,
    y: rand(24, bounds.height - 24),
    vx: fromLeft ? attack.speed : -attack.speed,
    vy: rand(-42, 42),
    rotation: fromLeft ? rand(-10, 10) : rand(170, 190),
    spin: rand(-90, 90),
  })
}

function fromTop(attack, bounds, type, size = {}) {
  const width = size.width || 20
  const height = size.height || 20

  return projectile(attack, {
    type,
    width,
    height,
    x: rand(24, bounds.width - 24),
    y: -height,
    vx: rand(-38, 38),
    vy: attack.speed,
    rotation: rand(-14, 14),
    spin: rand(-90, 90),
  })
}

function fromBottom(attack, bounds, type, size = {}) {
  const width = size.width || 22
  const height = size.height || 22

  return projectile(attack, {
    type,
    width,
    height,
    x: rand(24, bounds.width - 24),
    y: bounds.height + height,
    vx: rand(-30, 30),
    vy: -attack.speed,
    rotation: rand(-16, 16),
    spin: rand(-90, 90),
  })
}

function towardPoint(attack, bounds, type, size = {}) {
  const edge = Math.floor(rand(0, 4))
  const width = size.width || 22
  const height = size.height || 22
  let x = rand(0, bounds.width)
  let y = rand(0, bounds.height)

  if (edge === 0) y = -height
  if (edge === 1) x = bounds.width + width
  if (edge === 2) y = bounds.height + height
  if (edge === 3) x = -width

  const targetX = bounds.width / 2 + rand(-bounds.width * 0.28, bounds.width * 0.28)
  const targetY = bounds.height / 2 + rand(-bounds.height * 0.28, bounds.height * 0.28)
  const dx = targetX - x
  const dy = targetY - y
  const len = Math.hypot(dx, dy) || 1

  return projectile(attack, {
    type,
    width,
    height,
    x,
    y,
    vx: (dx / len) * attack.speed,
    vy: (dy / len) * attack.speed,
    rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
  })
}

function topWall(attack, bounds, type, options = {}) {
  const lanes = options.lanes || 7
  const gap = options.gap ?? 0
  const gapSize = options.gapSize || 1
  const width = options.width || 20
  const height = options.height || 20
  const speed = attack.speed * (options.speedMultiplier || 1)
  const drift = options.drift || 0

  return Array.from({ length: lanes }, (_, index) => index)
    .filter((index) => Math.abs(index - gap) >= gapSize)
    .map((index) => projectile(attack, {
      type,
      width,
      height,
      x: lane(index, lanes, bounds.width),
      y: -(height + (options.stagger ? (index % 2) * 34 : 0)),
      vx: drift * (index - (lanes - 1) / 2),
      vy: speed,
      rotation: options.rotation ?? rand(-8, 8),
      spin: options.spin || 0,
      hitboxScale: options.hitboxScale || 1,
    }))
}

function bottomWall(attack, bounds, type, options = {}) {
  const lanes = options.lanes || 7
  const gap = options.gap ?? 0
  const gapSize = options.gapSize || 1
  const width = options.width || 20
  const height = options.height || 20
  const speed = attack.speed * (options.speedMultiplier || 1)

  return Array.from({ length: lanes }, (_, index) => index)
    .filter((index) => Math.abs(index - gap) >= gapSize)
    .map((index) => projectile(attack, {
      type,
      width,
      height,
      x: lane(index, lanes, bounds.width),
      y: bounds.height + height + (options.stagger ? (index % 2) * 30 : 0),
      vx: options.drift || 0,
      vy: -speed,
      rotation: options.rotation ?? rand(-8, 8),
      spin: options.spin || 0,
      hitboxScale: options.hitboxScale || 1,
    }))
}

function sideWall(attack, bounds, type, options = {}) {
  const rows = options.rows || 5
  const gap = options.gap ?? 0
  const gapSize = options.gapSize || 1
  const fromLeft = options.fromLeft ?? true
  const width = options.width || 24
  const height = options.height || 18
  const speed = attack.speed * (options.speedMultiplier || 1)
  const x = fromLeft ? -width : bounds.width + width

  return Array.from({ length: rows }, (_, index) => index)
    .filter((index) => Math.abs(index - gap) >= gapSize)
    .map((index) => projectile(attack, {
      type,
      width,
      height,
      x,
      y: lane(index, rows, bounds.height, 26),
      vx: fromLeft ? speed : -speed,
      vy: options.drift || 0,
      rotation: options.rotation ?? (fromLeft ? 0 : 180),
      spin: options.spin || 0,
      hitboxScale: options.hitboxScale || 1,
    }))
}

function blueJumpWave(attack, bounds, type, options = {}) {
  const fromLeft = options.fromLeft ?? true
  const x = fromLeft ? -(options.width || 70) : bounds.width + (options.width || 70)
  const floorY = bounds.height - SOUL_RADIUS
  const speed = attack.speed * (options.speedMultiplier || 1)
  const width = options.width || 70
  const lowHeight = options.lowHeight || 32
  const highHeight = options.highHeight || 78
  const low = projectile(attack, {
    type,
    width,
    height: lowHeight,
    x,
    y: floorY - lowHeight / 2,
    vx: fromLeft ? speed : -speed,
    vy: 0,
    rotation: 0,
    hitboxScale: options.hitboxScale || 0.92,
  })

  if (!options.withCeiling) {
    return [low]
  }

  return [
    low,
    projectile(attack, {
      type,
      width: options.ceilingWidth || width * 0.8,
      height: highHeight,
      x: fromLeft ? x - width * 1.25 : x + width * 1.25,
      y: SOUL_RADIUS + highHeight / 2 + 6,
      vx: fromLeft ? speed : -speed,
      vy: 0,
      rotation: 0,
      hitboxScale: options.hitboxScale || 0.88,
    }),
  ]
}

function fan(attack, type, options) {
  const count = options.count || 5
  const start = options.startAngle ?? 0
  const end = options.endAngle ?? 360
  const speed = attack.speed * (options.speedMultiplier || 1)

  return Array.from({ length: count }, (_, index) => {
    const ratio = count === 1 ? 0.5 : index / (count - 1)
    const angle = start + (end - start) * ratio
    const velocity = velocityFromAngle(angle, speed)

    return projectile(attack, {
      type,
      width: options.width || 20,
      height: options.height || 20,
      x: options.x,
      y: options.y,
      ...velocity,
      rotation: angle,
      spin: options.spin || 0,
      hitboxScale: options.hitboxScale || 1,
    })
  })
}

function fanToward(attack, bounds, type, options) {
  const targetX = options.targetX ?? bounds.width / 2
  const targetY = options.targetY ?? bounds.height / 2
  const centerAngle = (Math.atan2(targetY - options.y, targetX - options.x) * 180) / Math.PI
  const spread = options.spread ?? 70

  return fan(attack, type, {
    ...options,
    startAngle: centerAngle - spread / 2,
    endAngle: centerAngle + spread / 2,
  })
}

function aimed(attack, bounds, type, options = {}) {
  const width = options.width || 22
  const height = options.height || 22
  const speed = attack.speed * (options.speedMultiplier || 1)
  const sourceX = options.x
  const sourceY = options.y
  const targetX = options.targetX ?? bounds.width / 2
  const targetY = options.targetY ?? bounds.height / 2
  const dx = targetX - sourceX
  const dy = targetY - sourceY
  const len = Math.hypot(dx, dy) || 1

  return projectile(attack, {
    type,
    width,
    height,
    x: sourceX,
    y: sourceY,
    vx: (dx / len) * speed,
    vy: (dy / len) * speed,
    rotation: (Math.atan2(dy, dx) * 180) / Math.PI,
    spin: options.spin || 0,
    hitboxScale: options.hitboxScale || 1,
  })
}

function corner(bounds, index, padding = 36) {
  const corners = [
    { x: -padding, y: -padding },
    { x: bounds.width + padding, y: -padding },
    { x: bounds.width + padding, y: bounds.height + padding },
    { x: -padding, y: bounds.height + padding },
  ]

  return corners[index % corners.length]
}

function spawnProjectiles(pattern, rect, attack, state = {}) {
  const bounds = {
    width: rect?.width || DEFAULT_ARENA.width,
    height: rect?.height || DEFAULT_ARENA.height,
  }
  const spawnIndex = state.spawnIndex || 0
  const elapsed = state.elapsedMs || 0
  const pulse = Math.floor(elapsed / 900)

  switch (pattern) {
    case 'printerRain': {
      const gap = (spawnIndex + pulse) % 7
      const sheets = topWall(attack, bounds, 'paper', {
        lanes: 7,
        gap,
        width: 28,
        height: 12,
        speedMultiplier: 0.92,
        drift: 8,
        stagger: true,
        spin: 80,
      })
      return spawnIndex % 3 === 0
        ? [...sheets, fromSide(attack, bounds, 'paper', { width: 34, height: 12 })]
        : sheets
    }

    case 'printerSides': {
      const gap = (spawnIndex * 2 + pulse) % 5
      const fromLeft = spawnIndex % 2 === 0
      const wall = sideWall(attack, bounds, 'paper', {
        rows: 5,
        gap,
        fromLeft,
        width: 42,
        height: 14,
        speedMultiplier: 1.05,
      })
      return spawnIndex % 4 === 0
        ? [...wall, fromTop(attack, bounds, 'paper', { width: 24, height: 12 })]
        : wall
    }

    case 'printerJam': {
      const sourceX = spawnIndex % 2 === 0 ? bounds.width * 0.16 : bounds.width * 0.84
      const fanBurst = fan(attack, 'paper', {
        x: sourceX,
        y: -28,
        startAngle: 55,
        endAngle: 125,
        count: 5,
        width: 30,
        height: 12,
        speedMultiplier: 1.04,
        spin: 120,
      })
      return spawnIndex % 3 === 0
        ? fanBurst
        : topWall(attack, bounds, 'paper', {
            lanes: 8,
            gap: (spawnIndex + 2) % 8,
            width: 26,
            height: 12,
            speedMultiplier: 0.95,
            spin: 100,
          })
    }

    case 'deanStamp':
      return topWall(attack, bounds, 'stamp', {
        lanes: 6,
        gap: (spawnIndex + pulse) % 6,
        width: 28,
        height: 28,
        speedMultiplier: 0.95,
        stagger: true,
      })

    case 'deanCross': {
      const gapX = spawnIndex % 7
      const gapY = (spawnIndex + 2) % 5
      return [
        ...topWall(attack, bounds, 'stamp', {
          lanes: 7,
          gap: gapX,
          width: 22,
          height: 22,
          speedMultiplier: 0.92,
        }),
        ...sideWall(attack, bounds, 'stamp', {
          rows: 5,
          gap: gapY,
          fromLeft: spawnIndex % 2 === 0,
          width: 22,
          height: 22,
          speedMultiplier: 0.96,
        }),
      ]
    }

    case 'deanSweep':
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'stamp', {
          fromLeft: spawnIndex % 2 === 0,
          width: 58,
          lowHeight: 34,
          withCeiling: spawnIndex % 3 === 1,
          speedMultiplier: 1.02,
        })
      }

      return sideWall(attack, bounds, 'stamp', {
        rows: 6,
        gap: (spawnIndex + Math.floor(pulse / 2)) % 6,
        fromLeft: spawnIndex % 2 === 0,
        width: 34,
        height: 76,
        speedMultiplier: 1.02,
        hitboxScale: 0.88,
      })

    case 'chatFlood': {
      const gap = (spawnIndex + Math.floor(pulse / 2)) % 8
      const messages = topWall(attack, bounds, 'message', {
        lanes: 8,
        gap,
        gapSize: 1,
        width: 42,
        height: 18,
        speedMultiplier: 0.96,
        drift: spawnIndex % 2 === 0 ? 7 : -7,
      })
      return spawnIndex % 2 === 0
        ? [...messages, fromSide(attack, bounds, 'message', { width: 48, height: 20 })]
        : messages
    }

    case 'chatMessage':
      return sideWall(attack, bounds, 'message', {
        rows: 6,
        gap: (spawnIndex * 2 + 1) % 6,
        fromLeft: spawnIndex % 2 === 1,
        width: 54,
        height: 22,
        speedMultiplier: 1.1,
      })

    case 'chatBurst': {
      const source = corner(bounds, spawnIndex)
      return fanToward(attack, bounds, 'message', {
        ...source,
        targetX: bounds.width / 2,
        targetY: bounds.height / 2,
        spread: 76,
        count: 6,
        width: 36,
        height: 18,
        speedMultiplier: 0.98,
      })
    }

    case 'bookRain':
      return [
        ...topWall(attack, bounds, 'book', {
          lanes: 7,
          gap: (spawnIndex + pulse) % 7,
          width: 26,
          height: 34,
          speedMultiplier: 0.88,
          stagger: true,
          spin: 70,
        }),
        ...(spawnIndex % 4 === 0 ? [fromTop(attack, bounds, 'bookmark', { width: 12, height: 48 })] : []),
      ]

    case 'shelfSweep':
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'shelf', {
          fromLeft: spawnIndex % 2 === 0,
          width: 112,
          lowHeight: 28,
          highHeight: 86,
          withCeiling: spawnIndex % 4 === 2,
          speedMultiplier: 0.94,
        })
      }

      return sideWall(attack, bounds, 'shelf', {
        rows: 5,
        gap: (spawnIndex + 1) % 5,
        fromLeft: spawnIndex % 2 === 0,
        width: 132,
        height: 24,
        speedMultiplier: 0.96,
        hitboxScale: 0.92,
      })

    case 'bookmarkCross': {
      const left = aimed(attack, bounds, 'bookmark', {
        x: -20,
        y: lane(spawnIndex % 5, 5, bounds.height),
        targetX: bounds.width + 40,
        targetY: lane((spawnIndex + 2) % 5, 5, bounds.height),
        width: 12,
        height: 54,
        speedMultiplier: 1.04,
      })
      const top = aimed(attack, bounds, 'bookmark', {
        x: lane((spawnIndex + 3) % 7, 7, bounds.width),
        y: -24,
        targetX: lane(spawnIndex % 7, 7, bounds.width),
        targetY: bounds.height + 44,
        width: 12,
        height: 54,
        speedMultiplier: 0.98,
      })
      return [left, top]
    }

    case 'badgeRain':
      return topWall(attack, bounds, 'badge', {
        lanes: 7,
        gap: (spawnIndex * 2 + pulse) % 7,
        width: 24,
        height: 24,
        speedMultiplier: 1,
        stagger: true,
        spin: 180,
      })

    case 'spotlightSweep':
      return sideWall(attack, bounds, 'spotlight', {
        rows: 4,
        gap: (spawnIndex + 1) % 4,
        fromLeft: spawnIndex % 2 === 0,
        width: 32,
        height: 122,
        speedMultiplier: 0.9,
        hitboxScale: 0.72,
      })

    case 'tapeLine': {
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'tape', {
          fromLeft: spawnIndex % 2 === 0,
          width: 118,
          lowHeight: 14,
          highHeight: 92,
          withCeiling: spawnIndex % 3 === 2,
          speedMultiplier: 1.04,
        })
      }

      const gap = spawnIndex % 6
      return [
        ...sideWall(attack, bounds, 'tape', {
          rows: 6,
          gap,
          fromLeft: true,
          width: 118,
          height: 12,
          speedMultiplier: 1.02,
        }),
        ...sideWall(attack, bounds, 'tape', {
          rows: 6,
          gap: (gap + 3) % 6,
          fromLeft: false,
          width: 118,
          height: 12,
          speedMultiplier: 0.92,
        }),
      ]
    }

    case 'formRain':
      return topWall(attack, bounds, 'form', {
        lanes: 8,
        gap: (spawnIndex + pulse) % 8,
        width: 24,
        height: 30,
        speedMultiplier: 0.92,
        drift: spawnIndex % 2 === 0 ? 6 : -6,
        stagger: true,
      })

    case 'signatureWall': {
      const fromLeft = spawnIndex % 2 === 0
      const wall = sideWall(attack, bounds, 'signature', {
        rows: 6,
        gap: (spawnIndex + 2) % 6,
        fromLeft,
        width: 112,
        height: 12,
        speedMultiplier: 1.08,
      })
      return spawnIndex % 3 === 0
        ? [...wall, aimed(attack, bounds, 'signature', {
            x: fromLeft ? bounds.width + 70 : -70,
            y: -20,
            targetX: fromLeft ? -30 : bounds.width + 30,
            targetY: bounds.height + 36,
            width: 96,
            height: 12,
            speedMultiplier: 0.9,
          })]
        : wall
    }

    case 'deadlineRush':
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'deadline', {
          fromLeft: spawnIndex % 2 === 1,
          width: 68,
          lowHeight: 30,
          highHeight: 72,
          withCeiling: spawnIndex % 4 === 1,
          speedMultiplier: 1.1,
        })
      }

      return sideWall(attack, bounds, 'deadline', {
        rows: 5,
        gap: (spawnIndex * 2 + pulse) % 5,
        fromLeft: spawnIndex % 2 === 1,
        width: 64,
        height: 26,
        speedMultiplier: 1.18,
      })

    case 'sansBoneRain':
      return topWall(attack, bounds, 'bone', {
        lanes: 9,
        gap: (spawnIndex + pulse) % 9,
        width: 14,
        height: 58,
        speedMultiplier: 1,
        stagger: true,
      })

    case 'sansBoneWalls':
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'bone', {
          fromLeft: spawnIndex % 2 === 0,
          width: 64,
          lowHeight: 42,
          highHeight: 92,
          withCeiling: spawnIndex % 3 === 1,
          speedMultiplier: 1.06,
        })
      }

      return sideWall(attack, bounds, 'bone', {
        rows: 6,
        gap: (spawnIndex + Math.floor(pulse / 2)) % 6,
        fromLeft: spawnIndex % 2 === 0,
        width: 18,
        height: 82,
        speedMultiplier: 1.08,
        hitboxScale: 0.84,
      })

    case 'sansBlasterFan': {
      const source = spawnIndex % 2 === 0
        ? { x: bounds.width / 2, y: -48 }
        : { x: bounds.width / 2, y: bounds.height + 48 }
      return fan(attack, 'beam', {
        ...source,
        startAngle: spawnIndex % 2 === 0 ? 42 : 222,
        endAngle: spawnIndex % 2 === 0 ? 138 : 318,
        count: 5,
        width: 18,
        height: 132,
        speedMultiplier: 0.94,
        hitboxScale: 0.65,
      })
    }

    case 'sansCross':
      return [
        ...topWall(attack, bounds, 'bone', {
          lanes: 8,
          gap: spawnIndex % 8,
          width: 14,
          height: 58,
          speedMultiplier: 0.98,
        }),
        ...sideWall(attack, bounds, 'bone', {
          rows: 5,
          gap: (spawnIndex + 2) % 5,
          fromLeft: spawnIndex % 2 === 0,
          width: 62,
          height: 14,
          speedMultiplier: 1.02,
        }),
      ]

    case 'sansSweep':
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'bone', {
          fromLeft: spawnIndex % 2 === 0,
          width: 130,
          lowHeight: spawnIndex % 2 === 0 ? 24 : 42,
          highHeight: 82,
          withCeiling: spawnIndex % 3 === 0,
          speedMultiplier: 1.08,
        })
      }

      return sideWall(attack, bounds, 'bone', {
        rows: 7,
        gap: (spawnIndex + 3) % 7,
        fromLeft: spawnIndex % 2 === 0,
        width: 144,
        height: 14,
        speedMultiplier: 1.1,
        hitboxScale: 0.92,
      })

    case 'sansBarrier':
      if (attack.soulMode === 'blue') {
        return [
          ...blueJumpWave(attack, bounds, 'bone', {
            fromLeft: spawnIndex % 2 === 0,
            width: 70,
            lowHeight: 38,
            withCeiling: false,
            speedMultiplier: 1.08,
          }),
          ...(spawnIndex % 2 === 0
            ? topWall(attack, bounds, 'bone', {
                lanes: 7,
                gap: (spawnIndex + 2) % 7,
                width: 14,
                height: 46,
                speedMultiplier: 0.92,
              })
            : []),
        ]
      }

      return [
        ...topWall(attack, bounds, 'bone', {
          lanes: 9,
          gap: spawnIndex % 9,
          width: 14,
          height: 54,
          speedMultiplier: 1.05,
        }),
        ...bottomWall(attack, bounds, 'bone', {
          lanes: 9,
          gap: (spawnIndex + 4) % 9,
          width: 14,
          height: 54,
          speedMultiplier: 1.05,
        }),
      ]

    case 'sansTrap': {
      if (attack.soulMode === 'blue') {
        const source = corner(bounds, spawnIndex, 44)
        return [
          ...blueJumpWave(attack, bounds, 'bone', {
            fromLeft: spawnIndex % 2 === 0,
            width: 76,
            lowHeight: 36,
            withCeiling: spawnIndex % 2 === 1,
            speedMultiplier: 1.08,
          }),
          ...fanToward(attack, bounds, 'bone', {
            ...source,
            targetX: bounds.width / 2,
            targetY: bounds.height * 0.45,
            spread: 72,
            count: 4,
            width: 14,
            height: 46,
            speedMultiplier: 0.9,
          }),
        ]
      }

      const source = corner(bounds, spawnIndex, 44)
      const burst = fanToward(attack, bounds, 'bone', {
        ...source,
        targetX: bounds.width / 2,
        targetY: bounds.height / 2,
        spread: 88,
        count: 6,
        width: 14,
        height: 52,
        speedMultiplier: 1.02,
      })
      return spawnIndex % 2 === 0
        ? [...burst, ...sideWall(attack, bounds, 'bone', {
            rows: 6,
            gap: (spawnIndex + 1) % 6,
            fromLeft: true,
            width: 64,
            height: 14,
            speedMultiplier: 1.06,
          })]
        : [...burst, ...topWall(attack, bounds, 'bone', {
            lanes: 8,
            gap: (spawnIndex + 2) % 8,
            width: 14,
            height: 52,
            speedMultiplier: 1.02,
          })]
    }

    case 'moldSporeRain':
      return topWall(attack, bounds, 'spore', {
        lanes: 8,
        gap: (spawnIndex + pulse) % 8,
        width: 20,
        height: 20,
        speedMultiplier: 0.96,
        drift: spawnIndex % 2 === 0 ? 10 : -10,
        stagger: true,
      })

    case 'moldBarrier':
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'slime', {
          fromLeft: spawnIndex % 2 === 0,
          width: 72,
          lowHeight: 38,
          highHeight: 78,
          withCeiling: spawnIndex % 4 === 2,
          speedMultiplier: 1,
        })
      }

      return sideWall(attack, bounds, 'slime', {
        rows: 6,
        gap: (spawnIndex + 2) % 6,
        fromLeft: spawnIndex % 2 === 0,
        width: 26,
        height: 88,
        speedMultiplier: 1.02,
        hitboxScale: 0.88,
      })

    case 'slimeFlood':
      if (attack.soulMode === 'blue') {
        return [
          ...blueJumpWave(attack, bounds, 'slime', {
            fromLeft: spawnIndex % 2 === 0,
            width: 62,
            lowHeight: 42,
            withCeiling: false,
            speedMultiplier: 0.94,
          }),
          ...(spawnIndex % 3 === 0 ? [fromTop(attack, bounds, 'spore', { width: 18, height: 18 })] : []),
        ]
      }

      return [
        ...bottomWall(attack, bounds, 'slime', {
          lanes: 7,
          gap: spawnIndex % 7,
          width: 32,
          height: 36,
          speedMultiplier: 0.92,
          stagger: true,
        }),
        ...(spawnIndex % 3 === 0 ? [fromTop(attack, bounds, 'spore', { width: 20, height: 20 })] : []),
      ]

    case 'moldCross':
      return [
        ...topWall(attack, bounds, 'spore', {
          lanes: 7,
          gap: spawnIndex % 7,
          width: 20,
          height: 20,
          speedMultiplier: 1,
        }),
        ...sideWall(attack, bounds, 'spore', {
          rows: 5,
          gap: (spawnIndex + 2) % 5,
          fromLeft: spawnIndex % 2 === 0,
          width: 20,
          height: 20,
          speedMultiplier: 1.04,
        }),
      ]

    case 'fridgeSlice':
      if (attack.soulMode === 'blue') {
        return blueJumpWave(attack, bounds, 'slice', {
          fromLeft: spawnIndex % 2 === 0,
          width: 88,
          lowHeight: 30,
          highHeight: 84,
          withCeiling: spawnIndex % 3 === 1,
          speedMultiplier: 1.12,
        })
      }

      return sideWall(attack, bounds, 'slice', {
        rows: 5,
        gap: (spawnIndex + pulse) % 5,
        fromLeft: spawnIndex % 2 === 0,
        width: 86,
        height: 26,
        speedMultiplier: 1.2,
      })

    default:
      return [fromTop(attack, bounds, 'paper', { width: 22, height: 22 })]
  }
}

function moveRedSoul(soul, keys, dt, bounds) {
  let dx = 0
  let dy = 0

  if (keys.has('ArrowLeft') || keys.has('KeyA')) dx -= 1
  if (keys.has('ArrowRight') || keys.has('KeyD')) dx += 1
  if (keys.has('ArrowUp') || keys.has('KeyW')) dy -= 1
  if (keys.has('ArrowDown') || keys.has('KeyS')) dy += 1

  if (!dx && !dy) {
    return { ...soul, vx: 0, vy: 0 }
  }

  const len = Math.hypot(dx, dy)
  const nextX = clamp(soul.x + (dx / len) * soul.speed * dt, SOUL_RADIUS, bounds.width - SOUL_RADIUS)
  const nextY = clamp(soul.y + (dy / len) * soul.speed * dt, SOUL_RADIUS, bounds.height - SOUL_RADIUS)

  return { ...soul, x: nextX, y: nextY, vx: 0, vy: 0, onGround: false, jumpQueued: false }
}

function moveBlueSoul(soul, keys, dt, bounds) {
  let direction = 0

  if (keys.has('ArrowLeft') || keys.has('KeyA')) direction -= 1
  if (keys.has('ArrowRight') || keys.has('KeyD')) direction += 1

  const floorY = bounds.height - SOUL_RADIUS
  const ceilingY = SOUL_RADIUS
  const control = soul.onGround ? 1 : BLUE_AIR_CONTROL
  const nextVx = direction * soul.speed * control
  let nextVy = soul.vy || 0
  let onGround = soul.onGround

  if (soul.jumpQueued && onGround) {
    nextVy = BLUE_JUMP_VELOCITY
    onGround = false
  }

  nextVy += BLUE_GRAVITY * dt

  if (keys.has('ArrowDown') || keys.has('KeyS')) {
    nextVy += BLUE_FAST_FALL * dt
  }

  let nextX = clamp(soul.x + nextVx * dt, SOUL_RADIUS, bounds.width - SOUL_RADIUS)
  let nextY = soul.y + nextVy * dt

  if (nextY >= floorY) {
    nextY = floorY
    nextVy = 0
    onGround = true
  }

  if (nextY <= ceilingY) {
    nextY = ceilingY
    nextVy = Math.max(0, nextVy)
  }

  return {
    ...soul,
    x: nextX,
    y: nextY,
    vx: nextVx,
    vy: nextVy,
    onGround,
    jumpQueued: false,
  }
}

function moveSoul(soul, keys, dt, bounds) {
  if (soul.mode === 'blue') {
    return moveBlueSoul(soul, keys, dt, bounds)
  }

  return moveRedSoul(soul, keys, dt, bounds)
}

function updateProjectiles(projectiles, dt, bounds) {
  return projectiles
    .map((proj) => {
      const vx = (proj.vx || 0) + (proj.ax || 0) * dt
      const vy = (proj.vy || 0) + (proj.ay || 0) * dt

      return {
        ...proj,
        vx,
        vy,
        age: (proj.age || 0) + dt,
        x: proj.x + vx * dt,
        y: proj.y + vy * dt,
        rotation: (proj.rotation || 0) + (proj.spin || 0) * dt,
      }
    })
    .filter((proj) => (
      proj.x > -260 &&
      proj.x < bounds.width + 260 &&
      proj.y > -260 &&
      proj.y < bounds.height + 260
    ))
}

function touchesSoul(projectileData, soul) {
  const scale = projectileData.hitboxScale || 1
  const halfW = (projectileData.width * scale) / 2
  const halfH = (projectileData.height * scale) / 2

  return (
    Math.abs(soul.x - projectileData.x) <= halfW + SOUL_RADIUS &&
    Math.abs(soul.y - projectileData.y) <= halfH + SOUL_RADIUS
  )
}

function resizeCanvas(canvas, bounds) {
  const dpr = window.devicePixelRatio || 1
  const width = Math.max(1, Math.round(bounds.width * dpr))
  const height = Math.max(1, Math.round(bounds.height * dpr))

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width
    canvas.height = height
  }

  const ctx = canvas.getContext('2d')
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  return ctx
}

function drawRoundRect(ctx, x, y, width, height, radius = 3) {
  const r = Math.min(radius, width / 2, height / 2)

  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + width - r, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + r)
  ctx.lineTo(x + width, y + height - r)
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height)
  ctx.lineTo(x + r, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - r)
  ctx.lineTo(x, y + r)
  ctx.quadraticCurveTo(x, y, x + r, y)
  ctx.closePath()
}

function projectileStyle(type) {
  const styles = {
    paper: { fill: '#f8f8f8', stroke: '#ffffff', radius: 1 },
    stamp: { fill: '#ff4a4a', stroke: '#ffffff', radius: 999 },
    message: { fill: '#8be7ff', stroke: '#ffffff', radius: 5 },
    book: { fill: '#b48a62', stroke: '#fff0d0', radius: 2 },
    badge: { fill: '#ffd257', stroke: '#fff7b0', radius: 999 },
    form: { fill: '#c8ffc8', stroke: '#ffffff', radius: 2 },
    bone: { fill: '#f4f4f4', stroke: '#ffffff', radius: 6 },
    spore: { fill: '#9cff74', stroke: '#ddffd2', radius: 999 },
    shelf: { fill: '#8d6748', stroke: '#d8b38d', radius: 2 },
    bookmark: { fill: '#ffcc4a', stroke: '#ffffff', radius: 999 },
    spotlight: { fill: 'rgba(255, 235, 122, 0.72)', stroke: '#fff7bd', radius: 999 },
    tape: { fill: '#ffd34f', stroke: '#161616', radius: 999 },
    signature: { fill: '#f2fbff', stroke: '#80d9ff', radius: 999 },
    deadline: { fill: '#e8293f', stroke: '#ffffff', radius: 3 },
    beam: { fill: '#eaffff', stroke: '#87ecff', radius: 999 },
    slime: { fill: '#78d94f', stroke: '#d8ffc8', radius: 999 },
    slice: { fill: '#ebfff0', stroke: '#ffffff', radius: 2 },
  }

  return styles[type] || styles.paper
}

function drawProjectile(ctx, proj) {
  const style = projectileStyle(proj.type)
  const alpha = proj.hit ? 0.25 : 1

  ctx.save()
  ctx.translate(proj.x, proj.y)
  ctx.rotate(((proj.rotation || 0) * Math.PI) / 180)
  ctx.globalAlpha = alpha
  ctx.fillStyle = style.fill
  ctx.strokeStyle = style.stroke
  ctx.lineWidth = proj.type === 'beam' || proj.type === 'spotlight' ? 2 : 1

  if (style.radius >= 999) {
    const radius = Math.max(proj.width, proj.height) / 2
    ctx.beginPath()
    ctx.ellipse(0, 0, proj.width / 2, proj.height / 2, 0, 0, Math.PI * 2)
    ctx.fill()
    ctx.stroke()

    if (proj.type === 'bone') {
      ctx.beginPath()
      ctx.arc(0, -proj.height / 2 + radius * 0.35, radius * 0.28, 0, Math.PI * 2)
      ctx.arc(0, proj.height / 2 - radius * 0.35, radius * 0.28, 0, Math.PI * 2)
      ctx.fill()
    }
  } else {
    drawRoundRect(ctx, -proj.width / 2, -proj.height / 2, proj.width, proj.height, style.radius)
    ctx.fill()
    ctx.stroke()
  }

  if (proj.type === 'tape') {
    ctx.strokeStyle = '#111'
    ctx.lineWidth = 2
    for (let x = -proj.width / 2 + 10; x < proj.width / 2; x += 18) {
      ctx.beginPath()
      ctx.moveTo(x, -proj.height / 2)
      ctx.lineTo(x + 8, proj.height / 2)
      ctx.stroke()
    }
  }

  ctx.restore()
}

function drawSoul(ctx, soul, invulnUntil, now) {
  const blink = now < invulnUntil && Math.floor(now / 90) % 2 === 0

  if (blink) {
    return
  }

  ctx.save()
  ctx.translate(soul.x, soul.y)
  ctx.fillStyle = soul.mode === 'blue' ? '#2f77ff' : '#ff1f4d'
  ctx.strokeStyle = '#ffffff'
  ctx.lineWidth = 1.5
  ctx.beginPath()
  ctx.moveTo(0, 12)
  ctx.bezierCurveTo(-18, 0, -13, -16, 0, -7)
  ctx.bezierCurveTo(13, -16, 18, 0, 0, 12)
  ctx.closePath()
  ctx.fill()
  ctx.stroke()
  ctx.restore()
}

function drawArenaCanvas(canvas, battle, phase, bounds, now) {
  if (!canvas || !battle || !bounds) {
    return
  }

  const ctx = resizeCanvas(canvas, bounds)

  ctx.clearRect(0, 0, bounds.width, bounds.height)
  ctx.fillStyle = '#000000'
  ctx.fillRect(0, 0, bounds.width, bounds.height)

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)'
  ctx.lineWidth = 1
  for (let x = 0; x <= bounds.width; x += 28) {
    ctx.beginPath()
    ctx.moveTo(x + 0.5, 0)
    ctx.lineTo(x + 0.5, bounds.height)
    ctx.stroke()
  }
  for (let y = 0; y <= bounds.height; y += 28) {
    ctx.beginPath()
    ctx.moveTo(0, y + 0.5)
    ctx.lineTo(bounds.width, y + 0.5)
    ctx.stroke()
  }

  battle.projectiles.forEach((proj) => drawProjectile(ctx, proj))

  if (battle.soul.mode === 'blue') {
    ctx.strokeStyle = 'rgba(47, 119, 255, 0.92)'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(0, bounds.height - SOUL_RADIUS + 0.5)
    ctx.lineTo(bounds.width, bounds.height - SOUL_RADIUS + 0.5)
    ctx.stroke()

    ctx.fillStyle = 'rgba(47, 119, 255, 0.95)'
    ctx.font = '700 14px "Courier New", monospace'
    ctx.fillText('BLUE MODE: JUMP', 12, 24)
  } else {
    ctx.fillStyle = 'rgba(255, 31, 77, 0.95)'
    ctx.font = '700 14px "Courier New", monospace'
    ctx.fillText('RED MODE: MOVE', 12, 24)
  }

  if (phase === 'attack' || phase === 'menu' || phase === 'busy') {
    drawSoul(ctx, battle.soul, battle.invulnUntil, now)
  }
}

function updateAttackFrame(battle, dt, now, bounds, keys) {
  const soul = moveSoul(battle.soul, keys, dt, bounds)
  let projectiles = updateProjectiles(battle.projectiles, dt, bounds)
  let playerHp = battle.playerHp
  let invulnUntil = battle.invulnUntil

  if (now >= invulnUntil) {
    const hitIndex = projectiles.findIndex((proj) => !proj.hit && touchesSoul(proj, soul))

    if (hitIndex >= 0) {
      const hit = projectiles[hitIndex]
      playerHp = clamp(playerHp - hit.damage, 0, battle.playerMaxHp)
      invulnUntil = now + INVULN_MS
      projectiles = projectiles.map((proj, index) => (
        index === hitIndex ? { ...proj, hit: true } : proj
      ))
    }
  }

  return {
    ...battle,
    soul,
    projectiles,
    playerHp,
    invulnUntil,
  }
}

export default function BattleScene({ sceneId, bossId, flags, onWin, onLose, updateFlags }) {
  const scene = BOSSES[bossId || sceneId.replace('battle-', '')]
  const [battle, setBattle] = useState(null)
  const [phase, setPhase] = useState('menu')
  const [message, setMessage] = useState(scene?.intro || '')
  const [submenu, setSubmenu] = useState(null)
  const [timing, setTiming] = useState(null)

  const arenaRef = useRef(null)
  const keysRef = useRef(new Set())
  const battleRef = useRef(null)
  const phaseRef = useRef('menu')
  const timingRef = useRef(null)
  const flagsRef = useRef(flags)
  const onWinRef = useRef(onWin)
  const onLoseRef = useRef(onLose)
  const updateFlagsRef = useRef(updateFlags)
  const arenaCanvasRef = useRef(null)
  const finishedRef = useRef(false)
  const lastFrameTimeRef = useRef(0)
  const hiddenAtRef = useRef(null)
  const animationFrameRef = useRef(null)
  const attackIntervalRef = useRef(null)
  const attackTimeoutRef = useRef(null)
  const beginEnemyAttackRef = useRef(null)
  const finishBattleRef = useRef(null)
  const resolveFightStrikeRef = useRef(null)

  const setBattleState = useCallback((nextOrUpdater, options = {}) => {
    const base = battleRef.current
    const next = typeof nextOrUpdater === 'function' ? nextOrUpdater(base) : nextOrUpdater
    battleRef.current = next

    if (!options.silent) {
      setBattle(next)
    }

    return next
  }, [])

  const clearAttackTimers = useCallback(() => {
    if (attackIntervalRef.current) {
      window.clearInterval(attackIntervalRef.current)
      attackIntervalRef.current = null
    }

    if (attackTimeoutRef.current) {
      window.clearTimeout(attackTimeoutRef.current)
      attackTimeoutRef.current = null
    }
  }, [])

  useEffect(() => {
    flagsRef.current = flags
    onWinRef.current = onWin
    onLoseRef.current = onLose
    updateFlagsRef.current = updateFlags
  }, [flags, onWin, onLose, updateFlags])

  useEffect(() => {
    phaseRef.current = phase
  }, [phase])

  useEffect(() => {
    timingRef.current = timing
  }, [timing])

  const finishBattle = useCallback((outcome) => {
    if (finishedRef.current) {
      return
    }

    finishedRef.current = true
    clearAttackTimers()
    keysRef.current.clear()
    phaseRef.current = 'finished'
    setPhase('finished')
    setSubmenu(null)
    setTiming(null)
    timingRef.current = null

    const current = battleRef.current

    if (outcome === 'win' && current) {
      updateFlagsRef.current({
        spared: {
          ...(flagsRef.current.spared || {}),
          [current.boss.id]: true,
        },
      })
      setMessage('Победа. День двигается дальше.')
      window.setTimeout(() => onWinRef.current(current.boss.winScene), 560)
      return
    }

    setMessage('Гоша выдохлась. День начинается заново.')
    window.setTimeout(() => onLoseRef.current(), 620)
  }, [clearAttackTimers])

  useEffect(() => {
    finishBattleRef.current = finishBattle
  }, [finishBattle])

  const beginEnemyAttack = useCallback(() => {
    const current = battleRef.current

    if (!current || finishedRef.current || current.enemyHp <= 0 || current.playerHp <= 0) {
      return
    }

    clearAttackTimers()

    const attack = current.attacks[current.turn % current.attacks.length]
    const rect = arenaRef.current?.getBoundingClientRect() || DEFAULT_ARENA
    const startTime = performance.now()
    const soulMode = attack.soulMode || 'red'
    const centeredSoul = {
      ...current.soul,
      x: rect.width / 2,
      y: soulMode === 'blue' ? rect.height - SOUL_RADIUS : rect.height / 2,
      vx: 0,
      vy: 0,
      mode: soulMode,
      onGround: soulMode === 'blue',
      jumpQueued: false,
    }

    phaseRef.current = 'attack'
    setPhase('attack')
    setSubmenu(null)
    setTiming(null)
    timingRef.current = null
    setMessage(`${attack.line} ${soulMode === 'blue' ? 'Синяя душа: прыгай.' : 'Красная душа: двигайся.'}`)

    setBattleState((prev) => ({
      ...prev,
      turn: prev.turn + 1,
      projectiles: [],
      soul: centeredSoul,
      attackStartedAt: startTime,
      currentAttack: attack,
    }))

    let spawnIndex = 0

    attackIntervalRef.current = window.setInterval(() => {
      if (finishedRef.current || phaseRef.current !== 'attack') {
        clearAttackTimers()
        return
      }

      const arenaRect = arenaRef.current?.getBoundingClientRect() || DEFAULT_ARENA
      const elapsedMs = performance.now() - startTime
      const nextProjectiles = spawnProjectiles(attack.pattern, arenaRect, attack, {
        spawnIndex,
        elapsedMs,
      })
      spawnIndex += 1

      setBattleState((prev) => {
        if (!prev) return prev
        return {
          ...prev,
          projectiles: [...prev.projectiles, ...nextProjectiles].slice(-220),
        }
      }, { silent: true })
    }, attack.interval)

    attackTimeoutRef.current = window.setTimeout(() => {
      clearAttackTimers()

      const latest = battleRef.current
      if (!latest || finishedRef.current) {
        return
      }

      if (latest.playerHp <= 0) {
        finishBattleRef.current?.('lose')
        return
      }

      setBattleState((prev) => ({
        ...prev,
        projectiles: [],
        currentAttack: null,
        soul: {
          ...prev.soul,
          x: rect.width / 2,
          y: rect.height / 2,
          vx: 0,
          vy: 0,
          mode: 'red',
          onGround: false,
          jumpQueued: false,
        },
      }))
      phaseRef.current = 'menu'
      setPhase('menu')
      setMessage(latest.boss.intro)
    }, attack.duration)
  }, [clearAttackTimers, setBattleState])

  useEffect(() => {
    beginEnemyAttackRef.current = beginEnemyAttack
  }, [beginEnemyAttack])

  const resolveFightStrike = useCallback((options = {}) => {
    const currentTiming = timingRef.current
    const current = battleRef.current

    if (!currentTiming || !current || phaseRef.current !== 'timing' || finishedRef.current) {
      return
    }

    phaseRef.current = 'busy'
    setPhase('busy')
    setTiming(null)
    timingRef.current = null

    const center = currentTiming.zoneStart + currentTiming.zoneWidth / 2
    const distance = Math.abs(currentTiming.needle - center)
    const zoneHalf = currentTiming.zoneWidth / 2
    const hitRatio = options.timeout ? 0 : clamp(1 - distance / Math.max(0.001, zoneHalf), 0, 1)
    const landed = !options.timeout && distance <= zoneHalf
    const isLibrarian = current.boss.id === 'librarian'
    const damage = isLibrarian
      ? 0
      : landed
        ? Math.round(16 + hitRatio * 16)
        : Math.round(5 + hitRatio * 6)
    const nextEnemyHp = clamp(current.enemyHp - damage, 0, current.enemyMaxHp)

    setSubmenu(null)
    setBattleState((prev) => ({
      ...prev,
      enemyHp: nextEnemyHp,
    }))

    if (options.timeout) {
      setMessage('Промах. Враг перехватывает ход.')
    } else if (isLibrarian) {
      setMessage('Удар нарушает тишину. Лучше действовать спокойно.')
    } else if (hitRatio > 0.84) {
      setMessage(`Точный удар! -${damage}`)
    } else if (landed) {
      setMessage(`Удар! -${damage}`)
    } else {
      setMessage(`Скользящий удар. -${damage}`)
    }

    if (nextEnemyHp <= 0) {
      finishBattleRef.current?.('win')
      return
    }

    window.setTimeout(() => beginEnemyAttackRef.current?.(), 380)
  }, [setBattleState])

  useEffect(() => {
    resolveFightStrikeRef.current = resolveFightStrike
  }, [resolveFightStrike])

  useEffect(() => {
    if (!scene) {
      battleRef.current = null
      setBattle(null)
      return
    }

    clearAttackTimers()
    finishedRef.current = false
    keysRef.current.clear()
    lastFrameTimeRef.current = 0
    phaseRef.current = 'menu'
    timingRef.current = null

    setPhase('menu')
    setSubmenu(null)
    setTiming(null)
    setMessage(scene.intro)
    setBattleState(createBattleState(scene, flags))

    return clearAttackTimers
  }, [scene, clearAttackTimers, setBattleState])

  useEffect(() => {
    const handleKeyDown = (e) => {
      const playKey = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'KeyA',
        'KeyD',
        'KeyW',
        'KeyS',
        'Space',
        'Enter',
      ].includes(e.code)

      if (playKey && (phaseRef.current === 'attack' || phaseRef.current === 'timing')) {
        e.preventDefault()
      }

      keysRef.current.add(e.code)

      if ((e.code === 'Space' || e.code === 'Enter') && phaseRef.current === 'timing') {
        resolveFightStrikeRef.current?.()
      }

      const jumpKey = e.code === 'ArrowUp' || e.code === 'KeyW' || e.code === 'Space'
      const current = battleRef.current

      if (!e.repeat && jumpKey && phaseRef.current === 'attack' && current?.soul.mode === 'blue') {
        setBattleState((prev) => ({
          ...prev,
          soul: {
            ...prev.soul,
            jumpQueued: true,
          },
        }), { silent: true })
      }
    }

    const handleKeyUp = (e) => {
      keysRef.current.delete(e.code)
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  useEffect(() => {
    const handleVisibilityChange = () => {
      const now = performance.now()

      if (document.hidden) {
        hiddenAtRef.current = now
        return
      }

      if (!hiddenAtRef.current) {
        return
      }

      const hiddenDuration = now - hiddenAtRef.current
      hiddenAtRef.current = null
      lastFrameTimeRef.current = now

      if (phaseRef.current === 'timing' && timingRef.current) {
        const nextTiming = {
          ...timingRef.current,
          startedAt: timingRef.current.startedAt + hiddenDuration,
        }

        timingRef.current = nextTiming
        setTiming(nextTiming)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  useEffect(() => {
    const gameLoop = (currentTime) => {
      const previousTime = lastFrameTimeRef.current || currentTime
      const deltaTime = Math.min((currentTime - previousTime) / 1000, 0.034)
      lastFrameTimeRef.current = currentTime
      const rect = arenaRef.current?.getBoundingClientRect()

      if (phaseRef.current === 'attack' && !finishedRef.current) {
        const current = battleRef.current

        if (current && rect) {
          const next = updateAttackFrame(current, deltaTime, currentTime, rect, keysRef.current)
          const tookDamage = next.playerHp < current.playerHp
          setBattleState(next, { silent: !tookDamage })

          if (tookDamage) {
            document.body.classList.add('shake')
            window.setTimeout(() => document.body.classList.remove('shake'), 180)
          }

          if (next.playerHp <= 0) {
            finishBattleRef.current?.('lose')
          }
        }
      }

      drawArenaCanvas(
        arenaCanvasRef.current,
        battleRef.current,
        phaseRef.current,
        rect,
        currentTime,
      )

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    }

    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [setBattleState])

  useEffect(() => {
    if (phase !== 'timing' || !timing) {
      return undefined
    }

    const startedAt = timing.startedAt
    let animationId = null

    const animate = (currentTime) => {
      if (document.hidden) {
        animationId = requestAnimationFrame(animate)
        return
      }

      const elapsedMs = currentTime - startedAt
      const elapsed = elapsedMs / 1000
      const wave = (Math.sin(elapsed * timing.speed * Math.PI * 2) + 1) / 2

      setTiming((prev) => {
        if (!prev || prev.startedAt !== startedAt) {
          return prev
        }

        const next = { ...prev, needle: wave }
        timingRef.current = next
        return next
      })

      if (elapsedMs >= TIMING_LIMIT_MS) {
        resolveFightStrikeRef.current?.({ timeout: true })
        return
      }

      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [phase, timing?.startedAt])

  const handleFight = () => {
    const current = battleRef.current
    if (!current || phaseRef.current !== 'menu' || finishedRef.current) {
      return
    }

    const zoneWidth = clamp(0.18 + current.calm * 0.018, 0.16, 0.34)
    const zoneStart = rand(0.12, 0.88 - zoneWidth)
    const timingData = {
      startedAt: performance.now(),
      needle: 0,
      zoneStart,
      zoneWidth,
      speed: Math.max(0.92, 1.28 + current.turn * 0.055 - current.calm * 0.04),
    }

    phaseRef.current = 'timing'
    timingRef.current = timingData
    setPhase('timing')
    setSubmenu(null)
    setTiming(timingData)
    setMessage('Останови стрелку в зелёной зоне.')
  }

  const handleAct = () => {
    if (phaseRef.current !== 'menu') {
      return
    }

    setSubmenu('act')
    setMessage('Выбирай действие.')
  }

  const handleItem = () => {
    const current = battleRef.current
    if (!current || phaseRef.current !== 'menu') {
      return
    }

    if (!current.items.length) {
      phaseRef.current = 'busy'
      setPhase('busy')
      setMessage('Пусто.')
      window.setTimeout(() => beginEnemyAttackRef.current?.(), 420)
      return
    }

    setSubmenu('item')
    setMessage('Выбирай предмет.')
  }

  const closeSubmenu = () => {
    setSubmenu(null)
    setMessage(battleRef.current?.boss.intro || '')
  }

  const executeAct = (act) => {
    const current = battleRef.current
    if (!current || phaseRef.current !== 'menu' || finishedRef.current) {
      return
    }

    const isLibrarian = current.boss.id === 'librarian'
    const calmToWin = current.boss.calmToWin || (isLibrarian ? 3 : DEFAULT_CALM_TO_WIN)
    const nextCalm = current.calm + (act.calm || 0)
    const nextPlayerHp = clamp(current.playerHp + (act.heal || 0), 0, current.playerMaxHp)
    const damage = isLibrarian ? 0 : (act.damage || 0)
    const nextEnemyHp = clamp(current.enemyHp - damage, 0, current.enemyMaxHp)
    const nextQuietCounter = isLibrarian && act.calm ? current.quietCounter + 1 : current.quietCounter

    setSubmenu(null)
    phaseRef.current = 'busy'
    setPhase('busy')
    setBattleState((prev) => ({
      ...prev,
      calm: nextCalm,
      playerHp: nextPlayerHp,
      enemyHp: nextEnemyHp,
      quietCounter: nextQuietCounter,
    }))

    if (isLibrarian && act.calm) {
      setMessage(`${act.message} Тишина растёт (${nextQuietCounter}/${calmToWin}).`)
    } else {
      setMessage(act.message)
    }

    if (nextEnemyHp <= 0 || nextCalm >= calmToWin || nextQuietCounter >= calmToWin) {
      window.setTimeout(() => finishBattleRef.current?.('win'), 520)
      return
    }

    window.setTimeout(() => beginEnemyAttackRef.current?.(), 420)
  }

  const useItem = (index) => {
    const current = battleRef.current
    if (!current || phaseRef.current !== 'menu' || finishedRef.current) {
      return
    }

    const item = current.items[index]
    if (!item) {
      return
    }

    const nextItems = [...current.items]
    nextItems.splice(index, 1)
    const nextPlayerHp = clamp(current.playerHp + item.heal, 0, current.playerMaxHp)

    setSubmenu(null)
    phaseRef.current = 'busy'
    setPhase('busy')
    setBattleState((prev) => ({
      ...prev,
      items: nextItems,
      playerHp: nextPlayerHp,
    }))
    setMessage(item.message)
    window.setTimeout(() => beginEnemyAttackRef.current?.(), 420)
  }

  if (!scene) {
    return <div className="battle-loading">Босс не найден: {sceneId}</div>
  }

  if (!battle) {
    return <div className="battle-loading">Загрузка боя...</div>
  }

  return (
    <section className="battle-panel card">
      <div className="battle-top">
        <div className="battle-headline">
          <p className="eyebrow">{battle.boss.tag}</p>
          <h2 className="battle-title">{battle.boss.title}</h2>
        </div>

        <div className="battle-stats">
          <div className="hp-card">
            <div className="stat-label-row">
              <span className="stat-label">Гоша</span>
              <span className="stat-meta">
                {Math.ceil(battle.playerHp)} / {battle.playerMaxHp}
              </span>
            </div>
            <div className="hp-bar">
              <div
                className="hp-fill hp-fill-player"
                style={{ width: `${percent(battle.playerHp, battle.playerMaxHp)}%` }}
              />
            </div>
          </div>

          <div className="hp-card">
            <div className="stat-label-row">
              <span className="stat-label">{battle.boss.enemyName}</span>
              <span className="stat-meta">
                {Math.ceil(battle.enemyHp)} / {battle.enemyMaxHp}
              </span>
            </div>
            <div className="hp-bar">
              <div
                className="hp-fill hp-fill-enemy"
                style={{ width: `${percent(battle.enemyHp, battle.enemyMaxHp)}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <p className="battle-message" aria-live="polite">{message}</p>

      <div className="arena-shell">
        <div className="arena" ref={arenaRef}>
          <canvas className="arena-canvas" ref={arenaCanvasRef} aria-label="Поле боя" />
        </div>
      </div>

      {phase === 'menu' && !submenu && (
        <div className="battle-controls">
          <button type="button" onClick={handleFight}>Удар</button>
          <button type="button" onClick={handleAct}>Действие</button>
          <button type="button" onClick={handleItem}>Предмет</button>
        </div>
      )}

      {submenu === 'act' && (
        <div className="battle-submenu">
          {battle.acts.map((act, index) => (
            <button
              key={index}
              className="choice battle-option"
              type="button"
              onClick={() => executeAct(act)}
            >
              {act.label}
            </button>
          ))}
          <button className="choice battle-option battle-back" type="button" onClick={closeSubmenu}>
            Назад
          </button>
        </div>
      )}

      {submenu === 'item' && (
        <div className="battle-submenu">
          {battle.items.map((item, index) => (
            <button
              key={index}
              className="choice battle-option"
              type="button"
              onClick={() => useItem(index)}
            >
              {item.label} +{item.heal}
            </button>
          ))}
          <button className="choice battle-option battle-back" type="button" onClick={closeSubmenu}>
            Назад
          </button>
        </div>
      )}

      {phase === 'timing' && timing && (
        <div className="battle-timing">
          <p className="battle-timing-label">
            Попади в зелёную зону. Space или Enter тоже сработают.
          </p>
          <div className="battle-timing-bar">
            <div
              className="battle-timing-zone"
              style={{
                left: `${timing.zoneStart * 100}%`,
                width: `${timing.zoneWidth * 100}%`,
              }}
            />
            <div
              className="battle-timing-needle"
              style={{ left: `${timing.needle * 100}%` }}
            />
          </div>
          <button
            className="battle-timing-button"
            type="button"
            onClick={() => resolveFightStrike()}
          >
            Стоп
          </button>
        </div>
      )}
    </section>
  )
}
