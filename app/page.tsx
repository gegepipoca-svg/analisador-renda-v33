'use client'

import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="gradient-bg">
        <nav className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="text-white font-bold text-xl">
            📊 Analisador de Renda
          </div>
          <div className="flex gap-4">
            <Link href="/login" className="text-white/80 hover:text-white transition">
              Entrar
            </Link>
            <Link href="/cadastro" className="bg-white/20 hover:bg-white/30 text-white px-4 py-2 rounded-lg transition">
              Criar conta
            </Link>
          </div>
        </nav>

        {/* Hero */}
        <div className="max-w-6xl mx-auto px-4 py-20 text-center">
          <div className="inline-block bg-emerald-500 text-white text-sm font-semibold px-4 py-1 rounded-full mb-6">
            🚀 Tecnologia de ponta com IA
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Analise Extratos Bancários<br />
            <span className="text-emerald-400">em Segundos</span>
          </h1>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Transforme PDFs e imagens de extratos em relatórios detalhados de renda. 
            Perfeito para corretores imobiliários e profissionais de crédito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/cadastro" className="btn-success text-lg px-8 py-4">
              Começar Agora - R$ 39,90/mês
            </Link>
            <a href="#como-funciona" className="bg-white/10 hover:bg-white/20 text-white px-8 py-4 rounded-xl font-semibold transition">
              Como funciona?
            </a>
          </div>
          <p className="text-white/60 text-sm mt-4">
            ✓ Cancele quando quiser &nbsp; ✓ Suporte por WhatsApp &nbsp; ✓ Análises ilimitadas
          </p>
        </div>
      </header>

      {/* Benefícios */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Por que usar o Analisador de Renda?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="card text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ultra Rápido</h3>
              <p className="text-gray-600">
                Análise completa em menos de 30 segundos. 
                Não perca mais tempo calculando manualmente.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">99.5% de Precisão</h3>
              <p className="text-gray-600">
                Inteligência Artificial treinada para identificar 
                entradas de renda com altíssima precisão.
              </p>
            </div>
            <div className="card text-center">
              <div className="text-4xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Relatório Completo</h3>
              <p className="text-gray-600">
                Gera planilha Excel pronta para apresentar 
                ao banco ou à instituição financeira.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Como Funciona */}
      <section id="como-funciona" className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Como funciona?
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
              <h3 className="font-bold text-gray-900 mb-2">Faça Upload</h3>
              <p className="text-gray-600 text-sm">Envie os extratos em PDF ou imagem (até 6 meses)</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
              <h3 className="font-bold text-gray-900 mb-2">IA Analisa</h3>
              <p className="text-gray-600 text-sm">Nossa IA identifica todas as entradas de renda</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
              <h3 className="font-bold text-gray-900 mb-2">Filtra Automático</h3>
              <p className="text-gray-600 text-sm">Exclui transferências de familiares automaticamente</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">✓</div>
              <h3 className="font-bold text-gray-900 mb-2">Baixe o Relatório</h3>
              <p className="text-gray-600 text-sm">Receba a planilha Excel completa em segundos</p>
            </div>
          </div>
        </div>
      </section>

      {/* Preço */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-xl mx-auto px-4">
          <div className="card text-center border-2 border-blue-600">
            <div className="inline-block bg-blue-600 text-white text-sm font-semibold px-4 py-1 rounded-full mb-4">
              PLANO PROFISSIONAL
            </div>
            <div className="text-5xl font-bold text-gray-900 mb-2">
              R$ 39,90
              <span className="text-lg text-gray-500 font-normal">/mês</span>
            </div>
            <p className="text-gray-600 mb-6">Tudo que você precisa para analisar renda</p>
            
            <ul className="text-left space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Análises ilimitadas</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Até 6 meses por análise</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>PDF e imagens suportados</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Relatório Excel automático</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Filtro de transferências familiares</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="text-emerald-500">✓</span>
                <span>Suporte por WhatsApp</span>
              </li>
            </ul>
            
            <Link href="/cadastro" className="btn-success w-full block text-center text-lg">
              Assinar Agora
            </Link>
            <p className="text-gray-500 text-sm mt-4">
              Cancele a qualquer momento. Sem multa.
            </p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Perguntas Frequentes
          </h2>
          <div className="space-y-6">
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">Funciona com todos os bancos?</h3>
              <p className="text-gray-600">Sim! Nossa IA analisa extratos de qualquer banco brasileiro: Caixa, BB, Bradesco, Itaú, Santander, Nubank, Inter, e muitos outros.</p>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">É seguro enviar meus extratos?</h3>
              <p className="text-gray-600">Totalmente seguro. Os extratos são processados de forma segura e não armazenamos os dados bancários após a análise.</p>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">O que é o filtro de transferências familiares?</h3>
              <p className="text-gray-600">O sistema identifica automaticamente transferências de pessoas com o mesmo sobrenome do cliente e as exclui do cálculo de renda, conforme exigência dos bancos.</p>
            </div>
            <div className="card">
              <h3 className="font-bold text-gray-900 mb-2">Posso cancelar a qualquer momento?</h3>
              <p className="text-gray-600">Sim! Você pode cancelar sua assinatura a qualquer momento, sem multa ou burocracia.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="gradient-bg py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Comece a economizar tempo agora
          </h2>
          <p className="text-xl text-white/80 mb-8">
            Junte-se a centenas de corretores que já automatizaram a análise de renda
          </p>
          <Link href="/cadastro" className="btn-success text-lg px-8 py-4 inline-block">
            Criar Minha Conta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="mb-2">
            📊 Analisador de Renda - Magalhães Negócios Imobiliários
          </p>
          <p className="text-sm">
            © 2026 Todos os direitos reservados
          </p>
        </div>
      </footer>
    </div>
  )
}
