const Product = require('../Models/Product');
const Color = require('../Models/Color');
const Size = require('../Models/Size');
const ChatShop = require('../Models/chatShop');
const checkClient = require('../Models/CheckClientUser');
const checkClientMess = require('../Models/CheckClientMess');
const notification = require('../Models/Notification');
const notificationOneUser = require('../Models/NotificationOneUser');
const User = require('../Models/User');
const express = require('express');
const app = express();
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const currencyFormatter = require('currency-formatter');
const Order = require("../Models/Oderdetail");
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const mongoose = require('mongoose');
const dataClient = require("../Models/dataClient");
const CartItem = require('../Models/CartItem');
const FavouriteItem = require('../Models/FavouriteItem');

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
const uploadsPath = path.join(__dirname, '../uploads');
app.use('/uploads', express.static(uploadsPath));


const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/'); // Destination folder for uploaded images
    },
    filename: function(req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, file.fieldname + '-' + uniqueSuffix + ext);
    },
});

const upload = multer({ storage: storage });


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

        formatCurrency: function(amount) {
            return currencyFormatter.format(amount, { code: 'VND' });
        }
    },
});
app.engine('.hbs', handlebars.engine);
app.set('view engine', '.hbs');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
//màn hình home
app.get('/loadData', async(req, res) => {
    const choXacNhan = await Order.find({ status: 0 }).sort({ order_date: -1 });
    const choLayHang = await Order.find({ status: 1 }).sort({ order_date: -1 });
    const choGiaoHang = await Order.find({ status: 2 }).sort({ order_date: -1 });
    const daGiao = await Order.find({ status: { $in: [3, 9] } }).sort({ order_date: -1 });
    // const donHuy = await Order.find({status: 4}).sort({order_date: -1});
    const donHuy = await Order.find({ status: 8 }).sort({ order_date: -1 });
    const traHang = await Order.find({ status: 5 }).sort({ order_date: -1 });
    const donHoan = await Order.find({ status: 6 }).sort({ order_date: -1 });

    const arr = [choXacNhan, choLayHang, choGiaoHang, daGiao, donHuy, traHang, donHoan]

    res.json(arr)
})

app.get('/loadDataChoXacNhan', async(req, res) => {
    const choXacNhan = await Order.find({ status: 0 }).sort({ order_date: -1 });
    res.json(choXacNhan)
})

app.get('/loadDataChoLayHang', async(req, res) => {
    const choLayHang = await Order.find({ status: 1 }).sort({ order_date: -1 });
    res.json(choLayHang)
})

app.get('/loadDataChoGiaoHang', async(req, res) => {
    const choGiaoHang = await Order.find({ status: 2 }).sort({ order_date: -1 });
    res.json(choGiaoHang)
})

app.get('/loadDataDaGiao', async(req, res) => {
    const daGiao = await Order.find({ status: { $in: [3, 9] } }).sort({ order_date: -1 });
    res.json(daGiao)
})

app.get('/loadDataDonHuy', async(req, res) => {
    const donHuy = await Order.find({ status: 8 }).sort({ order_date: -1 });
    res.json(donHuy)
})

app.get('/loadDataTraHang', async(req, res) => {
    const traHang = await Order.find({ status: 5 }).sort({ order_date: -1 });
    res.json(traHang)
})

app.get('/loadDataDonHoan', async(req, res) => {
    const donHoan = await Order.find({ status: 6 }).sort({ order_date: -1 });
    res.json(donHoan)
})

