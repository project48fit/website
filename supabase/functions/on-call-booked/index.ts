/**
 * on-call-booked
 *
 * HTTP endpoint to call when a lead books a coaching call.
 * Cancels their scheduled follow-up emails and moves them to the call-booked audience.
 *
 * Call manually (or wire up to a Calendly/Cal.com webhook later):
 *   POST <edge-function-url>
 *   Headers: x-admin-token: <ADMIN_API_TOKEN>
 *   Body: { "email": "lead@example.com" }
 *      or { "lead_id": "uuid" }
 *
 * Required env vars:
 *   RESEND_API_KEY
 *   ADMIN_API_TOKEN                  — same token used by the site's admin endpoints
 *   RESEND_CALL_BOOKED_AUDIENCE_ID   — optional, audience for booked contacts
 *   SUPABASE_URL                     — auto-set
 *   SUPABASE_SERVICE_ROLE_KEY        — auto-set
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const RESEND_API = 'https://api.resend.com'

Deno.serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  const adminToken = Deno.env.get('ADMIN_API_TOKEN')
  if (adminToken && req.headers.get('x-admin-token') !== adminToken) {
    return new Response('Unauthorized', { status: 401 })
  }

  let body: { email?: string; lead_id?: string }
  try {
    body = await req.json()
  } catch {
    return new Response('Invalid JSON', { status: 400 })
  }

  const { email, lead_id } = body
  if (!email && !lead_id) {
    return new Response('Provide email or lead_id', { status: 400 })
  }

  const resendKey = Deno.env.get('RESEND_API_KEY')
  const callBookedAudienceId = Deno.env.get('RESEND_CALL_BOOKED_AUDIENCE_ID')

  if (!resendKey) {
    return new Response('Server misconfiguration', { status: 500 })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  // Find the lead
  let query = supabase.from('leads').select('*').limit(1)
  if (lead_id) query = query.eq('id', lead_id)
  else query = query.eq('email', email)

  const { data: leads, error: lookupError } = await query
  if (lookupError || !leads?.length) {
    return new Response('Lead not found', { status: 404 })
  }
  const lead = leads[0]

  const resendHeaders = { 'Authorization': `Bearer ${resendKey}` }

  // 1. Cancel scheduled emails (fire-and-forget, best-effort)
  const cancels: Promise<Response>[] = []
  if (lead.resend_email_2_id) {
    cancels.push(
      fetch(`${RESEND_API}/emails/${lead.resend_email_2_id}/cancel`, {
        method: 'POST',
        headers: resendHeaders
      })
    )
  }
  if (lead.resend_email_3_id) {
    cancels.push(
      fetch(`${RESEND_API}/emails/${lead.resend_email_3_id}/cancel`, {
        method: 'POST',
        headers: resendHeaders
      })
    )
  }

  const cancelResults = await Promise.allSettled(cancels)
  cancelResults.forEach((result, i) => {
    if (result.status === 'rejected') {
      console.error(`Cancel email ${i + 2} failed`, result.reason)
    }
  })

  // 2. Add to call-booked audience in Resend
  if (callBookedAudienceId && lead.email) {
    const firstName = (lead.full_name ?? '').trim().split(' ')[0]
    try {
      const res = await fetch(`${RESEND_API}/audiences/${callBookedAudienceId}/contacts`, {
        method: 'POST',
        headers: { ...resendHeaders, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: lead.email,
          first_name: firstName,
          last_name: (lead.full_name ?? '').split(' ').slice(1).join(' ') || '',
          unsubscribed: false
        })
      })
      if (!res.ok) console.error('Resend call-booked contact failed', await res.text())
    } catch (err) {
      console.error('Resend call-booked audience error', err)
    }
  }

  // 3. Mark lead as booked
  const { error: updateError } = await supabase
    .from('leads')
    .update({ call_booked_at: new Date().toISOString() })
    .eq('id', lead.id)

  if (updateError) {
    console.error('Failed to update call_booked_at', updateError)
  }

  return new Response(
    JSON.stringify({ ok: true, lead_id: lead.id, email: lead.email }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  )
})
