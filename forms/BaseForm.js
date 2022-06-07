const Validator = require('../utils/Validator');

class BaseForm {

    isValid = true;
    errors = [];
    fields = [];
    fieldParams = [];

    constructor(inputs) {
        this.inputs = inputs;
    }

    setFields() {
        this.fields.forEach(fieldName => {
            this[fieldName] = this.inputs[fieldName];
        });
    }

    validate() {
        this.fieldParams.forEach((param) => {
            this.validateField(param)
        });

        if (this.errors.length) {
            this.isValid = false;
        }
    }

    validateField(fieldParams) {
        const {name, rules, field} = fieldParams;
        const value = this.inputs[field];
        const validator = new Validator(value, rules, name, field);
        
        if (validator.errors.length) {
            this.errors = [...this.errors, ...validator.errors];   
        }
    }
}

module.exports = BaseForm;