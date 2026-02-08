import type { NextApiRequest, NextApiResponse } from 'next';
import { getParallelClient, getParallelProcessor } from '../../lib/parallel';

type ApplyRequestBody = {
  name?: string;
  email?: string;
  goals?: string;
};

async function forwardEmail(payload: Required<ApplyRequestBody>) {
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.APPLY_EMAIL_TO;
  const fromEmail =
    process.env.APPLY_EMAIL_FROM ?? 'Project Coaching <coach@projectfitness.co>';

  if (!apiKey || !toEmail) {
    console.log('New coaching application:', payload);
    return;
  }

  const recipients = toEmail
    .split(',')
    .map((address) => address.trim())
    .filter(Boolean);

  if (recipients.length === 0) {
    console.log('New coaching application (no recipients):', payload);
    return;
  }

  const brief = await generateCoachBrief(payload);
  const briefSection = brief ? `\n\nCoach Brief (Parallel)\n${brief}\n` : '';

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: recipients,
      subject: `New coaching application from ${payload.name}`,
      text: `Name: ${payload.name}\nEmail: ${payload.email}\nGoals: ${payload.goals}${briefSection}`
    })
  }).then(async (response) => {
    if (!response.ok) {
      const message = await response.text();
      throw new Error(`Resend API error: ${message}`);
    }
  });
}

async function sendApplicantConfirmation(payload: Required<ApplyRequestBody>) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const fromEmail =
    process.env.APPLY_CONFIRMATION_FROM ??
    'Project Fitness <marketing@notifications.projectfitness.co>';

  const calendarLink = 'https://calendar.app.google/v4MAspiPTvvRnc127';
  const scheduledAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  const subject = 'Next step: book your Project. coaching call';
  const text = [
    `Hey ${payload.name}, thanks for filling out the Project. coaching form.`,
    '',
    'You took the first step toward getting structure, accountability, and a fitness plan that fits your life.',
    '',
    "Here's what happens next:",
    'Caleb and I run a short 15–20 minute coaching call to:',
    '- Understand your goals and training history',
    "- Identify what’s been holding you back",
    '- See if Project is the right fit for you moving forward',
    '',
    "If it is, we’ll outline how we’d coach you. If it’s not, we’ll tell you that too.",
    '',
    'Book your call here:',
    calendarLink,
    '',
    "Spots are limited each week so we can stay hands-on with our clients. If you’re serious about making progress, book your time now.",
    '',
    'Talk soon,',
    'Birk & Caleb',
    'Project. Fitness',
    'Website: https://projectfitness.co'
  ].join('\n');

  const html = `
    <p>Hey ${payload.name}, thanks for filling out the Project. coaching form.</p>
    <p>You took the first step toward getting structure, accountability, and a fitness plan that fits your life.</p>
    <p><strong>Here’s what happens next:</strong><br />
      Caleb and I run a short 15–20 minute coaching call to:</p>
    <ul>
      <li>Understand your goals and training history</li>
      <li>Identify what’s been holding you back</li>
      <li>See if Project is the right fit for you moving forward</li>
    </ul>
    <p>If it is, we’ll outline how we’d coach you. If it’s not, we’ll tell you that too.</p>
    <p><strong>Book your call here:</strong><br />
      <a href="${calendarLink}">${calendarLink}</a>
    </p>
    <p>Spots are limited each week so we can stay hands-on with our clients. If you’re serious about making progress, book your time now.</p>
    <p>Talk soon,<br />
      <strong>Birk &amp; Caleb</strong><br />
      Project. Fitness<br />
      Website: <a href="https://projectfitness.co">projectfitness.co</a>
    </p>
    <p><img src="https://projectfitness.co/full_logo.png" alt="Project. Fitness" style="max-width: 240px; height: auto;" /></p>
  `;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [payload.email],
      subject,
      text,
      html,
      scheduled_at: scheduledAt,
      tags: [{ name: 'category', value: 'apply_confirmation' }]
    })
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`Resend confirmation error: ${message}`);
  }
}

type CoachBrief = {
  summary: string;
  key_goals: string[];
  risks: string[];
  first_two_weeks_focus: string[];
  follow_up_questions: string[];
  readiness_score: number;
  readiness_label: 'low' | 'medium' | 'high';
  tags: string[];
};

function formatCoachBrief(brief: CoachBrief) {
  return [
    `Readiness: ${brief.readiness_label} (${brief.readiness_score}/100)`,
    `Tags: ${brief.tags.join(', ')}`,
    '',
    `Summary: ${brief.summary}`,
    '',
    'Key Goals:',
    ...brief.key_goals.map((goal) => `- ${goal}`),
    '',
    'Risks / Blockers:',
    ...brief.risks.map((risk) => `- ${risk}`),
    '',
    'First 2-Week Focus:',
    ...brief.first_two_weeks_focus.map((item) => `- ${item}`),
    '',
    'Follow-Up Questions:',
    ...brief.follow_up_questions.map((question) => `- ${question}`)
  ].join('\n');
}

async function generateCoachBrief(payload: Required<ApplyRequestBody>) {
  const client = getParallelClient();
  if (!client) return null;

  try {
    const run = await client.taskRun.create({
      input: {
        name: payload.name,
        email: payload.email,
        goals: payload.goals
      },
      processor: getParallelProcessor(),
      metadata: {
        source: 'apply_form'
      },
      task_spec: {
        output_schema: {
          type: 'json',
          json_schema: {
            type: 'object',
            additionalProperties: false,
            properties: {
              readiness_score: {
                type: 'number',
                description: '0-100 readiness score based on clarity, constraints, and fit.'
              },
              readiness_label: {
                type: 'string',
                enum: ['low', 'medium', 'high'],
                description: 'Qualitative readiness bucket.'
              },
              tags: {
                type: 'array',
                items: { type: 'string' },
                description: 'Short labels like "strength", "fat loss", "busy schedule".'
              },
              summary: {
                type: 'string',
                description: '1-2 sentence summary of the applicant and their goals.'
              },
              key_goals: {
                type: 'array',
                items: { type: 'string' },
                description: 'Top 2-4 concrete goals.'
              },
              risks: {
                type: 'array',
                items: { type: 'string' },
                description: 'Likely blockers, constraints, or risks.'
              },
              first_two_weeks_focus: {
                type: 'array',
                items: { type: 'string' },
                description: 'Suggested focus areas for the first two weeks.'
              },
              follow_up_questions: {
                type: 'array',
                items: { type: 'string' },
                description: '3-5 follow-up questions for onboarding.'
              }
            },
            required: [
              'readiness_score',
              'readiness_label',
              'tags',
              'summary',
              'key_goals',
              'risks',
              'first_two_weeks_focus',
              'follow_up_questions'
            ]
          }
        }
      }
    });

    const result = await client.taskRun.result(run.run_id, { timeout: 10 });
    if (result.output.type === 'json') {
      return formatCoachBrief(result.output.content as CoachBrief);
    }
    return result.output.content.trim();
  } catch (error) {
    console.error('Parallel coach brief failed', error);
    return null;
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const { name, email, goals }: ApplyRequestBody = req.body ?? {};

  if (!name || !email || !goals) {
    res.status(400).json({ error: 'Missing required fields.' });
    return;
  }

  try {
    await forwardEmail({ name, email, goals });
    sendApplicantConfirmation({ name, email, goals }).catch((error) =>
      console.error('Applicant confirmation failed', error)
    );
    res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Error forwarding application', error);
    res.status(500).json({ error: 'Failed to send application. Please try again later.' });
  }
}
