import type { CardMove, CardType, RarityLevel, CardStage, PetCardRecord } from "@/types/card"

const types: CardType[] = ["electric", "fire", "water", "grass", "psychic", "dark", "ice", "dragon"]
const rarities: RarityLevel[] = [1, 2, 3, 4, 5]
const stages: CardStage[] = ["BABY", "BASIC", "STAGE 1", "STAGE 2", "EX"]

const owners = [
  { name: "Luna", avatar: "🌙" },
  { name: "Max", avatar: "🐾" },
  { name: "Bella", avatar: "🌸" },
  { name: "Charlie", avatar: "⭐" },
  { name: "Daisy", avatar: "🌼" },
  { name: "Rocky", avatar: "🪨" },
  { name: "Milo", avatar: "🐱" },
  { name: "Coco", avatar: "🥥" },
  { name: "Leo", avatar: "🦁" },
  { name: "Lily", avatar: "🪷" },
]

const petNames = [
  "Mochi", "Oreo", "Simba", "Nala", "Cooper",
  "Zeus", "Luna", "Maple", "Ollie", "Winston",
  "Hazel", "Finn", "Ruby", "Archie", "Pepper",
  "Bailey", "Jack", "Maggie", "Rusty", "Sophie",
]

const speciesList = [
  "Golden Retriever", "Siberian Husky", "Persian Cat", "Holland Lop",
  "Cockatiel", "Bearded Dragon", "Hedgehog", "Ferret",
  "German Shepherd", "Maine Coon", "Parakeet", "Sugar Glider",
]

const moveNames = [
  "Paw Swipe", "Tail Whip", "Furry Blast", "Nuzzle Dash",
  "Sharp Claw", "Howling Strike", "Pounce", "Sonic Bark",
  "Frost Breath", "Flame Tail", "Hydro Pump", "Leaf Storm",
  "Psychic Beam", "Shadow Sneak", "Dragon Rush", "Ice Fang",
]

const flavors = [
  "Loves belly rubs", "Sleeps all day", "Best friend ever",
  "Fast as lightning", "Brave and loyal", "Always hungry",
  "Secret agent in training", "Professional zoomie athlete",
]

function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0
    seed = (seed + 0x6d2b79f5) | 0
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!
}

function randInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min
}

function generateCard(index: number, seedOffset = 0): PetCardRecord {
  const rng = mulberry32(index + seedOffset + 1)
  const type = pick(rng, types)
  const rarity = pick(rng, rarities)
  const owner = pick(rng, owners)
  const move1 = pick(rng, moveNames)
  let move2 = pick(rng, moveNames)
  while (move2 === move1) move2 = pick(rng, moveNames)

  return {
    id: `seed-${seedOffset}-${index}`,
    slug: `seed-${seedOffset}-${index}`,
    name: petNames[index % petNames.length]!,
    species: pick(rng, speciesList),
    stage: pick(rng, stages),
    type,
    rarity,
    imageUrl: null,
    stats: {
      hp: randInt(rng, 60, 200),
      atk: randInt(rng, 30, 150),
      def: randInt(rng, 20, 120),
      spd: randInt(rng, 20, 150),
    },
    moves: [
      { name: move1, damage: randInt(rng, 10, 80), cost: randInt(rng, 1, 3) },
      { name: move2, damage: randInt(rng, 30, 120), cost: randInt(rng, 2, 4) },
    ] as [CardMove, CardMove],
    flavor: pick(rng, flavors),
    cardNumber: `${String(index + 1).padStart(3, "0")}/100`,
    template: rng() > 0.5 ? "neo" : "classic",
    holo: pick(rng, ["none", "basic", "reverse", "regular", "rainbow", "cosmos", "radiant", "secret", "galaxy"] as const),
    owner: owner.name,
    ownerAvatar: owner.avatar,
    isPublic: rng() > 0.3,
    likesCount: randInt(rng, 0, 240),
    createdAt: new Date(Date.now() - index * 86400000).toISOString(),
  }
}

export const COLLECTION_CARDS: PetCardRecord[] = Array.from({ length: 16 }, (_, i) => generateCard(i, 0))

export const COMMUNITY_CARDS: PetCardRecord[] = Array.from({ length: 24 }, (_, i) => generateCard(i, 100))

export const USER_INFO = {
  name: "PetCard Creator",
  avatar: "🎨",
  joined: "May 2026",
}
