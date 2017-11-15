const http = require('http');
const request = require('request');
const port = process.env.PORT || 9999;
const defaultWebsite = 'google.fr';
let currentWebsite = defaultWebsite;

http.createServer((req, res) => {
  //res.setHeader('Host', 'google.fr');
  const splittedUrl = req.url.split('/foxy/');
  const websiteOptionFromUrl = splittedUrl[splittedUrl.length - 1];
  
  if (websiteOptionFromUrl !== req.url) {
    currentWebsite = websiteOptionFromUrl;
  }

  const target = req.url === '/' || req.url.startsWith('/foxy/') ? currentWebsite : `${currentWebsite}${req.url}`;

  res.setHeader('Content-Type', 'text/html;charset=utf8');
  res.statusCode = 200;

  console.log(`targetting ${target}`);

  req.on('error', (err) => {
    res.statusCode = 500;
    res.end(`An error occured : ${err}`);
  });

  res.on('error', (err) => {
    res.statusCode = 500;
    res.end(`An error occured : ${err}`);
  });

  request(`http://www.${target}`)
    .on('error', (err) => {
      currentWebsite = defaultWebsite;
      res.statusCode = 500;
      res.end(`<!DOCTYPE html><html><head><link href='https://fonts.googleapis.com/css?family=Roboto' rel='stylesheet'><title>Target not found</title><style>html, body { margin: 0; padding: 0; height: 100%; display: flex; flex-flow: column wrap; justify-content: center; align-items: center; background: url('https://www.technobuffalo.com/wp-content/uploads/2013/07/mad-max-official-img4.jpg') no-repeat center; background-size: cover; font-family: 'Roboto', sans-serif; color: black; }</style></head><body><p>Target '${target}' cannot be found...</p></body></html>`);
    })
    .pipe(res);
}).listen(port);
