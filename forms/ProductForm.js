const Category = require('../models/Category');
const User = require('../models/User');
const Validator = require('../utils/Validator');
const BaseForm = require('./BaseForm');

class ProductForm extends BaseForm {

    fields = ['name', 'description', 'summary', 'price', 'image', 'category_id', 'user_id'];

    fieldParams = [
        {
            name: 'Name',
            field: 'name',
            rules: [Validator.REQUIRED_RULE, Validator.minLength(5)]
        },
        {
            name: 'Description',
            field: 'description',
            rules: []
        },
        {
            name: 'Summary',
            field: 'summary',
            rules: []
        },
        {
            name: 'Price',
            field: 'price',
            rules: [Validator.REQUIRED_RULE, Validator.POSITIVE_NUMBER_RULE, Validator.NUMBER_RULE]
        },
        {
            name: 'Category',
            field: 'category_id',
            rules: [Validator.REQUIRED_RULE]
        },
        {
            name: 'Image',
            field: 'image',
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

    getModelAttributes() {
        return {
            name: this.name,
            description: this.description,
            summary: this.summary,
            price: this.price,
            image: this.image,
            category_id: this.category_id,
            user_id: this.user_id
        }
    }

    async validate() {
        await this.validateCategory();
        await this.validateUser();
        super.validate();
    }

    async validateCategory() {
        const category = await Category.findById(this.category_id);
        if (!category) {
            this.addSingleError('category_id', this.category_id, 'Category not found !');
        }
    }

    async validateUser() {
        const user = await User.findById(this.user_id);
        if (!user) {
            this.addSingleError('user_id', this.user_id, 'User not found !');
        }
    }
}

module.exports = ProductForm;