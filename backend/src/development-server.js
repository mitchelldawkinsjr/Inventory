const app = require('./index');

app.listen(8081, () => {
  console.log('listening on port 8081');
});

console.log(process.env);

//to run locally use : node src/development-server.js from backend dir
