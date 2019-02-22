const copyToClipboard = (req, res) => {
  const { text } = req.query
  var decoded = Buffer.from(text, 'base64').toString()
  res.render('copy', {
    title: 'copy',
    password: decoded
  })
}

module.exports = {
  copyToClipboard
}
