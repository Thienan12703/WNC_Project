const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Category = require('./models/Category');
const Product = require('./models/Product');
const Post = require('./models/Post');

dotenv.config();

const adminEmail = 'admin@badminton.com';
const adminPassword = 'admin123';

const seedData = async () => {
  try {
    await connectDB();

    const hashedAdminPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await User.findOneAndUpdate(
      { email: adminEmail },
      {
        name: 'Admin',
        email: adminEmail,
        password: hashedAdminPassword,
        role: 'admin',
      },
      {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
      }
    );

    const categories = [
      {
        name: 'Vot Cau Long',
        slug: 'vot-cau-long',
        description: 'Vot cau long chat luong cao',
      },
      {
        name: 'Giay Cau Long',
        slug: 'giay-cau-long',
        description: 'Giay cau long chinh hang',
      },
      {
        name: 'Ao Cau Long',
        slug: 'ao-cau-long',
        description: 'Ao the thao thoang mat',
      },
      {
        name: 'Phu Kien',
        slug: 'phu-kien',
        description: 'Quan con, balo, tui xach',
      },
      {
        name: 'Tui Vot / Balo',
        slug: 'tui-vot-balo',
        description: 'Balo va tui vot',
      },
    ];

    const categoryDocs = {};

    for (const item of categories) {
      const doc = await Category.findOneAndUpdate(
        { slug: item.slug },
        item,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
      categoryDocs[item.slug] = doc;
    }

    const products = [
      {
        name: 'Vot Yonex Astrox 99 Pro',
        price: 3500000,
        image: 'https://images.unsplash.com/photo-1622279457486-640c4cb71653?w=800&q=80',
        brand: 'Yonex',
        category: categoryDocs['vot-cau-long']._id,
        description: 'Vot tan cong uy luc danh cho nguoi choi chuyen nghiep, phien ban Pro mang lai suc manh vuot troi.',
        stock: 15,
        isFeatured: true,
      },
      {
        name: 'Vot Lining Aeronaut 9000C',
        price: 3200000,
        image: 'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?w=800&q=80',
        brand: 'Lining',
        category: categoryDocs['vot-cau-long']._id,
        description: 'Su ket hop hoan hao giua tan cong va phong thu, cong nghe Aeronaut giam suc can khong khi.',
        stock: 10,
        isFeatured: true,
      },
      {
        name: 'Giay Victor SH-A920',
        price: 1800000,
        image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
        brand: 'Victor',
        category: categoryDocs['giay-cau-long']._id,
        description: 'Giay em, bam san tot cho moi van dong, cong nghe de ngoai sieu ben.',
        stock: 20,
        isFeatured: true,
      },
      {
        name: 'Giay Yonex Eclipsion Z3',
        price: 2400000,
        image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=800&q=80',
        brand: 'Yonex',
        category: categoryDocs['giay-cau-long']._id,
        description: 'De em, dan hoi tot, cong nghe Power Cushion+ mang lai su em ai va ben bi.',
        stock: 12,
        isFeatured: false,
      },
      {
        name: 'Ao Yonex Lee Chong Wei',
        price: 550000,
        image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800&q=80',
        brand: 'Yonex',
        category: categoryDocs['ao-cau-long']._id,
        description: 'Ao thi dau chuyen nghiep, tham hut mo hoi tot, thiet ke dam chat quyen luc.',
        stock: 50,
        isFeatured: true,
      },
      {
        name: 'Ao Lining Doi Tuyen TQ',
        price: 600000,
        image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
        brand: 'Lining',
        category: categoryDocs['ao-cau-long']._id,
        description: 'Chat lieu vai cao cap, co gian 4 chieu, thiet ke noi bat tren san.',
        stock: 45,
        isFeatured: false,
      },
      {
        name: 'Balo Yonex BA92012',
        price: 1200000,
        image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80',
        brand: 'Yonex',
        category: categoryDocs['phu-kien']._id,
        description: 'Balo chuyen dung, ngan chua vat dung va giay rieng biet, chong nuoc tot.',
        stock: 8,
        isFeatured: true,
      },
      {
        name: 'Quan con Yonex AC102',
        price: 45000,
        image: 'https://plus.unsplash.com/premium_photo-1663100659639-651c5187e59c?w=800&q=80',
        brand: 'Yonex',
        category: categoryDocs['phu-kien']._id,
        description: 'Quan con pho bien nhat the gioi, bam tay, tham mo hoi hieu qua.',
        stock: 100,
        isFeatured: false,
      },
      {
        name: 'Balo Lining Sport',
        price: 1300000,
        image: 'https://images.unsplash.com/photo-1517263904808-5dc0ba5f1a5c?w=800&q=80',
        brand: 'Lining',
        category: categoryDocs['tui-vot-balo']._id,
        description: 'Balo chiu luc cao, ngan rieng vat dung va giay, thiet ke thoi trang.',
        stock: 12,
        isFeatured: true,
      },
    ];

    for (const item of products) {
      await Product.findOneAndUpdate(
        { name: item.name },
        item,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const posts = [
      {
        title: 'Cach chon vot cau long phu hop cho nguoi moi bat dau',
        slug: 'cach-chon-vot-cau-long',
        content: '<p>Huong dan chi tiet ve viec lua chon vợt dua tren can nang, toc do swing va ngan sach.</p>',
        thumbnail: 'https://images.unsplash.com/photo-1509475826633-fed577a2c71b?w=800&q=80',
        author: admin._id,
      },
      {
        title: 'Top 5 mau giay cau long hot nhat mua 2024',
        slug: 'top-5-mau-giay-cau-long-2024',
        content: '<p>Danh sach cac mau giay duoc cac van dong vien chuyen nghiep uu chuong.</p>',
        thumbnail: 'https://images.unsplash.com/photo-1581291519185-ef11498d1cf9?w=800&q=80',
        author: admin._id,
      },
    ];

    for (const item of posts) {
      await Post.findOneAndUpdate(
        { slug: item.slug },
        item,
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    console.log('Seeding completed successfully. Admin account available with email admin@badminton.com and password admin123');
  } catch (error) {
    console.error(error);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
};

seedData();
