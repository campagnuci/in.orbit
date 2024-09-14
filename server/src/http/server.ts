import fastifyCors from '@fastify/cors'
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
import fastify from 'fastify'
import { jsonSchemaTransform, serializerCompiler, validatorCompiler, type ZodTypeProvider } from 'fastify-type-provider-zod'

import { env } from '../config/env'
import { createGoalRoute } from './routes/create-goal'
import { createGoalCompletionRoute } from './routes/create-goal-completion'
import { getWeekPendingGoalsRoute } from './routes/get-week-pending-goals'
import { getWeekSummaryRoute } from './routes/get-week-summary'
import { deleteGoalCompletionRoute } from './routes/delete-goal-completion'


const app = fastify().withTypeProvider<ZodTypeProvider>()

app.register(fastifyCors, {
  origin: '*',
})

app.register(fastifySwagger, {
  swagger: {
    consumes: ['application/json'],
    produces: ['application/json'],
    info: {
      title: 'in.orbit',
      description: 'Especificações da API para o back-end da aplicação in.orbit construída durante o NLW Pocket Javascript da Rocketseat.',
      version: '1.0.0'
    },
  },
  transform: jsonSchemaTransform,
})

app.register(fastifySwaggerUI, {
  routePrefix: '/docs',
})

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.register(createGoalRoute)
app.register(createGoalCompletionRoute)
app.register(deleteGoalCompletionRoute)
app.register(getWeekPendingGoalsRoute)
app.register(getWeekSummaryRoute)

app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log('HTTP server running on port 3333')
  })
