module.exports = (err, req, res) => {
  if (err.name === "ValidationError" || err.name === "CastError") {
    res.status(400).send({ message: "Invalid data" });
    return;
  }

  res.status(500).send({ message: "An error has occurred on the server" });
};
