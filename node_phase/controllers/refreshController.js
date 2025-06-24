const jwt = require('jsonwebtoken');
require('dotenv').config();

const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleRefreshToken = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(401); // Unauthorized

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);
  if (!foundUser) return res.sendStatus(403); // Forbidden

  jwt.verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    (err, decoded) => {
      if (err || foundUser.username !== decoded.username) {
        return res.sendStatus(403); // Forbidden
      }

      const accessToken = jwt.sign(
        { username: decoded.username },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '120s' }
      );

      res.json({ accessToken });
    }
  );
};

module.exports = { handleRefreshToken };
