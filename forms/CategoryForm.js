const Validator = require("../utils/Validator");
const BaseForm = require("./BaseForm");
const Category = require("../models/Category");

class CategoryForm extends BaseForm {

    fields = ['name'];

    fieldParams = [
        {
            name: 'Name',
            field: 'name',
            rules: [Validator.REQUIRED_RULE, Validator.minLength(3)]
        }
    ];

    constructor(inputs) {
        super(inputs);
        this.setFields();
    }

    async validate() {

        await this.validateCategory();

        super.validate();   
    }

    async validateCategory() {
        const category = await Category.findBySlug(this.name);
        if (category) {
            this.addSingleError('name', this.name, 'Category with this name already exists');
        }
    }

    getModelAttributes() {
        return {
            name: this.name,
        }
    }
}

module.exports = CategoryForm;