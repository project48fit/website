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

function shell(content: string): string {
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
  <table border="0" width="100%" cellpadding="0" cellspacing="0" role="presentation" style="background:#e8e4d9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table align="center" width="90%" border="0" cellpadding="0" cellspacing="0" role="presentation"
          style="max-width:600px;background:#f5f2e8;border:2px solid #000;padding:40px;font-family:Arial,Helvetica,sans-serif;">
          <tr>
            <td>

              <!-- HEADER -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
                <tr>
                  <td align="center" style="border-bottom:2px solid #000;padding-bottom:24px;">
                    <a href="${SITE_URL}" style="text-decoration:none;" target="_blank">
                      <img src="${LOGO_URL}" alt="Project Fitness" width="140" height="140"
                        style="display:block;margin:0 auto;outline:none;border:none;" />
                    </a>
                    <p style="margin:10px 0 0 0;padding:0;font-size:11px;letter-spacing:2px;color:#444;text-transform:uppercase;">
                      EST. 2025 &nbsp;&bull;&nbsp; Training &nbsp;&bull;&nbsp; Nutrition &nbsp;&bull;&nbsp; Discipline
                    </p>
                  </td>
                </tr>
              </table>

              ${content}

              <!-- FOOTER -->
              <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="margin-top:32px;">
                <tr>
                  <td align="center" style="border-top:1px solid #ccc;padding-top:24px;font-size:11px;
                    color:#666;text-align:center;line-height:1.8;">
                    <p style="margin:0;padding:0;">&copy; Project Fitness &mdash; All Rights Reserved</p>
                    <p style="margin:4px 0 0 0;padding:0;">
                      You're receiving this because you applied for coaching.<br />
                      <a href="{{unsubscribe_url}}" style="color:#000;text-decoration:underline;">Unsubscribe</a>
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

// ─── Email 1: Immediate post-application ────────────────────────────────────

export function applicationEmail(firstName: string): string {
  const name = escapeHtml(firstName)
  return shell(`
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:28px 0 16px 0;">
        <h2 style="margin:0;padding:0;font-size:20px;font-weight:700;letter-spacing:2px;
          text-transform:uppercase;color:#000;">Application Received</h2>
      </td>
    </tr>
    <tr>
      <td style="font-size:16px;line-height:1.6;color:#222;padding-bottom:24px;border-bottom:1px solid #ccc;">
        <p style="margin:0 0 14px 0;">Hey ${name},</p>
        <p style="margin:0 0 14px 0;">Thanks for taking the time to fill out the Project coaching application. We appreciate it.</p>
        <p style="margin:0 0 14px 0;">The next step is simple.</p>
        <p style="margin:0 0 10px 0;">Book your 15&ndash;20 minute coaching call so we can:</p>
        <ul style="margin:0 0 14px 20px;padding:0;">
          <li style="margin:0 0 6px 0;">Understand your goals and training history</li>
          <li style="margin:0 0 6px 0;">Identify what has been holding you back</li>
          <li style="margin:0 0 6px 0;">Walk through what coaching would look like for you</li>
        </ul>
        <p style="margin:0;">This call gives you clarity on whether Project is the right fit for where you are now.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 0;text-align:center;">
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 16px auto;">
          <tr>
            <td bgcolor="#000000" style="padding:16px 36px;text-align:center;">
              <a href="${BOOKING_URL}" style="color:#f5f2e8;text-decoration:none;text-transform:uppercase;
                letter-spacing:0.2em;font-size:12px;font-weight:700;display:inline-block;">
                Book Your Coaching Call
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0;font-size:12px;color:#666;">
          Button not working?
          <a href="${BOOKING_URL}" style="color:#000;text-decoration:underline;">${BOOKING_URL}</a>
        </p>
      </td>
    </tr>
    <tr>
      <td style="font-size:15px;line-height:1.7;color:#222;">
        <p style="margin:0;">Talk soon,<br /><strong>Birk &amp; Caleb</strong><br />
          Founders of Project Fitness<br />projectfitness.co</p>
      </td>
    </tr>
  </table>`)
}

// ─── Email 2: Social proof — 24hrs after application ────────────────────────

export function socialProofEmail(firstName: string): string {
  const name = escapeHtml(firstName)
  return shell(`
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:28px 0 16px 0;">
        <h2 style="margin:0;padding:0;font-size:20px;font-weight:700;letter-spacing:2px;
          text-transform:uppercase;color:#000;">How Keith Got Leaner Than He&rsquo;d Been in 15 Years</h2>
      </td>
    </tr>
    <tr>
      <td style="font-size:16px;line-height:1.6;color:#222;padding-bottom:24px;border-bottom:1px solid #ccc;">
        <p style="margin:0 0 14px 0;">Hey ${name},</p>
        <p style="margin:0 0 14px 0;">Keith is a business owner from Georgia. Knows fitness. Been training for years.</p>
        <p style="margin:0 0 14px 0;">Before Project, his approach was one-dimensional &mdash; he&rsquo;d either lock in on nutrition, or push harder in the gym, or focus on consistency. Never all three. Never with anyone holding him accountable to the full picture.</p>
        <p style="margin:0 0 14px 0;">He didn&rsquo;t think he needed coaching. He already had the knowledge.</p>
        <p style="margin:0 0 24px 0;">What he didn&rsquo;t have was the system &mdash; and someone in his corner making sure he actually used it.</p>

        <!-- PULL QUOTE -->
        <table width="100%" cellpadding="0" cellspacing="0" role="presentation"
          style="border-left:4px solid #0e0e0e;background:#ede9db;margin-bottom:24px;">
          <tr>
            <td style="padding:20px 24px;font-size:17px;line-height:1.6;color:#0e0e0e;font-style:italic;">
              &ldquo;I&rsquo;m leaner than I&rsquo;ve been in the past 15 years. My back has felt better than it has in many, many years. Project pushes you in new areas &mdash; and I&rsquo;d recommend it to anyone who thinks they don&rsquo;t need it because they already know what to do.&rdquo;
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 16px 24px;font-size:12px;letter-spacing:1px;text-transform:uppercase;color:#444;font-weight:700;">
              &mdash; Keith T., Business Owner
            </td>
          </tr>
        </table>

        <p style="margin:0 0 14px 0;">Since working with Caleb, Keith is leaner than he&rsquo;s been in 15 years. Back issues that had bothered him on and off for years? Barely a factor anymore. And he&rsquo;s moving in ways he hadn&rsquo;t pushed himself to move before.</p>
        <p style="margin:0;">Knowing and doing are two different things.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 0;font-size:16px;line-height:1.6;color:#222;">
        <p style="margin:0 0 14px 0;">If you haven&rsquo;t booked your call yet, this is your reminder.</p>
        <p style="margin:0 0 24px 0;">15 minutes. No pressure. Just clarity on what&rsquo;s possible.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
          <tr>
            <td bgcolor="#000000" style="padding:16px 36px;text-align:center;">
              <a href="${BOOKING_URL}" style="color:#f5f2e8;text-decoration:none;text-transform:uppercase;
                letter-spacing:0.2em;font-size:12px;font-weight:700;display:inline-block;">
                Book Your Coaching Call
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 24px 0;font-size:12px;color:#666;">
          Button not working?
          <a href="${BOOKING_URL}" style="color:#000;text-decoration:underline;">${BOOKING_URL}</a>
        </p>
        <p style="margin:0;">Talk soon,<br /><strong>Birk &amp; Caleb</strong><br />
          Founders of Project Fitness<br />projectfitness.co</p>
      </td>
    </tr>
  </table>`)
}

// ─── Email 3: Objection handle — 72hrs after application ────────────────────

export function objectionEmail(firstName: string): string {
  const name = escapeHtml(firstName)
  return shell(`
  <table width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation">
    <tr>
      <td style="padding:28px 0 16px 0;">
        <h2 style="margin:0;padding:0;font-size:20px;font-weight:700;letter-spacing:2px;
          text-transform:uppercase;color:#000;">If You&rsquo;re Too Busy, You Need This More Than Anyone</h2>
      </td>
    </tr>
    <tr>
      <td style="font-size:16px;line-height:1.6;color:#222;padding-bottom:24px;border-bottom:1px solid #ccc;">
        <p style="margin:0 0 14px 0;">Hey ${name},</p>
        <p style="margin:0 0 14px 0;">The most common reason people don&rsquo;t book the call:
          <strong>&ldquo;I&rsquo;m too busy right now.&rdquo;</strong></p>
        <p style="margin:0 0 14px 0;">We hear it every week. And we get it &mdash; you&rsquo;re running a company.
          Your calendar is already spoken for.</p>
        <p style="margin:0 0 20px 0;">But here&rsquo;s the truth:</p>

        <h3 style="margin:0 0 10px 0;padding:0 0 8px 0;border-bottom:1px solid #000;font-size:18px;
          font-weight:700;text-transform:uppercase;color:#000;">
          The Busiest People Need This the Most
        </h3>
        <p style="margin:0 0 14px 0;">When your energy is low, your decisions suffer.
          When you&rsquo;re not sleeping, your focus drops.
          When you&rsquo;re not training, stress compounds instead of releasing.</p>
        <p style="margin:0 0 20px 0;">The executives who perform at the highest level aren&rsquo;t the ones
          who &ldquo;find time&rdquo; for health. They&rsquo;re the ones who treat health
          <em>as the foundation</em> that makes everything else possible.</p>

        <h3 style="margin:0 0 10px 0;padding:0 0 8px 0;border-bottom:1px solid #000;font-size:18px;
          font-weight:700;text-transform:uppercase;color:#000;">
          Built for No Margin
        </h3>
        <p style="margin:0 0 14px 0;">Our program is designed for people who have no slack in their schedule:</p>
        <ul style="margin:0 0 14px 20px;padding:0;">
          <li style="margin:0 0 8px 0;">Sessions as short as 30 minutes</li>
          <li style="margin:0 0 8px 0;">Programming that adapts to travel weeks and back-to-back calendars</li>
          <li style="margin:0 0 8px 0;">A coach who adjusts your plan in real time &mdash; not one who emails
            you a PDF and disappears</li>
        </ul>
        <p style="margin:0;"><strong>If you&rsquo;re too busy to get healthy, you&rsquo;re too busy not to.</strong></p>
      </td>
    </tr>
    <tr>
      <td style="padding:28px 0;font-size:16px;line-height:1.6;color:#222;">
        <p style="margin:0 0 14px 0;">The call is 15 minutes. If it&rsquo;s not a fit, no problem.</p>
        <p style="margin:0 0 24px 0;">But if it is &mdash; you&rsquo;ll know exactly what to do next.</p>
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 0 16px 0;">
          <tr>
            <td bgcolor="#000000" style="padding:16px 36px;text-align:center;">
              <a href="${BOOKING_URL}" style="color:#f5f2e8;text-decoration:none;text-transform:uppercase;
                letter-spacing:0.2em;font-size:12px;font-weight:700;display:inline-block;">
                Book Your Coaching Call
              </a>
            </td>
          </tr>
        </table>
        <p style="margin:0 0 24px 0;font-size:12px;color:#666;">
          Button not working?
          <a href="${BOOKING_URL}" style="color:#000;text-decoration:underline;">${BOOKING_URL}</a>
        </p>
        <p style="margin:0;">Talk soon,<br /><strong>Birk &amp; Caleb</strong><br />
          Founders of Project Fitness<br />projectfitness.co</p>
      </td>
    </tr>
  </table>`)
}
