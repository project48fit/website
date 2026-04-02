/**
 * on-lead-created
 *
 * Triggered by a Supabase Database Webhook on INSERT to the `leads` table.
 * Setup: Supabase Dashboard → Database → Webhooks → Create webhook
 *   Table: leads | Events: INSERT | URL: <your edge function URL>
 *   Add header: x-webhook-secret: <WEBHOOK_SECRET env var>
 *
 * Required env vars (set via `supabase secrets set` or the dashboard):
 *   RESEND_API_KEY
 *   RESEND_LEADS_AUDIENCE_ID      — Resend audience for applied contacts
 *   APPLY_CONFIRMATION_FROM       — e.g. "Project Fitness <marketing@notifications.projectfitness.co>"
 *   WEBHOOK_SECRET                — secret header to verify the webhook
 *   SUPABASE_URL                  — auto-set by Supabase
 *   SUPABASE_SERVICE_ROLE_KEY     — auto-set by Supabase
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { applicationEmail, socialProofEmail, objectionEmail } from '../_shared/templates.ts'

const RESEND_API = 'https://api.resend.com'

Deno.serve(async (req: Request) => {
  // Verify webhook secret
  const webhookSecret = Deno.env.get('WEBHOOK_SECRET')
  if (webhookSecret && req.headers.get('x-webhook-secret') !== webhookSecret) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: Record<string, unknown>
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  // Only process INSERT events on the leads table
  if (body.type !== 'INSERT') {
    return new Response(JSON.stringify({ ok: true, skipped: true }), { status: 200 })
  }

  const lead = body.record as Record<string, string>
  const { id: leadId, full_name, email } = lead

  if (!email || !full_name || !leadId) {
    console.error('Missing required lead fields', { leadId, email, full_name })
    return new Response('Missing fields', { status: 400 })
  }

  const firstName = full_name.trim().split(' ')[0]
  const resendKey = Deno.env.get('RESEND_API_KEY')
  const audienceId = Deno.env.get('RESEND_LEADS_AUDIENCE_ID')
  const fromEmail = Deno.env.get('APPLY_CONFIRMATION_FROM') ??
    'Project Fitness <marketing@notifications.projectfitness.co>'

  if (!resendKey) {
    console.error('RESEND_API_KEY not set')
    return new Response('Server misconfiguration', { status: 500 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const resendHeaders = {
    'Authorization': `Bearer ${resendKey}`,
    'Content-Type': 'application/json'
  }

  // 1. Create/update contact in leads audience
  let contactId: string | null = null
  if (audienceId) {
    try {
      const res = await fetch(`${RESEND_API}/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: resendHeaders,
        body: JSON.stringify({
          email,
          first_name: firstName,
          last_name: full_name.split(' ').slice(1).join(' ') || '',
          unsubscribed: false
        })
      })
      if (res.ok) {
        const data = await res.json()
        contactId = data?.id ?? data?.data?.id ?? null
      } else {
        console.error('Resend contact creation failed', await res.text())
      }
    } catch (err) {
      console.error('Resend contact error', err)
    }
  }

  // 2. Send email-1 immediately
  try {
    const res = await fetch(`${RESEND_API}/emails`, {
      method: 'POST',
      headers: resendHeaders,
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: "You're Confirmed — Book Your Coaching Call",
        html: applicationEmail(firstName),
        tags: [{ name: 'category', value: 'apply_confirmation' }]
      })
    })
    if (!res.ok) console.error('Email-1 send failed', await res.text())
  } catch (err) {
    console.error('Email-1 error', err)
  }

  // 3. Schedule email-2 for +24hrs
  let email2Id: string | null = null
  try {
    const scheduledAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const res = await fetch(`${RESEND_API}/emails`, {
      method: 'POST',
      headers: resendHeaders,
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: 'Real Results From People Like You',
        html: socialProofEmail(firstName),
        scheduled_at: scheduledAt,
        tags: [{ name: 'category', value: 'social_proof' }]
      })
    })
    if (res.ok) {
      const data = await res.json()
      email2Id = data?.id ?? null
    } else {
      console.error('Email-2 schedule failed', await res.text())
    }
  } catch (err) {
    console.error('Email-2 error', err)
  }

  // 4. Schedule email-3 for +72hrs
  let email3Id: string | null = null
  try {
    const scheduledAt = new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString()
    const res = await fetch(`${RESEND_API}/emails`, {
      method: 'POST',
      headers: resendHeaders,
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: "If You're Too Busy, You Need This More Than Anyone",
        html: objectionEmail(firstName),
        scheduled_at: scheduledAt,
        tags: [{ name: 'category', value: 'objection_handle' }]
      })
    })
    if (res.ok) {
      const data = await res.json()
      email3Id = data?.id ?? null
    } else {
      console.error('Email-3 schedule failed', await res.text())
    }
  } catch (err) {
    console.error('Email-3 error', err)
  }

  // 5. Store Resend IDs back to leads table so we can cancel later
  const updates: Record<string, string> = {}
  if (contactId) updates.resend_contact_id = contactId
  if (email2Id) updates.resend_email_2_id = email2Id
  if (email3Id) updates.resend_email_3_id = email3Id

  if (Object.keys(updates).length > 0) {
    const { error } = await supabase.from('leads').update(updates).eq('id', leadId)
    if (error) console.error('Failed to update lead with Resend IDs', error)
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
})
