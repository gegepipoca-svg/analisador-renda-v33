'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function Cadastro() {
  const router = useRouter()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCadastro(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      // 1. Criar usuário no Supabase
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            nome: nome,
          }
        }
      })

      if (authError) {
        if (authError.message.includes('already registered')) {
          setError('Este email já está cadastrado. Faça login.')
        } else {
          setError(authError.message)
        }
        return
      }

      if (authData.user) {
        // 2. Redirecionar para checkout do Stripe
        const response = await fetch('/api/checkout', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: email,
            userId: authData.user.id,
          }),
        })

        const { url, error: checkoutError } = await response.json()

        if (checkoutError) {
          setError(checkoutError)
          return
        }

        // Redirecionar para o Stripe Checkout
        window.location.href = url
      }
    } catch (err) {
      setError('Erro ao criar conta. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-bg flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="text-white font-bold text-2xl">
            📊 Analisador de Renda
          </Link>
        </div>

        <div className="card">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Criar sua conta
          </h1>
          <p className="text-gray-600 text-center mb-6">
            R$ 39,90/mês • Cancele quando quiser
          </p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleCadastro} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nome completo
              </label>
              <input
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                className="input-field"
                placeholder="Seu nome"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="seu@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Senha
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                placeholder="Mínimo 6 caracteres"
                minLength={6}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-success w-full disabled:opacity-50"
            >
              {loading ? 'Criando conta...' : 'Criar conta e assinar'}
            </button>
          </form>

          <div className="mt-4 text-center text-sm text-gray-500">
            <p>Você será redirecionado para o pagamento seguro</p>
          </div>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Já tem uma conta?{' '}
              <Link href="/login" className="text-blue-600 hover:underline font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-white/60 text-sm">
          <p>🔒 Pagamento seguro via Stripe</p>
        </div>
      </div>
    </div>
  )
}
