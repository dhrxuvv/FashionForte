const port = 4000;
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const jwt = require('jsonwebtoken');

// Middleware
app.use(express.json());
app.use(cors());

// Database Connection
mongoose.connect("mongodb+srv://heyydhruv:9586440012@cluster0.4z6mdzv.mongodb.net/e-commerce")
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error("MongoDB connection error:", err));

// Image Storage
const storage = multer.diskStorage({
    destination: './upload/images',
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// Upload endpoints for images
app.use('/images', express.static('upload/images'));

app.post('/upload', upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: `http://localhost:${port}/images/${req.file.filename}`
    });
});

// Schema for creating product
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    image: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    new_price: {
        type: Number,
        required: true,
    },
    old_price: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    available: {
        type: Boolean,
        default: true,
    },
});

// Endpoint for adding a product
app.post('/addproduct', async (req, res) => {
    try {
        let products = await Product.find({});
        let id = products.length > 0 ? products[products.length - 1].id + 1 : 1;

        const product = new Product({
            id: id,
            name: req.body.name,
            image: req.body.image,
            category: req.body.category,
            new_price: req.body.new_price,
            old_price: req.body.old_price,
            date: req.body.date || new Date(),
            available: req.body.available || true,
        });

        await product.save();

        console.log("Product saved successfully");

        res.json({
            success: true,
            name: req.body.name,
        });
    } catch (error) {
        console.error("Error adding product:", error);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

// Endpoint for deleting a product
app.post('/removeproduct', async (req, res) => {
    try {
        await Product.findOneAndDelete({ id: req.body.id });
        console.log("Product deleted successfully");
        res.json({
            success: true,
            name: req.body.name
        });
    } catch (error) {
        console.error("Error removing product:", error);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

// Endpoint for getting all products
app.get('/allproducts', async (req, res) => {
    try {
        let products = await Product.find({});
        console.log("All products fetched successfully");
        res.send(products);
    } catch (error) {
        console.error("Error fetching all products:", error);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

// Schema for creating user model
const UserSchema = new mongoose.Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
    cartData: Object,
    date: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

// Endpoint for registering users
app.post('/signup', async (req, res) => {
    try {
        let check = await User.findOne({ email: req.body.email });
        if (check) {
            return res.status(400).json({ success: false, errors: "User already exists" });
        }

        let cart = {};
        for (let index = 0; index < 300; index++) {
            cart[index] = 0;
        }

        const user = new User({
            name: req.body.username,
            email: req.body.email,
            password: req.body.password,
            cartData: cart,
        });

        await user.save();

        const data = { user: { id: user.id } };
        const token = jwt.sign(data, 'your_secret_key_here');

        res.json({ success: true, token });
    } catch (error) {
        console.error('Error during user registration:', error);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

// Endpoint for user login
app.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.json({ success: false, errors: "User not found" });
        }

        const passCompare = req.body.password === user.password;
        if (!passCompare) {
            return res.json({ success: false, errors: "Invalid Password" });
        }

        const data = { user: { id: user.id } };
        const token = jwt.sign(data, 'your_secret_key_here');
        res.json({ success: true, token });

    } catch (error) {
        console.error('Error during user login:', error);
        res.status(500).json({ success: false, errors: "Internal server error" });
    }
});

// Endpoint for fetching new collection data
app.get('/newcollections', async (req, res) => {
    try {
        let products = await Product.find({});
        let newcollection = products.slice(1).slice(-8);
        console.log("New Collection Fetched");
        res.send(newcollection);
    } catch (error) {
        console.error("Error fetching new collections:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Endpoint for fetching popular products in women section
app.get('/popularinwomen', async (req, res) => {
    try {
        let products = await Product.find({ category: "women" }).limit(4);
        console.log("Popular in Women Fetched");
        res.send(products);
    } catch (error) {
        console.error("Error fetching popular products in women category:", error);
        res.status(500).send("Internal Server Error");
    }
});

// Middleware to verify user token
const fetchUser = async (req, res, next) => {
    try {
        const token = req.headers['auth-token'];
        if (!token) {
            return res.status(401).json({ errors: "Please authenticate using a valid token" });
        }

        const decoded = jwt.verify(token, 'your_secret_key_here');
        req.user = decoded.user;
        next();
    } catch (error) {
        console.error("Error during token verification:", error);
        return res.status(401).json({ errors: "Please authenticate using a valid token" });
    }
};

// Endpoint for adding a product to the cart
// Endpoint for adding a product to the cart
app.post('/addtocart', fetchUser, async (req, res) => {
    console.log('Added', req.body.itemId);
    try {
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ errors: "User not found" });
        }

        // Check if the item exists in the cart data
        if (userData.cartData.hasOwnProperty(req.body.itemId)) {
            userData.cartData[req.body.itemId] += 1;
        } else {
            // If the item does not exist, initialize it with 1
            userData.cartData[req.body.itemId] = 1;
        }

        // Update the user's cart data in the database
        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Added");
    } catch (error) {
        console.error("Error adding item to cart:", error);
        res.status(500).json({ errors: "Internal Server Error" });
    }
});

// Endpoint for removing a product from the cart
app.post('/removefromcart', fetchUser, async (req, res) => {
    console.log('Removed', req.body.itemId);
    try {
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ errors: "User not found" });
        }

        // Check if the item exists in the cart data and is greater than 0
        if (userData.cartData.hasOwnProperty(req.body.itemId) && userData.cartData[req.body.itemId] > 0) {
            userData.cartData[req.body.itemId] -= 1;
        }

        // Update the user's cart data in the database
        await User.findOneAndUpdate({ _id: req.user.id }, { cartData: userData.cartData });
        res.send("Removed");
    } catch (error) {
        console.error("Error removing item from cart:", error);
        res.status(500).json({ errors: "Internal Server Error" });
    }
});

//creating endpoint for get cartdata
app.post('/getcart', fetchUser, async (req, res) => {
    console.log("Getcart");
    try {
        let userData = await User.findOne({ _id: req.user.id });
        if (!userData) {
            return res.status(404).json({ errors: "User not found" });
        }
        res.json(userData.cartData);
    } catch (error) {
        console.error("Error getting user cart data:", error);
        res.status(500).json({ errors: "Internal Server Error" });
    }
});



// Start the server
app.listen(port, (error) => {
    if (!error) {
        console.log("Server listening on port " + port);
    } else {
        console.error("Error starting server:", error);
    }
});
