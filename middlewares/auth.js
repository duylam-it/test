const jwt = require('jsonwebtoken')

module.exports = async (req, res, next) => {
  try {
    if (req.cookies.jwt == null) throw new Error('Forbidden!!!');
    const token = req.cookies.jwt;
    const payload = await jwt.verify(token, process.env.SECRET);
    req.payload = payload;
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Forbidden 🚫🚫🚫',
    })
  }
}
