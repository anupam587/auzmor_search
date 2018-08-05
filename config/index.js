var appConfigByEnvironment = {
    prod: {
        DATABASES: {
            url: 'mongodb://localhost:27017',
            db_name: 'page_keyword',
            collection_name: 'keywords'
        },
        MAX_WEIGHT: 8,
        SHOW_MAX_PAGES: 5,
        APP_PORT: 7001
    }
};

module.exports = appConfigByEnvironment['prod'];