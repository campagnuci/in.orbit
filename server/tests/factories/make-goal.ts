import { faker } from '@faker-js/faker'

import { db } from '../../src/db'
import { goals } from '../../src/db/schema'
import type { InferSelectModel } from 'drizzle-orm'

export async function makeGoal (
  override: Partial<InferSelectModel<typeof goals>> & Pick<InferSelectModel<typeof goals>, 'userId'>
) {
  const [row] = await db.insert(goals).values({
    title: faker.person.fullName(),
    desiredWeeklyFrequency: faker.number.int({ min: 1, max: 1_000_000 }),
    ...override,
  }).returning()

  return row
}
