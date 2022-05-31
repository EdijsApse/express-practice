function accessDenied(req, res) {
    res.status(403).render('errors/403');
}

function notFound(req, res) {
    res.status(404).render('errors/404');
}

module.exports = {
    notFound: notFound,
    accessDenied: accessDenied
}