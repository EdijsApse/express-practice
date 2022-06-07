const BaseForm = require('./BaseForm');

class ProductForm extends BaseForm{

    fields = ['name', 'description', 'summary', 'price', 'image', 'category_id'];
    fieldParams = [
        {
            name: 'Name',
            field: 'name',
            rules: ['required', 'min:5']
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
            rules: ['number', 'required']
        },
        {
            name: 'Category',
            field: 'category_id',
            rules: ['required']
        },
        {
            name: 'Image',
            field: 'image',
            rules: ['required']
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