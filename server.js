const express = require('express');
const fs = require ('fs');
const app = express();
const path = require('path');
var port = process.env.PORT || 3000; 
const uuidv1 = require('uuid/v1');

app.engine('html', require('ejs').renderFile);
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

fs.readFile(path.join(__dirname, 'db', 'db.json'), 'utf-8', function(err, data) {
	if (err) throw err;
	notesArray = JSON.parse(data);
})

app.get('/notes', function(request, response) {
    response.sendFile(path.join(__dirname, 'public', 'notes.html'))
})

app.get('/api/notes', (req, res) => res.sendFile(path.join(__dirname, 'db', 'db.json')));

app.post('/api/notes', function (req, res) {
    let note = {
      title: req.body.title,
      text: req.body.text,
      id: uuidv1()
    }
    notesArray.push(note);
    
    fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notesArray), 'utf-8', function(err) {
      if (err) throw err;
    });
    
   res.send('200');
});

app.delete('/api/notes/:id', function(req, res) {
  let id = ((req.url).substring(11, (req.url).length));

  for (i = 0; i < notesArray.length; i++) {
    if (notesArray[i].id === id) {
      notesArray.splice(i, 1);
    }
  }

  fs.writeFile(path.join(__dirname, 'db', 'db.json'), JSON.stringify(notesArray), 'utf-8', function(err) {
    if (err) throw err;
  });

  res.send('200');
});

app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'public', 'index.html')));

app.listen(port, function() {
    console.log("App listening on PORT " + port);
  });