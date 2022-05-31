function proceedIfUser(req, res, next) {
    const { user } = req.session;
    
    if (!user) {
        return res.redirect('/login');
    }

    next();
}

function proceedIfGuest(req, res, next) {
    const { user } = req.session;
    
    if (user) {
        return res.redirect('/');
    }

    next();
}

function proceedIfAdmin(req, res, next) {
    const { user } = req.session;
    
    if (!user || !user.isAdmin) {
        return res.redirect('/403');
    }

    next();
}

module.exports = {
    proceedIfUser: proceedIfUser,
    proceedIfGuest: proceedIfGuest,
    proceedIfAdmin: proceedIfAdmin
}