const fsPromises = require('fs').promises;
const path = require('path');

const usersDB = {
  users: require('../models/users.json'),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleLogout = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(204); // No content

  const refreshToken = cookies.jwt;

  const foundUser = usersDB.users.find(user => user.refreshToken === refreshToken);

  // No user found, just clear cookie and return
  if (!foundUser) {
    res.clearCookie('jwt', { httpOnly: true });
    return res.sendStatus(204);
  }

  // Remove refresh token from user
  const otherUsers = usersDB.users.filter(
    person => person.refreshToken !== refreshToken
  );
  const currentUser = { ...foundUser, refreshToken: "" };

  usersDB.setUsers([...otherUsers, currentUser]);

  await fsPromises.writeFile(
    path.join(__dirname, '..', 'models', 'users.json'),
    JSON.stringify(usersDB.users, null, 2)
  );

  res.clearCookie('jwt', { httpOnly: true }); // Optionally add: secure: true, sameSite
  res.sendStatus(204);
};

module.exports = { handleLogout };
