import { eq } from 'drizzle-orm'
import { describe, it, expect, beforeEach } from 'vitest'

import { db } from '../db'
import { users } from '../db/schema'
import { getUser } from './get-user'

describe('Get User', () => {
  it('should be able to get a user', async () => {
    beforeEach(async () => {
      await db.delete(users).where(eq(users.id, 'john-doe'))
    })

    await db.insert(users).values({
      id: 'john-doe',
      avatarUrl: 'https://github.com/campagnuci.png',
      externalAccountId: 1282929
    })

    const result = await getUser({ userId: 'john-doe' })
    expect(result).toEqual({
      id: 'john-doe',
      name: null,
      email: null,
      avatarUrl: 'https://github.com/diego3g.png',
    })
  })
})
