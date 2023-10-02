const Product = require('../Models/Product');
const CartItem = require('../Models/CartItem');
const FavouriteItem = require('../Models/FavouriteItem');
const Order = require('../Models/Order');
const User = require('../Models/User');
const Address = require('../Models/Address');
const Profile = require('../Models/Profile');
const auth = require('../authenticateToken');

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


// Middleware để xử lý dữ liệu JSON
app.use(express.json());

// Thêm sản phẩm
app.post('/add', async (req, res) => {
    const { product_title, product_price, product_image, product_quantity } = req.body;

    const product = new Product({
        product_title,
        product_price,
        product_image,
        product_quantity
    });

    try {
        await product.save();
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// getAll
app.get('/', async (req, res) => {
    try {
        const produt = await Product.find();
        res.json(produt);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Định nghĩa endpoint để sửa dữ liệu
app.put('/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { product_title, product_price, product_image, product_quantity } = req.body;

    try {
        const result = await Product.updateOne({ _id: id }, {
            product_title,
            product_price,
            product_image,
            product_quantity
        });
        res.sendStatus(200);
    } catch (err) {
        console.error('Lỗi khi sửa dữ liệu:', err);
        res.sendStatus(500);
    }
});

// Định nghĩa endpoint để xoá dữ liệu
app.delete('/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await Product.deleteOne({ _id: id });
        res.sendStatus(200);
    } catch (err) {
        console.error('Lỗi khi xoá dữ liệu:', err);
        res.sendStatus(500);
    }
});

// Hiển thị chi tiết một sản phẩm
app.get('/product/:id', async (req, res) => {
    const productId = req.params.id;

    try {
        // Tìm sản phẩm theo ID
        const product = await Product.findById(productId);

        if (!product) {
            // Sản phẩm không tồn tại
            res.status(404).json({ message: 'Sản phẩm không tồn tại' });
        } else {
            res.json(product);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm sản phẩm vào giỏ hàng
app.post('/cart/add', async (req, res) => {
    const { product_id, quantity } = req.body;

    try {
        // Kiểm tra xem sản phẩm đã tồn tại trong giỏ hàng chưa
        let cartItem = await CartItem.findOne({ product: product_id });

        if (cartItem) {
            // Nếu sản phẩm đã tồn tại, cập nhật số lượng
            cartItem.quantity += quantity;
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào bảng giỏ hàng
            const product = await Product.findById(product_id);

            if (!product) {
                res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            } else {
                cartItem = new CartItem({
                    product: product_id,
                    quantity,
                    product_title: product.product_title,
                    product_image: product.product_image
                });
            }
        }

        await cartItem.save();
        res.json(cartItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xoá sản phẩm khỏi giỏ hàng
app.delete('/cart/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await CartItem.findByIdAndDelete(id);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Lấy toàn bộ sản phẩm trong giỏ hàng
app.get('/cart', async (req, res) => {
    try {
        const cartItems = await CartItem.find();
        res.json(cartItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Thêm sản phẩm vào bảng yêu thích
app.post('/favourite/add', async (req, res) => {
    const { product_id } = req.body;

    try {
        // Kiểm tra xem sản phẩm đã tồn tại trong bảng yêu thích chưa
        let favouriteItem = await FavouriteItem.findOne({ product: product_id });

        if (favouriteItem) {
            // Nếu sản phẩm đã tồn tại trong bảng yêu thích, không thêm lại
            res.status(400).json({ message: 'Sản phẩm đã tồn tại trong bảng yêu thích' });
        } else {
            // Nếu sản phẩm chưa tồn tại, thêm vào bảng yêu thích
            const product = await Product.findById(product_id);

            if (!product) {
                res.status(404).json({ message: 'Sản phẩm không tồn tại' });
            } else {
                favouriteItem = new FavouriteItem({
                    product: product_id,
                    product_title: product.product_title,
                    product_price: product.product_price,
                    product_image: product.product_image
                });

                await favouriteItem.save();
                res.json(favouriteItem);
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Xoá sản phẩm khỏi yêu thích
app.delete('/favourite/delete/:id', async (req, res) => {
    const id = req.params.id;

    try {
        await FavouriteItem.findByIdAndDelete(id);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Lấy toàn bộ sản phẩm yêu thích
app.get('/favourite', async (req, res) => {
    try {
        const favouriteItems = await FavouriteItem.find();
        res.json(favouriteItems);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Đặt hàng
app.post('/order/add', async (req, res) => {
    const { customer_email, products, address_id } = req.body;

    try {
        // Tìm tất cả sản phẩm theo danh sách product_id
        const foundProducts = await Product.find({ _id: { $in: products.map(item => item.product_id) } });

        // Kiểm tra xem tất cả các sản phẩm trong danh sách có tồn tại hay không
        if (foundProducts.length !== products.length) {
            res.status(404).json({ message: 'Một hoặc nhiều sản phẩm không tồn tại' });
        } else {
            // Tìm địa chỉ theo ID
            const address = await Address.findById(address_id);

            if (!address) {
                res.status(404).json({ message: 'Địa chỉ không tồn tại' });
            } else {
                // Tạo danh sách sản phẩm và số lượng tương ứng
                const orderedProducts = products.map(item => {
                    const foundProduct = foundProducts.find(product => product._id.equals(item.product_id));
                    return { product: foundProduct._id, quantity: item.quantity };
                });

                // Tạo đơn hàng mới
                const order = new Order({
                    customer_email,
                    products: orderedProducts,
                    addresses: [{
                        address_id,
                        address: address.address,
                        name: address.name,
                        phone: address.phone
                    }]
                });

                await order.save();
                res.json(order);
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Lấy toàn bộ đơn hàng
app.get('/order', async (req, res) => {
    try {
        // Tìm tất cả các đơn hàng trong cơ sở dữ liệu
        const orders = await Order.find();

        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Top sản phẩm bán chạy
app.get('/top-selling', async (req, res) => {
    try {
        // Sử dụng aggregation để tính toán top sản phẩm bán chạy
        const topSellingProducts = await Order.aggregate([
            { $unwind: '$products' },
            { $group: { _id: '$products.product', totalQuantity: { $sum: '$products.quantity' } } },
            { $sort: { totalQuantity: -1 } },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
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
        res.status(500).json({ message: error.message });
    }
});


// Đăng nhập
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Tìm người dùng với username được cung cấp
        const user = await User.findOne({ username });

        if (!user) {
            // Người dùng không tồn tại
            res.status(404).json({ message: 'Tài khoản không tồn tại' });
        } else {
            // Kiểm tra mật khẩu
            const isPasswordMatch = await bcrypt.compare(password, user.password);

            if (!isPasswordMatch) {
                // Sai mật khẩu
                res.status(401).json({ message: 'Sai mật khẩu' });
            } else {
                // Đăng nhập thành công, tạo token và cập nhật token cho user
                const token = jwt.sign({ userId: user._id }, 'your-secret-key');

                await User.updateOne({ username: username }, {
                    tokens: token
                });

                // Trả về token cho client
                res.json({ token });
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Đăng xuất
app.post('/logout', auth, async (req, res) => {
    try {
        // Xử lý quá trình logout (ví dụ: xóa token, vô hiệu hóa phiên đăng nhập, vv.)
        // Đối với ví dụ này, chúng ta có thể xóa token khỏi danh sách token hiệu lực của người dùng

        req.user.tokens = req.user.tokens.filter(token => token !== req.token);
        await req.user.save();

        res.sendStatus(200);
    } catch (error) {
        
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

// Đăng ký
app.post('/register', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Kiểm tra xem username đã tồn tại hay chưa
        const existingUser = await User.findOne({ username });

        if (existingUser) {
            // Username đã tồn tại
            res.status(409).json({ message: 'Username đã tồn tại' });
        } else {
            // Mã hóa mật khẩu
            const hashedPassword = await bcrypt.hash(password, 10);

            // Tạo người dùng mới
            const user = new User({
                username,
                password: hashedPassword
            });

            // Lưu người dùng vào cơ sở dữ liệu
            await user.save();

            res.sendStatus(201);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Đổi mật khẩu
app.post('/changepassword', async (req, res) => {
    const { username, oldPassword, newPassword } = req.body;

    try {
        // Tìm người dùng với username được cung cấp
        const user = await User.findOne({ username });

        if (!user) {
            // Người dùng không tồn tại
            res.status(404).json({ message: 'Tài khoản không tồn tại' });
        } else {
            // Kiểm tra mật khẩu cũ
            const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

            if (!isPasswordMatch) {
                // Sai mật khẩu cũ
                res.status(401).json({ message: 'Sai mật khẩu cũ' });
            } else {
                // Mã hóa mật khẩu mới
                const hashedPassword = await bcrypt.hash(newPassword, 10);

                // Cập nhật mật khẩu mới cho người dùng
                user.password = hashedPassword;
                await user.save();

                res.sendStatus(200);
            }
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// lấy toàn bộ user
app.get('/user', async (req, res) => {
    try {
        const u = await User.find();
        res.json(u);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Thêm địa chỉ
app.post('/address/add', async (req, res) => {
    const { name, phone, address } = req.body;

    const add = new Address({
        name,
        phone,
        address
    });

    try {
        await add.save();
        res.json(add);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// lấy toàn bộ địa chỉ
app.get('/address', async (req, res) => {
    try {
        const add = await Address.find();
        res.json(add);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// Định nghĩa endpoint để sửa địa chỉ
app.put('/address/edit/:id', async (req, res) => {
    const id = req.params.id;
    const { name, phone, address } = req.body;

    try {
        await Address.updateOne({ _id: id }, {
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
        await Address.deleteOne({ _id: id });
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
            res.status(404).json({ message: 'Địa chỉ không tồn tại' });
        } else {
            res.json(add);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});


// sửa trang cá nhân
app.put('/profile/edit', async (req, res) => {
    const { user, fullname, gender, avatar, birthday } = req.body;

    try {
        const u = await User.findById(user);

        if (!u) {
            res.status(404).json({ message: 'Tài khoản không tồn tại' });
        } else {
            pro = new Profile({
                user: user,
                fullname: fullname,
                gender: gender,
                avatar: avatar,
                birthday: birthday
            });

            await pro.save();
            res.json(pro);
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//Tìm kiếm sản phẩm theo tiêu đề
app.get('/products/search', async (req, res) => {
    const { title } = req.body;
  
    try {
      const searchString = String(title);
      const products = await Product.find({ product_title: { $regex: searchString, $options: 'i' } });
      res.json(products);
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: error.message });
    }
  });

module.exports = app;