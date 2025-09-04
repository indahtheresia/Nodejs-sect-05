exports.get404 = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404', { title: 'Not Found', path: '' })
}

exports.get500 = (req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(500).render('500', { title: 'Error', path: '' })
}