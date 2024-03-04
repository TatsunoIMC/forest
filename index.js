const https = require('https');
const fs = require('fs');

const port = 443;

const options = {
    key: fs.readFileSync('./encrypt/key.pem'),
    cert: fs.readFileSync('./encrypt/cert.pem')
};
const allowedPaths = ['/api/'];
const server = https.createServer(options, (req, res) => {
    const { url, method } = req;
    const ip = getIP(req);
    // log the request
    fs.writeFileSync('console.log', fs.readFileSync('console.log', 'UTF-8') + `\n${ip} ${method} ${url}`, 'UTF-8');

    if (allowedPaths.every(path => url == path)) {// check if the url is allowed
        if (method === 'GET') {
            res.writeHead(404);
            res.end('Not Found');
        }
        else if (method === 'POST') {
            res.writeHead(403);
            res.end('Forbidden');
        }
        else {
            res.writeHead(405);
            res.end('Method Not Allowed');
        }
        return;
    }

    if (method === 'POST') {// handle post request
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });
        req.on('end', () => {
            res.writeHead(200);
            res.end(handlePostRequest(body));
            res.write()
        });
    }
    else if (method === 'OPTIONS') {// handle preflight request
        res.writeHead(200);
        res.end();
    }
    else {
        res.writeHead(404);
        res.end('Not Found');
    }
});

function getIP(req) {
    if (req.headers['x-forwarded-for']) {
        console.log("typeA");
        return req.headers['x-forwarded-for'];
    }
    if (req.connection && req.connection.remoteAddress) {
        console.log("typeB");
        return req.connection.remoteAddress;
    }
    if (req.connection.socket && req.connection.socket.remoteAddress) {
        console.log("typeC");
        return req.connection.socket.remoteAddress;
    }
    if (req.socket && req.socket.remoteAddress) {
        console.log("typeD");
        return req.socket.remoteAddress;
    }
    return '0.0.0.0';
};

function handlePostRequest(body) {
    let data = JSON.parse(body);
    // John add merchandise to database
    if (data.name === 'John') {
        fs.writeFileSync(`./database/${data.merchandise}.json`, JSON.stringify(data), 'UTF-8');
        // TODO: purchase statement
    }
}

server.listen(port, () => {
    console.log(`server is listening on ${port}`);
});
