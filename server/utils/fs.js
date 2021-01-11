const fs = require('fs');
const path = require('path');

const checkDir = str => {
    console.log('fs: checkDir...');
    try {
        if (!fs.existsSync(path.join(__dirname, '..', str))) {
            console.log('The path not exists.');
            fs.mkdirSync(path.join(__dirname, '..', str));
        }
        else console.log('The path exists.');    
    }
    catch(err) {
        console.error(err);
    }
}

const deleteFile = (dir, title, ext) => {
    fs.unlinkSync(`${dir}/${title}.${ext}`, err => {
        if(err) console.error(err);
        else console.log('삭제 완료');
    });
}

module.exports = { checkDir, deleteFile };