class Validator {

    static REQUIRED_RULE = 'required';
    static NUMBER_RULE = 'number';
    static POSITIVE_NUMBER_RULE = 'positive';
    static EMAIL_RULE = 'email';

    errors = [];

    constructor(value, rules, fieldName, field) {
        this.value = value;
        this.rules = rules;
        this.fieldName = fieldName;
        this.field = field;
        
        this.validate();
    }

    validate() {

        if (this.requiredRuleFound()) {
            this.requiredValidation()
        }

        if (this.minValueRuleFound()) {
            this.minLengthValidation()
        }

        if (this.numberRuleFound()) {
            this.numberValidation();
        }

        if (this.positiveNumberRuleFound()) {
            this.positiveNumberValidator()
        }
    }

    requiredRuleFound() {
        return this.rules.includes(Validator.REQUIRED_RULE);
    }

    minValueRuleFound() {
        const minRule = this.rules.findIndex((rule) => {
            return rule.match(/min:\d+/g);
        });
        
        return minRule !== -1;
    }

    numberRuleFound() {
        return this.rules.includes(Validator.NUMBER_RULE);
    }

    positiveNumberRuleFound() {
        return this.rules.includes(Validator.POSITIVE_NUMBER_RULE);
    }

    emailRuleFound() {
        return this.rules.includes(Validator.EMAIL_RULE);
    }

    numberValidation() {
        if (isNaN(this.value)) {
            this.errors.push({
                field: this.field,
                value: this.value,
                message: `${this.fieldName} should be a valid number!`
            });
        }
    }

    requiredValidation() {
        if (this.value === null || this.value === undefined || this.value === '') {
            this.addError(`${this.fieldName} is required!`);
        }
    }

    minLengthValidation() {
        const rule = this.rules.find((r) => {
            return r.match(/min:\d+/g);
        });

        const [x, minLength] = rule.split(':');

        if (this.value.length < minLength) {
            this.addError(`${this.fieldName} should contain atleast ${minLength} characters!`);
        }
    }

    positiveNumberValidator() {
        if (this.value < 0) {
            this.addError(`${this.value} must be greater then 0 !`)
        }
    }

    emailValidation() {
        const matched = this.value.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
        if (!matched) {
            this.addError(`${this.value} is not a valid email address`);
        }
    }

    addError(message) {
        this.errors.push({
            field: this.field,
            value: this.value,
            message: message
        })
    }

    static minLength(value) {
        return `min:${value}`
    }

    hasErrors() {
        return this.errors.length > 0;
    }
}

module.exports = Validator;