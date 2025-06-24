const fsPromises = require('fs').promises;
const path = require('path');
const bcrypt = require('bcrypt');

const usersDB = {
  users: require('../models/employees.json'),
  setUsers: function (data) {
    this.users = data;
  }
};

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  // Check for duplicate username
  const duplicate = usersDB.users.find(user => user.username === username);
  if (duplicate) return res.sendStatus(409); // Conflict

  try {
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = { username, password: hashedPassword };

    // Update local users list
    usersDB.setUsers([...usersDB.users, newUser]);

    // Save to JSON file
    await fsPromises.writeFile(
      path.join(__dirname, '..', 'models', 'employees.json'),
      JSON.stringify(usersDB.users, null, 2)
    );

    res.status(201).json({ message: `New user ${username} registered` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
