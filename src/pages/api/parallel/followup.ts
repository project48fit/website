import type { NextApiRequest, NextApiResponse } from 'next';
import { getParallelClient, getParallelProcessor } from '../../../lib/parallel';

type FollowupRequestBody = {
  name?: string;
  email?: string;
  goals?: string;
  notes?: string;
  run_id?: string;
};

type FollowupDraft = {
  subject: string;
  body: string;
};

type FollowupPending = {
  run_id: string;
  status: 'pending';
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const adminToken = process.env.ADMIN_API_TOKEN;
  if (adminToken) {
    const providedToken = req.headers['x-admin-token'];
    if (providedToken !== adminToken) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }
  }

  const { name, email, goals, notes, run_id }: FollowupRequestBody = req.body ?? {};

  const client = getParallelClient();
  if (!client) {
    res.status(400).json({ error: 'Parallel not configured.' });
    return;
  }

  try {
    let runId = run_id ?? null;

    if (!runId) {
      if (!name || !email || !goals) {
        res.status(400).json({ error: 'name, email, and goals are required.' });
        return;
      }

      const run = await client.taskRun.create({
        input: {
          name,
          email,
          goals,
          notes: notes ?? ''
        },
        processor: getParallelProcessor(),
        metadata: {
          source: 'followup_draft'
        },
        task_spec: {
          output_schema: {
            type: 'json',
            json_schema: {
              type: 'object',
              additionalProperties: false,
              properties: {
                subject: {
                  type: 'string',
                  description: 'Short subject line for a follow-up email.'
                },
                body: {
                  type: 'string',
                  description:
                    'Email body in a warm, concise tone. 2-3 short paragraphs, end with a clear CTA to reply.'
                }
              },
              required: ['subject', 'body']
            }
          }
        }
      });

      runId = run.run_id;
    }

    try {
      const result = await client.taskRun.result(runId, { timeout: 12 });
      if (result.output.type !== 'json') {
        res.status(500).json({ error: 'Unexpected response from Parallel.' });
        return;
      }

      res.status(200).json(result.output.content as FollowupDraft);
      return;
    } catch (error) {
      if (error instanceof Error && error.message.includes('Run still active')) {
        res.status(202).json({ status: 'pending', run_id: runId } satisfies FollowupPending);
        return;
      }
      throw error;
    }
  } catch (error) {
    console.error('Parallel follow-up draft failed', error);
    res.status(500).json({ error: 'Unable to generate follow-up draft.' });
  }
}
