import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from '@tanstack/react-query'
import { X, Medal, CircleX } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

import { Button } from '@/components/ui/button'
import { DialogContent, DialogTitle, DialogClose, DialogDescription } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem, RadioGroupIndicator } from '@/components/ui/radio-group'
import { createGoal } from '@/http/create-goal'

const createGoalForm = z.object({
  title: z.string().min(1, 'Informe a atividade que deseja realizar.'),
  desiredWeeklyFrequency: z.coerce.number().min(1).max(7)
})

type CreateGoalForm = z.infer<typeof createGoalForm>

interface CreateGoalProps {
  closeDialog: () => void
}

export function CreateGoal({ closeDialog }: CreateGoalProps) {
  const queryClient = useQueryClient()
  const { register, control, handleSubmit, formState, reset } = useForm<CreateGoalForm>({
    resolver: zodResolver(createGoalForm)
  })

  async function handleCreateGoal(data: CreateGoalForm) {
    try {
      await createGoal({
        title: data.title,
        desiredWeeklyFrequency: data.desiredWeeklyFrequency,
      })

      queryClient.invalidateQueries({ queryKey: ['summary'] })
      queryClient.invalidateQueries({ queryKey: ['pending-goals'] })

      reset()
      closeDialog()

      toast.success('Meta cadastrada com sucesso', {
        description: `Meta "${data.title}" para ser completada ${data.desiredWeeklyFrequency}x por semana!`,
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
    <DialogContent>
      <div className="flex flex-col gap-6 h-full">
        <div className="flex flex-col gap-3">
          <div className='flex items-center justify-between'>
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className='size-5 text-zinc-600' />
            </DialogClose>
          </div>
          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>
        <form onSubmit={handleSubmit(handleCreateGoal)} className='flex-1 flex flex-col justify-between'>
          <div className='flex flex-col gap-6'>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='title'>Qual a atividade?</Label>
              <Input
                id='title'
                autoFocus
                placeholder='Praticar exercícios, meditar, etc'
                {...register('title')}
              />
              {formState.errors.title && (
                <p className="text-red-400 text-xs">
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <div className='flex flex-col gap-2'>
              <Label htmlFor='title'>Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name="desiredWeeklyFrequency"
                defaultValue={3}
                render={({ field }) => {
                  return (
                    <RadioGroup
                      onValueChange={field.onChange}
                      value={String(field.value)}
                    >
                      <RadioGroupItem value="1">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          1x na semana
                        </span>
                        <span className="text-lg leading-none">🥱</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="2">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          2x na semana
                        </span>
                        <span className="text-lg leading-none">🙂</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="3">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          3x na semana
                        </span>
                        <span className="text-lg leading-none">😎</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="4">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          4x na semana
                        </span>
                        <span className="text-lg leading-none">😜</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="5">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          5x na semana
                        </span>
                        <span className="text-lg leading-none">🤨</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="6">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          6x na semana
                        </span>
                        <span className="text-lg leading-none">🤯</span>
                      </RadioGroupItem>

                      <RadioGroupItem value="7">
                        <RadioGroupIndicator />
                        <span className="text-zinc-300 text-sm font-medium leading-none">
                          Todos dias da semana
                        </span>
                        <span className="text-lg leading-none">🔥</span>
                      </RadioGroupItem>
                    </RadioGroup>
                  )
                }}
              />
            </div>
          </div>
          <div className='flex items-center gap-3'>
            <DialogClose asChild>
              <Button className="flex-1" type='button' variant='secondary'>Fechar</Button>
            </DialogClose>
            <Button className="flex-1">Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
