import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createGoalCompletion } from '../../functions/create-goal-completion'

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/completions',
    {
      schema: {
        summary: 'Create Goal Completion',
        tags: ['goal-completion'],
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request) => {
      const { goalId } = request.body

      const { goalCompletion } = await createGoalCompletion({ goalId })
      return { goalCompletion }
    }
  )
}
