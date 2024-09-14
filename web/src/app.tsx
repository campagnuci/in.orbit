import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { Toaster } from "sonner"

import { Dialog } from '@/components/ui/dialog'
import { CreateGoal } from '@/components/create-goal'
import { WeeklySummary } from '@/components/weekly-summary'
import { EmptyGoals } from '@/components/empty-goals'
import { getWeeklySummary } from '@/http/get-summary'

export function App() {
  const [isOpen, setIsOpen] = useState(false);
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: getWeeklySummary,
    staleTime: 1000 * 60, // 60 seconds
  })

  function handleCloseDialog () {
    setIsOpen(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {data?.total && data?.total > 0 ? <WeeklySummary /> : <EmptyGoals />}
      <CreateGoal closeDialog={handleCloseDialog} />
      <Toaster richColors />
    </Dialog>
  )
}
