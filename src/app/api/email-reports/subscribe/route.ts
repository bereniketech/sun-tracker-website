import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'

const emailSubscribeSchema = z.object({
  email: z.string().email(),
  lat: z.number().min(-90).max(90),
  lng: z.number().min(-180).max(180),
  location_name: z.string().min(1).max(255)
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const subscription = emailSubscribeSchema.parse(body)

    // Get auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Initialize Supabase client with service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the token and get user
    const authResult = await supabase.auth.getUser(token)
    const user = authResult?.data?.user
    const authError = authResult?.error

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Upsert the email subscription
    const { data, error: upsertError } = await supabase
      .from('email_subscriptions')
      .upsert(
        {
          user_id: user.id,
          email: subscription.email,
          lat: subscription.lat,
          lng: subscription.lng,
          location_name: subscription.location_name,
          opted_in: true,
          updated_at: new Date().toISOString()
        },
        {
          onConflict: 'user_id'
        }
      )
      .select()
      .single()

    if (upsertError) {
      console.error('Supabase upsert error:', upsertError)
      return NextResponse.json(
        { error: 'Failed to save subscription' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Email subscription saved',
        data
      },
      { status: 200 }
    )
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      )
    }

    console.error('Email subscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Get auth header
    const authHeader = request.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      return NextResponse.json(
        { error: 'Missing or invalid authorization header' },
        { status: 401 }
      )
    }

    const token = authHeader.substring(7)

    // Initialize Supabase client with service role
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the token and get user
    const authResult = await supabase.auth.getUser(token)
    const user = authResult?.data?.user
    const authError = authResult?.error

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Update opted_in to false for this user
    const { error: updateError } = await supabase
      .from('email_subscriptions')
      .update({ opted_in: false, updated_at: new Date().toISOString() })
      .eq('user_id', user.id)

    if (updateError) {
      console.error('Supabase update error:', updateError)
      return NextResponse.json(
        { error: 'Failed to unsubscribe' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { success: true, message: 'Unsubscribed from email reports' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Email unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
