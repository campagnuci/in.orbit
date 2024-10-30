import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { deleteGoalCompletion } from '../../functions/delete-goal-completion'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const deleteGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  app.delete(
    '/completions',
    {
      onRequest: [authenticateUserHook],
      schema: {
        summary: 'Delete a goal completion',
        tags: ['goals-completion'],
        body: z.object({
          goalId: z.string(),
        }),
        response: {
          204: z.null(),
        }
      },
    },
    async (request, reply) => {
      const { goalId } = request.body
      await deleteGoalCompletion({ goalId })
      return reply.status(204).send()
    }
  )
}
