const { Redis } = require('@upstash/redis');

const redis = Redis.fromEnv();
const SESSION_KEY_PREFIX = 'portfolio:visitor:session:';
const TOTAL_KEY = 'portfolio:visitor:total';

module.exports = async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const sessionId = String(req.query.session || '');
  if (!/^[A-Za-z0-9_-]{16,100}$/.test(sessionId)) {
    return res.status(400).json({ ok: false, error: 'Invalid session' });
  }

  try {
    const wasAdded = await redis.set(SESSION_KEY_PREFIX + sessionId, '1', { nx: true });
    if (wasAdded) await redis.incr(TOTAL_KEY);

    const total = Number(await redis.get(TOTAL_KEY) || 0);
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ok: true, total: total });
  } catch (error) {
    console.error('Visitor counter failed:', error);
    return res.status(503).json({ ok: false, error: 'Visitor counter unavailable' });
  }
};
