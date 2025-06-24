const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleLogin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password required" });
  }

  const foundUser = usersDB.users.find(user => user.username === username);
  if (!foundUser) {
    return res.sendStatus(401); // Unauthorized
  }

  const match = await bcrypt.compare(password, foundUser.password);
  if (!match) {
    return res.sendStatus(401); // Unauthorized
  }

  // Create JWTs
  const accessToken = jwt.sign(
    { username: foundUser.username },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '120s' }
  );

  const refreshToken = jwt.sign(
    { username: foundUser.username },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '1d' }
  );

  // Save refreshToken to user and write to file
  const otherUsers = usersDB.users.filter(
    person => person.username !== foundUser.username
  );

  const currentUser = { ...foundUser, refreshToken };
  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'models', 'users.json'),
    JSON.stringify(usersDB.users, null, 2)
  );

  // Send cookie and access token
  res.cookie('jwt', refreshToken, {
    httpOnly: true,
    secure: false, // Set true if using HTTPS
    sameSite: 'Strict',
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  });

  res.json({ accessToken });
};

module.exports = { handleLogin };
