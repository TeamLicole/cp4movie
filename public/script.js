var app = new Vue({
  el: '#app',
  data: {
    items: [],
    text: '',
    show: 'all',
    drag: {},
    priority: '',
  },
  computed: {
    activeItems: function() {
      return this.items.filter(function(item) {
	       return !item.completed;
      });
    },
    completedItems: function() {
      return this.items.filter(function(item) {
	       return item.completed;
      });
    },
    filteredItems: function() {
      if (this.show === 'active')
	     return this.items.filter(function(item) {
	        return !item.completed;
	      });
      if (this.show === 'completed')
	     return this.items.filter(function(item) {
         return item.completed;
	     });
      return this.items;
    },
  },
  created: function() {
    this.getItems();
  },
  methods: {
    addItem: function() {
      if (this.priority === "1") {
       this.priority = 1;
      }
      else if (this.priority === "2") {
       this.priority = 2;
      }
      else if (this.priority === "3") {
        this.priority = 3;
      }
      axios.post("http://localhost:3001/api/items", {
      	text: this.text,
        priority: 0,
        type: "movieType",
      	completed: false
      }).then(response => {
      	this.text = "";
        this.priority = "";
        console.log("items size before = ", this.items.length);
      	this.getItems();
        console.log("items size after = ", this.items.length);
      	return true;
      }).catch(err => {
      });
    },
    completeItem: function(item) {
     axios.put("http://localhost:3001/api/items/" + item.id, {
       text: item.text,
       completed: !item.completed,
       priority: item.priority,
       type: "movieType",
       orderChange: false,
       sortBool: false,
     }).then(response => {
       return true;
     }).catch(err => {
     });
   },
   priorityUp: function(item) {
     if (item.priority < 5) {
       item.priority++;
     }
     axios.put("http://localhost:3001/api/items/" + item.id, {
       text: item.text,
       completed: item.completed,
       priority: item.priority,
       type: "movieType",
       orderChange: false,
       sortBool: false,
     }).then(response => {
       return true;
     }).catch(err => {
     });
    },
   priorityDown: function(item) {
      if (item.priority > 1) {
        item.priority--;
      }
      axios.put("http://localhost:3001/api/items/" + item.id, {
        text: item.text,
        completed: item.completed,
        priority: item.priority,
        type: "movieType",
        orderChange: false,
        sortBool: false
      }).then(response => {
        return true;
      }).catch(err => {
      });
   },
   deleteItem: function(item) {
      axios.delete("http://localhost:3001/api/items/" + item.id).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   showAll: function() {
      this.show = 'all';
   },
   showActive: function() {
      this.show = 'active';
   },
   showCompleted: function() {
      this.show = 'completed';
   },
   deleteCompleted: function() {
      this.items.forEach(item => {
      	if (item.completed)
      	  this.deleteItem(item)
      });
   },
   sort: function() {
      var counter = 0;
      counter = this.sortLoop(5, counter);
      counter = this.sortLoop(4, counter);
      counter = this.sortLoop(3, counter);
      counter = this.sortLoop(2, counter);
      counter = this.sortLoop(1, counter);
      counter = this.sortLoop(0, counter);
   },
   sortLoop: function(value, counter) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].priority == value) {
          console.log(counter, ": ", value, ", ", this.items[i].id);
          this.sortMove(this.items[i], counter);
          counter++;
        }
      }
      return counter;
   },
   sortMove: function(item, counter) {
      axios.put("http://localhost:3001/api/items/" + item.id, {
      	text: item.text,
      	completed: item.completed,
        priority: item.priority,
        type: "movieType",
      	orderChange: true,
        sortBool: true,
      	orderTarget: counter
      }).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   dragItem: function(item) {
      this.drag = item;
   },
   dropItem: function(item) {
      axios.put("http://localhost:3001/api/items/" + this.drag.id, {
      	text: this.drag.text,
      	completed: this.drag.completed,
        priority: this.drag.priority,
        type: "movieType",
      	orderChange: true,
        sortBool: false,
      	orderTarget: item.id
      }).then(response => {
      	this.getItems();
      	return true;
      }).catch(err => {
      });
   },
   getItems: function() {
      // axios.get("http://localhost:3001/api/items", {
      //   type: "movieType",
      // })
      axios.get("http://localhost:3001/api/items/" + "movieType", {
      }).then(response => {
      	this.items = response.data;
      	return true;
      }).catch(err => {
      });
   },
  }
});
