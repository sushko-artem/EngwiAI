import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@generated/prisma/client';
import { hashSync } from 'bcrypt';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const seedData = [
  {
    name: 'Животные',
    cards: [
      {
        word: 'Cat',
        translation: 'Кот',
      },
      {
        word: 'Dog',
        translation: 'Собака',
      },
      {
        word: 'Crocodile',
        translation: 'Крокодил',
      },
      {
        word: 'Monkey',
        translation: 'Обезьяна',
      },
      {
        word: 'Elephant',
        translation: 'Слон',
      },
      {
        word: 'Bird',
        translation: 'Птица',
      },
      {
        word: 'Donkey',
        translation: 'Осел',
      },
      {
        word: 'Bear',
        translation: 'Медведь',
      },
    ],
  },
  {
    name: 'Еда',
    cards: [
      {
        word: 'Bread',
        translation: 'Хлеб',
      },
      {
        word: 'Meat',
        translation: 'Мясо',
      },
      {
        word: 'Icecream',
        translation: 'Мороженое',
      },
      {
        word: 'Vegetables',
        translation: 'Овощи',
      },
    ],
  },
];

async function main() {
  const email = 'dev@example.com';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`[seed] Dev user already exists: ${email}`);
    return;
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: 'User',
      password: hashSync('qwerty', 10),
      roles: ['USER', 'SUPERUSER'],
    },
  });

  console.log(`[seed] User created: ${email} / qwerty`);

  await prisma.$transaction(async (tx) => {
    for (const collectionData of seedData) {
      const collection = await tx.collection.create({
        data: {
          userId: user.id,
          name: collectionData.name,
        },
      });

      await tx.card.createMany({
        data: collectionData.cards.map((card) => ({
          collectionId: collection.id,
          word: card.word,
          translation: card.translation,
        })),
      });
    }
  });
  console.log(`[seed] Collections created`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
  })
  .catch(async (e) => {
    console.error('[seed] Failed:', e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
