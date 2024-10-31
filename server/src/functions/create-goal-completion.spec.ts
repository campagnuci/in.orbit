import { describe, it, expect } from 'vitest'

import { makeGoal } from '../../tests/factories/make-goal'
import { makeUser } from '../../tests/factories/make-user'
import { createGoalCompletion } from './create-goal-completion'
import { makeGoalCompletion } from '../../tests/factories/make-goal-completion'

describe('Create Goal Completion', () => {
  it('should be able to complete a goal', async () => {
    const user = await makeUser()
    const goal = await makeGoal({ userId: user.id })

    const result = await createGoalCompletion({
      userId: user.id,
      goalId: goal.id
    })

    expect(result).toEqual({
      goalCompletion: expect.objectContaining({
        id: expect.any(String),
        goalId: goal.id
      })
    })
  })

  it('should not be able to complete a goal more times than expected', async () => {
    const user = await makeUser()
    const goal = await makeGoal({ userId: user.id, desiredWeeklyFrequency: 1 })

    await makeGoalCompletion({ goalId: goal.id })

    await expect(createGoalCompletion({
      goalId: goal.id,
      userId: user.id
    })).rejects.toThrow()
  })
})
