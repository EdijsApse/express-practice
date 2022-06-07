class FormHelper {
    constructor(inputs, errors) {
        this.inputs = inputs;
        this.errors = errors;
    }

    old(fieldName) {
        return this.inputs[fieldName] ? this.inputs[fieldName] : '';
    }

    hasError(fieldName) {
        const containsError = this.errors.findIndex((error) => {
            return error.field === fieldName;
        })

        return containsError !== -1;
    }

    getError(fieldName) {
        const error = this.errors.find((error) => {
            return error.field === fieldName;
        });

        return error.message; 
    }
}

module.exports = FormHelper;