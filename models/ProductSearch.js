const database = require('../database/connection');
const Product = require('./Product');

class ProductSearch {
    
    page = 1;
    pageSize = 8;
    data = []
    pages = 0;
    skipRecordCount = 0;
    collectionFilter = {};

    constructor({ q, slug, page }) {
        this.q = q;
        this.slug = slug;
        this.page = (!isNaN(page) ? Math.abs(page) : 1);

        this.setSkipRecords();
        this.buildCollectionFilter();
    }

    setSkipRecords() {
        if (this.page > 1) {
            this.skipRecordCount = (this.page * this.pageSize) - this.pageSize;
        }
    }

    async prepareData() {
        await this.search();
        await this.loadPageInfo();
    }

    async loadPageInfo() {
        const docs = await database.getDb().collection('products')
        .countDocuments(this.collectionFilter);

        if (docs) {
            this.pages = Math.ceil(docs / this.pageSize);
        }
    }

    buildCollectionFilter() {
        if (this.q) {
            this.collectionFilter.name = { $regex: this.q, $options: 'i' };
        }

        if (this.slug) {
            this.collectionFilter['category.slug'] = this.slug;
        }
    }

    async search() {
        const products = await database.getDb()
        .collection('products')
        .find(this.collectionFilter)
        .skip(this.skipRecordCount)
        .limit(this.pageSize)
        .toArray();

        this.data = products.map((product) => new Product(product));
    }
}

module.exports = ProductSearch;