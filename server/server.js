let express = require('express')
//import body parser
let bodyParser = require('body-parser');
//import mongoose
let mongoose = require('mongoose');
let app = express();
var cors = require('cors');
const shortid = require("shortid");
//Import routes


//configure bodyparser to hande the post requests
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

//connect to mongoose

const options = {useNewUrlParser: true, useUnifiedTopology: true}
const mongo = mongoose.connect(process.env.MONGODB_URL || "mongodb://localhost/reactshopping", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });

mongo.then(() => {
    console.log('connected');
}, error => {
    console.log(error, 'error');
});
var db=mongoose.connection;

//Check DB Connection
if (!db)
    console.log("Error connecting db");
else
    console.log("DB Connected Successfully");

// Server Port
var port = process.env.PORT || 5000;
app.use(cors()) 
// Welcome message
const Product = mongoose.model(
    "products",
    new mongoose.Schema({
      _id: { type: String, default: shortid.generate },
      title: String,
      description: String,
      image: String,
      price: Number,
      availableSizes: [String],
    })
  );
  
  app.get("/api/products", async (req, res) => {
    const products = await Product.find({});
    res.send(products);
  });
  
  app.post("/api/products", async (req, res) => {
    const newProduct = new Product(req.body);
    const savedProduct = await newProduct.save();
    res.send(savedProduct);
  });
  
  app.delete("/api/products/:id", async (req, res) => {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    res.send(deletedProduct);
  });
  
  const Order = mongoose.model(
    "order",
    new mongoose.Schema(
      {
        _id: {
          type: String,
          default: shortid.generate,
        },
        email: String,
        name: String,
        address: String,
        total: Number,
        cartItems: [
          {
            _id: String,
            title: String,
            price: Number,
            count: Number,
          },
        ],
      },
      {
        timestamps: true,
      }
    )
  );
  
  app.post("/api/orders", async (req, res) => {
    if (
      !req.body.name ||
      !req.body.email ||
      !req.body.address ||
      !req.body.total ||
      !req.body.cartItems
    ) {
      return res.send({ message: "Data is required." });
    }
    const order = await Order(req.body).save();
    res.send(order);
  });
  app.get("/api/orders", async (req, res) => {
    const orders = await Order.find({});
    res.send(orders);
  });
  app.delete("/api/orders/:id", async (req, res) => {
    const order = await Order.findByIdAndDelete(req.params.id);
    res.send(order);
  });

// Launch app to the specified port
app.listen(port, function() {
    console.log("Running FirstRest on Port "+ port);
});






