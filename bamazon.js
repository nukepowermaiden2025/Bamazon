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

function start() {
  inquirer
    .prompt({
      name: "userType",
      type: "list",
      message: "Please choose the best fit scenario below?",
      choices: ["I want to buy on Bamazon", "I am a Bamazon Seller", "I am a Bamazon Manager"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.userType === "I want to buy on Bamazon") {
        console.log("get ready to buy!");
        purchaseItem();//TODO
      }else if(answer.userType === "I am a Bamazon Seller"){
        console.log("get ready to sell!")
        sellItem();//TODO
      }
      else{
        console.log("Hey Mr. money bags, it is time to check on the business")
        manageItems();//TODO
      }
    });
};


//All products should return after the products page is updated.
function returnProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    insertProduct();
    // start();
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

function sellItem() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "What is the name of your product?"
      },
      {
        name: "department_name",
        type: "list",
        message: "In which category would you like to place your product for sale?",
        choices: [
          "Apparel", 
          "Camera", 
          "Electronics",
          "Health and Beauty",
          "Kitchen",
          "Misc.",
          "Personal Computers",
          "Sports",
          "Tools & Home Improvement",
          "Toy",
          "Wireless Phone Accessory"
        ]
      },
      {
        name: "list_price_per",
        type: "input",
        message: "What would you like your list price to be?",
        validate: function(value) {
          if ($.isNumeric(value) === true) {
            return true;
          }
          return false;
        }
      },
      {
      name: "on_sale_price",
      type: "input",
      message: "Please enter your on sale price. If not on sale enter list price?",
      validate: function(value) {
          if ($.isNumeric(value) === true) {
            return true;
          }
          return false;
        }
      },
      name: "inventory",
      type: "input",
      message: "Please enter your on sale price. If not on sale enter list price?",
      validate: function(value) {
          if ($.isNumeric(value) === true) {
            return true;
          }
          return false;
        }
      },

    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
     insertProduct();
    });
}

function insertProduct(){
  var postItem = {
    product_name:answer.product_name,
    department_name:answer.department_name,
    list_price_per: answer.list_price_per,
    on_sale_price: answer.on_sale_price,
    Inventory:30
  };
  let query = connection.query('INSERT INTO products SET ?', postItem, function (error, res, fields) {
    if (error) throw error;
    console.log(res);
  // Neat!
  });
console.log(query.sql); 
};
// function start(){
// 	console.log("The program is ready to accept user inputs from inquirer!");
	
// };
  

	
//Prompt the user to see if they are a Department Manager or Buyer/Seller

//If Buyer/Seller
  //Prompt to see if they want to sell or buy
    //If buy= console.log in table for the items
    //next level is search for item

//If Manager
  //Prompt to they