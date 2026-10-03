const { db } = require('./_mongo');
const { requireAuth } = require('./_auth');

module.exports = async (req, res) => {
  try {
    const session = requireAuth(req, res);
    if (!session) return;
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
    if (req.method === 'DELETE') {
      if (session.role !== 'admin') { return res.status(403).json({ error: 'Chỉ tài khoản quản trị mới có quyền xóa lịch sử.' }); }
      const date = req.query.date;
      if (!date) return res.status(400).json({ error: 'Thiếu ngày cần xóa' });
      const result = await col.deleteOne({ _id: date });
      if (!result.deletedCount) return res.status(404).json({ error: 'Không tìm thấy lịch sử của ngày này' });
      return res.status(200).json({ ok: true, date });
    }
    res.setHeader('Allow', 'GET, POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
