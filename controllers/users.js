/* eslint-disable no-underscore-dangle */
const _ = require("lodash");
const User = require("../model/user");

exports.userById = (req, res, next, id) => {
  try {
    User.findById(id).exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "user is not found" });
      }

      req.profile = user;
      next();
    });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.hasAuthorization = (req, res) => {
  try {
    const authorized =
      req.profile && req.auth && req.profile._id === req.auth._id;

    if (!authorized) {
      return res
        .status(403)
        .json({ error: "user is not authorized to perform this action" });
    }
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.allUsers = (req, res, next) => {
  try {
    User.find((err, user) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json(user);
    }).select("name email created updated");
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.getUser = (req, res) => {
  try {
    req.profile.password = undefined;
    return res.json(req.profile);
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.updateUser = (req, res) => {
  try {
    let user = req.profile;
    user = _.extend(user, req.body);
    user.updated = Date.now();
    user.save((err) => {
      if (err) {
        return res.status(400).json({
          error: "you're not authorized to perform this action",
        });
      }
      user.password = undefined;
      res.json({ user });
    });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.deleteUser = (req, res) => {
  try {
    const user = req.profile;
    user.remove((err, user) => {
      if (err) {
        return res.status(400).json({ error: err });
      }
      res.json({ message: "user deleted successfully" });
    });
  } catch (error) {
    return res.json({ message: error });
  }
};
