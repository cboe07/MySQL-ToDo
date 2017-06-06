var express = require('express');
var router = express.Router();

// Import custom "config" node module.
// It holds a single object that has our MySQL credentials
var config = require('../config/config');
// Include the mysql module. We got his via npm
var mysql = require('mysql');
var connection = mysql.createConnection({
	host: config.host,
	user: config.userName,
	password: config.password,
	database: config.database
})

// We are noe connected (after this line)!
connection.connect();
// Now we are capable of writing queries


/* GET home page. */
router.get('/', function(req, res, next) {
	var message = req.query.msg;          //Looks for msg in query
	if(message = "added"){
		message = "Task added successfully!";
	}
	var selectQuery = "SELECT * FROM tasks ORDER BY taskDate,taskName";

	connection.query(selectQuery, (error,results)=>{
		res.render('index', { 
			message: message, 
			taskArray: results
		});
	});
	
});

// Add a post route "addItem" to handle the form submission
router.post('/addItem', (req,res)=>{
	// res.json(req.body)
	var newTask = req.body.newTask;
	var dueDate = req.body.newTaskDate;
	// We know what they submitted from the form. It comes to this route inside req.body.NAMEOFFIELD.
	// Now we need to insert it into MySQL.
	var insertQuery = "INSERT INTO tasks (taskName, taskDate) VALUES ('"+newTask+"','"+dueDate+"')"

	// res.send(insertQuery);
	connection.query(insertQuery, (error,results)=>{
		if(error) throw error;
		res.redirect('/?msg=added');
	});

});

router.get('/delete/:id', (req,res)=>{
	var idToDelete = req.params.id;
	var deleteQuery = "DELETE from tasks WHERE id = " + idToDelete;
	connection.query(deleteQuery, (error,results)=>{
		res.redirect('/?msg=deleted');
	});
	// res.send(idToDelete);
});

// Make a new route to handle the edit page. It will be /edit/IDTOEDIT
router.get('/edit/:id',(req,res)=>{
	var idToEdit = req.params.id;
	var selectQuery = "SELECT * FROM tasks WHERE id = ?";
	connection.query(selectQuery, [idToEdit], (error,results)=>{
		res.render('edit',{
			task: results[0]
		});
		// res.json(results);

	});
});



module.exports = router;













