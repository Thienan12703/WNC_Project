import { Link } from 'react-router-dom';
import { ArrowRight, Zap, Shield, Truck, ShoppingCart } from 'lucide-react';
import { useEffect, useState, useMemo } from 'react';
import axiosClient from '../api/axiosClient';
import useCartStore from '../stores/cartStore';
import { toast } from '../components/ToastProvider';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [currentBanner, setCurrentBanner] = useState(0);
    const addToCart = useCartStore(state => state.addToCart);

    const shuttlecocks = useMemo(() => {
        const items = [];
        for (let i = 0; i < 25; i++) {
            // Left side
            items.push({
                id: `left-${i}`,
                side: 'left',
                pos: Math.random() * 15,
                width: Math.random() * 2 + 1.5,
                delay: Math.random() * -20,
                duration: Math.random() * 12 + 8,
                color: i % 3 === 0 ? '39ff14' : '9ca3af',
                alpha: Math.floor(Math.random() * 50 + 30),
            });
            // Right side
            items.push({
                id: `right-${i}`,
                side: 'right',
                pos: Math.random() * 15,
                width: Math.random() * 2 + 1.5,
                delay: Math.random() * -20,
                duration: Math.random() * 12 + 8,
                color: i % 3 === 0 ? '39ff14' : '9ca3af',
                alpha: Math.floor(Math.random() * 50 + 30),
            });
        }
        return items;
    }, []);

    useEffect(() => {
        const fetchFeatured = async () => {
            try {
                const { data } = await axiosClient.get('/api/products?keyword=');
                setFeaturedProducts(data.slice(0, 4));
            } catch (err) {
                console.error(err);
            }
        };
        const fetchBanners = async () => {
            try {
                const { data } = await axiosClient.get('/api/banners');
                if (data.length > 0) setBanners(data);
            } catch (err) {
                console.error(err);
            }
        };
        fetchFeatured();
        fetchBanners();
    }, []);

    useEffect(() => {
        if (banners.length > 1) {
            const interval = setInterval(() => {
                setCurrentBanner((prev) => (prev + 1) % banners.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [banners]);

    return (
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
            {/* Background Floating/Falling Elements */}
            <div className="fixed inset-0 pointer-events-none z-[-1]">
                <div className="absolute top-1/4 left-5 w-32 h-32 bg-primary/10 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute top-2/3 right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl animate-bounce"></div>
                {/* Falling shuttlecocks generated randomly */}
                {shuttlecocks.map((item) => (
                    <img 
                        key={item.id}
                        src={`https://api.iconify.design/mdi:badminton.svg?color=%23${item.color}${item.alpha}`} 
                        alt="shuttlecock" 
                        className="absolute top-[-10%] drop-shadow-lg animate-fall" 
                        style={{ 
                            [item.side]: `${item.pos}%`,
                            width: `${item.width}rem`,
                            animationDelay: `${item.delay}s`, 
                            animationDuration: `${item.duration}s` 
                        }} 
                    />
                ))}
            </div>

            {/* Hero Section / Banner Slider */}
            <section className="relative bg-surface-dark text-white overflow-hidden py-20 lg:py-32 rounded-3xl mt-4 min-h-[500px]">
                {banners.length > 0 ? (
                    banners.map((banner, index) => (
                        <div 
                            key={banner._id} 
                            className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBanner ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <div className="absolute inset-0 opacity-40">
                                <img src={banner.image} alt={banner.title1} className="w-full h-full object-cover" />
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/90 to-transparent"></div>
                            
                            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10 h-full flex flex-col justify-center py-20 lg:py-32">
                                <div className="max-w-2xl transform transition-transform duration-700 translate-y-0">
                                    <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-4 uppercase leading-tight">
                                        {banner.title1}
                                    </h1>
                                    <h2 className="text-4xl md:text-5xl text-primary font-bold italic mb-6 uppercase text-shadow-neon">
                                        {banner.title2}
                                    </h2>
                                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                        <Link to="/products" className="bg-primary text-black font-bold px-8 py-4 rounded-full hover:bg-primary-light hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                                            Mua Sắm Ngay <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    // Fallback static banner
                    <>
                        <div className="absolute inset-0 opacity-20">
                            <img src="https://images.unsplash.com/photo-1622279457486-640c4cb71653?w=1600&q=80" alt="Badminton Background" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/90 to-transparent"></div>
                        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 z-10">
                            <div className="max-w-2xl">
                                <h1 className="text-5xl md:text-7xl font-black italic tracking-tighter mb-6 uppercase leading-tight">
                                    Sức Mạnh <span className="text-primary block text-shadow-neon">Đỉnh Cao</span>
                                </h1>
                                <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                                    Trang bị cho mình những dụng cụ cầu lông chuyên nghiệp nhất. Bước ra sân với phong thái của nhà vô địch.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Link to="/products" className="bg-primary text-black font-bold px-8 py-4 rounded-full hover:bg-primary-light hover:shadow-[0_0_20px_rgba(57,255,20,0.4)] transition-all flex items-center justify-center gap-2 uppercase tracking-wide">
                                        Mua Sắm Ngay <ArrowRight size={20} />
                                    </Link>
                                    <Link to="/products?category=vot-cau-long" className="bg-transparent border-2 border-white text-white font-bold px-8 py-4 rounded-full hover:bg-white hover:text-black transition-all flex items-center justify-center uppercase tracking-wide">
                                        Khám phá Vợt
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                )}
                
                {/* Banner Indicators */}
                {banners.length > 1 && (
                    <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                        {banners.map((_, idx) => (
                            <button 
                                key={idx} 
                                onClick={() => setCurrentBanner(idx)}
                                className={`w-3 h-3 rounded-full transition-colors ${idx === currentBanner ? 'bg-primary' : 'bg-gray-400'}`}
                            ></button>
                        ))}
                    </div>
                )}
            </section>

            {/* Features */}
            <section className="py-12 border-b border-gray-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="flex items-center gap-4 p-4 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center shrink-0">
                            <Zap size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Hiệu Suất Tối Đa</h3>
                            <p className="text-gray-500 text-sm">Sản phẩm chính hãng chất lượng cao</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center shrink-0">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Bảo Hành Uy Tín</h3>
                            <p className="text-gray-500 text-sm">Cam kết đổi trả trong 30 ngày</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 p-4 hover:-translate-y-1 transition-transform">
                        <div className="w-12 h-12 bg-gray-100 text-gray-900 rounded-full flex items-center justify-center shrink-0">
                            <Truck size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Giao Hàng Siêu Tốc</h3>
                            <p className="text-gray-500 text-sm">Miễn phí ship đơn từ 1.000.000đ</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-16 bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 rounded-3xl mb-12 relative z-10">
                <div className="flex justify-between items-end mb-10">
                    <div>
                        <h2 className="text-3xl font-black uppercase italic tracking-wide">Sản Phẩm Nổi Bật</h2>
                        <div className="w-20 h-1 bg-primary mt-2"></div>
                    </div>
                    <Link to="/products" className="text-gray-900 font-bold hover:text-primary transition-colors flex items-center gap-1">
                        Tất cả <ArrowRight size={18} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                    {featuredProducts.map((product) => (
                        <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col">
                            <Link to={`/products/${product._id}`} className="block relative h-56 overflow-hidden bg-gray-100">
                                <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                                {product.isFeatured && (
                                    <span className="absolute top-3 left-3 bg-black text-primary text-xs font-bold px-2 py-1 uppercase tracking-wider rounded">HOT</span>
                                )}
                            </Link>
                            <div className="p-5 flex flex-col flex-1">
                                <span className="text-xs text-gray-500 uppercase font-semibold tracking-wider">{product.brand}</span>
                                <Link to={`/products/${product._id}`}>
                                    <h3 className="font-bold text-gray-900 mt-1 mb-2 line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                </Link>
                                <div className="mt-auto pt-4 flex flex-col gap-3">
                                    <span className="text-lg font-black text-surface-dark">{product.price.toLocaleString('vi-VN')}₫</span>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button onClick={(e) => { e.preventDefault(); addToCart(product); toast.success('Đã thêm vào giỏ hàng! 🛒'); }} className="bg-gray-100 text-gray-900 flex items-center justify-center py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors text-xs">
                                            <ShoppingCart size={14} className="mr-1" /> Giỏ
                                        </button>
                                        <Link to="/cart" onClick={() => addToCart(product)} className="bg-primary text-black flex items-center justify-center py-2 rounded-lg font-bold hover:bg-[#2ae012] transition-colors text-xs">
                                            Mua ngay
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default Home;
