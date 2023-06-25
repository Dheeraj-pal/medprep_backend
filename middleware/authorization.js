const authorization = (role_array) => {
  return (req, res, next) => {
    const role = req.body.role;
    if (role_array.includes(role)) {
      next();
    } else {
      res.status(404).json({ msg: "You are not Authorized" });
    }
  };
};

module.exports = {
    authorization,
};
