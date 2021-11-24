
const fs = require('fs');

module.exports = isDirectoryExist = (req, res, next) => {
    const dirUser = `./public/users/${req.user.username}`;
    const dirImages = `./public/users/${req.user.username}/images`;

    // check if directory exists
    if (fs.existsSync(dirImages)) {
        next();
    } else {

        if (fs.existsSync(dirUser)) {

            fs.mkdirSync(dirImages, (err) => {

                if (err) {
                    throw err;
                }
            });

            next();
        }
        else {
            fs.mkdirSync(dirUser, (err) => {

                if (err) {
                    throw err;
                }
            });

            fs.mkdirSync(dirImages, (err) => {

                if (err) {
                    throw err;
                }
            })

            next();
        }

    }
}