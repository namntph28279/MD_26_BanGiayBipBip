const Product = require('../Models/Product');
const CartItem = require('../Models/CartItem');
const FavouriteItem = require('../Models/FavouriteItem');
const Order = require('../Models/Order');
const Oderdetail = require("../Models/Oderdetail");
const User = require('../Models/User');
const Address = require('../Models/Address');
const Profile = require('../Models/Profile');
const Color = require('../Models/Color');
const Size = require('../Models/Size');
const OrderStatus = require('../Models/OrderStatus');
const dataClient = require('../Models/dataClient')

const express = require('express');
const app = express();
const Handlebars = require('express-handlebars');
const bodyParser = require('body-parser');
const handlebarshelper = require("../handlebars-helpers");
const checkClient = require("../Models/CheckClientUser");
const orderDetail = require("../Models/Oderdetail");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

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

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//git add
//git commit -am "make it better"
//git push heroku master

//more -> ls
//heroku logs --app md26bipbip
//quay lại cd ..


// Chờ xác nhận: 1
// Đang chuẩn bị hàng: 2
// Đang giao: 3
// Yêu cầu hủy đơn: 4
// Đơn đã hủy: 5
// Đã nhận hàng: 6


// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Thêm sản phẩm
app.post('/add', async (req, res) => {
    const {product_title, product_price, product_image, product_quantity, product_category} = req.body;

    const product = new Product({
        product_title,
        product_price,
        product_image,
        product_quantity,
        product_category
    });

    try {
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// getAll
app.get('/', async (req, res) => {
    try {
        const produt = await Product.find().sort({ data_product: -1 });
        res.json(produt);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Định nghĩa endpoint để sửa dữ liệu
app.put('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const {product_title, product_price, product_image, product_quantity, product_category} = req.body;

    try {
        const result = await Product.updateOne({_id: id}, {
            product_title,
            product_price,
            product_image,
            product_quantity,
            product_category
        });
        res.sendStatus(200);
    } catch (err) {
        console.error('Lỗi khi sửa dữ liệu:', err);
        res.sendStatus(500);
    }
});

const io = require('../server');

// Định nghĩa endpoint để xoá dữ liệu
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Product.deleteOne({_id: id});
        await FavouriteItem.deleteMany({product: id });
        await CartItem.deleteMany({product: id });

        
        res.sendStatus(200);
    } catch (err) {
        console.error('Lỗi khi xoá dữ liệu:', err);
        res.sendStatus(500);
    }
});

//getOneProduct
app.get('/product/:id', async (req, res) => {
    try {
        const productId = req.params.id;

        // Lấy thông tin sản phẩm
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({error: 'Không tìm thấy sản phẩm'});
        }

        // Lấy thông tin màu sắc của sản phẩm
        const colors = await Color.find({product: productId});

        // Tạo mảng chứa thông tin kích thước của sản phẩm
        const sizes = [];

        // Lấy thông tin kích thước của từng màu sắc
        for (const color of colors) {
            const colorId = color._id;
            const colorSizes = await Size.find({colorId});
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

        res.json(productWithDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Lỗi server'});
    }
});

//lọc product theo loại
app.get('/products/:category', async (req, res) => {
    try {
        const category = req.params.category;

        // Lấy danh sách sản phẩm theo danh mục
        const products = await Product.find({product_category: category});

        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Thêm sản phẩm vào giỏ hàng
app.post('/cart/add', async (req, res) => {
    const {product_id, quantity, user_id, size_id, color_id} = req.body;

    try {
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng của người dùng chưa
        let cartItem = await CartItem.findOne({sizeId: size_id, user: user_id});
        if (cartItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            cartItem.quantity += quantity;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
            const product = await Product.findById(product_id);
            if (!product) {
                res.status(404).json({message: 'Sản phẩm không tồn tại'});
                return;
            }
            const size = await Size.findById(size_id);
            const color = await Color.findById(color_id);
            cartItem = new CartItem({
                product: product_id,
                quantity,
                sizeId: size_id,
                size: size.size_name,
                colorId: color_id,
                color: color.color_name,
                user: user_id
            });
        }

        await cartItem.save();
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Xoá sản phẩm khỏi giỏ hàng
app.delete('/cart/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await CartItem.findByIdAndDelete(id);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Xoá nhiều sản phẩm khỏi giỏ hàng
app.delete('/cart/delete-multiple', async (req, res) => {
    const productIdsToDelete = req.body.productIds;

    try {
        await CartItem.deleteMany({_id: {$in: productIdsToDelete}});

        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Lấy về toàn bộ cartItem dựa trên userId
app.get('/cart/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const cartItems = await CartItem.find({user: userId});
        res.send(cartItems);
    } catch (error) {
        res.send([]);
    }
});

// Thêm sản phẩm vào bảng yêu thích
app.post('/favourite/add', async (req, res) => {
    const {product_id, user_id} = req.body;

    try {
        // Kiểm tra xem sản phẩm đã tồn tại trong bảng yêu thích của người dùng chưa
        let favouriteItem = await FavouriteItem.findOne({product: product_id, user: user_id});

        if (favouriteItem) {
            // Nếu sản phẩm đã tồn tại trong bảng yêu thích, không thêm lại
            res.status(400).json({message: 'Sản phẩm đã tồn tại trong bảng yêu thích'});
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào bảng yêu thích
            const product = await Product.findById(product_id);

            if (!product) {
                res.status(404).json({message: 'Sản phẩm không tồn tại'});
            } else {
                favouriteItem = new FavouriteItem({
                    product: product_id,
                    product_title: product.product_title,
                    product_price: product.product_price,
                    product_image: product.product_image,
                    user: user_id
                });

                await favouriteItem.save();
                res.json(favouriteItem);
            }
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Xoá sản phẩm khỏi yêu thích
app.delete('/favourite/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await FavouriteItem.findByIdAndDelete(id);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/favourite/addFav', async (req, res) => {
    const {product_id, user_id} = req.body;
    try {
        // Kiểm tra xem sản phẩm đã tồn tại trong bảng yêu thích của người dùng chưa
        let favouriteItem = await FavouriteItem.findOne({product: product_id, user: user_id});

        if (favouriteItem) {
            await FavouriteItem.findByIdAndDelete(favouriteItem._id);
            res.status(200).json({message: 'Xóa thành công'});
            console.log("Xóa thành công")
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào bảng yêu thích
            const product = await Product.findById(product_id);

            if (!product) {
                res.status(404).json({message: 'Sản phẩm không tồn tại'});
            } else {
                favouriteItem = new FavouriteItem({
                    product: product_id,
                    product_title: product.product_title,
                    product_price: product.product_price,
                    product_image: product.product_image,
                    user: user_id
                });
                console.log("Thêm thành công")
                await favouriteItem.save();
                res.send(favouriteItem);
            }
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Lấy về toàn bộ favouriteItem dựa trên userId
app.get('/favourite/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const favouriteItems = await FavouriteItem.find({user: userId});
        res.send(favouriteItems);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Đặt hàng
app.post('/order/addd', async (req, res) => {
    try {
        // Trích xuất dữ liệu từ phần thân của yêu cầu
        const {user, customer_email, products, address, total_amount} = req.body;

        // Kiểm tra và giảm số lượng kích thước
        for (const product of products) {
            const sizeId = product.sizeId;
            const quantityToReduce = product.quantity;

            await Size.findByIdAndUpdate(
                sizeId, {$inc: {size_quantity: -quantityToReduce}}, {new: true}
            );
        }

        // Tạo một đơn hàng mới
        const newOrder = new Order({
            user,
            customer_email,
            products,
            address,
            total_amount
        });


        const savedOrder = await newOrder.save();

        res.status(201).json(savedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});

//sửa đơn hàng
app.put('/order/edit/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const {user, customer_email, products, address, total_amount} = req.body;

    try {
        // Kiểm tra và giảm số lượng kích thước
        for (const product of products) {
            const sizeId = product.sizeId;
            const quantityToReduce = product.quantity;

            await Size.findByIdAndUpdate(
                sizeId, {$inc: {size_quantity: -quantityToReduce}}, {new: true}
            );
        }

        // Cập nhật đơn hàng
        const updatedOrder = await Order.findByIdAndUpdate(orderId, {
            user,
            customer_email,
            products,
            address,
            total_amount
        }, {new: true});

        if (!updatedOrder) {
            return res.status(404).json({message: 'Không tìm thấy đơn hàng'});
        }

        res.json(updatedOrder);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});


//lấy về đơn hàng theo trạng thái server
app.get('/orders/:condition', async (req, res) => {
    const condition = parseInt(req.params.condition);

    try {
        const orders = await OrderStatus.aggregate([{
            $match: {condition: condition}
        },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: '_id',
                    as: 'orderDetails'
                }
            },
            {
                $unwind: '$orderDetails'
            },
            {
                $project: {
                    _id: '$orderDetails._id',
                    user: '$orderDetails.user',
                    customer_email: '$orderDetails.customer_email',
                    products: '$orderDetails.products',
                    address: '$orderDetails.address',
                    order_date: '$orderDetails.order_date',
                    total_amount: '$orderDetails.total_amount',
                    condition: '$condition',
                    content: '$content'
                }
            }
        ]);

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});

//lấy về đơn hàng theo trạng thái client
app.get('/orders/:userId/:condition', async (req, res) => {
    const userId = req.params.userId;
    const condition = parseInt(req.params.condition);

    try {
        const orders = await OrderStatus.aggregate([{
            $match: {condition: condition}
        },
            {
                $lookup: {
                    from: 'orders',
                    localField: 'order',
                    foreignField: '_id',
                    as: 'orderDetails'
                }
            },
            {
                $unwind: '$orderDetails'
            },
            {
                $match: {'orderDetails.user': mongoose.Types.ObjectId(userId)}
            },
            {
                $project: {
                    _id: '$orderDetails._id',
                    user: '$orderDetails.user',
                    customer_email: '$orderDetails.customer_email',
                    products: '$orderDetails.products',
                    address: '$orderDetails.address',
                    order_date: '$orderDetails.order_date',
                    total_amount: '$orderDetails.total_amount',
                    condition: '$condition',
                    content: '$content'
                }
            }
        ]);

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});


// chuyển đổi trạng thái đơn hàng
app.put('/order/edit-status/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    const {condition, content} = req.body;

    try {
        const updatedOrder = await OrderStatus.findByIdAndUpdate(orderId, {
            condition,
            content
        }, {new: true});

        if (!findByIdAndUpdate) {
            return res.status(404).json({message: 'không tồn tại'});
        }


        res.json(updatedOrder);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Lấy toàn bộ đơn hàng
app.get('/order', async (req, res) => {
    try {
        // Tìm tất cả các đơn hàng trong cơ sở dữ liệu
        const orders = await Order.find();

        res.json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Lấy toàn bộ đơn hàng của một người dùng
app.get('/orders/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        // Tìm tất cả các đơn hàng của người dùng trong cơ sở dữ liệu
        const orders = await Order.find({user: userId});

        res.json(orders);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//chi tiết đơn hàng
// app.get('/order/getOne/:orderId', async (req, res) => {
//     const orderId = req.params.orderId;

//     try {
//         // Tìm đơn hàng theo ID
//         const order = await Order.findById(orderId);

//         if (!order) {
//             return res.status(404).json({ message: 'Không tìm thấy đơn hàng' });
//         }

//         res.json(order);
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
//     }
// });

//thống kê sản phẩm đã bán ra 
app.get('/statistics/sold-products', async (req, res) => {
    try {
        const successfulOrders = await orderDetail.find({status: 3});

        const soldProducts = successfulOrders.reduce((accumulator, order) => {
            order.products.forEach(product => {
                const productId = product.product.toString();
                const quantity = parseInt(product.quantityProduct);

                if (accumulator[productId]) {
                    accumulator[productId] += quantity;
                } else {
                    accumulator[productId] = quantity;
                }
            });

            return accumulator;
        }, {});

        const soldProductDetails = await Product.find({_id: {$in: Object.keys(soldProducts)}});

        const result = soldProductDetails.map(product => ({
            productId: product._id,
            productName: product.product_title,
            totalQuantitySold: soldProducts[product._id.toString()] || 0,
        }));
        const top5Product = result.sort((a, b) => b.totalQuantitySold - a.totalQuantitySold).slice(0, 5);
        const total = top5Product.reduce((accumulator, currentValue) => accumulator + currentValue.totalQuantitySold, 0);


        const totalInsight = top5Product.map(product => ({
            name: product.productName,
            totalDetail: ((product.totalQuantitySold / total) * 100).toFixed(2),
        }))


        res.json(totalInsight);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});


// Thống kê doanh số và lợi nhuận theo năm
app.get('/statistics/revenue/:year', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const successfulOrders = await orderDetail.find({
            status: 3,
            $expr: {$eq: [{$year: '$order_date'}, year]}
        });

        // Tạo mảng chứa doanh số và lợi nhuận theo tháng
        const monthlyData = Array.from({length: 12}, (_, monthIndex) => {
            const month = monthIndex + 1; // Tháng bắt đầu từ 1
            const ordersInMonth = successfulOrders.filter(order => new Date(order.order_date).getMonth() === monthIndex);
            const totalRevenue = ordersInMonth.reduce((accumulator, order) => accumulator + order.total_amount, 0);
            const totalProfit = totalRevenue * 0.25; // Lợi nhuận là 25% doanh số

            return {month, totalRevenue, totalProfit};
        });

        res.json(monthlyData);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});

// Thống kê doanh số và lợi nhuận theo tháng
app.get('/statistics/revenue/:year/:month', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        const successfulOrders = await orderDetail.find({
            status: 3,
            $expr: {
                $and: [
                    {$eq: [{$year: '$order_date'}, year]},
                    {$eq: [{$month: '$order_date'}, month]}
                ]
            }
        });

        const totalRevenue = successfulOrders.reduce((accumulator, order) => {
            return accumulator + order.total_amount;
        }, 0);

        const totalProfit = totalRevenue * 0.25; // Lợi nhuận là 25% doanh số

        res.json({totalRevenue, totalProfit});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});

//Thống kê theo ngày 
app.get('/statistics/revenue/:year/:month/:startDay/:endDay', async (req, res) => {
    try {
        const year = parseInt(req.params.year);
        const month = parseInt(req.params.month);
        const startDay = parseInt(req.params.startDay);
        const endDay = parseInt(req.params.endDay);

        const successfulOrders = await orderDetail.find({
            status: 3,
            $expr: {
                $and: [
                    {$eq: [{$year: '$order_date'}, year]},
                    {$eq: [{$month: '$order_date'}, month]},
                    {$gte: [{$dayOfMonth: '$order_date'}, startDay]},
                    {$lte: [{$dayOfMonth: '$order_date'}, endDay]}
                ]
            }
        });

        const totalRevenue = successfulOrders.reduce((accumulator, order) => {
            return accumulator + order.total_amount;
        }, 0);

        const totalProfit = totalRevenue * 0.25; // Lợi nhuận là 25% doanh số

        res.json({totalRevenue, totalProfit});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});

//Thống kê 1 ngày
app.get('/statistics/revenueOneDate/:date', async (req, res) => {
    try {
        const date = req.params.date

        const year = parseInt(date.substr(0, 4));
        const month = parseInt(date.substr(5, 2));
        const day = parseInt(date.substr(8, 2));

        const successfulOrders = await orderDetail.find({
            status: 3,
            $expr: {
                $and: [
                    {$eq: [{$year: '$order_date'}, year]},
                    {$eq: [{$month: '$order_date'}, month]},
                    {$eq: [{$dayOfMonth: '$order_date'}, day]}
                ]
            }
        });

        const totalRevenue = successfulOrders.reduce((accumulator, order) => {
            return accumulator + order.total_amount;
        }, 0);

        const totalProfit = totalRevenue * 0.25; // Lợi nhuận là 25% doanh số

        res.json({totalRevenue, totalProfit});
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});


//chi tiết đơn hàng
app.get('/order/getOne/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    try {
        const orderDetails = await orderDetail.aggregate([{
            $match: {_id: new ObjectId(orderId)}
        },
            {
                $unwind: '$products'
            },
            {
                $lookup: {
                    from: 'products',
                    localField: 'products.product',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {
                $unwind: '$productDetails'
            },
            {
                $project: {
                    user: 1,
                    customer_email: 1,
                    order_date: 1,
                    total_amount: 1,
                    'products.product': '$products.product',
                    'products.quantity': '$products.quantity',
                    'products.colorId': '$products.colorId',
                    'products.sizeId': '$products.sizeId',
                    'products.product_title': '$productDetails.product_title',
                    'products.product_price': '$productDetails.product_price',
                    'products.product_image': '$productDetails.product_image',
                    'products.product_quantity': '$productDetails.product_quantity',
                    'products.product_quantityColor': '$productDetails.product_quantityColor',
                    'products.product_category': '$productDetails.product_category',
                }
            }
        ]);

        if (orderDetails.length > 0) {
            res.json(orderDetails[0]);
        } else {
            res.status(404).json({message: 'Không tìm thấy đơn hàng'});
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});


// Top sản phẩm bán chạy
app.get('/top-selling', async (req, res) => {
    try {
        // Sử dụng aggregation để tính toán top sản phẩm bán chạy
        const topSellingProducts = await Order.aggregate([
            {$unwind: '$products'},
            {$group: {_id: '$products.product', totalQuantity: {$sum: '$products.quantity'}}},
            {$sort: {totalQuantity: -1}},
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            {$unwind: '$productDetails'},
            {
                $project: {
                    _id: 0,
                    productId: '$_id',
                    productName: '$productDetails.product_title',
                    totalQuantity: 1
                }
            }
        ]).limit(10);

        res.json(topSellingProducts);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/login', async (req, res) => {
    const {username, password} = req.body;

    try {
        const user = await User.findOne({username});

        if (!user) {
            res.status(404).json({message: 'Tài khoản không tồn tại'});
        } else {
            if (password !== user.password) {
                res.status(401).json({message: 'Sai mật khẩu'});
            } else {
                // user.status = true;
                await user.save();
                res.json(user);
            }
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/logout/:iduser', async (req, res) => {
    const idUser = req.params.iduser;

    try {

        const user = await User.findById(idUser);

        if (!user) {
            res.status(404).json({message: 'Người dùng không tồn tại'});
        } else {
            user.status = false;
            await user.save();
            res.json({message: 'Đăng xuất thành công'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.post('/register', async (req, res) => {
    const {username, password} = req.body;

    try {
        const existingUser = await User.findOne({username});

        if (existingUser) {
            return res.status(409).json({message: 'Username đã tồn tại'});
        }

        const user = new User({
            username,
            password
        });

        await user.save();

        const newProfile = new Profile({
            user: user._id,
            fullname: username.split('@')[0],
            gender: 'Nam',
            avatar: 'https://st.quantrimang.com/photos/image/072015/22/avatar.jpg',
            birthday: "11/11/2000",
        });

        await newProfile.save();

        return res.sendStatus(201);
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
});

app.post('/changepassword', async (req, res) => {
    const {username, oldPassword, newPassword} = req.body;

    try {
        const user = await User.findOne({username});

        if (!user) {
            res.status(404).json({message: 'Tài khoản không tồn tại'});
        } else {
            if (oldPassword !== user.password) {
                res.status(401).json({message: 'Sai mật khẩu cũ'});
            } else {
                user.password = newPassword;
                await user.save();

                res.sendStatus(200);
            }
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// lấy toàn bộ user
app.get('/user', async (req, res) => {
    try {
        const u = await User.find();
        res.json(u);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});
// Hiển thị thông tin user dựa trên ID
app.get('/user/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({message: 'Người dùng không tồn tại'});
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Thêm địa chỉ
app.post('/address/add', async (req, res) => {
    const {name, phone, address, userId} = req.body;

    const add = new Address({
        name,
        phone,
        address,
        user: userId
    });


    try {
        await add.save();
        res.json(add);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// Lấy về toàn bộ địa chỉ dựa trên userId
app.get('/address/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const addresses = await Address.find({user: userId});
        res.json(addresses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

app.get('/addressOneUser/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const addresses = await Address.find({user: userId});
        res.json(addresses);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

// Định nghĩa endpoint để sửa địa chỉ
app.put('/address/edit/:id', async (req, res) => {
    const id = req.params.id;
    const {name, phone, address} = req.body;

    try {
        await Address.updateOne({_id: id}, {
            name,
            phone,
            address
        });
        res.sendStatus(200);
    } catch (err) {
        console.error('Lỗi khi sửa dữ liệu:', err);
        res.sendStatus(500);
    }
});

// Định nghĩa endpoint để xoá địa chỉ
app.delete('/address/delete/:id', async (req, res) => {
    const id = req.params.id;
    try {
        await Address.deleteOne({_id: id});
        res.sendStatus(200);
    } catch (err) {
        console.error('Lỗi khi xoá dữ liệu:', err);
        res.sendStatus(500);
    }
});

// Hiển thị chi tiết một địa chỉ
app.get('/address/:id', async (req, res) => {
    const address_id = req.params.id;

    try {
        // Tìm sản phẩm theo ID
        const add = await Address.findById(address_id);

        if (!add) {
            // địa chỉ không tồn tại
            res.status(404).json({message: 'Địa chỉ không tồn tại'});
        } else {
            res.json(add);
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// getAll
app.get('/address', async (req, res) => {
    try {
        const address = await Address.find();
        res.json(address);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


// sửa trang cá nhân
// app.put('/profile/edit', async(req, res) => {
//     const { user, fullname, gender, avatar, birthday } = req.body;

//     try {
//         const u = await User.findById(user);

//         if (!u) {
//             res.status(404).json({ message: 'Tài khoản không tồn tại' });
//         } else {
//             pro = new Profile({
//                 user: user,
//                 fullname: fullname,
//                 gender: gender,
//                 avatar: avatar,
//                 birthday: birthday
//             });

//             await pro.save();
//             res.json(pro);
//         }

//     } catch (error) {
//         res.status(500).json({ message: error.message });
//     }
// });

// sửa trang cá nhân hiển
app.put('/profile/edit', async (req, res) => {
    const {user, fullname, gender, avatar, birthday} = req.body;

    try {
        let profile = await Profile.findOne({user});

        if (profile) {
            profile.fullname = fullname;
            profile.gender = gender;
            profile.avatar = avatar;
            profile.birthday = birthday;
        } else {
            profile = new Profile({
                user,
                fullname,
                gender,
                avatar,
                birthday
            });
        }

        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});


//lấy về thông tin profile theo userId
app.get('/profile/:userId', async (req, res) => {
    const userId = req.params.userId;

    try {
        const profile = await Profile.findOne({user: userId});

        if (profile) {
            res.json(profile);
        } else {
            res.status(404).json({message: 'Không tìm thấy hồ sơ'});
        }
    } catch (error) {
        res.status(500).json({message: error.message});
    }
});

//Tìm kiếm sản phẩm theo tiêu đề
app.post('/products/search', async (req, res) => {
    const {title} = req.body;

    try {
        const searchString = String(title);

        const products = await Product.find({product_title: {$regex: searchString, $options: 'i'}});
        res.json(products);
    } catch (error) {

        res.status(500).json({message: error.message});
    }
});

// Tạo màu sắc mới cho sản phẩm
app.post('/colors/add/:productId', async (req, res) => {
    try {
        const {productId} = req.params;
        const {color_name, color_image} = req.body;

        // Tạo màu sắc mới
        const color = await Color.create({color_name, product: productId, color_image});

        // // Cập nhật mảng colors của sản phẩm
        // await Product.findByIdAndUpdate(productId, { $push: { colors: color._id } });

        res.status(201).json(color);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Sửa đổi thông tin màu sắc
app.put('/colors/edit/:colorId', async (req, res) => {
    try {
        const {colorId} = req.params;
        const {color_name, color_image} = req.body;

        // Tìm và cập nhật thông tin màu sắc
        const color = await Color.findByIdAndUpdate(colorId, {color_name, color_image}, {new: true});

        res.json(color);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Xóa màu sắc
app.delete('/colors/delete/:colorId', async (req, res) => {
    try {
        const {colorId} = req.params;

        // Xóa màu sắc
        await Color.findByIdAndDelete(colorId);

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Lấy về toàn bộ dữ liệu từ bảng Color
app.get('/colors/getAll', async (req, res) => {
    try {
        const colors = await Color.find();
        res.json(colors);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

//lấy color theo productId
app.get('/api/colors/:productId', async (req, res) => {
    try {
        const productId = req.params.productId;

        // Sử dụng phương thức find với điều kiện productId
        const colors = await Color.find({product: productId});

        // Trả về danh sách màu sắc
        res.json(colors);
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error('Error getting colors', error);
        res.status(500).json({error: 'Internal server error'});
    }
});

// Tạo kích thước mới cho sản phẩm
app.post('/sizes/add/:colorId', async (req, res) => {
    try {
        const {colorId} = req.params;
        const {size_name, size_quantity} = req.body;

        // Tạo kích thước mới
        const newSize = new Size({
            size_name,
            size_quantity,
            colorId
        });

        const savedSize = await newSize.save();

        res.status(201).json(savedSize);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Sửa đổi thông tin kích thước
app.put('/sizes/edit/:sizeId', async (req, res) => {
    try {
        const {sizeId} = req.params;
        const {size_name, size_quantity} = req.body;

        // Tìm và cập nhật thông tin kích thước
        const updatedSize = await Size.findByIdAndUpdate(
            sizeId, {size_name, size_quantity}, {new: true}
        );

        res.json(updatedSize);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Xóa kích thước
app.delete('/sizes/delete/:sizeId', async (req, res) => {
    try {
        const {sizeId} = req.params;

        // Xóa kích thước
        await Size.findByIdAndDelete(sizeId);

        res.sendStatus(204);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Lấy về toàn bộ size
app.get('/sizes/getAll', async (req, res) => {
    try {
        const sizes = await Size.find();
        res.json(sizes);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

// Lấy về size theo color
app.get('/sizes/:colorId', async (req, res) => {
    try {
        const {colorId} = req.params;

        // Tìm các kích thước dựa trên colorId
        const sizes = await Size.find({colorId});

        res.json(sizes);
    } catch (error) {
        res.status(500).json({error: 'Lỗi server'});
    }
});

app.get('/order/addOderDetail/All', async (req, res) => {
    const oderAll = await orderDetail.find({});

    res.json(oderAll);
})

app.post('/order/addOderDetail/:id', async (req, res) => {
    const {id} = req.params;
    await orderDetail.deleteOne({_id: id});
})

app.post('/order/addOderDetail', async (req, res) => {
    try {
        const data = req.body;

        let dataProductOrder = []

        for (let i = 0; i < data.products.length; i++) {
            const dataProduct = {
                product: data.products[i].product,
                img_product: data.products[i].img_product,
                name_Product: data.products[i].name_Product,
                name_Size: data.products[i].name_Size,
                name_Price: data.products[i].name_Price,
                name_Color: data.products[i].name_Color,
                quantityProduct: data.products[i].quantityProduct
            }

            dataProductOrder.push(dataProduct)
        }
        const newOder = new orderDetail({
            user: data.user,
            customer_email: data.customer_email,
            products: dataProductOrder,
            total_amount: data.total_amount,
            userName: data.userName,
            phone: data.phone,
            address: data.address,
            total_quantity: data.total_quantity,
            total_product: data.total_product,
            total_insurance_amount: data.total_insurance_amount,
            total_shipping_fee: data.total_shipping_fee,
            total_All: data.total_All,
        });
        const savedOrder = await newOder.save();

        res.status(201).json(savedOrder);

    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi máy chủ nội bộ'});
    }
});
app.get('/order/detail/:orderId', async (req, res) => {
    const orderId = req.params.orderId;

    try {
        const orderDetail1 = await orderDetail.findById(orderId);

        if (!orderDetail1) {
            return res.status(404).json({message: 'không tồn tại dữ liệu'});
        }

        res.json(orderDetail1);
    } catch (error) {
        console.error(error);
        res.status(500).json({message: 'Lỗi rồi'});
    }
});

app.get('/idApp',async (req,res)=>{
    const data = await dataClient.find()
    res.json(data)
})
app.post('/addIdClient', async (req, res) => {
    try {
        const data = req.body;
        console.log(data.idClient)
        const idClient = await dataClient.findOne({client: data.idClient});
        if (!idClient) {
            const  newClient = new dataClient({
                client:data.idClient
            })
            await newClient.save()
        }
        res.json(true)
    } catch (e) {
        console.log(e)
    }
})

app.get('/totalUser',async (req,res) =>{
    const data = await User.find().count();
    res.json(data)
})
app.get('/totalNewUser', async (req, res) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    const startDate = new Date(currentYear, currentMonth - 1, 1);
    const endDate = new Date(currentYear, currentMonth, 0);
    try {
        const data = await User.find({
            date: {
                $gte: startDate,
                $lte: endDate
            }
        }).count();

        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
});
app.get('/totalUserActive',async (req,res) =>{
    const data = await User.findOne({status : false}).count();
    res.json(data)
})
app.get('/totalUserBlock',async (req,res) =>{
    const data = await User.findOne({status : true}).count();
    res.json(data)
})

app.get('/orderNews', async (req, res) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1;
    const currentDay = currentDate.getDate();

    const startDate = new Date(currentYear, currentMonth - 1, currentDay, 0, 0, 0);
    const endDate = new Date(currentYear, currentMonth - 1, currentDay, 23, 59, 59);
    try {
        const data = await orderDetail.find({
            order_date: {
                $gte: startDate,
                $lte: endDate
            },
            status: 0
        }).sort({order_date: -1});
        res.json(data);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
});

//api top khách hàng mua nhiều
app.get('/top-customers', async (req, res) => {
    try {
        // Sử dụng aggregation để nhóm và tính tổng số lượng sản phẩm của từng khách hàng
        const topCustomers = await Oderdetail.aggregate([
            {
                $unwind: "$products"
            },
            {
                $group: {
                    _id: "$user",
                    totalQuantity: { $sum: { $toInt: "$products.quantityProduct" } },
                    totalAmount: { $sum: "$total_amount" },
                    totalOrders: { $sum: 1 }
                }
            },
            {
                $sort: { totalQuantity: -1 }
            },
            {
                $limit: 3 // Lấy top 3 khách hàng mua nhiều nhất
            },
            {
                $lookup: {
                    from: "users", // Tên bảng users trong cơ sở dữ liệu
                    localField: "_id",
                    foreignField: "_id",
                    as: "userDetails"
                }
            },
            {
                $unwind: "$userDetails"
            },
            {
                $project: {
                    _id: 0,
                    name: { $arrayElemAt: [{ $split: ["$userDetails.username", "@"] }, 0] }, // Lấy phần tử đầu tiên của mảng
                    username: "$userDetails.username",
                    totalOrders: 1,
                    totalQuantity: 1
                }
            }
        ]);

        res.json(topCustomers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//api trả về đơn hàng mới đặt theo ngày
app.get('/api/orders-by-date/:year/:month/:day', async (req, res) => {
    try {
        const { year, month, day } = req.params;

        // Convert date parameters to a Date object
        const searchDate = new Date(`${year}-${month}-${day}`);

        // Query orders with a specific date and status
        const orders = await Oderdetail.find({
            order_date: {
                $gte: searchDate,
                $lt: new Date(searchDate.getTime() + 24 * 60 * 60 * 1000),
            },
            status: 0,
        });

        res.json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

//api trả về doanh số theo năm
app.get('/api/orders-by-year/:year', async (req, res) => {
    try {
        const { year } = req.params;

        // Tìm tất cả các đơn hàng thành công trong năm cụ thể
        const successfulOrders = await orderDetail.find({
            status: 3,
            $expr: {
                $eq: [{ $year: '$order_date' }, parseInt(year)]
            }
        });

        // Tính tổng doanh số
       if (successfulOrders){
           const totalRevenue = successfulOrders.reduce((accumulator, order) => {
               return accumulator + order.total_amount;
           }, 0);

           res.json({ totalRevenue });
       }else {
           res.json({totalRevenue: 0})
       }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
});

//api trả về tổng số sản phẩm
app.get('/api/countProducts', async (req, res) => {
    try {
        
        const totalProducts = await Product.countDocuments();

        res.json({ totalProducts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi máy chủ nội bộ' });
    }
});
module.exports = app;