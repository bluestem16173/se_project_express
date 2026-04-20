const jwt = require("jsonwebtoken");
const UnauthorizedError = require("../utils/errors/UnauthorizedError");

const { JWT_SECRET = "super-strong-secret" } = process.env;

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new UnauthorizedError("Authorization required"));
  }

  const token = authorization.replace("Bearer ", "");
  let payload;

  try {
    payload = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return next(new UnauthorizedError("Authorization required"));
  }

  req.user = payload; // assigning the payload to the request object

  return next(); // sending the request to the next middleware
};
