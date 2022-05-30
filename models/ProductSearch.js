const database = require('../database/connection');
const Product = require('./Product');

class ProductSearch {
    constructor({ q, slug, page }) {
        this.q = q;
        this.slug = slug;
        this.page = 1;
        this.pageSize = 2;
        this.skipRecordCount = 0;
        this.pages = 0;
        
        this.data = [];

        if (page && page > 1) {
            this.page = page;
            this.skipRecordCount = (this.page * this.pageSize) - this.pageSize;
        }

        this.searchObj = {};

        this.buildSearchObj();
    }

    async prepareData() {
        await this.search();
        await this.loadPageInfo();
    }

    async loadPageInfo() {
        const docs = await database.getDb().collection('products')
        .countDocuments(this.searchObj);

        if (docs) {
            this.pages = Math.ceil(docs / this.pageSize);
        }
    }

    buildSearchObj() {
        if (this.q) {
            this.searchObj.name = { $regex: this.q };
        }

        if (this.slug) {
            this.searchObj['category.slug'] = this.slug;
        }
    }

    async search() {
        const products = await database.getDb()
        .collection('products')
        .find(this.searchObj)
        .skip(this.skipRecordCount)
        .limit(this.pageSize)
        .toArray();

        this.data = products.map((product) => new Product(product.name, product.price, product.summary, product.description, product.category, product.images, product._id));
    }
}

module.exports = ProductSearch;