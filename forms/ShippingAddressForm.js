const User = require('../models/User');
const Validator = require('../utils/Validator');
const BaseForm = require('./BaseForm');

class ShippingAddressForm extends BaseForm {

    fields = ['country', 'city', 'state', 'zip', 'address_line', 'user_id'];
    fieldParams = [
        {
            name: 'Country',
            field: 'country',
            rules: [Validator.REQUIRED_RULE]
        },
        {
            name: 'City',
            field: 'city',
            rules: [Validator.REQUIRED_RULE]
        },
        {
            name: 'State',
            field: 'state',
            rules: [Validator.REQUIRED_RULE]
        },
        {
            name: 'ZIP',
            field: 'zip',
            rules: [Validator.REQUIRED_RULE]
        },
        {
            name: 'Address line',
            field: 'address_line',
            rules: [Validator.REQUIRED_RULE]
        },
        {
            name: 'User',
            field: 'user_id',
            rules: []
        }
    ];

    constructor(inputs) {
        super(inputs);
        this.setFields();
    }

    async validate() {
        super.validate();
        await this.validateUser();
    }

    getModelAttributes() {
        return {
            country: this.country,
            city: this.city,
            state: this.state,
            zip: this.zip,
            address_line: this.address_line,
            user_id: this.user_id
        }
    }

    async validateUser() {
        const user = await User.findById(this.user_id);
        if (!user) {
            this.addSingleError('user_id', this.user_id, 'User not found!');
        }
    }
}

module.exports = ShippingAddressForm;