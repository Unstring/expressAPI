const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const Posts = require("../model/post");

exports.postById = (req, res, next, id) => {
  try {
    Posts.findById(id)
      .populate("postedBy", "_id name")
      .exec((err, post) => {
        if (err || !post) {
          return res.status(400).json({
            error: err,
          });
        }
        req.post = post;
        next();
      });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.getPost = (req, res) => {
  try {
    return res.json(req.post);
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.createPosts = (req, res, next) => {
  try {
    const form = formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: "image could not be uploaded",
        });
      }

      const post = new Posts(fields);
      req.profile.password = undefined;
      post.postedBy = req.profile;
      if (files.photo) {
        post.photo.data = fs.readFileSync(files.photo.path);
        post.photo.contentType = files.photo.type;
      }
      post.save((err, result) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.json(result);
      });
    });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.getAllPosts = (req, res, next) => {
  try {
    Posts.find()
      .populate("postedBy", "_id name")
      .select("_id title body created photo")
      .then((posts) => {
        console.log(posts);
        res.status(200).json(posts);
      })
      .catch((err) => {
        res.status(400).json({
          message: err,
        });
      });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.updatePost = (req, res, next) => {
  try {
    let { post } = req;
    post = _.extend(post, req.body);
    post.updated = Date.now();
    post.save((err) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(post);
    });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.postedByUser = (req, res) => {
  try {
    Posts.find({ postedBy: req.profile._id })
      .populate("postedBy", "id name")
      .sort("_created")
      .exec((err, posts) => {
        if (err) {
          return res.status(400).json({
            error: err,
          });
        }
        res.json(posts);
      });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.deletePosts = (req, res, next) => {
  try {
    const { post } = req;
    post.remove((err, post) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json({
        message: "post deleted succefully",
      });
    });
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.isPoster = (req, res, next) => {
  try {
    const poster =
      req.post && req.auth && req.post.postedBy._id == req.auth._id;
    if (!poster) {
      return res.status(403).json({
        error: "user is not authorized to delete",
      });
    }
    next();
  } catch (error) {
    return res.json({ message: error });
  }
};

exports.updatePost = (req, res, next) => {
  try {
    let { post } = req;
    post = _.extend(post, req.body);
    post.updated = Date.now();
    post.save((err) => {
      if (err) {
        return res.status(400).json({
          error: err,
        });
      }
      res.json(post);
    });
  } catch (error) {
    return res.json({ message: error });
  }
};
