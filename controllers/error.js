/* eslint-disable no-underscore-dangle */

exports.errorHandler = (req, res) => {
  return res.status(404).json({ error: "route not found" });
};