app.get('/dataOrderUser/:id', async(req, res) => {
    const userId = req.params.id;
    const data = await Order.find({ user: userId }).sort({ order_date: -1 });
    res.json(data)
})
app.get('/home', async(req, res) => {
    res.render('../Views/screenHome.hbs');

});
app.get('/notifications', async(req, res) => {
    res.render('../Views/screenNotifications.hbs');
});
app.get('/accountManagement', async(req, res) => {
    res.render('../Views/screenAccountManagement.hbs');
});
app.get('/statistic', async(req, res) => {
    try {
        res.render('../Views/screenStatistics.hbs');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});
app.get('/customer', async(req, res) => {
    try {
        const data = await User.aggregate([{
                $lookup: {
                    from: "profiles",
                    localField: "_id",
                    foreignField: "user",
                    as: "profile"
                }
            },
            {
                $unwind: {
                    path: "$profile",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "_id",
                    foreignField: "user",
                    as: "address"
                }
            },
            {
                $unwind: {
                    path: "$address",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    password: 1,
                    role: 1,
                    status: 1,
                    date: 1,
                    block_reason: 1,
                    "profile.fullname": 1,
                    "profile.gender": 1,
                    "profile.avatar": 1,
                    "profile.birthday": 1,
                    "profile.email": 1,
                    "profile.phone": 1,
                    "profile.address": 1,
                    "profile.username": "$username",
                    "address.address": 1,
                    "address.phone": 1,
                    "profile.status": "$status",
                }
            }
        ]);
        res.render('../Views/customer.hbs', { data });
    } catch (error) {
        console.error(error);
        res.status(500).send('Lỗi rồi');
    }
});
app.get('/customer/:userId', async(req, res) => {
    const userId = req.params.userId;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'userId không hợp lệ' });
    }

    try {
        const data = await User.aggregate([{
                $match: {
                    _id: new mongoose.Types.ObjectId(userId)
                }
            },
            {
                $lookup: {
                    from: "profiles",
                    localField: "_id",
                    foreignField: "user",
                    as: "profile"
                }
            },
            {
                $unwind: {
                    path: "$profile",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $lookup: {
                    from: "addresses",
                    localField: "_id",
                    foreignField: "user",
                    as: "address"
                }
            },
            {
                $unwind: {
                    path: "$address",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    _id: 1,
                    username: 1,
                    password: 1,
                    role: 1,
                    status: 1,
                    date: 1,
                    block_reason: 1,
                    "profile.fullname": 1,
                    "profile.gender": 1,
                    "profile.avatar": 1,
                    "profile.birthday": 1,
                    "profile.email": 1,
                    "profile.phone": 1,
                    "profile.address": 1,
                    "profile.username": "$username",
                    "address.address": 1,
                    "address.phone": 1,
                    "profile.status": "$status",
                }
            }
        ]);

        if (data.length > 0) {
            res.json(data[0]);
        } else {
            res.status(404).json({ message: 'Không tìm thấy người dùng' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi rồi' });
    }
});

app.post('/block', async(req, res) => {
    let userId = req.body.userId;
    const blockReason = req.body.blockReason;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'UserId không hợp lệ', userId, blockReason });

    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tồn tại tài khoản' });
        }

        user.status = true;
        user.block_reason = blockReason;
        await user.save();
        const { io } = require('../server');

        if(io){
            io.sockets.emit('data-block', { userId });
            console.log("block");
        }else{
            console.log("fail");
        }

        res.redirect('/customer');
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi rồi' });
    }
});
app.get('/checkstatususer/:userId', async(req, res) => {
    try {
        const userId = req.params.userId;
        const userInfo = await User.findById(userId, 'status date block_reason');

        if (!userInfo) {
            return res.status(404).json({ message: 'không tồn tại user' });
        }
        res.json(userInfo);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Lỗi' });
    }
});

