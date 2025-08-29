exports.getLogin = (req, res, next) => {
  // const isLoggedIn = req.get('Cookie').split(';')[1].split('=')[1];
  console.log(req.session.isLoggedIn);
  res.render('auth/login', { title: 'Login', path: '/login', isAuthenticated: false });
};

exports.postLogin = (req, res, next) => {
  req.session.isLoggedIn = true;
  // res.setHeader('Set-Cookie', 'loggedIn=true; HttpOnly');
  res.redirect('/');
}