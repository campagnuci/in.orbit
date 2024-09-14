import { useQuery, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-br'
import { CheckCircle2, CircleX, FlagOff, Plus } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'
import { Progress, ProgressIndicator } from '@/components/ui/progress-bar'
import { Separator } from '@/components/ui/separator'
import { InOrbitIcon } from '@/components/in-orbit-icon'
import { PendingGoals } from '@/components/pending-goals'
import { deleteGoalCompletion } from '@/http/delete-goal-completion'
import { getWeeklySummary } from '@/http/get-summary'

dayjs.locale(ptBR)

export function WeeklySummary() {
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getWeeklySummary,
    staleTime: 1000 * 60, // 60 seconds
  })

  if (!data) {
    return null
  }

  const firstDayOfWeek = dayjs().startOf('week').format("DD MMM")
  const lastDayOfWeek = dayjs().endOf('week').format("DD MMM")

  const completedPercentage = Math.round((data?.completed * 100) / data?.total)

  async function handleDeleteGoalCompletion(goalId: string) {
    try {
      await deleteGoalCompletion(goalId)

      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

      toast.warning('Você removeu uma tarefa', {
        description: 'A tarefa foi removida com sucesso. =(',
        duration: 2500,
        closeButton: true,
        icon: <FlagOff />,
      })
    } catch (error) {
      toast.error('Erro ao criar meta', {
        description: 'Oops. Encontramos algum problema, tente novamente mais tarde.',
        duration: 2500,
        closeButton: true,
        icon: <CircleX />,
      })
    }
  }

  return (
    <div className="py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <InOrbitIcon />
          <span className="text-lg font-semibold capitalize">
            {firstDayOfWeek} - {lastDayOfWeek}
          </span>
        </div>
        <DialogTrigger asChild>
          <Button size="sm">
            <Plus className='size-4' />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>

      <div className="flex flex-col gap-3">
        <Progress max={15} value={8}>
          <ProgressIndicator style={{ width: `${completedPercentage}%` }} />
        </Progress>
        <div className="flex items-center justify-between text-xs text-zinc-400">
          <span>
            Você completou{' '}
            <span className="text-zinc-100">{data?.completed}</span> de {' '}
            <span className="text-zinc-100">{data?.total}</span> metas nessa semana.
          </span>
          <span>{completedPercentage}%</span>
        </div>
      </div>

      <Separator />
      <PendingGoals />

      <div className="flex flex-col gap-6">
        <h2 className="text-xl font-medium">Sua Semana</h2>
        {Object.entries(data.goalsPerDay).map(([date, goals]) => {
          const weekDay = dayjs(date).format('dddd')
          const formattedDate = dayjs(date).format('DD[ de ]MMMM')
          return (
            <div key={date} className="flex flex-col gap-4">
              <h3 className="font-medium">
                <span className='capitalize'>{weekDay}</span>{' '}
                <span className="text-xs text-zinc-400">({formattedDate})</span>
              </h3>
              <ul className="flex flex-col gap-3">
                {goals.map((goal) => {
                  const time = dayjs(goal.completedAt).format('HH:mm')
                  return (
                    <li key={goal.id} className="flex items-center gap-2">
                      <CheckCircle2 className="size-4 text-pink-500" />
                      <span className="text-sm text-zinc-400">
                        Você completou "
                        <span className="text-zinc-100">{goal.title}</span>" às{' '}
                        <span className="text-zinc-100">{time}h</span>.
                      </span>
                      <Button
                        variant='link'
                        size='none'
                        onClick={() => handleDeleteGoalCompletion(goal.id)}
                      >
                        Desfazer
                      </Button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </div>
    </div>
  )
}
