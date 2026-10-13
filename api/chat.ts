import { handlePolyAdvisorQuery } from '../src/services/polyAdvisor';

export default async function handler(req: any, res: any) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const { message, studentProfile, history } = body;

    if (!message) {
      res.status(400).json({ error: 'Message is required' });
      return;
    }

    const result = await handlePolyAdvisorQuery({ message, studentProfile, history });
    res.status(200).json(result);
  } catch (error: any) {
    console.error('Vercel API chat handler error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
}
