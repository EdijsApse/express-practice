function getSessionInputs(req, defaults) {
    let sessionInputs = req.session.inputErrors;

    if (!sessionInputs) {

        sessionInputs = {
            ...defaults,
        }
    }

    req.session.inputs = null;

    return sessionInputs;
}

function flashErrorMessage(req, inputs, message) {
    req.session.inputs = inputs;
    req.session.hasError = true;
    req.session.errorMessage = message;
}

module.exports = {
    getSessionInputs: getSessionInputs,
    flashErrorMessage: flashErrorMessage
}