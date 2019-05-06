const express = require('express');// commonJS import modules.. how server imports are typically written since It will work on all versions of node without extra config

//import our db helper functions/methods
const db = require('./data/db');

const server = express();// activate express server in a variable;
server.use(express.json());

const PORT = process.env.port || 5000 ;//Setting up environment variables that will be utilized in the prod environment

server.get('/', (req, res) => { //Endpoints - These tell express what the user can quewry to get a particulur set of data
res.send("Hewllo World!!!")
})

//set an endpoint to get the Date and pass it back as a string
server.get('/now', (req,res) => {
const now = new Date().toISOString();
res.send(now);
});

//Get All Hubs Endpoint
server.get('/hubs', (req,res) => {
db.hubs
    .find()
    .then(hubs => {
        res.status(200).json(hubs)
    })

    // line 30-33 same as 35, destructuring
    // .catch((response) => {
    //     const message = response.message
    //     const code = response.code
    // })
    // Destructured variables from the response object
    .catch(({code, message}) => {
        res.status(code).json({success: false, message})
    })
})

// Get INDIVIDUAL HUB - gets hub by ID

server.get('/hubs/:id', (req, res) => {
    db.hubs
    .findById(req.params.id)
    .then(hub => {
        if(hub) {
            res.status(200).json({success: true, hub})
     } else {
         res.status(404).json({success: false, message: "Cannot find Hub by that id"});
     }
     })
            .catch(({ code, message}) => {
        res.status(code).json({success: false, message});
    });
});

//POST - Add an object to the db in our server

server.post('/hubs', (req,res) => {

    //One method for getting info from user is in req.body
    //we will be getting info from the client side for our post
    // axios.post(url, object)
    const hubInfo = req.body // need the use json.parsing in our server to read it
    console.log(hubInfo);
clo
    db.hubs
    .add(hubInfo)
    .then(hub => { // Hub was successfully added
        res.status(201).json({success: true, hub })

    })
    .catch(({code, message}) => {
        res.status(code).json({success: false, message});
    });
});
//Delete - remove a post from db
server.delete('/hubs/:id',(req,res)=>{
// another way to get data from our user is in the req.params (the url parameters)
const id = req.params.id;
db.hubs
.remove(id)
.then(deleted => {
    // the data layer returns the deleted record, but we wont use it, instead using the response headers status code and .end we terminate the request
    res.status(204).end();
})
.catch(({code, message}) => {
    res.status(code).json({success: false, message});
});
});


// PUT - require an id from the params and some data from the user on the body that they want to change
server.put('/hubs/:id', (req, res) => {
    //Destructuring id from req.params
    const {id} = req.params;
    const changes = req.body;

    db.hubs
    .update(id, changes)
    .then(updated => {
        if(updated) {
            res.status(200).json({success: true, updated})
        }else {
            res.status(404).json({success: false, message: "Cannot find the Hub to update"})
        }
        
    })
    .catch(({code, message }) => {
        res.status(code).json({success: false, message});
    });
});
  server.listen(PORT, () => { // our servers now listening on the set port and our console will reflect that
      console.log(`\n*** Server Listening on ${PORT}  *** \n`)
  })