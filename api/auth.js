const { clearSessionCookie, credentialsValid, setSessionCookie } = require('./_auth');

module.exports = async (req, res) => {
  try {
    if (req.method === 'POST') {
      const body = req.body || {};
      const username = String(body.username || '');
      const password = String(body.password || '');
      if (!credentialsValid(username, password)) {
        return res.status(401).json({ error: 'Sai tên đăng nhập hoặc mật khẩu.' });
      }
      setSessionCookie(res, username);
      return res.status(200).json({ ok: true });
    }

    if (req.method === 'DELETE') {
      clearSessionCookie(res);
      return res.status(200).json({ ok: true });
    }

    res.setHeader('Allow', 'POST, DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: e.message });
  }
};
