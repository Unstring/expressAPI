const express = require("express");

const { errorHandler } = require("../controllers/error");

const router = express.Router();
router.all("/*", errorHandler);
module.exports = router;
