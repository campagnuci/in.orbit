import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getWeekPendingGoals } from '../../functions/get-week-pending-goals'

export const getWeekPendingGoalsRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/pending-goals',
    {
      schema: {
        summary: 'List Week Pending Goals',
        tags: ['goals'],
      }
    },
    async () => {
      const { pendingGoals } = await getWeekPendingGoals()
      return { pendingGoals }
    }
  )
}
