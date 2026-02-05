// eslint-disable-next-line no-unused-vars
module.exports = (err, req, res, next) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(400).send({ message: "Invalid data" });
    return;
  }

  res.status(500).send({ message: "An error has occurred on the server" });
};
