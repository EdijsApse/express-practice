class Validator {

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
    }

    requiredRuleFound() {
        return this.rules.includes('required');
    }

    minValueRuleFound() {
        const minRule = this.rules.findIndex((rule) => {
            return rule.match(/min:\d+/g);
        });
        
        return minRule !== -1;
    }

    numberRuleFound() {
        return this.rules.includes('number');
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
            this.errors.push({
                field: this.field,
                value: this.value,
                message: `${this.fieldName} is required!`
            });
        }
    }

    minLengthValidation() {
        const rule = this.rules.find((r) => {
            return r.match(/min:\d+/g);
        });

        const [x, minLength] = rule.split(':');

        if (this.value.length < minLength) {
            this.errors.push({
                field: this.field,
                value: this.value,
                message: `${this.fieldName} should contain atleast ${minLength} characters!`
            });
        }
    }
}

module.exports = Validator;