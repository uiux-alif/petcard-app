import { PrismaClient, Prisma } from "@prisma/client"
import { COMMUNITY_CARDS, USER_INFO } from "../src/data/seeds"

const prisma = new PrismaClient()

function slugify(name: string, id: string) {
  return `${name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${id.slice(-6)}`
}

async function main() {
  console.log("Seeding PetCard database...")

  const creator = await prisma.user.upsert({
    where: { email: "creator@petcard.app" },
    update: {},
    create: {
      username: "petcard-creator",
      email: "creator@petcard.app",
      avatarUrl: null,
      bio: USER_INFO.name,
    },
  })

  for (const card of COMMUNITY_CARDS) {
    const slug = slugify(card.name, card.id)
    const cardData: Prisma.InputJsonValue = {
      name: card.name,
      species: card.species,
      stage: card.stage,
      type: card.type,
      rarity: card.rarity,
      imageUrl: card.imageUrl,
      stats: { ...card.stats },
      moves: card.moves.map((m) => ({ ...m })),
      flavor: card.flavor,
      cardNumber: card.cardNumber,
      template: card.template ?? "classic",
      holo: card.holo ?? "none",
    }
    await prisma.card.upsert({
      where: { slug },
      update: {},
      create: {
        userId: creator.id,
        title: card.name,
        slug,
        cardData,
        isPublic: card.isPublic,
        likesCount: card.likesCount,
      },
    })
  }

  console.log(`Seeded ${COMMUNITY_CARDS.length} cards for ${creator.username}.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
