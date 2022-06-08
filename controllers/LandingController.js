function index(req, res) {
    console.log(req.session.user)
    res.render('landing');
}

module.exports = {
    index: index
}