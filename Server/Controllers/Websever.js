const Product = require('../Models/Product');
const Color = require('../Models/Color');
const Size = require('../Models/Size');

const express = require('express');
const app = express();
const Handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const handlebarshelper = require("../handlebars-helpers");
const mongoose = require('mongoose');

app.set('Views', __dirname + '/views');

// Cấu hình để chạy file .hbs
app.engine('.hbs', Handlebars.engine({
    defaultLayout: null,
    extname: '.hbs',
    allowProtoPropertiesByDefault: true,
    allowProtoMethodsByDefault: true,
    helpers: handlebarshelper
}))
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const ObjectId = mongoose.Types.ObjectId;


// const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//git add
//git commit -am "make it better"
//git push heroku master

//more -> ls
//heroku logs --app md26bipbip
//quay lại cd ..


// Middleware để xử lý dữ liệu JSON
app.use(express.json());
//màn hình home
app.get('/home', async(req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('../Views/home.hbs', { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/home/search', async(req, res) => {
    const { title } = req.body;
    try {
        const searchString = String(title);

        const products = await Product.find({ product_title: { $regex: searchString, $options: 'i' } }).lean();
        res.render('../Views/home.hbs', { products });
    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});

app.post('/home/add', async(req, res) => {
    const { product_title, product_price, product_image, product_quantity, product_category } = req.body;

    const product = new Product({
        product_title,
        product_price,
        product_image,
        product_quantity,
        product_category
    });

    try {
        await product.save();

        const productList = await Product.find().lean();

        res.render('../Views/home.hbs', { products: productList });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/home/edit/:id', async(req, res) => {
    const id = req.params.id;
    const { product_title, product_price, product_image, product_quantity, product_category } = req.body;

    try {
        await Product.updateOne({ _id: id }, {
            product_title,
            product_price,
            product_image,
            product_quantity,
            product_category
        }).lean();

        const productList = await Product.find().lean();

        res.render('../Views/home.hbs', { products: productList });
    } catch (err) {
        console.error('Lỗi khi sửa dữ liệu:', err);
        res.sendStatus(500);
    }
});

app.post('/home/delete/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await Product.deleteOne({ _id: id });
        const productList = await Product.find().lean();

        res.render('../Views/home.hbs', { products: productList });
    } catch (err) {
        console.error('Lỗi khi xoá dữ liệu:', err);
        res.sendStatus(500);
    }
});

app.get('/home/detail/:id', async(req, res) => {
    try {
        const productId = req.params.id;

        // Lấy thông tin sản phẩm
        const product = await Product.findById(productId).lean();

        if (!product) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }

        // Lấy thông tin màu sắc của sản phẩm
        const colors = await Color.find({ product: productId }).lean();

        // Tạo mảng chứa thông tin kích thước của sản phẩm
        const sizes = [];

        // Lấy thông tin kích thước của từng màu sắc
        for (const color of colors) {
            const colorId = color._id;
            const colorSizes = await Size.find({ colorId }).lean();
            sizes.push(...colorSizes);
        }


        // Tính toán tổng số lượng màu sắc
        const colorQuantity = colors.length;

        // Tính toán tổng số lượng kích thước
        const sizeQuantity = sizes.reduce((total, size) => total + size.size_quantity, 0);

        // Tính toán tổng số lượng sản phẩm
        const productQuantity = colorQuantity + sizeQuantity;

        // Kết hợp thông tin sản phẩm, kích thước và màu sắc
        const productWithDetails = {
            _id: product._id,
            product_title: product.product_title,
            product_price: product.product_price,
            product_image: product.product_image,
            product_quantity: productQuantity,
            sizes,
            colors
        };


        res.render('../Views/product_detail.hbs', { productWithDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.post('/home/detail/color/add/:productId', async(req, res) => {
    try {
        const productId = req.params.productId;
        const { color_name, color_image } = req.body;

        const product = await Product.findById(productId).lean();
        await Color.create({ color_name, product: productId, color_image });
        const colors = await Color.find({ product: productId }).lean();

        const sizes = [];
        for (const color of colors) {
            const colorId = color._id;
            const colorSizes = await Size.find({ colorId }).lean();
            sizes.push(...colorSizes);
        }

        const colorQuantity = colors.length;
        const sizeQuantity = sizes.reduce((total, size) => total + size.size_quantity, 0);
        const productQuantity = colorQuantity + sizeQuantity;

        const productWithDetails = {
            _id: product._id,
            product_title: product.product_title,
            product_price: product.product_price,
            product_image: product.product_image,
            product_quantity: productQuantity,
            sizes,
            colors
        };

        res.render('../Views/product_detail.hbs', { productWithDetails });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.post('/home/detail/colors/edit/:colorId', async(req, res) => {
    try {
        const { colorId } = req.params;
        const { color_name, color_image } = req.body;

        // Tìm màu sắc cần cập nhật
        const color = await Color.findById(colorId);

        // Kiểm tra xem màu sắc có tồn tại hay không
        if (!color) {
            return res.status(404).json({ error: 'Không tìm thấy màu sắc' });
        }

        // Cập nhật thông tin màu sắc
        color.color_name = color_name;
        color.color_image = color_image;
        await color.save();

        // Lấy thông tin sản phẩm liên quan
        const product = await Product.findById(color.product).lean();

        // Lấy danh sách màu sắc cho sản phẩm
        const colors = await Color.find({ product: color.product }).lean();

        // Lấy danh sách kích thước cho từng màu sắc
        const sizes = [];
        for (const color of colors) {
            const colorId = color._id;
            const colorSizes = await Size.find({ colorId }).lean();
            sizes.push(...colorSizes);
        }

        // Tính toán tổng số lượng màu sắc
        const colorQuantity = colors.length;

        // Tính toán tổng số lượng kích thước
        const sizeQuantity = sizes.reduce((total, size) => total + size.size_quantity, 0);

        // Tính toán tổng số lượng sản phẩm
        const productQuantity = colorQuantity + sizeQuantity;

        // Cập nhật thông tin màu sắc trong sản phẩm
        product.colors = colors;

        // Kết hợp thông tin sản phẩm, kích thước và màu sắc
        const productWithDetails = {
            _id: product._id,
            product_title: product.product_title,
            product_price: product.product_price,
            product_image: product.product_image,
            product_quantity: productQuantity,
            sizes,
            colors
        };

        // Cập nhật thông tin sản phẩm trong trang product_detail
        res.render('../Views/product_detail.hbs', { productWithDetails });
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.post('/home/detail/colors/delete/:colorId', async(req, res) => {
    try {
        const { colorId } = req.params;

        // Lấy thông tin color trước khi xóa
        const color = await Color.findById(colorId);

        // Kiểm tra giá trị productId
        if (!ObjectId.isValid(color.productId)) {
            throw new Error('Invalid productId');
        }

        // Xóa màu sắc
        await Color.findByIdAndDelete(colorId);

        // Lấy thông tin sản phẩm liên quan
        const product = await Product.findById(color.product).lean();

        // Lấy danh sách màu sắc cho sản phẩm
        const colors = await Color.find({ productId }).lean();

        // Lấy danh sách kích thước cho từng màu sắc
        const sizes = [];
        for (const color of colors) {
            const colorId = color._id;
            const colorSizes = await Size.find({ colorId }).lean();
            sizes.push(...colorSizes);
        }

        // Tính toán tổng số lượng màu sắc
        const colorQuantity = colors.length;

        // Tính toán tổng số lượng kích thước
        const sizeQuantity = sizes.reduce((total, size) => total + size.size_quantity, 0);

        // Tính toán tổng số lượng sản phẩm
        const productQuantity = colorQuantity + sizeQuantity;

        product.colors = colors;

        // Kết hợp thông tin sản phẩm, kích thước và màu sắc
        const productWithDetails = {
            _id: product._id,
            product_title: product.product_title,
            product_price: product.product_price,
            product_image: product.product_image,
            product_quantity: productQuantity,
            sizes,
            colors
        };

        res.render('../Views/product_detail.hbs', { productWithDetails });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});
module.exports = app;
