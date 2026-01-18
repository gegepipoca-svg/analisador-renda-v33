import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'

// Cliente com service role para poder atualizar qualquer usuário
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'userId é obrigatório' },
        { status: 400 }
      )
    }

    // Gerar novo token de sessão único
    const newSessionToken = uuidv4()

    // Verificar se usuário existe na tabela users
    const { data: existingUser } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!existingUser) {
      // Criar usuário se não existe
      await supabaseAdmin
        .from('users')
        .insert({
          id: userId,
          email: email,
          session_token: newSessionToken,
          session_created_at: new Date().toISOString(),
        })
    } else {
      // Atualizar token de sessão (isso invalida sessões anteriores)
      await supabaseAdmin
        .from('users')
        .update({
          session_token: newSessionToken,
          session_created_at: new Date().toISOString(),
        })
        .eq('id', userId)
    }

    // Retornar o token para ser salvo no cookie
    const response = NextResponse.json({ 
      success: true, 
      sessionToken: newSessionToken 
    })

    // Setar cookie com o token
    response.cookies.set('session_token', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 365, // 1 ano
    })

    return response
  } catch (error: any) {
    console.error('Erro ao criar sessão:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
