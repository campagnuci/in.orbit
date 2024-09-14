import { CircleX, Medal, Plus } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { getPendingGoals } from '@/http/get-pending-goals'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { createGoalCompletion } from '@/http/create-goal-completion'
import { toast } from 'sonner'

export function PendingGoals() {
  const queryClient = useQueryClient()
  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPendingGoals,
    staleTime: 1000 * 60, // 60 seconds
  })

  if (!data) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    try {
      await createGoalCompletion(goalId)
      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

      toast.success('Você realizou uma das metas!', {
        description: 'Parabéns, continue assim!',
        duration: 2500,
        closeButton: true,
        icon: <Medal />,
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
    <div className='flex flex-wrap gap-3'>
      {data.map((goal) => {
        return (
          <OutlineButton
            key={goal.id}
            onClick={() => handleCompleteGoal(goal.id)}
            disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
          >
            <Plus className='size-4 text-zinc-600' />
            {goal.title}
          </OutlineButton>
        )
      })}
    </div>
  )
}
