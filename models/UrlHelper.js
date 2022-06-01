class UrlHelper {
    constructor(request) {
        this.request = request;
        
        this.path = this.request.path;
        this.params = this.request.params;
        this.query = this.request.query;

    }

    builUrl(queryToAppend = {}) {
        const query = {...this.query, ...queryToAppend};
        const queryKeys = Object.keys(query).map((value) => {
            return `${value}=${query[value]}`;
        });
        return `${this.path}?${queryKeys.join('&')}`;
    }

    getParamValue(keyName) {
        return this.query[keyName] ? this.query[keyName] : '';
    }

}

module.exports = UrlHelper;