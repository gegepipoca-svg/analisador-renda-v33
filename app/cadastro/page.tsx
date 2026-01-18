'use client'

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Cadastro() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const router = useRouter()
  const supabase = createClientComponentClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Criar conta no Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email já está cadastrado. Tente fazer login.')
        } else {
          setError(authError.message)
        }
        setLoading(false)
        return
      }

      if (authData.user) {
        // 2. Criar sessão de checkout no Stripe
        const response = await fetch('/api/stripe/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            userId: authData.user.id,
          }),
        })

        const data = await response.json()

        if (data.error) {
          setError(data.error)
          setLoading(false)
          return
        }

        // 3. Redirecionar para o Stripe Checkout
        if (data.url) {
          window.location.href = data.url
        }
      }
    } catch (err: any) {
      setError('Erro ao criar conta. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2">
            <span className="text-3xl">📊</span>
            <span className="font-bold text-white text-2xl">Analisador de Renda</span>
          </Link>
        </div>

        {/* Card de Cadastro */}
        <div className="bg-slate-800 rounded-2xl p-8 shadow-xl">
          <h1 className="text-2xl font-bold text-white text-center mb-2">
            Criar sua conta
          </h1>
          <p className="text-center text-emerald-400 mb-6">
            R$ 69,90 • Pagamento único • Acesso vitalício
          </p>

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 text-red-300 px-4 py-3 rounded-lg mb-6 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Nome completo
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-emerald-500 transition"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-500/50 text-white font-bold py-3 rounded-lg transition"
            >
              {loading ? 'Processando...' : 'Criar conta e pagar'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-4">
            Você será redirecionado para o pagamento seguro
          </p>

          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-emerald-400 hover:text-emerald-300 font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        {/* Garantias */}
        <div className="flex justify-center gap-6 mt-6 text-gray-400 text-sm">
          <span>🔒 Pagamento seguro</span>
          <span>✓ Garantia 7 dias</span>
        </div>
      </div>
    </div>
  )
}
