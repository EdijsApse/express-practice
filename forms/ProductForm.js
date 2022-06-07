const Validator = require('../utils/Validator');
const BaseForm = require('./BaseForm');

class ProductForm extends BaseForm{

    fields = ['name', 'description', 'summary', 'price', 'image', 'category_id'];
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
        }
    ];

    errors = [];
    isValid = true;

    constructor(inputs) {
        super(inputs);
        this.setFields();
    }
}

module.exports = ProductForm;