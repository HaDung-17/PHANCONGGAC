const { db } = require('./_mongo');

module.exports = async (req, res) => {
  try {
    const database = await db();
    const col = database.collection('guard_history');
    if (req.method === 'GET') {
      const limit = Math.min(Math.max(Number(req.query.limit || 5), 1), 30);
      const docs = await col.find({}).sort({ date: -1 }).limit(limit).toArray();
      return res.status(200).json(docs.map(({ _id, ...x }) => x));
    }
    if (req.method === 'POST') {
      const body = req.body || {};
      if (!body.date || !Array.isArray(body.assignments)) return res.status(400).json({ error: 'Thiếu date hoặc assignments' });
      await col.updateOne(
        { _id: body.date },
        { $set: {
          date: body.date,
          assignments: body.assignments,
          peopleSnapshot: body.peopleSnapshot || [],
          statusesSnapshot: body.statusesSnapshot || {},
          updatedAt: new Date()
        } },
        { upsert: true }
      );
      return res.status(200).json({ ok: true });
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
