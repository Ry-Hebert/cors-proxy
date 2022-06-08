import express from 'express'
import fetch from 'node-fetch'
import bodyParser from 'body-parser'

const app = express()

let myLimit = typeof(process.argv[2]) != 'undefined' ? process.argv[2] : '100kb';
console.log('Using limit: ', myLimit);

app.use(bodyParser.json({limit: myLimit}));
// app.use(cors({
//     origin: '*',
//     methods: ['GET', 'PUT', 'PATCH',  'POST', 'DELETE'],
//     credentials: true,
// }))

app.all('*', function (req, res, next) {

    // Set CORS headers: allow all origins, methods, and headers: you may want to lock this down in a production environment
    res.header("access-control-allow-methods", "GET, PUT, PATCH, POST, DELETE");
    res.header("access-control-allow-headers", 'X-Requested-With, Content-Type, Authorization, Origin, Accept, Target-URL, Keep-Alive, Connection, Date, ETag, Content-Length');
    res.header("access-control-allow-origin", '*');
    res.header('access-control-allow-credentials', 'true')

    // res.setHeader("Access-Control-Allow-Origin", "*");
    // res.setHeader("Access-Control-Allow-Credentials", "true");
    // res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.setHeader("Access-Control-Allow-Headers", '*');

    console.log(res.header())

    if (req.method === 'OPTIONS') {
        // CORS Preflight
        res.send();
    } else {
        let targetURL = req.header('Target-URL'); // Target-URL ie. https://example.com or http://example.com
        if (!targetURL) {
            res.send(500, { error: 'There is no Target-Endpoint header in the request' });
            return;
        }
        // console.log('URL Debug:')
        // console.log(targetURL)
        // console.log(req.url)
        fetch(`${targetURL + req.url}/`, {
            'method': req.method
        }).then( async (response) => {
            const waitRes = await response.json()
            console.log(waitRes)
            
            res.send(waitRes)
        })
        .catch(err => {
            console.error(err);
        })
    }
});

app.set('port', process.env.PORT || 3005);

app.listen(app.get('port'), function () {
    console.log('Proxy server listening on port ' + app.get('port'));
});