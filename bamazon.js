var inquirer = require("inquirer");
var mysql = require("mysql");
var connection = mysql.createConnection({
    host:"localhost",
	port:3306,
	user:"root",
	password:"36972255",
    database:"bamazon"
});


connection.connect(function(err) {
  if (err) throw err;
  console.log("connected as id " + connection.threadId);
  returnProducts();
});

//All products should return after the products page is updated.
function returnProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    insertProduct();
    start();
    connection.end();
  });
};

//Insert a product will be called as a part of prompt
function insertProduct(){
  var postItem = {
    product_name:"All Star basketball shorts for women",
    department_name:"Sports",
    list_price_per: 25.99,
    on_sale_price: 20.99,
    Inventory:30
  };
  let query = connection.query('INSERT INTO products SET ?', postItem, function (error, res, fields) {
    if (error) throw error;
    console.log(res);
  // Neat!
  });
console.log(query.sql); 
};


function start(){
	console.log("The program is ready to accept user inputs from inquirer!");
	
};
  


	
