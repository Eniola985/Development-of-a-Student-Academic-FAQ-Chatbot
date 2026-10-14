import { handlePolyAdvisorQuery, queryOfflinePolyKnowledge } from '../src/services/polyAdvisor';

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
    let body = req.body;
    if (!body || typeof body !== 'object') {
      body = await new Promise((resolve) => {
        let data = '';
        req.on('data', (chunk: any) => { data += chunk; });
        req.on('end', () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve({});
          }
        });
        setTimeout(() => resolve({}), 2000);
      });
    }

    const { message, studentProfile, history } = body;

    if (!message) {
      const fallbackResult = queryOfflinePolyKnowledge('Hello', studentProfile);
      res.status(200).json(fallbackResult);
      return;
    }

    try {
      const result = await handlePolyAdvisorQuery({ message, studentProfile, history });
      res.status(200).json(result);
    } catch (innerError) {
      console.warn('handlePolyAdvisorQuery error on Vercel, falling back to offline knowledge engine:', innerError);
      const fallbackResult = queryOfflinePolyKnowledge(message, studentProfile);
      res.status(200).json(fallbackResult);
    }
  } catch (error: any) {
    console.error('Vercel API chat handler error:', error);
    const safeResult = queryOfflinePolyKnowledge('Hello', {});
    res.status(200).json(safeResult);
  }
}
