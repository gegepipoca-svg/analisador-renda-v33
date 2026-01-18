'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [subscription, setSubscription] = useState<any>(null)

  useEffect(() => {
    checkUser()
  }, [])

  async function checkUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/login')
        return
      }

      setUser(user)

      // Verificar assinatura
      const { data: sub } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      setSubscription(sub)
    } catch (error) {
      console.error('Erro ao verificar usuário:', error)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    )
  }

  // Se não tem assinatura ativa, mostrar mensagem
  if (!subscription) {
    return (
      <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
        <div className="card max-w-md w-full text-center">
          <div className="text-5xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Assinatura não encontrada
          </h1>
          <p className="text-gray-600 mb-6">
            Você precisa de uma assinatura ativa para acessar o analisador.
          </p>
          <a 
            href="/api/checkout" 
            className="btn-success inline-block mb-4"
            onClick={async (e) => {
              e.preventDefault()
              const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: user?.email, userId: user?.id }),
              })
              const { url } = await response.json()
              window.location.href = url
            }}
          >
            Assinar Agora - R$ 39,90/mês
          </a>
          <button 
            onClick={handleLogout}
            className="text-gray-500 hover:text-gray-700"
          >
            Sair da conta
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="font-bold text-xl text-gray-900">
            📊 Analisador de Renda
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              {user?.email}
            </span>
            <span className="bg-emerald-100 text-emerald-700 text-xs font-semibold px-2 py-1 rounded">
              Assinante Ativo
            </span>
            <button 
              onClick={handleLogout}
              className="text-gray-500 hover:text-gray-700 text-sm"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content - Iframe do Analisador */}
      <main className="p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <iframe
              src={process.env.NEXT_PUBLIC_APPS_SCRIPT_URL}
              className="w-full border-0"
              style={{ height: 'calc(100vh - 120px)', minHeight: '700px' }}
              allow="clipboard-write"
            />
          </div>
        </div>
      </main>
    </div>
  )
}
