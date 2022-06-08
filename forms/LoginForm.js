const BaseForm = require("./BaseForm");
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const Validator = require('../utils/Validator');

class LoginForm extends BaseForm {

    fields = ['email', 'password'];

    fieldParams = [
        {
            name: 'Email',
            field: 'email',
            rules: [Validator.REQUIRED_RULE, Validator.EMAIL_RULE]
        },
        {
            name: 'Password',
            field: 'password',
            rules: [Validator.REQUIRED_RULE]
        }
    ];

    constructor(inputs) {
        super(inputs);
        this.setFields();
    }

    async validate() {

        await this.validateCredentials();

        super.validate();
    }

    async validateCredentials() {
        const user = await User.findByEmail(this.email);

        if (!user) {
            this.addSingleError('email', this.email, 'User with this email not found!');
        } else {
            await this.compareUserPassword(user.password);
        }
    }

    async compareUserPassword(userPassword) {
        const isMatching = await bcrypt.compare(this.password, userPassword);

        if (!isMatching) {
            this.addSingleError('password', this.password, 'Password doesnt match our records!');
        }
    }
}

module.exports = LoginForm;