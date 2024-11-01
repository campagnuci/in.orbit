import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { getUser } from '../../functions/get-user'

export const getProfileRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/profile',
    {
      schema: {
        summary: 'Get authenticated user profile',
        tags: ['auth'],
        response: {
          200: z.object({
            profile: z.object({
              id: z.string(),
              name: z.string().nullable(),
              email: z.string().nullable(),
              avatarUrl: z.string().url(),
            }),
          }),
        },
      },
    },
    async (request, reply) => {
      const userId = request.user.sub
      const { user } = await getUser({ userId })
      return reply.status(200).send({ profile: user })
    }
  )
}
