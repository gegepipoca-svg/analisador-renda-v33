# Analisador de Renda - SaaS

Sistema completo de análise de renda com IA para corretores imobiliários.

## 🚀 Deploy na Vercel (Passo a Passo)

### 1. Subir o código para o GitHub

1. Crie um repositório no GitHub: `analisador-renda-saas`
2. Faça upload de todos os arquivos deste projeto

### 2. Deploy na Vercel

1. Acesse: https://vercel.com
2. Clique em "Add New" → "Project"
3. Importe o repositório do GitHub
4. Configure as variáveis de ambiente (veja abaixo)
5. Clique em "Deploy"

### 3. Variáveis de Ambiente (Vercel)

Adicione estas variáveis em Settings → Environment Variables:

```
NEXT_PUBLIC_SUPABASE_URL=https://bsggwctfspgnqtqjyxpc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable__gdOXZlV4579Li1TVYgGzA_7MY0bkP-
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_51SnWs9GahSdCTHypEStXVFNpy3zV5ZN61YMrKK1RFJX9W2yvUv2gVvZUDhygIJd1FqoNGMLi2BpP1WnfwSuYRsoU00j9QDPe5a
STRIPE_SECRET_KEY=sk_live_sua_chave_aqui
STRIPE_PRICE_ID=price_1Sqz0TGahSdCTHypbLsuv1QD
STRIPE_WEBHOOK_SECRET=whsec_CONFIGURAR_DEPOIS
NEXT_PUBLIC_APP_URL=https://analisador.vsgcerebro.com.br
NEXT_PUBLIC_APPS_SCRIPT_URL=https://script.google.com/macros/s/AKfycbyjHpWBvhQimHzfqHbPcYujJKGwrOzL5dYSBljiHTSKkDODVcoAfLF-GnRJjZsauBkP1A/exec
```

### 4. Configurar domínio na Vercel

1. Vá em Settings → Domains
2. Adicione: `analisador.vsgcerebro.com.br`
3. A Vercel vai mostrar os registros DNS necessários

### 5. Configurar DNS na Hostinger

1. No painel da Hostinger, vá em DNS/Nameservers
2. Adicione um registro CNAME:
   - **Nome:** `analisador`
   - **Tipo:** CNAME
   - **Destino:** `cname.vercel-dns.com`

### 6. Criar tabela no Supabase

Execute este SQL no Supabase (SQL Editor):

```sql
-- Tabela de assinaturas
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,
  status TEXT DEFAULT 'inactive',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- RLS (Row Level Security)
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Política: usuário só vê sua própria assinatura
CREATE POLICY "Users can view own subscription" ON subscriptions
  FOR SELECT USING (auth.uid() = user_id);
```

### 7. Configurar Webhook do Stripe

1. No Stripe, vá em Developers → Webhooks
2. Clique em "Add endpoint"
3. URL: `https://analisador.vsgcerebro.com.br/api/webhook`
4. Eventos para escutar:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copie o "Signing secret" e atualize a variável `STRIPE_WEBHOOK_SECRET` na Vercel

---

## 📁 Estrutura do Projeto

```
analisador-saas/
├── app/
│   ├── page.tsx          # Landing page
│   ├── layout.tsx        # Layout principal
│   ├── globals.css       # Estilos globais
│   ├── login/
│   │   └── page.tsx      # Página de login
│   ├── cadastro/
│   │   └── page.tsx      # Página de cadastro
│   ├── dashboard/
│   │   └── page.tsx      # Dashboard com analisador
│   └── api/
│       ├── checkout/
│       │   └── route.ts  # API de checkout Stripe
│       └── webhook/
│           └── route.ts  # Webhook do Stripe
├── lib/
│   ├── supabase.ts       # Cliente Supabase
│   └── stripe.ts         # Cliente Stripe
├── middleware.ts         # Proteção de rotas
└── .env.local            # Variáveis de ambiente
```

---

## ✅ Checklist Final

- [ ] Código no GitHub
- [ ] Deploy na Vercel
- [ ] Variáveis de ambiente configuradas
- [ ] Domínio configurado (DNS)
- [ ] Tabela `subscriptions` criada no Supabase
- [ ] Webhook do Stripe configurado
- [ ] Testar fluxo completo (cadastro → pagamento → dashboard)

---

## 🆘 Suporte

Desenvolvido por Magalhães Negócios Imobiliários
