import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { createClient } from '@supabase/supabase-js'

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json({ error: 'Webhook Error' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as any
        const email = session.customer_email
        
        // 1. Verificar se usuário já existe no Auth
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
        let user = existingUsers?.users?.find(u => u.email === email)
        
        // 2. Se não existe, criar usuário com senha temporária
        if (!user) {
          const tempPassword = Math.random().toString(36).slice(-12) + 'A1!'
          
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: email,
            password: tempPassword,
            email_confirm: true,
          })
          
          if (createError) {
            console.error('Erro ao criar usuário:', createError)
            return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
          }
          
          user = newUser.user
          
          // TODO: Enviar email com link de reset de senha
        }
        
        // 3. Criar/atualizar na tabela users
        await supabaseAdmin
          .from('users')
          .upsert({
            id: user.id,
            email: email,
            has_lifetime: true,
            subscription_status: 'active',
            stripe_customer_id: session.customer,
          }, { onConflict: 'id' })
        
        // 4. Criar subscription
        await supabaseAdmin
          .from('subscriptions')
          .upsert({
            user_id: user.id,
            stripe_customer_id: session.customer,
            stripe_subscription_id: session.subscription || 'lifetime_' + session.id,
            status: 'active',
            current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
          }, { onConflict: 'user_id' })
        
        console.log('Usuário criado/atualizado com sucesso:', email)
        break
      }
      
      case 'customer.subscription.updated': {
        const subscription = event.data.object as any
        
        await supabaseAdmin
          .from('subscriptions')
          .update({
            status: subscription.status,
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq('stripe_subscription_id', subscription.id)
        
        break
      }
      
      case 'customer.subscription.deleted': {
        const subscription = event.data.object as any
        
        await supabaseAdmin
          .from('subscriptions')
          .update({ status: 'canceled' })
          .eq('stripe_subscription_id', subscription.id)
        
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Error processing webhook:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}
