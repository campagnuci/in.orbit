export async function deleteGoalCompletion(goalId: string) {
  const response = await fetch('http://localhost:3333/completions', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      goalId,
    }),
  })

  if (!response.ok) {
    throw new Error('Erro ao remover o item.')
  }
}
