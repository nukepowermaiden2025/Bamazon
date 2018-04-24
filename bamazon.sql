DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products(
  id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
  product_name VARCHAR(50) NOT NULL,
  department_name VARCHAR(50) NOT NULL,
  list_price_per DECIMAL(10,2) NOT NULL,
  on_sale_price DECIMAL(10,2) NOT NULL,
  inventory INT NOT NULL
  
);
