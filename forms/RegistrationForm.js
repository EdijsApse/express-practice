const Validator = require("../utils/Validator");
const BaseForm = require("./BaseForm");

const database = require('../database/connection');

class RegistrationForm extends BaseForm {

    fields = ['name', 'surname', 'email', 'password', 'password_confirmation'];

    fieldParams = [
        {
            name: 'Name',
            field: 'name',
            rules: [Validator.REQUIRED_RULE, Validator.minLength(3)]
        },
        {
            name: 'Surname',
            field: 'surname',
            rules: [Validator.REQUIRED_RULE, Validator.minLength(2)]
        },
        {
            name: 'Email',
            field: 'email',
            rules: [Validator.REQUIRED_RULE, Validator.EMAIL_RULE]
        },
        {
            name: 'Password',
            field: 'password',
            rules: [Validator.REQUIRED_RULE, Validator.minLength(5)]
        },
        {
            name: 'Password confirmation',
            field: 'password_confirmation',
            rules: [Validator.REQUIRED_RULE]
        },
    ];

    constructor(inputs) {
        super(inputs);
        this.setFields();
    }

    getModelAttributes() {
        return {
            name: this.name,
            surname: this.surname,
            email: this.email,
            password: this.password
        }
    }

    async validate() {
        this.validatePasswordConfirmation();
        await this.validateUniqueEmail();

        super.validate();
    }

    validatePasswordConfirmation() {
        if (this.password !== this.password_confirmation) {
            this.addSingleError('password_confirmation', this.password, 'Password confirmation doesnt match password');
        }
    }

    async validateUniqueEmail() {
        const user = await database.getDb().collection('users').findOne({email: this.email});

        if (user) {
            this.addSingleError('email', this.email, `${this.email} already exists!`);
        }
    }
}

module.exports = RegistrationForm;