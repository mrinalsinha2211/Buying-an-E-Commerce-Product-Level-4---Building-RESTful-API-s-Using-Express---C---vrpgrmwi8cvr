const fs = require('fs');
const express = require('express');
const app = express();


// Importing products from products.json file
const products = JSON.parse(
    fs.readFileSync(`${__dirname}/data/product.json`)
);


// Middlewares
app.use(express.json());

// Write PATCH endpoint to buy a product for the client here
// Endpoint /api/v1/products/:id

app.patch("/api/v1/products/:id" , async(req,res)=>{
    const productId=parseInt(req.params.id);
    try {
        const productsData = await fs.readFile(`${__dirname}/data/product.json`, 'utf-8');
        const products = JSON.parse(productsData);
    
        const productIndex=products.findIndex((product)=>{
            product.id===productId
        });
        if(productIndex!==-1){
            if(products[productIndex].quantity>0){
                products[productIndex].quantity--;
                //   await fs.writeFile(`${__dirname}/data/product.json`,JSON.stringify(products, null, 2));
                await fs.writeFile(productsFilePath, JSON.stringify(products, null, 2));

                res.status(200).json({
                    status: 'success',
                    message: `Thank you for purchasing ${products[productIndex].name}`,
                    product: {
                      id: products[productIndex].id,
                      name: products[productIndex].name,
                      price: products[productIndex].price,
                      quantity: products[productIndex].quantity,
                    },
                  });
            }else{
                res.status(404).json({
                    status: 'success',
                    message: `${products[productIndex].name}, Out of stock!`,
                  });
            }
        } else {
            res.status(404).json({
              status: 'failed',
              message: 'Product not found!',
            });
          }
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: 'Internal server error',
          });
    }
});


module.exports = app;
