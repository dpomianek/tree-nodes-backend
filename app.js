express = require('express');
fs = require('fs');
cors = require('cors');
var app = express();
var port = 8080;

var dataPath = '/data';
var initialFilePath = dataPath + '/initial-nodes.txt';
var modifiedFilePath = dataPath + '/modified-nodes.txt';

app.use(cors());
app.use(dataPath, express.static(__dirname + dataPath));
app.use(express.static(__dirname + dataPath));

app.get('/nodes', function (req, res) {
  fs.readFile(
    __dirname +
      (fs.existsSync(__dirname + modifiedFilePath) ? modifiedFilePath : initialFilePath),
    'utf8',
    function (err, data) {
      if (err) throw err;

      res.send(data);
    }
  );
});

app.put('/nodes', function (req, res) {
  var body = '';
  var filePath = __dirname + modifiedFilePath;
  req.on('data', function (data) {
    body += data;
  });

  req.on('end', function () {
    fs.writeFile(filePath, body, function (err) {
      if (err) {
        console.error(err);
        return;
      }
      res.end();
    });
  });
  res.status(201).send('Nodes saved successfuly');
});

app.listen(port, function () {
  console.log('TreeNodes backend app listening at http://localhost:' + port);
});
