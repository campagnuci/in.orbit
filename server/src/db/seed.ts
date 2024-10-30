import { fakerPT_BR as faker } from '@faker-js/faker'
import dayjs from 'dayjs'

import { client, db } from './'
import { goals, users } from './schema'
import { goalCompletions } from './schema'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const [user] = await db.insert(users).values({
    name: 'John Doe',
    externalAccountId: 120398120,
    avatarUrl: 'https://github.com/campagnuci.png'
  }).returning()

  const [goal1, goal2] = await db
    .insert(goals)
    .values([
      {
        userId: user.id,
        title: faker.lorem.words(3),
        desiredWeeklyFrequency: 1,
      },
      {
        userId: user.id,
        title: faker.lorem.words(3),
        desiredWeeklyFrequency: 2,
      },
      {
        userId: user.id,
        title: faker.lorem.words(3),
        desiredWeeklyFrequency: 1,
      },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values([
    { goalId: goal1.id, createdAt: startOfWeek.toDate() },
    { goalId: goal2.id, createdAt: startOfWeek.add(1, 'day').toDate() },
  ])
}

seed().then(() => {
  console.log('🌱 Database seeded successfully!')
  client.end()
})
