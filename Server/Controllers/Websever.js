const Product = require('../Models/Product');
const Color = require('../Models/Color');
const Size = require('../Models/Size');

const express = require('express');
const app = express();
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const currencyFormatter = require('currency-formatter');

app.set('Views', __dirname + '/views');

// Cấu hình để chạy file .hbs
const handlebars = expressHbs.create({
    defaultLayout: null,
    extname: '.hbs',
    runtimeOptions: {
        allowProtoPropertiesByDefault: true,
        allowProtoMethodsByDefault: true,
    },
    helpers: {

        formatCurrency: function (amount) {
            return currencyFormatter.format(amount, {code: 'VND'});
        }
    },
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

const ObjectId = mongoose.Types.ObjectId;

app.use(express.json());
//màn hình home
app.get('/home', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('../Views/home.hbs', {products});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/screen_order', async (req, res) => {
    try {

        res.render('../Views/order.hbs');
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/home/search', async (req, res) => {
    const {title} = req.body;
    try {
        const searchString = String(title);

        const products = await Product.find({product_title: {$regex: searchString, $options: 'i'}}).lean();
        res.render('../Views/home.hbs', {products});
    } catch (error) {

        res.status(500).json({message: error.message});
    }
});

app.post('/home/add', async (req, res) => {
    const {product_title, product_price, product_image, product_quantity, product_category} = req.body;

    const product = new Product({
        product_title,
        product_price,
        product_image,
        product_quantityColor: 0,
        product_quantity: 0,
        product_category
    });

    try {
        await product.save();
        res.redirect('/home')
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/home/edit/:id', async (req, res) => {
    const id = req.params.id;
    const {product_title, product_price, product_image, product_quantity, product_category} = req.body;

    try {
        await Product.updateOne({_id: id}, {
            product_title,
            product_price,
            product_image,
            product_category
        }).lean();

        res.redirect('/home')
    } catch (err) {
        console.error('Lỗi khi sửa dữ liệu:', err);
        res.sendStatus(500);
    }
});

app.post('/home/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Product.deleteOne({_id: id});
        res.redirect('/home')
    } catch (err) {
        console.error('Lỗi khi xoá dữ liệu:', err);
        res.sendStatus(500);
    }
});

app.get('/home/detail/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Lấy thông tin sản phẩm
        const product = await Product.findById(productId).lean();
        const idProductSP = product._id


        if (!product) {
            return res.status(404).json({error: 'Không tìm thấy sản phẩm'});
        }

        // Lấy thông tin màu sắc của sản phẩm
        const colors = await Color.find({product: productId}).lean();
        const colorAll = [];
        for (let i = 0; i < colors.length; i++) {
            const id = colors[i]._id;
            const dataSize = await Size.find({colorId: id}).lean();
            colorAll.push({dataColer: colors[i], dataSize, idProduct: product._id})
        }
        // Tạo mảng chứa thông tin kích thước của sản phẩm
        const sizes = [];

        // Lấy thông tin kích thước của từng màu sắc
        for (const color of colors) {
            const colorId = color._id;
            const colorSizes = await Size.find({colorId}).lean();
            sizes.push(...colorSizes);
        }

        // Tính toán tổng số lượng màu sắc
        const colorQuantity = colors.length;

        // Tính toán tổng số lượng kích thước
        const sizeQuantity = sizes.reduce((total, size) => total + size.size_quantity, 0);

        // Tính toán tổng số lượng sản phẩm
        const productQuantity = sizeQuantity;

        await Product.findOneAndUpdate({_id: idProductSP}, {
            product_quantity: productQuantity,
            product_quantityColor: colorQuantity,
        });
        // Kết hợp thông tin sản phẩm, kích thước và màu sắc
        const productWithDetails = {
            _id: product._id,
            product_title: product.product_title,
            product_price: product.product_price,
            product_image: product.product_image,
            product_quantity: productQuantity,
            sizes,
            colors,
            colorAll
        };

        res.render('../Views/product_detail.hbs', {productWithDetails});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Lỗi server'});
    }
});

app.post('/home/detail/color/add/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId).lean();
        const data = req.body;
        const arrSize = [data.size_26, data.size_27, data.size_28, data.size_29, data.size_34, data.size_35, data.size_36, data.size_37, data.size_38]
        const arrSizeName = [26, 27, 28, 29, 34, 35, 36, 37, 38]

        const color = await Color.create({
            product: productId,
            color_name: data.color_name,
            color_image: data.color_image
        });
        for (let i = 0; i < arrSize.length; i++) {
            await Size.create({
                colorId: color._id,
                size_quantity: arrSize[i],
                size_name: arrSizeName[i]
            });
        }
        res.redirect('/home/detail/' + product._id);

    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
})

app.post('/home/detail/colors/edit/:colorId/:productId', async (req, res) => {
    try {
        const colorId = req.params.colorId;
        const productId = req.params.productId;

        const data = req.body;
        const arrSize = [data.size_26, data.size_27, data.size_28, data.size_29, data.size_34, data.size_35, data.size_36, data.size_37, data.size_38]
        const arrSizeName = [26, 27, 28, 29, 34, 35, 36, 37, 38]

        const color = await Color.findById(colorId);
        // Kiểm tra xem màu sắc có tồn tại hay không
        if (!color) {
            return res.status(404).json({error: 'Không tìm thấy màu sắc'});
        }

        color.color_name = data.color_name;
        color.color_image = data.color_image;
        await color.save();

        const colorSizes = await Size.find({colorId}).lean();
        for (let i = 0; i < arrSize.length; i++) {
            const sizeId = colorSizes[i]._id;
            const newSizeQuantity = arrSize[i];
            const newSizeName = arrSizeName[i];
            await Size.findOneAndUpdate({_id: sizeId}, {
                size_quantity: newSizeQuantity,
                size_name: newSizeName,
            });
        }
        res.redirect('/home/detail/' + productId);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

app.post('/home/detail/colors/delete/:colorId/:productId', async (req, res) => {
    try {
        const colorId = req.params.colorId;
        const productId = req.params.productId;
        const colorSizes = await Size.find({colorId}).lean();


        // Xóa màu sắc
        await Color.findByIdAndDelete(colorId);
        // Xóa size

        for (let i = 0; i < colorSizes.length; i++) {
            const sizeId = colorSizes[i]._id; // ID của kích thước cần xóa
            await Size.findByIdAndRemove(sizeId);
        }
        res.redirect('/home/detail/' + productId);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Lỗi server'});
    }
});
module.exports = app;
