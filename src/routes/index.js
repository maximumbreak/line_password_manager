const { account } = require('../controllers/account')
const { copyToClipboard } = require('../controllers/copy')
let express = require('express')
let router = express.Router()

router.post('/account', account)
router.get('/copy', copyToClipboard)

module.exports = router
