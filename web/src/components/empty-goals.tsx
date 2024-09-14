import { Plus } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { DialogTrigger } from '@/components/ui/dialog'

import logoInOrbit from '@/assets/logo-in-orbit.svg'
import illustration from '@/assets/lets-start-illustration.svg'

export function EmptyGoals() {
  return (
    <div className="h-screen flex flex-col items-center justify-center gap-8">
      <img src={logoInOrbit} alt="in.orbit" />
      <img src={illustration} alt="" />
      <p className='text-zinc-300 leading-relaxed max-w-80 text-center'>
        Você ainda não cadastrou nenhuma meta, que tal cadastrar uma agora mesmo?
      </p>
      <DialogTrigger asChild>
        <Button className='px-4 py-2.5 rounded-lg bg-violet-500 text-violet-50 flex items-center gap-2 text-sm font-medium tracking-tight hover:bg-violet-600'>
          <Plus className='size-4' />
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </div>
  )
}
