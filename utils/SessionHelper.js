class SessionHelper {
    static flashMessage(request, message, success = true) {

        request.session.flashMessage = {
            type: success ? 'success' : 'error',
            message : message
        }
    }

    static storeUser(request, userParams) {
        request.session.user = userParams;
    }

    static destroy(request, key) {
        if (request.session[key]) {
            request.session[key] = null;
        }
    }
}

module.exports = SessionHelper;