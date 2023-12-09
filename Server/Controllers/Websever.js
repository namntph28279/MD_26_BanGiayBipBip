const Product = require('../Models/Product');
const Color = require('../Models/Color');
const Size = require('../Models/Size');
const ChatShop = require('../Models/chatShop');
const checkClient = require('../Models/CheckClientUser');
const checkClientMess = require('../Models/CheckClientMess');
const User = require('../Models/User');
const express = require('express');
const app = express();
const expressHbs = require('express-handlebars');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const currencyFormatter = require('currency-formatter');
const Order = require("../Models/Oderdetail");

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
app.get('/loadData', async (req, res) => {
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

app.get('/dataOrderUser/:id', async (req, res) => {
    const userId = req.params.id;
    const data = await Order.find({ user: userId }).sort({ order_date: -1 });

    res.json(data)
})
app.get('/home', async (req, res) => {
    res.render('../Views/screenHome.hbs');

});

app.get('/statistic', async (req, res) => {
    try {
        res.render('../Views/screenStatistics.hbs');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

});
app.get('/mess', async (req, res) => {
    try {
        res.render('../Views/screenMessger.hbs');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.get('/warehouse', async (req, res) => {
    try {
        const products = await Product.find().lean();
        res.render('../Views/screenWarehouse.hbs', { products });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


app.post('/screenWarehouse/search', async (req, res) => {
    const { title } = req.body;
    try {
        const searchString = String(title);

        const products = await Product.find({ product_title: { $regex: searchString, $options: 'i' } }).lean();
        res.render('../Views/screenWarehouse.hbs', { products });

    } catch (error) {

        res.status(500).json({ message: error.message });
    }
});
app.post('/order/status/:orderId', async (req, res) => {
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

app.post('/order/statusAPP/:orderId', async (req, res) => {
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

app.post('/order/status/Comfig/:id', async (req, res) => {

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
            NotificaionClient(idClientArray, "Đơn hàng của bạn đã được chuẩn bị xong và đang đợi đơn vị vận chuyển")
            res.json(true)
        } else if (order.status === 2) {
            order.status = 3;
            await order.save();
            NotificaionClient(idClientArray, "Đơn hàng của bạn đã được giao cho đơn vị vận chuyển")
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

app.post('/home/add', async (req, res) => {
    const { product_title, product_price, product_image, product_quantity, product_category } = req.body;

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
        res.status(500).json({ message: error.message });
    }
});

app.post('/home/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { product_title, product_price, product_image, product_quantity, product_category } = req.body;

    try {
        await Product.updateOne({ _id: id }, {
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
        await Product.deleteOne({ _id: id });
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
        res.status(500).json({ error: 'Lỗi server' });
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
            return res.status(404).json({ error: 'Không tìm thấy màu sắc' });
        }

        color.color_name = data.color_name;
        color.color_image = data.color_image;
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

app.post('/home/detail/colors/delete/:colorId/:productId', async (req, res) => {
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

app.post('/chatShop', async (req, res) => {
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

app.post('/chatAllShop', async (req, res) => {
    try {
        const dataChat = await ChatShop.find().lean();
        return res.send(dataChat)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
app.post('/delete', async (req, res) => {
    try {
        const id = req.body;
        await ChatShop.findByIdAndDelete(id._id);
    } catch (err) {
        console.log(err)
    }
})
app.post('/home/chatShop', async (req, res) => {
    const data = req.body;
    const check = await ChatShop.findOne({ user: data.user })
    if (check) {
        const newChat = {
            beLong: data.beLong,
            conTenMain: data.conTenMain,
        }

        try {
            check.status = data.status;
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

app.get("/AllId", async (req, res) => {
    try {
        const dataChat = await checkClient.find().lean();
        return res.send(dataChat)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})
app.get("/AllIdMess", async (req, res) => {
    try {
        const dataChat = await checkClientMess.find().lean();
        return res.send(dataChat)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/sendNotificationClient', async (req, res) => {
    const data = req.body;
    try {
        const check = await checkClient.findOne({ user: data.user });
        return res.send(check)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/sendNotificationMess', async (req, res) => {
    const data = req.body;
    try {
        const check = await checkClientMess.findOne({ user: data.user });
        return res.send(check)
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

app.post('/checkClientUser', async (req, res) => {
    const data = req.body;

    if (data.user === null) {
        return
    }
    try {
        const check = await checkClient.findOne({ user: data.user });

        if (check) {
            const clientUser = check.client.find((c) => c.IdClient === data.IdClient);

            if (clientUser) {
                clientUser.status = data.status;
                await check.save();
                return res.json({ message: "Cập nhật client thành công" });
            } else {
                const updatedCheckClient = await checkClient.findOneAndUpdate(
                    { user: data.user },
                    { $push: { client: { IdClient: data.IdClient, status: data.status } } },
                    { new: true, upsert: true }
                );
                return res.json({ message: "Tạo client thành công", data: updatedCheckClient });
            }
        } else {
            const newCheckClient = new checkClient({
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

app.post('/checkClientMess', async (req, res) => {
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
                const updatedCheckClient = await checkClientMess.findOneAndUpdate(
                    { user: data.user },
                    { $push: { client: { IdClient: data.IdClient, status: data.status } } },
                    { new: true, upsert: true }
                );
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
app.get('/login', async (req, res) => {
    try {
        res.render('../Views/login.hbs', {});
    } catch (error) {
        console.log(error);
    }
});
app.post("/web/login", async (req, res) => {
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
app.post("/web/register", async (req, res) => {
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
                birthday: "01-01-2000",
            });
            await newProfile.save();
            //thông báo đăng ký thành công
            res.redirect("/login");
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
});
app.get('/loadData/traHang/:id', async (req, res) => {
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

app.get('/loadData/donHuy/:id', async (req, res) => {
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
app.post('/order/return/:orderId', async (req, res) => {
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


app.post('/order/out/:orderId', async (req, res) => {
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




module.exports = app;
