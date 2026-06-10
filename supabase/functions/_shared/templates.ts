const LOGO_URL = 'https://resend-attachments.s3.amazonaws.com/71rZhnxGeQF5xzs'
const SITE_URL = 'https://projectfitness.co'
const BOOKING_URL = 'https://calendar.app.google/c7qR2kRWT7HLDQBYA'

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

function ctaButton(url: string, label: string): string {
  return `
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 10px 0;">
          <tr>
            <td bgcolor="#0e0e0e" style="padding:15px 40px;text-align:center;">
              <a href="${url}" style="color:#f5f2e8;text-decoration:none;text-transform:uppercase;
                letter-spacing:0.15em;font-size:11px;font-weight:700;display:inline-block;">
                ${label}
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0;font-size:11px;color:#aaa;">
          <a href="${url}" style="color:#aaa;text-decoration:underline;">${url}</a>
        </p>`
}

function shell(content: string, footerNote = "You're receiving this because you applied for coaching."): string {
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
  <meta content="width=device-width" name="viewport" />
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="x-apple-disable-message-reformatting" />
  <meta content="IE=edge" http-equiv="X-UA-Compatible" />
  <meta content="telephone=no,address=no,email=no,date=no,url=no" name="format-detection" />
</head>
<body style="margin:0;padding:0;background:#e8e4d9;">
  <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#e8e4d9;padding:36px 16px;">
    <tr>
      <td align="center">
        <table align="center" width="92%" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:580px;background:#f5f2e8;border:1px solid #1a1a1a;font-family:Arial,Helvetica,sans-serif;">
          <tr>
            <td>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="border-bottom:1px solid #1a1a1a;padding:28px 36px 20px;">
                    <a href="${SITE_URL}" style="text-decoration:none;" target="_blank">
                      <img src="${LOGO_URL}" alt="Project Fitness" width="108" height="108"
                        style="display:block;margin:0 auto;outline:none;border:none;" />
                    </a>
                    <p style="margin:10px 0 0 0;padding:0;font-size:10px;letter-spacing:3px;color:#777;text-transform:uppercase;">
                      EST. 2025 &nbsp;&bull;&nbsp; Training &nbsp;&bull;&nbsp; Nutrition &nbsp;&bull;&nbsp; Discipline
                    </p>
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td style="padding:28px 36px;">
                    ${content}
                  </td>
                </tr>
              </table>

              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="border-top:1px solid #d8d4c9;padding:16px 36px 24px;font-size:10px;
                    color:#999;text-align:center;line-height:1.8;">
                    <p style="margin:0;padding:0;">&copy; Project Fitness &mdash; All Rights Reserved</p>
                    <p style="margin:4px 0 0 0;padding:0;">
                      ${footerNote}<br />
                      <a href="{{unsubscribe_url}}" style="color:#777;text-decoration:underline;">Unsubscribe</a>
                    </p>
                  </td>
                </tr>
              </table>

            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

// ─── Email 1: Immediate post-application confirmation ───────────────────────

export function applicationEmail(firstName: string): string {
  const name = escapeHtml(firstName)
  return shell(`
    <h2 style="margin:0 0 20px 0;padding:0 0 16px 0;border-bottom:1px solid #d8d4c9;font-size:18px;
      font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0e0e0e;">Application Received</h2>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Hey ${name},</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Thanks for applying to Project coaching. The next step is to book your 15&ndash;20 minute intro call.</p>
    <p style="margin:0 0 10px 0;font-size:15px;line-height:1.7;color:#222;">On the call, we&rsquo;ll cover:</p>
    <ul style="margin:0 0 20px 24px;padding:0;font-size:15px;line-height:1.7;color:#222;">
      <li style="margin:0 0 6px 0;">Your goals and training history</li>
      <li style="margin:0 0 6px 0;">What&rsquo;s held you back so far</li>
      <li style="margin:0 0 6px 0;">Whether Project is the right fit</li>
    </ul>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#222;">No commitment required. Just clarity on what&rsquo;s possible.</p>
    ${ctaButton(BOOKING_URL, 'Book Your Coaching Call')}
    <p style="margin:24px 0 0 0;font-size:15px;line-height:1.7;color:#222;">Talk soon,<br /><strong>Birk &amp; Caleb</strong><br />
      Founders of Project Fitness &mdash; projectfitness.co</p>
  `)
}

// ─── Email 2: Social proof — 24hrs after application ────────────────────────

export function socialProofEmail(firstName: string): string {
  const name = escapeHtml(firstName)
  return shell(`
    <h2 style="margin:0 0 20px 0;padding:0 0 16px 0;border-bottom:1px solid #d8d4c9;font-size:18px;
      font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0e0e0e;">How Keith Got Leaner Than He&rsquo;d Been in 15 Years</h2>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Hey ${name},</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Keith is a business owner from Georgia. Knows fitness. Been training for years.</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Before Project, his approach was one-dimensional &mdash; he&rsquo;d either lock in on nutrition, or push harder in the gym, or focus on consistency. Never all three at once.</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">He didn&rsquo;t think he needed coaching. He already had the knowledge.</p>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#222;">What he didn&rsquo;t have was the system &mdash; and someone making sure he actually used it.</p>

    <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
      style="border-left:3px solid #1a1a1a;background:#ede9db;margin-bottom:20px;">
      <tr>
        <td style="padding:18px 22px 14px;font-size:15px;line-height:1.7;color:#1a1a1a;font-style:italic;">
          &ldquo;I&rsquo;m leaner than I&rsquo;ve been in the past 15 years. My back has felt better than it has in many years. Project pushes you in new areas &mdash; and I&rsquo;d recommend it to anyone who thinks they don&rsquo;t need it because they already know what to do.&rdquo;
        </td>
      </tr>
      <tr>
        <td style="padding:0 22px 16px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#555;font-weight:700;">
          &mdash; Keith T., Business Owner
        </td>
      </tr>
    </table>

    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Since working with Caleb, Keith is leaner than he&rsquo;s been in 15 years. Back issues that had bothered him on and off? Barely a factor. And he&rsquo;s moving in ways he hadn&rsquo;t pushed himself to move before.</p>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#222;">Knowing and doing are two different things.</p>
    <p style="margin:0 0 10px 0;font-size:15px;line-height:1.7;color:#222;">If you haven&rsquo;t booked your call yet &mdash; 15 minutes, no pressure, just clarity.</p>
    ${ctaButton(BOOKING_URL, 'Book Your Coaching Call')}
    <p style="margin:24px 0 0 0;font-size:15px;line-height:1.7;color:#222;">Talk soon,<br /><strong>Birk &amp; Caleb</strong><br />
      Founders of Project Fitness &mdash; projectfitness.co</p>
  `)
}

// ─── Email 3: Objection handle — 72hrs after application ────────────────────

export function objectionEmail(firstName: string): string {
  const name = escapeHtml(firstName)
  return shell(`
    <h2 style="margin:0 0 20px 0;padding:0 0 16px 0;border-bottom:1px solid #d8d4c9;font-size:18px;
      font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0e0e0e;">If You&rsquo;re Too Busy, You Need This More Than Anyone</h2>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Hey ${name},</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">The most common reason people don&rsquo;t book the call: <strong>&ldquo;I&rsquo;m too busy right now.&rdquo;</strong></p>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#222;">We hear it every week. And we get it &mdash; you&rsquo;re running a company. Your calendar is already spoken for.</p>

    <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0e0e0e;
      border-bottom:1px solid #d8d4c9;padding-bottom:8px;">The Busiest People Need This the Most</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">When your energy is low, your decisions suffer. When you&rsquo;re not sleeping, your focus drops. When you&rsquo;re not training, stress compounds instead of releasing.</p>
    <p style="margin:0 0 20px 0;font-size:15px;line-height:1.7;color:#222;">The executives who perform at the highest level don&rsquo;t &ldquo;find time&rdquo; for health. They treat health <em>as the foundation</em> that makes everything else possible.</p>

    <p style="margin:0 0 8px 0;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0e0e0e;
      border-bottom:1px solid #d8d4c9;padding-bottom:8px;">Built for No Margin</p>
    <p style="margin:0 0 10px 0;font-size:15px;line-height:1.7;color:#222;">The program is designed for people with no slack in their schedule:</p>
    <ul style="margin:0 0 14px 24px;padding:0;font-size:15px;line-height:1.7;color:#222;">
      <li style="margin:0 0 6px 0;">Sessions as short as 30 minutes</li>
      <li style="margin:0 0 6px 0;">Programming that adapts to travel weeks and back-to-back calendars</li>
      <li style="margin:0 0 6px 0;">A coach who adjusts your plan in real time &mdash; not a PDF and a disappearing act</li>
    </ul>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#222;"><strong>If you&rsquo;re too busy to get healthy, you&rsquo;re too busy not to.</strong></p>
    <p style="margin:0 0 10px 0;font-size:15px;line-height:1.7;color:#222;">The call is 15 minutes. If it&rsquo;s not a fit, no problem. But if it is &mdash; you&rsquo;ll know exactly what to do next.</p>
    ${ctaButton(BOOKING_URL, 'Book Your Coaching Call')}
    <p style="margin:24px 0 0 0;font-size:15px;line-height:1.7;color:#222;">Talk soon,<br /><strong>Birk &amp; Caleb</strong><br />
      Founders of Project Fitness &mdash; projectfitness.co</p>
  `)
}

// ─── Email 4: Close — 7 days after application, no booking ──────────────────

export function closeEmail(firstName: string): string {
  const name = escapeHtml(firstName)
  return shell(`
    <h2 style="margin:0 0 20px 0;padding:0 0 16px 0;border-bottom:1px solid #d8d4c9;font-size:18px;
      font-weight:700;letter-spacing:2px;text-transform:uppercase;color:#0e0e0e;">Still Interested?</h2>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Hey ${name},</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">Checking in one last time on your Project coaching application.</p>
    <p style="margin:0 0 14px 0;font-size:15px;line-height:1.7;color:#222;">If coaching is still on your radar, book your 15-minute call below. No commitment required &mdash; just a conversation.</p>
    <p style="margin:0 0 24px 0;font-size:15px;line-height:1.7;color:#222;">If the timing isn&rsquo;t right, no problem. We&rsquo;ll be here when it is.</p>
    ${ctaButton(BOOKING_URL, 'Book Your Coaching Call')}
    <p style="margin:24px 0 0 0;font-size:15px;line-height:1.7;color:#222;">Birk &amp; Caleb<br />
      Founders of Project Fitness &mdash; projectfitness.co</p>
  `)
}