app.post('/unblock', async(req, res) => {
    let userId = req.body.userId;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ message: 'UserId không hợp lệ', userId });
    }

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: 'Không tồn tại tài khoản' });
        }
        if (!user.status) {
            return res.status(400).json({ message: 'Người dùng đã được mở chặn trước đó' });
        }
        user.status = false;
        user.block_reason = 'Đã bỏ chặn';
        await user.save();

        res.status(200).json({ message: 'Người dùng đã được bỏ chặn thành công' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Lỗi rồi' });
    }
});
app.get('/mess', async(req, res) => {
    try {
        res.render('../Views/screenMessger.hbs');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/dataWarehouse', async(req, res) => {
    try {
        const products = await Product.find().sort({ data_product: -1 });
        res.json(products)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});




app.get('/warehouse', async(req, res) => {
    try {
        res.render('../Views/screenWarehouse.hbs');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/warehouse/:cate', async(req, res) => {
    const cate = req.params.cate;
    try {
        if (cate === "men") {
            category = "Nam";
        } else if (cate === "women") {
            category = "Nữ";
        }
        const products = await Product.find({ product_category: cate }).sort({ data_product: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/warehouse/:cate/:sort', async(req, res) => {
    const { sort } = req.params;
    const { cate } = req.params;
    try {
        if (cate === "men") {
            category = "Nam";
        } else if (cate === "women") {
            category = "Nữ";
        } else if (cate === "all") {
            category = "Tất cả";
        }
        if (sort === "lowtohight") {
            sortName = "Giá: Thấp đến Cao";
        } else if (sort === "highttolow") {
            sortName = "Giá: Cao đến Thấp";
        }
        if (cate === "all") {
            const products = await Product.find().sort({ data_product: -1 });
            const sortProducts = sort === "lowtohight" ? products.slice().sort((a, b) => a.product_price - b.product_price) : products.slice().sort((a, b) => b.product_price - a.product_price);
            res.json(sortProducts)
        } else {
            const products = await Product.find({ product_category: cate }).sort({ data_product: -1 });
            const sortProducts = sort === "lowtohight" ? products.slice().sort((a, b) => a.product_price - b.product_price) : products.slice().sort((a, b) => b.product_price - a.product_price);
            res.json(sortProducts)
        }


    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/screenWarehouse/search', async(req, res) => {
    const { title } = req.body;
    try {
        const searchString = String(title);

        const products = await Product.find({ product_title: { $regex: searchString, $options: 'i' } }).sort({ data_product: -1 });
        res.render('../Views/screenWarehouse.hbs', { products });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});
app.post('/order/status/:orderId', async(req, res) => {
    const orderId = req.params.orderId;
    const data = req.body
    const order = await Order.findById(orderId);
    let mess;
    if (order.status === 5) {
        mess = "Shop từ chối trả hàng vì: " + data.noiDung
    } else {
        mess = "Đơn hàng của bạn đã bị hủy vì: " + data.noiDung
    }
    console.log(mess)
    try {
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }
        const idUserOrder = order.user;
        const IDClient = await checkClient.findOne({ user: idUserOrder });
        const filteredData = IDClient.client.filter(item => item.status === "true");
        const idClientArray = filteredData.map(item => item.IdClient);

        function NotificaionClient(id, mess) {
            fetch('https://exp.host/--/api/v2/push/send', {
                mode: 'no-cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: id,
                    title: 'ShopBipBip',
                    body: mess,
                    data: {
                        message: mess,
                    },
                })
            });
        }

        NotificaionClient(idClientArray, mess)
        console.log(order.status)
        if (order.status === 5) {
            order.status = 9;
            order.lyDoHuyDon = data.noiDung
            await order.save();
            res.json(true)
        } else {
            order.status = 8;
            order.lyDoHuyDon = data.noiDung
            await order.save();
            res.json(true)
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/order/statusAPP/:orderId', async(req, res) => {
    const orderId = req.params.orderId;
    try {
        const order = await Order.findById(orderId);
        order.status = 4;
        await order.save();
        res.json(true)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/order/status/Comfig/:id', async(req, res) => {

    const orderId = req.params.id;
    console.log(orderId)

    try {
        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }
        const idUserOrder = order.user;
        const IDClient = await checkClient.findOne({ user: idUserOrder });
        const filteredData = IDClient.client.filter(item => item.status === "true");
        const idClientArray = filteredData.map(item => item.IdClient);

        function NotificaionClient(id, mess) {
            fetch('https://exp.host/--/api/v2/push/send', {
                mode: 'no-cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: id,
                    title: 'ShopBipBip',
                    body: mess,
                    data: {
                        message: mess,
                    },
                })
            });
        }

        if (order.status === 0) {
            order.status = 1;
            await order.save();
            NotificaionClient(idClientArray, "Đơn hàng của bạn đã được xác nhận và đang chuẩn bị hàng")
            res.json(true)
        } else if (order.status === 1) {
            order.status = 2;
            await order.save();
            NotificaionClient(idClientArray, "Đơn hàng của bạn đã được giao cho đơn vị vận chuyển")
            res.json(true)
        } else if (order.status === 2) {
            order.status = 3;
            order.order_date = Date.now();
            console.log(order.order_date);
            await order.save();
            NotificaionClient(idClientArray, "Đơn vị vận đã giao thành công cho bạn")
            res.json(true)
        } else if (order.status === 5) {
            order.status = 6;
            await order.save();
            NotificaionClient(idClientArray, "Bạn vui lòng liên hệ với shop thông qua phần tin nhắn hoặc hotline: 0987654321 để được hỗ trợ trả hàng ")
            res.json(true)
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/home/add', upload.single('product_image'), async(req, res) => {
    try {
        const { product_title, product_price, product_category } = req.body;

        let imagePath = "";
        if (req.file) {
            imagePath = req.file.path;
        }
        const imageUrl = `http://localhost/${path.normalize(imagePath).replace(/\\/g, '/')}`;


        if (!product_title || !product_price) {
            return res.status(400).send('Missing required fields');
        }

        const newProduct = new Product({
            product_title,
            product_price,
            product_quantity: 0,
            product_quantityColor: 0,
            product_image: imageUrl,
            product_category,
        });

        await newProduct.save();
        res.redirect('/warehouse');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
});


app.post('/home/edit/:id', upload.single('product_image'), async(req, res) => {
    const id = req.params.id;
    const { product_title, product_price, product_category } = req.body;
    let imagePath = "";
    if (req.file) {
        imagePath = req.file.path;
    }
    const imageUrl = `http://localhost/${path.normalize(imagePath).replace(/\\/g, '/')}`;
    if (!product_title || !product_price) {
        return res.status(400).send('Missing required fields');
    }

    try {
        await Product.updateOne({ _id: id }, {
            product_title,
            product_price,
            product_image: imageUrl,
            product_category
        }).lean();

        res.redirect('/warehouse')
    } catch (err) {
        console.error('Lỗi khi sửa dữ liệu:', err);
        res.sendStatus(500);
    }
});


app.post('/home/delete/:id', async(req, res) => {
    const id = req.params.id;

    try {
        await Product.deleteOne({ _id: id });
        await FavouriteItem.deleteMany({ product: id });
        await CartItem.deleteMany({ product: id });

        await checkClient.findOneAndUpdate({ user: id }, {
            $push: {
                client: {
                    status: false
                }
            }
        }, { new: true, upsert: true });
       
        const { io } = require('../server');

        if (io) {
            io.sockets.emit('data-deleted', { id });
            console.log("ok");
        } else {
            console.log("fail");
        }

        res.json(true)
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
        const idProductSP = product._id


        if (!product) {
            return res.status(404).json({ error: 'Không tìm thấy sản phẩm' });
        }

        // Lấy thông tin màu sắc của sản phẩm
        const colors = await Color.find({ product: productId }).lean();
        const colorAll = [];
        for (let i = 0; i < colors.length; i++) {
            const id = colors[i]._id;
            const dataSize = await Size.find({ colorId: id }).lean();
            colorAll.push({ dataColer: colors[i], dataSize, idProduct: product._id })
        }
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
        const productQuantity = sizeQuantity;

        await Product.findOneAndUpdate({ _id: idProductSP }, {
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

        res.render('../Views/product_detail.hbs', { productWithDetails });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.post('/home/detail/color/add/:productId', upload.single('color_image'), async(req, res) => {
    try {
        const productId = req.params.productId;
        const product = await Product.findById(productId).lean();
        const data = req.body;
        const arrSize = [data.size_26, data.size_27, data.size_28, data.size_29, data.size_34, data.size_35, data.size_36, data.size_37, data.size_38]
        const arrSizeName = [26, 27, 28, 29, 34, 35, 36, 37, 38]

        let imagePath = "";
        if (req.file) {
            imagePath = req.file.path;
        }
        const imageUrl = `http://localhost/${path.normalize(imagePath).replace(/\\/g, '/')}`;


        const color = await Color.create({
            product: productId,
            color_name: data.color_name,
            color_image: imageUrl
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
        res.status(500).json({ error: 'Lỗi server' });
    }
})

app.post('/home/detail/colors/edit/:colorId/:productId', upload.single("color_image"), async(req, res) => {
    try {
        const colorId = req.params.colorId;
        const productId = req.params.productId;

        const data = req.body;
        const arrSize = [data.size_26, data.size_27, data.size_28, data.size_29, data.size_34, data.size_35, data.size_36, data.size_37, data.size_38]
        const arrSizeName = [26, 27, 28, 29, 34, 35, 36, 37, 38]

        const color = await Color.findById(colorId);
        // Kiểm tra xem màu sắc có tồn tại hay không
        if (!color) {
            return res.status(404).json({ error: 'Không tìm thấy màu sắc' });
        }
        let imagePath = "";
        if (req.file) {
            imagePath = req.file.path;
        }
        const imageUrl = `http://localhost/${path.normalize(imagePath).replace(/\\/g, '/')}`;

        color.color_name = data.color_name;
        color.color_image = imageUrl;
        await color.save();

        const colorSizes = await Size.find({ colorId }).lean();
        for (let i = 0; i < arrSize.length; i++) {
            const sizeId = colorSizes[i]._id;
            const newSizeQuantity = arrSize[i];
            const newSizeName = arrSizeName[i];
            await Size.findOneAndUpdate({ _id: sizeId }, {
                size_quantity: newSizeQuantity,
                size_name: newSizeName,
            });
        }
        res.redirect('/home/detail/' + productId);
    } catch (error) {
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.post('/home/detail/colors/delete/:colorId/:productId', async(req, res) => {
    try {
        const colorId = req.params.colorId;
        const productId = req.params.productId;
        const colorSizes = await Size.find({ colorId }).lean();


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
        res.status(500).json({ error: 'Lỗi server' });
    }
});

app.post('/chatShop', async(req, res) => {
    try {
        const data = req.body;
        const products = await ChatShop.findOne({ user: data.user }).lean();
        if (products) {
            return res.send(products)
        }

    } catch (error) {
        res.send([]);
    }
});

app.post('/chatAllShop', async(req, res) => {
    try {
        const dataChat = await ChatShop.find().lean();
        const sort = dataChat.sort((a, b) => new Date(b.date) - new Date(a.date))
        return res.send(sort)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/delete', async(req, res) => {
    try {
        const id = req.body;
        await ChatShop.findByIdAndDelete(id._id);
    } catch (err) {
        console.log(err)
    }
})

app.post('/home/notificationChatShop', async(req, res) => {
    const data = req.body;
    const check = await ChatShop.findOne({ user: data.user })
    if (check) {
        try {
            if (data.beLong === "admin") {
                const idApp = await checkClient.findOne({ user: check.user })
                const idAppMess = await checkClientMess.findOne({ user: check.user })
                const client = idApp.client
                const clienCheckMess = idAppMess.client
                const dataClient = client.filter(item => item.status === "true").map(item => item.IdClient)
                const dataClientMess = clienCheckMess.filter(item => item.status === "false").map(item => item.IdClient)

                if (dataClient.length !== 0) {
                    const intersection = dataClient.filter(item => dataClientMess.includes(item));
                    NotificaionClient(intersection, data.conTenMain)
                }

                function NotificaionClient(id, mess) {
                    fetch('https://exp.host/--/api/v2/push/send', {
                        mode: 'no-cors',
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            to: id,
                            title: 'ShopBipBip',
                            body: mess,
                            data: {
                                message: mess,
                            },
                        })
                    });
                }

                return res.json(true);
            }
        } catch (error) {
            return res.json(false);
        }
    }
})

app.post('/home/chatShop', async(req, res) => {
    const data = req.body;
    const check = await ChatShop.findOne({ user: data.user })
    if (check) {
        try {
            const newChat = {
                beLong: data.beLong,
                conTenMain: data.conTenMain,
            }
            check.status = data.status;
            check.date = Date.now();
            check.content.push(newChat)
            await check.save()
            return res.json(true);
        } catch (error) {
            return res.json(false);
        }
    } else {
        try {
            const newChat = new ChatShop({
                user: data.user,
                fullName: data.fullName,
                status: true,
                content: [{
                    beLong: data.beLong,
                    conTenMain: data.conTenMain
                }]
            })
            await newChat.save()
            return res.json({ message: "Tạo chat thành công" });
        } catch (error) {
            console.log(error);
        }
    }
})

app.get("/AllId", async(req, res) => {
    try {
        const dataChat = await checkClient.find().lean();
        return res.send(dataChat)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
app.get("/AllIdMess", async(req, res) => {
    try {
        const dataChat = await checkClientMess.find().lean();
        return res.send(dataChat)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/sendNotificationClient', async(req, res) => {
    const data = req.body;
    try {
        const check = await checkClient.findOne({ user: data.user });
        return res.send(check)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/sendNotificationMess', async(req, res) => {
    const data = req.body;
    try {
        const check = await checkClientMess.findOne({ user: data.user });
        return res.send(check)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/checkClientUser', async(req, res) => {
    const data = req.body;
    console.log(data.user)
    if (data.user === null) {
        return
    }
    try {
        const check = await checkClient.findOne({ user: data.user });
        if (check) {
            const clientUser = check.client.find((c) => c.IdClient === data.IdClient);

            if (clientUser) {
                console.log(1)
                clientUser.status = data.status;
                await check.save();
                return res.json({ message: "Cập nhật client thành công" });
            } else {
                const updatedCheckClient = await checkClient.findOneAndUpdate({ user: data.user }, {
                    $push: {
                        client: {
                            IdClient: data.IdClient,
                            status: data.status
                        }
                    }
                }, { new: true, upsert: true });
                return res.json(true);
            }
        } else {
            console.log(2)
            const newCheckClient = new checkClient({
                user: data.user,
                client: [{
                    IdClient: data.IdClient,
                    status: data.status,
                }]
            });
            await newCheckClient.save();
            return res.json(true);
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi xử lý yêu cầu" });
    }
});

app.post('/checkClientMess', async(req, res) => {
    const data = req.body;
    console.log("start")
    if (data.user === null) {
        return
    }
    try {

        const check = await checkClientMess.findOne({ user: data.user });

        if (check) {
            const clientUser = check.client.find((c) => c.IdClient === data.IdClient);

            if (clientUser) {

                clientUser.status = data.status;
                await check.save();
                return res.json({ message: "Cập nhật trạng thái thành công" });
            } else {
                const updatedCheckClient = await checkClientMess.findOneAndUpdate({ user: data.user }, {
                    $push: {
                        client: {
                            IdClient: data.IdClient,
                            status: data.status
                        }
                    }
                }, { new: true, upsert: true });
                return res.json({ message: "Tạo trạng thái thành công", data: updatedCheckClient });
            }
        } else {
            const newCheckClient = new checkClientMess({
                user: data.user,
                client: [{
                    IdClient: data.IdClient,
                    status: data.status,
                }]
            });
            await newCheckClient.save();
            return res.json({ message: "Tạo client thành công", data: newCheckClient });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Lỗi xử lý yêu cầu" });
    }
});
app.get('/login', async(req, res) => {
    try {
        res.render('../Views/login.hbs', {});
    } catch (error) {
        console.log(error);
    }
});
app.post("/web/login", async(req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || user.role !== 2) {
            const error = "Tài khoản không tồn tại";
            res.redirect("/login");
        } else {
            if (password !== user.password) {
                const error = "Sai mật khẩu";
                res.redirect("/login");
            } else {
                user.status = true;
                await user.save();
                res.redirect("/home");
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post("/web/register", async(req, res) => {
    const { username, password, repassword, fullname } = req.body;

    try {
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            const error = "Tài khoản đã tồn tại";
            res.redirect("/login");
        } else {
            if (password != repassword) {
                res.flash("Xác nhận mật khẩu mới không khớp");
                const error = "Xác nhận mật khẩu mới không khớp";
                res.redirect("/login");
            }
            const user = new User({
                username,
                password,
                role: 2,
            });
            await user.save();
            const newProfile = new Profile({
                user: user._id,
                fullname: fullname,
                gender: "Nam",
                avatar: "https://st.quantrimang.com/photos/image/072015/22/avatar.jpg",
                birthday: "11/11/2000",
            });
            await newProfile.save();
            //thông báo đăng ký thành công
            res.redirect("/login");
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
app.get('/loadData/traHang/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const traHang = Order.find({ status: 5, user: id }).sort({ order_date: -1 });
        const donHoan = Order.find({ status: 6, user: id }).sort({ order_date: -1 })
        const arr = traHang.concat(donHoan)

        res.json(arr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
});

app.get('/loadData/donHuy/:id', async(req, res) => {
    try {
        const id = req.params.id;
        const donHuyClient = await Order.find({ status: 4, user: id }).sort({ order_date: -1 });
        const donHuyServer = await Order.find({ status: 8, user: id }).sort({ order_date: -1 });
        const arr = donHuyClient.concat(donHuyServer);

        res.json(arr);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Đã xảy ra lỗi' });
    }
});
//trả hàng
app.post('/order/return/:orderId', async(req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Check if the order status is eligible for return (assuming status 4 means "Đã giao")
        if (order.status !== 3) {
            return res.status(400).json({ message: 'Không thể trả đơn hàng với trạng thái hiện tại' });
        }
        if (req.body.status === 'waiting_approval') {
            setTimeout(() => {
                order.status = 5;
                console.log('dfsfdsfsdfs', order.status = 5);

                // Save the updated order
                order.save();
            }, 1000); // 1000 milliseconds (1 second)
        } else if (req.body.status === 'rejected') {
            order.status = 9;
            console.log('dfsfdsfsdfs', order.status = 9);
        } else {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/order/out/:orderId', async(req, res) => {
    const orderId = req.params.orderId;

    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ message: 'Đơn hàng không tồn tại' });
        }

        // Check if the order status is eligible for return (assuming status 4 means "Đã giao")
        if (order.status !== 3) {
            return res.status(400).json({ message: 'Không thể trả đơn hàng với trạng thái hiện tại' });
        }
        if (req.body.status === 'hh') {
            setTimeout(() => {
                order.status = 7;
                console.log('dfsfdsfsdfs', order.status = 7);

                // Save the updated order
                order.save();
            }, 1000); // 1000 milliseconds (1 second)
        } else {
            return res.status(400).json({ message: 'Trạng thái không hợp lệ' });
        }

        res.json({ message: 'Cập nhật trạng thái đơn hàng thành công' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/dataNotification', async(req, res) => {
    const data = await notification.find();
    const sort = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    res.json(sort)
})

app.get('/dataNameUser', async(req, res) => {
    const data = await User.find().exec();
    const filterName = data.filter(item => item.status === false)
    const sortName = filterName.sort((a, b) => new Date(b.date) - new Date(a.date))
    console.log(sortName)
    const name = sortName.map(item => item.username);
    console.log(name)
    res.json(name)
})
app.post('/addNotification', async(req, res) => {
    try {
        const data = req.body;
        if (data.noiDung) {
            const newNotification = new notification({
                noiDung: data.noiDung
            })
            await newNotification.save()

            const dataIdApp = await dataClient.find().exec();
            const clients = dataIdApp.map(item => item.client);

            NotificaionClient(clients, data.noiDung)
            console.log(clients)
        }

        function NotificaionClient(id, mess) {
            fetch('https://exp.host/--/api/v2/push/send', {
                mode: 'no-cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: id,
                    title: 'ShopBipBip',
                    body: mess,
                    data: {
                        message: mess,
                    },
                })
            });
        }

        res.json(true)
    } catch (e) {
        console.log(e)
    }
})


app.get('/dataAllNotificationOneUser', async(req, res) => {
    const data = await notificationOneUser.find()
    const sort = data.sort((a, b) => new Date(b.date) - new Date(a.date))
    res.json(sort)
})
app.post('/addNotificationOneUser', async(req, res) => {
    const data = req.body;
    const dataUser = await User.findOne({ username: data.userName })
    console.log(dataUser)
    if (dataUser) {

        const idUser = dataUser._id
        const idApp = await checkClient.findOne({ user: idUser })

        if (idApp) {
            const clientApp = idApp.client
            const dataClient = clientApp.filter(item => item.status === "true").map(item => item.IdClient)
            NotificaionClient(dataClient, data.noiDung)
        }

        const newNotification = new notificationOneUser({
            userName: data.userName,
            noiDung: data.noiDung
        })
        await newNotification.save()

        function NotificaionClient(id, mess) {
            fetch('https://exp.host/--/api/v2/push/send', {
                mode: 'no-cors',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    to: id,
                    title: 'ShopBipBip',
                    body: mess,
                    data: {
                        message: mess,
                    },
                })
            });
        }

        res.json(true)
    } else {
        res.json(false)
    }

})

app.post('/deleteAllNotification', async(req, res) => {
    await notification.deleteMany()
    res.json(true)
})
app.post('/deleteAllNotificationOne', async(req, res) => {
    await notificationOneUser.deleteMany()
    res.json(true)
})
module.exports = app;