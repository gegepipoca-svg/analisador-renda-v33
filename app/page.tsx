'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function Home() {
  const [vagasRestantes, setVagasRestantes] = useState(47)
  const [timeLeft, setTimeLeft] = useState({ hours: 23, minutes: 59, seconds: 59 })

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 }
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 }
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 }
        }
        return { hours: 23, minutes: 59, seconds: 59 }
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📊</span>
          <span className="font-bold text-white text-xl">Analisador de Renda</span>
        </div>
        <div className="flex gap-4">
          <Link href="/login" className="text-gray-300 hover:text-white transition">
            Entrar
          </Link>
          <Link href="/cadastro" className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium transition">
            Criar conta
          </Link>
        </div>
      </header>

      {/* Barra de Urgência */}
      <div className="bg-red-600 py-3 text-center">
        <p className="text-white font-bold animate-pulse">
          🔥 OFERTA DE LANÇAMENTO: Apenas {vagasRestantes} vagas restantes pelo preço promocional!
        </p>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="inline-block bg-yellow-500 text-black px-4 py-1 rounded-full text-sm font-bold mb-6">
          ⚡ LANÇAMENTO EXCLUSIVO
        </div>
        
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Pare de Perder <span className="text-red-500">HORAS</span> Analisando<br/>
          Extratos Bancários <span className="text-emerald-400">Linha por Linha</span>
        </h1>
        
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          Chega de criar planilhas manualmente, somar entrada por entrada, e rezar pra não errar o cálculo. 
          Nossa IA analisa PDFs e imagens de extratos em <strong className="text-white">segundos</strong> e entrega o relatório pronto.
        </p>

        {/* Contador */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="bg-slate-800 p-4 rounded-lg min-w-[80px]">
            <div className="text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400">HORAS</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg min-w-[80px]">
            <div className="text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400">MINUTOS</div>
          </div>
          <div className="bg-slate-800 p-4 rounded-lg min-w-[80px]">
            <div className="text-3xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-xs text-gray-400">SEGUNDOS</div>
          </div>
        </div>

        {/* Preço */}
        <div className="mb-8">
          <div className="text-gray-400 line-through text-2xl">De R$ 99,90</div>
          <div className="text-5xl font-bold text-white">
            Por apenas <span className="text-emerald-400">R$ 69,90</span>
          </div>
          <div className="text-emerald-400 font-medium mt-2">💳 Pagamento único • Acesso vitalício</div>
        </div>

        <Link 
          href="/cadastro"
          className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold px-12 py-5 rounded-xl transition transform hover:scale-105 shadow-lg shadow-emerald-500/30"
        >
          QUERO ECONOMIZAR TEMPO AGORA →
        </Link>

        <div className="flex justify-center gap-6 mt-6 text-gray-400 text-sm">
          <span>✓ Garantia de 7 dias</span>
          <span>✓ Suporte por WhatsApp</span>
          <span>✓ Análises ilimitadas</span>
        </div>
      </section>

      {/* Problema Section */}
      <section className="bg-slate-800/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Você ainda faz isso <span className="text-red-500">manualmente</span>? 😰
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-red-900/30 border border-red-500/30 p-6 rounded-xl">
              <h3 className="text-red-400 font-bold text-xl mb-4">❌ O Jeito Antigo (Doloroso)</h3>
              <ul className="text-gray-300 space-y-3">
                <li>• Baixar extrato do banco</li>
                <li>• Abrir Excel e criar planilha do zero</li>
                <li>• Analisar linha por linha cada entrada</li>
                <li>• Somar manualmente (e torcer pra não errar)</li>
                <li>• Formatar relatório apresentável</li>
                <li className="text-red-400 font-bold">⏱️ Tempo: 30 min a 2 horas POR CLIENTE</li>
              </ul>
            </div>
            
            <div className="bg-emerald-900/30 border border-emerald-500/30 p-6 rounded-xl">
              <h3 className="text-emerald-400 font-bold text-xl mb-4">✅ Com o Analisador (Simples)</h3>
              <ul className="text-gray-300 space-y-3">
                <li>• Faz upload do PDF ou foto do extrato</li>
                <li>• IA analisa automaticamente</li>
                <li>• Recebe relatório completo e formatado</li>
                <li>• Baixa em PDF ou copia pro WhatsApp</li>
                <li>• Pronto pra enviar pro banco/cliente</li>
                <li className="text-emerald-400 font-bold">⚡ Tempo: Menos de 30 SEGUNDOS</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Por que corretores estão <span className="text-emerald-400">amando</span> isso?
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-white font-bold text-xl mb-2">Velocidade Absurda</h3>
              <p className="text-gray-400">O que levava 1 hora, agora leva 30 segundos. Atenda mais clientes no mesmo tempo.</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-white font-bold text-xl mb-2">Precisão de 99,5%</h3>
              <p className="text-gray-400">IA treinada para identificar todas as entradas, PIX, TED, depósitos. Sem erro humano.</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl text-center">
              <div className="text-4xl mb-4">📱</div>
              <h3 className="text-white font-bold text-xl mb-2">Aceita Foto do Celular</h3>
              <p className="text-gray-400">Cliente mandou foto do extrato no WhatsApp? Só jogar na plataforma que funciona.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-slate-800/50 py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Simples assim: <span className="text-emerald-400">3 passos</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">1</div>
              <h3 className="text-white font-bold text-lg mb-2">Faça Upload</h3>
              <p className="text-gray-400">PDF, imagem ou foto do extrato bancário</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">2</div>
              <h3 className="text-white font-bold text-lg mb-2">IA Processa</h3>
              <p className="text-gray-400">Em segundos, analisa todas as entradas</p>
            </div>
            
            <div className="text-center">
              <div className="bg-emerald-500 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">3</div>
              <h3 className="text-white font-bold text-lg mb-2">Relatório Pronto</h3>
              <p className="text-gray-400">Baixe em PDF ou copie para WhatsApp</p>
            </div>
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
            Quem usa, <span className="text-emerald-400">recomenda</span>
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="bg-slate-800 p-6 rounded-xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">⭐</span>)}
              </div>
              <p className="text-gray-300 mb-4">"Economizo pelo menos 2 horas por dia. Antes eu fazia tudo na mão, agora é questão de segundos. Melhor investimento que fiz."</p>
              <p className="text-white font-bold">Carlos M.</p>
              <p className="text-gray-500 text-sm">Correspondente Bancário</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">⭐</span>)}
              </div>
              <p className="text-gray-300 mb-4">"A precisão é impressionante. Peguei erros que eu mesma tinha deixado passar quando fazia manual. Super recomendo!"</p>
              <p className="text-white font-bold">Amanda L.</p>
              <p className="text-gray-500 text-sm">Corretora de Imóveis</p>
            </div>
            
            <div className="bg-slate-800 p-6 rounded-xl">
              <div className="flex gap-1 mb-4">
                {[1,2,3,4,5].map(i => <span key={i} className="text-yellow-400">⭐</span>)}
              </div>
              <p className="text-gray-300 mb-4">"Cliente manda foto torta do extrato e funciona do mesmo jeito. Isso é mágica! Já indiquei pra toda minha equipe."</p>
              <p className="text-white font-bold">Roberto S.</p>
              <p className="text-gray-500 text-sm">Gerente de Imobiliária</p>
            </div>
          </div>
        </div>
      </section>

      {/* Garantia */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border border-emerald-500/30 rounded-2xl p-8 max-w-3xl mx-auto text-center">
            <div className="text-6xl mb-4">🛡️</div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">
              Garantia Incondicional de 7 Dias
            </h2>
            <p className="text-gray-300 mb-4">
              Se você não ficar 100% satisfeito, devolvemos seu dinheiro. Sem perguntas, sem burocracia. 
              Você não tem nada a perder e muito tempo a ganhar.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-16 bg-gradient-to-b from-slate-900 to-emerald-900/30">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Pronto para economizar <span className="text-emerald-400">horas</span> do seu dia?
          </h2>
          
          <p className="text-gray-300 text-xl mb-8">
            Apenas <span className="text-red-400 font-bold">{vagasRestantes} vagas</span> restantes pelo preço de lançamento
          </p>

          {/* Preço Final */}
          <div className="mb-8">
            <div className="text-gray-400 line-through text-xl">R$ 99,90</div>
            <div className="text-5xl font-bold text-white mb-2">
              <span className="text-emerald-400">R$ 69,90</span>
            </div>
            <div className="text-emerald-400">Pagamento único • Acesso vitalício</div>
          </div>

          <Link 
            href="/cadastro"
            className="inline-block bg-emerald-500 hover:bg-emerald-600 text-white text-xl font-bold px-12 py-5 rounded-xl transition transform hover:scale-105 shadow-lg shadow-emerald-500/30 mb-6"
          >
            GARANTIR MINHA VAGA AGORA →
          </Link>

          <div className="flex justify-center gap-6 text-gray-400 text-sm">
            <span>✓ Garantia de 7 dias</span>
            <span>✓ Suporte por WhatsApp</span>
            <span>✓ Análises ilimitadas</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 py-8 border-t border-slate-800">
        <div className="container mx-auto px-4 text-center text-gray-500">
          <p>© 2025 Analisador de Renda. Todos os direitos reservados.</p>
          <p className="mt-2 text-sm">
            <Link href="/termos" className="hover:text-gray-300">Termos de Uso</Link>
            {' • '}
            <Link href="/privacidade" className="hover:text-gray-300">Política de Privacidade</Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
