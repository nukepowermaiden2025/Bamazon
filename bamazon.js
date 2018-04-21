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
  // returnProducts();
  start();
});

function start() {
  inquirer.prompt({
      name: "userType",
      type: "list",
      message: "Please choose the best fit scenario below?",
      choices: ["I want to buy on Bamazon", "I am a Bamazon Seller", "I am a Bamazon Manager"]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.userType === "I want to buy on Bamazon") {
        console.log("get ready to buy!");
        returnProducts();
        purchaseItem();//TODO
      }else if(answer.userType === "I am a Bamazon Seller"){
        sellItem();
      }
      else{
        console.log("Hey money bags, it is time to check on the business")
        manageItems();//TODO
      }
    });
};


//All products should return after the products page is updated.
function returnProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log(res);
    // insertProduct();
    // start();
    
  });
};

function sellItem() {
  // prompt for info about the item being put up for auction
  inquirer
    .prompt([
      {
        name: "product_name",
        type: "input",
        message: "What is the name of your product?"
      },{
        name: "department_name",
        type: "list",
        message: "In which category would you like to place your product for sale?",
        choices: [
          "Apparel", "Camera", "Electronics","Health and Beauty","Kitchen",
          "Misc.", "Personal Computers", "Sports","Tools & Home Improvement",
          "Toy","Wireless Phone Accessory"
        ]
      },{
        name: "list_price_per",
        type: "input",
        message: "What would you like your list price to be?",
        validate: function(value) {
          if (Math.round(value)) {
            return true;
          }
          return false;
        }
      },{
      name: "on_sale_price",
      type: "input",
      message: "Please enter your on sale price. If not on sale enter list price?",
      validate: function(value) {
          if (Math.round(value)) {
            return true;
          } else return false;
        }
      },{
      name: "inventory",
      type: "input",
      message: "Please enter your the amount of the product you have in inventory to sell.",
      validate: function(value) {
          if (Math.round(value)) {
            return true;
          }else return false;
        }
      },
    ])
    .then(function(answer) {
      // when finished prompting, insert a new item into the db with that info
      var postItem = {
        product_name:answer.product_name,
        department_name:answer.department_name,
        list_price_per: answer.list_price_per,
        on_sale_price: answer.on_sale_price,
        Inventory:answer.inventory
      };
      let query = connection.query('INSERT INTO products SET ?', postItem, function (error, res, fields) {
        if (error) throw error;
        console.log(res);
       
      // Neat!
      });
    console.log(query.sql); 
    returnProducts();
    connection.end();//Adding the end connection her so the it stops when the query is done
  });
};

  

	
//Prompt the user to see if they are a Department Manager or Buyer/Seller

//If Buyer/Seller
  //Prompt to see if they want to sell or buy
    //If buy= console.log in table for the items
    //next level is search for item

//If Manager
  //Prompt to they