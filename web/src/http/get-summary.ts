import dayjs from 'dayjs'

type WeeklySummaryResponse = {
  completed: number
  total: number
  goalsPerDay: Record<
    string,
    {
      id: string
      title: string
      completedAt: string
    }[]
  >
}

export async function getWeeklySummary(): Promise<WeeklySummaryResponse> {
  const timezoneOffset = dayjs().utcOffset()
  const response = await fetch('http://localhost:3333/summary?' + new URLSearchParams({
    timezoneOffset: `${timezoneOffset}`,
  }).toString())
  const data = await response.json()

  return data.summary
}
