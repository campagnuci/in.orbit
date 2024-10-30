import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { z } from 'zod'

import { getWeekSummary } from '../../functions/get-week-summary'
import { authenticateUserHook } from '../hooks/authenticate-user'

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  app.get(
    '/summary',
    {
      onRequest: [authenticateUserHook],
      schema: {
        summary: 'Get Week Summary',
        tags: ['summary'],
        querystring: z.object({
          timezoneOffset: z.coerce.number().default(0)
        }),
        response: {
          200: z.object({
            summary: z.object({
              completed: z.number(),
              total: z.number(),
              goalsPerDay: z.record(z.string(), z.array(z.object({
                id: z.string(),
                title: z.string(),
                completedAt: z.string(),
              })))
            })
          })
        }
      }
    },
    async (request) => {
      const userId = request.user.sub
      const { timezoneOffset } = request.query
      const { summary } = await getWeekSummary({ userId, timezoneOffset })
      return { summary }
    }
  )
}
