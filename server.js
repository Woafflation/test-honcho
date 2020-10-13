const { parseStreamService } = require('./services/parse-service');
const { db } = require('./services/db-service');
const { FILE_PATH } = require('./config');

parseStreamService(FILE_PATH, (err, res) => {
    if (err) {
        console.error(err);
    } else {
        db.save(res);
    }
});
