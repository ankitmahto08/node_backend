const verifyRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req?.roles) return res.sendStatus(401); // Unauthorized

    const result = req.roles
      .map(role => allowedRoles.includes(role))
      .find(val => val === true);

    if (!result) return res.sendStatus(401); // Unauthorized

    next();
  };
};

module.exports = verifyRoles;
