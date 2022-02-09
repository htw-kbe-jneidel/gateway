const http = require( "http" );

const HTTP_PORT = 8000;
const HTTP_PORT_API = 8001;
const HTTP_PORT_FRONTEND = 8002;
const baseUrl = "localhost";

const server = http.createServer().listen( HTTP_PORT );
console.log( "gateway listening on: http://localhost:" + HTTP_PORT )

function forward(req, res, port, path=req.url) {
  const connector = http.request( {
    host   : baseUrl,
    port,
    path,
    method : req.method,
    headers: req.headers,
  }, ( resp ) => {
    resp.pipe( res );
  } );
  req.pipe( connector );
}

server.on( "request", ( req, res ) => {
  console.log( req.url )
  if ( req.url.match( /^\/api\// ) ) {
    const pathSansPrefix = req.url.match( /^\/api(\/.*)/ )[1];
    forward( req, res, HTTP_PORT_API, pathSansPrefix );
  } else {
    forward( req, res, HTTP_PORT_FRONTEND );
  }
} );
