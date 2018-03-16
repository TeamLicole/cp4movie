const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'))

let items = [];
let id = 0;

app.get('/api/items', (req, res) => {
 console.log("entered get with type: ", req.body.type);
 let itemArray = [];
 for (let i = 0; i < items.length; i++) {
   if (items[i].type === req.body.type) {
     itemArray.push(items[i]);
   }
 }
 res.send(itemArray);
});

app.get('/api/items/:type', (req, res) => {
 console.log("entered getSpecific with type: ", req.params.type);
 let itemArray = [];
 for (let i = 0; i < items.length; i++) {
   if (items[i].type === req.params.type) {
     itemArray.push(items[i]);
   }
 }
 res.send(itemArray);
});

app.post('/api/items', (req, res) => {
 id = id + 1;
 let item = {id:id, text:req.body.text, completed: req.body.completed, priority: req.body.priority, type: req.body.type};
 items.push(item);
 res.send(item);
});

app.put('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let itemsMap = items.map(item => { return item.id; });
  let index = itemsMap.indexOf(id);
  let item = items[index];
  item.completed = req.body.completed;
  item.text = req.body.text;
  item.priority = req.body.priority;
  item.type = req.body.type;
  // handle drag and drop re-ordering
  if (req.body.orderChange) {
    let indexTarget = itemsMap.indexOf(req.body.orderTarget);
    if (req.body.sortBool) {
      indexTarget = req.body.orderTarget;
    }
    items.splice(index,1);
    items.splice(indexTarget,0,item);
  }
  res.send(item);
});

app.delete('/api/items/:id', (req, res) => {
  let id = parseInt(req.params.id);
  let removeIndex = items.map(item => { return item.id; }).indexOf(id);
  if (removeIndex === -1) {
    res.status(404).send("Sorry, that item doesn't exist");
    return;
  }
  items.splice(removeIndex, 1);
  res.sendStatus(200);
});

app.listen(3001, () => console.log('Server listening on port 3001!'))
