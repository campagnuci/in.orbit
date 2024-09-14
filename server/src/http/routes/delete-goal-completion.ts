import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { deleteGoalCompletion } from '../../functions/delete-goal-completion'

export const deleteGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/completions',
    {
      schema: {
        summary: 'Delete Goal Completion',
        tags: ['goal-completion'],
        body: z.object({
          goalId: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { goalId } = request.body

      await deleteGoalCompletion({ goalId })
      return reply.status(204).send()
    }
  )
}
