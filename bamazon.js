var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require('console.table');
var konsole =require('konsole.table');

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
  start(); 
});

function start() {
  inquirer.prompt({
      name: "userType",
      type: "list",
      message: "Please choose the best fit scenario below?",
      choices: ["I want to buy on Bamazon", "I am a Bamazon Seller", "I am a Bamazon Manager","Maybe Later, I want to exit."]
    })
    .then(function(answer) {
      // based on their answer, either call the bid or the post functions
      if (answer.userType === "I want to buy on Bamazon") {
        console.log("get ready to buy!");
        purchaseItem();
      }else if(answer.userType === "I am a Bamazon Seller"){
        sellItem();
      }
      else if(answer.userType === "I am a Bamazon Manager"){
        console.log("Hey money bags, it is time to check on the business")
        manageItems();//TODO
      }else{
        connection.end();
      }
    });
};


function returnProducts() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    var itemArr = [];
    console.log("\n");
    for( let i = 0; i< res.length; i++){
    
      var items = { 
        id:res[i].id,
        product_name:res[i].product_name, 
        department_name:res[i].department_name,
        list_price_per:res[i].list_price_per, 
        on_sale_price:res[i].on_sale_price,
        inventory:res[i].inventory
      };  
      itemArr.push(items);     
    }
   console.table(itemArr); 
  });
};

function purchaseItem(){
  returnProducts();//show the items for the user to buy

    
  inquirer
    .prompt([
      {
        name: "id",
        type: "input",
        message: "What is the id of product you want to purchase"
      },{
      name: "quantity",
      type: "input",
      message: "Please enter quantity of the product you would like to purchase",
      validate: function(value) {
          if (Math.round(value)) {
            return true;
          }else return false;
        }
      },
    ])
    .then(function(answer) {
      var quantity = parseInt(answer.quantity);
      console.log(quantity);
      
      connection.query("SELECT * FROM products where id=?",answer.id,function(err, res) {
        if (err) throw err;
          // console.log(res);
          console.log(answer.id,quantity);
          console.log(res[0].inventory);

        if(quantity < res[0].inventory){
          console.log(`You have purchased ${quantity} of ${res[0].product_name}`);
          updateProducts(answer.id,quantity);
        }else{
          console.log(`Sorry there are not ${quantity} available for purchase. The max available is ${res[0].inventory}`);
        }
      });
      start();
    });
    
};

function updateProducts(id,quantity){

  console.log("Updating product quantities...",id,quantity);

  var query = "UPDATE products SET inventory=inventory-? WHERE id=?";
  connection.query(query,[quantity,id], function(err, res) {
      if (err) throw err;
      returnProducts();
    }
  );
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
      var postItem = {
        product_name:answer.product_name,department_name:answer.department_name,
        list_price_per: answer.list_price_per,on_sale_price: answer.on_sale_price,inventory:answer.inventory
      };
      let query = connection.query('INSERT INTO products SET ?', postItem, function (error, res, fields) {
        if (error) throw error;
        console.log(res);
       
      }); 
    returnProducts();
    //Adding the end connection her so the it stops when the query is done
   start();
  });
};

function manageItems(){

};//TODO




	//***********NOTES***************/
//Prompt the user to see if they are a Department Manager or Buyer/Seller

//If Buyer/Seller
    //next level is search for item

//If Manager
  //Prompt to they