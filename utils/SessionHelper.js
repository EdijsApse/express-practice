class SessionHelper {
    static flashMessage(request, message, success = true) {
        SessionHelper.add(request, 'flashMessage', {
            type: success ? 'success' : 'error',
            message : message
        })
    }

    static destroy(request, key) {
        if (request.session[key]) {
            request.session[key] = null;
        }
    }

    static add(request, key, value) {
        request.session[key] = value;
    }

    static get(request, key) {
        return request.session[key];
    }
}

module.exports = SessionHelper;