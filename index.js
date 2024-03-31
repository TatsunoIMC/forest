const express = require('express');
const multer = require('multer');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require("crypto");
const app = express();
let ID = -1;
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/cache/')
    },
    filename: function (req, file, cb) {
        ID = crypto.randomUUID();
        cb(null, ID + '.' + file.originalname.split('.').pop())
    }
})
const upload = multer({ storage: storage })

const port = 443;

const options = {
    key: fs.readFileSync('./encrypt/key.pem'),
    cert: fs.readFileSync('./encrypt/cert.pem')
};
const server = https.createServer(options, app);
app.get("*", (req, res) => {
    let url = req.originalUrl;
    console.log(url);
    if (!url.startsWith('/forest/')) return res.status(403).send('Forbidden');
    url = url.substring(7);
    if (url.endsWith('/')) url += "index.html";
    res.sendFile(path.join(__dirname, 'assets', url));
});
app.post('/forest/add/', upload.single('image'), (req, res) => {
    let equipmentData = req.body;
    fs.writeFileSync(`public/data/${ID}.json`, JSON.stringify(equipmentData));
    res.send(
        JSON.stringify({
            status: 'success',
            equipmentId: ID
        })
    )
});

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
