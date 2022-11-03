const http = require('http'); // Import Node.js core module

// Just using the http module to create a server -> not express

const toDos = [
  { id: 1, task: 'Learn Node.js', isCompleted: true },
  { id: 2, task: 'Learn Express.js', isCompleted: true },
  { id: 3, task: 'Learn MongoDB', isCompleted: false },
  { id: 4, task: 'Learn Angular', isCompleted: false },
  { id: 5, task: 'Learn React', isCompleted: false },
];

const server = http.createServer((req, res) => {
  // console.log(req); // Log the request to the console
  // console.log(req.method); // GET

  const { headers, url, method } = req; // pull out with destructuring
  // console.log(headers); // Log the headers to the console
  // console.log(url); // Log the url to the console
  // console.log(method); // Log the method to the console
  // console.log(req.headers.authorization); // Log the authorization header to the console

  // Send Body Data and Get Body Data on the Server
  let body = [];

  req
    .on('data', (chunk) => {
      body.push(chunk); // push the chunk to the body array
    })
    .on('end', () => {
      body = Buffer.concat(body).toString(); // convert body array to string
      // console.log(body); // Log the body to the console

      // Default response
      let status = 404;
      const response = {
        success: false,
        data: null,
      };

      if (method === 'GET' && url === '/todos') {
        status = 200;
        response.success = true;
        response.data = toDos;
      } else if (method === 'POST' && url === '/todos') {
        const { id, task, isCompleted } = JSON.parse(body); // parse the body to get the id, task, and isCompleted

        // Simple validation
        if (!id || !task || isCompleted === null || isCompleted === undefined) {
          status = 400;
          response.error = 'Please add id, task, and isCompleted';
        } else {
          toDos.push({ id, task, isCompleted }); // push the new todo to the toDos array
          status = 201;
          response.success = true;
          response.data = toDos;
        }
      }

      // A lot of ways you can write this code
      // GET /todos
      // if (method === 'GET' && url === '/todos') {
      //   res.writeHead(200, {
      //     'Content-Type': 'application/json',
      //     'X-Powered-By': 'Node.js',
      //   });

      //   res.end(
      //     JSON.stringify({
      //       success: true,
      //       data: toDos,
      //     })
      //   );

      // } else {
      //   res.writeHead(404, {
      //     'Content-Type': 'application/json',
      //     'X-Powered-By': 'Node.js',
      //   });
      //   res.end(JSON.stringify({ message: 'Route Not Found' }));
      // }

      res.writeHead(status, {
        'Content-Type': 'application/json',
        'X-Powered-By': 'Node.js',
      });

      res.end(JSON.stringify(response));
    });

  // res.statusCode = 200; // Set status code
  // res.setHeader('Content-Type', 'text/plain'); // Set header -> text plain
  // res.setHeader('Content-Type', 'text/html'); // Set header -> html
  // res.setHeader('Content-Type', 'application/json'); // Set header -> json
  // res.setHeader('X-Powered-By', 'Node.js'); // Set header -> powered by Node.js server

  // res.writeHead(400, {
  //   'Content-Type': 'application/json',
  //   'X-Powered-By': 'Node.js',
  // });

  // res.writeHead(200, {
  //   'Content-Type': 'application/json',
  //   'X-Powered-By': 'Node.js',
  //   })

  // res.end('Hello World'); // Send the response
  // res.end('<h1>Hello World</h1>'); // Send the response body as "Hello World"
  // res.write('<h1>Hello World</h1>'); // Send the response body as "Hello World"

  // res.statusCode = 404; // Set status code
  // res.end(
  //   JSON.stringify({
  //     success: false,
  //     error: 'Not found',
  //     data: null,
  //   })
  // );

  // res.end(
  //   JSON.stringify({
  //     success: false,
  //     error: 'Please add email and password',
  //     data: null,
  //   })
  // );

  // res.end(
  //   JSON.stringify({
  //     success: true,
  //     data: toDos,
  //   })
  // );
});

const PORT = process.env.PORT || 3000;

// Run Server
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Run the server
//...  node server.js
