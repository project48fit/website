import type { NextApiRequest, NextApiResponse } from 'next';
import { createReadStream, statSync } from 'fs';
import { join, normalize } from 'path';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { slug } = req.query;

  if (!slug || Array.isArray(slug)) {
    res.status(400).json({ error: 'Invalid resource request' });
    return;
  }

  const safeSlug = slug.replace(/\.\./g, '');
  const filePath = normalize(join(process.cwd(), 'public', 'assets', 'resources', safeSlug));

  try {
    const stats = statSync(filePath);
    res.setHeader('Content-Length', stats.size);
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${safeSlug}"`);
    const stream = createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    res.status(404).json({ error: 'Resource not found' });
  }
}
