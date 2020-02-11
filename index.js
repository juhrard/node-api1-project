// implement your API here

// We use Require instead of import for backend. Native Node Syntax.
const express = require('express'); 
const db = require('./data/db')

// Creating a server.
const server = express();

// Declaring a port.
const port = 5000;

// Teach express how to read JSON from the body
server.use(express.json());

// Create a request handler.
server.get('/', (req, res) => {
  res.json({ hello: 'Web 26' });
});

// View a list of users.
server.get('/api/users', (req, res) => {
  db.find()
    .then(users => {res.status(200).json(users)})
    .catch(err => {console.log(err); res.status(500).json({ errorMessage: 'The users information could not be retrieved.' })});
});

// View a specific user.
server.get('/api/users/:id', (req, res) => {
  db.findById(req.params.id)
  .then(user => {
    if(user) {
    res.status(200).json(user)
    } else {
      res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
    }
  })
  .catch(err => {
    console.log(err); 
    res.status(500).json({ errorMessage: 'The user information could not be retrieved.' })
  });
});

// Add a user
server.post('/api/users', (req, res) => {
  const newUser = req.body;
  if(newUser.name && newUser.bio) {
    db.insert(newUser)
      .then(user => {
        res.status(201).json(user);
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: 'There was an error while saving the user to the database' })
      });
  } else {
    res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
  }
})

// Edit a user
server.put('/api/users/:id', (req, res) => {
  const editedUser = req.body;
    db.update(req.params.id, editedUser)
      .then(user => {
        if(editedUser.name && editedUser.bio) {
          res.status(200).json(user);
        } else if(user){
          res.status(400).json({ errorMessage: 'Please provide name and bio for the user.' })
        } else {
          res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: 'There was an error while saving the user to the database.' })
      });
})

// Delete a user
server.delete('/api/users/:id', (req, res) => {
    db.remove(req.params.id)
      .then(removed => {
        if(removed) {
          res.status(200).json(removed);
        } else {
          res.status(404).json({ errorMessage: 'The user with the specified ID does not exist.' })
        }
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({ errorMessage: 'The user could not be removed.' })
      });

})

// Set server to listen on port.
server.listen(port, () => console.log(`\n** API on port ${port} \n`));
