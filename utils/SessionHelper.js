class SessionHelper {
    static flashMessage(request, message, success = true) {

        request.session.flashMessage = {
            type: success ? 'success' : 'error',
            message : message
        }
    }
}

module.exports = SessionHelper;