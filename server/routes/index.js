const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth').router);
router.use('/user', require('./user'));
router.use('/product', require('./product'));
router.use('/parameter', require('./parameter'));
router.use('/item', require('./item'));
router.use('/group', require('./group'));

// router.use('/foodtype', require('./foodtype'));
// router.use('/order', require('./order'));
// router.use('/ingredient', require('./ingredient'));
// router.use('/ingtype', require('./ingtype'));
// router.use('/change', require('./change'));
// router.use('/param', require('./param'));

module.exports = router;