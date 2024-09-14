import { useQuery } from '@tanstack/react-query'

import { Dialog } from '@/components/ui/dialog'
import { CreateGoal } from '@/components/create-goal'
import { WeeklySummary } from '@/components/weekly-summary'
import { EmptyGoals } from '@/components/empty-goals'
import { getWeeklySummary } from '@/http/get-summary'

export function App() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getWeeklySummary,
    staleTime: 1000 * 60, // 60 seconds
  })

  return (
    <Dialog>
      {data?.total && data?.total > 0 ? <WeeklySummary /> : <EmptyGoals />}

      <CreateGoal />
    </Dialog>
  )
}
