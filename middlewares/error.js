function errorHandler(error, req, res, next) {
    if (process.env.APP_MODE == 'dev') {
        return res.status(500).render('admin/500', { error });
    }

    res.status(500).render('errors/500');
}

module.exports = {
    defaultErrorhandler: errorHandler
}