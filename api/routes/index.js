let express = require('express');
let router = express.Router();
let sequelize = require("../database/config/database");

/* GET home page. */
router.get('/',async function(req, res, next) {
  try {
    res.render('index', {title: 'Express'});
  }
  catch (e) {
    res.render('error', {message: "Exception", error: e});
  }
});

router.get('/sync',async function(req, res, next) {
  try {
    await sequelize.sync({ force: true });
    console.log("All models were synchronized successfully.");
    res.render('index', {title: 'Express'});
  }
  catch (e) {
    logger.error(e);
    res.render('error', {message: "Exception", error: e});
  }
});

module.exports = router;
