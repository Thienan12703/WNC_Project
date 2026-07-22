import { useEffect, useState, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Filter, ChevronLeft, ChevronRight, ShoppingCart, Zap } from 'lucide-react';
import axiosClient from '../api/axiosClient';
import useCartStore from '../stores/cartStore';
import { toast } from '../components/ToastProvider';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryFilter, setCategoryFilter] = useState('');
    const [brandFilter, setBrandFilter] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    
    const location = useLocation();
    const navigate = useNavigate();
    const addToCart = useCartStore(state => state.addToCart);

    // client-side pagination
    const [page, setPage] = useState(1);
    const pageSize = 12;

    const uniqueBrands = useMemo(() => {
        const brands = products.map(p => p.brand).filter(Boolean);
        return [...new Set(brands)];
    }, [products]);

    const fetchProducts = async (paramsObj = {}) => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (paramsObj.category) params.append('category', paramsObj.category);
            if (paramsObj.brand) params.append('brand', paramsObj.brand);
            if (paramsObj.minPrice) params.append('minPrice', paramsObj.minPrice);
            if (paramsObj.maxPrice) params.append('maxPrice', paramsObj.maxPrice);
            if (paramsObj.keyword) params.append('keyword', paramsObj.keyword);

            const [productsRes, categoriesRes] = await Promise.all([
                axiosClient.get(`/api/products?${params.toString()}`),
                axiosClient.get('/api/categories'),
            ]);
            
            setProducts(productsRes.data);
            setCategories(categoriesRes.data);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const queryParams = new URLSearchParams(location.search);
        const searchCategory = queryParams.get('category') || '';
        const searchKeyword = queryParams.get('keyword') || '';
        
        if (searchCategory) setCategoryFilter(searchCategory);

        fetchProducts({ category: searchCategory, keyword: searchKeyword });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.search]);

    const handleSearch = async (e) => {
        e.preventDefault();
        setPage(1);
        const queryParams = new URLSearchParams(location.search);
        const searchKeyword = queryParams.get('keyword') || '';
        fetchProducts({
            category: categoryFilter,
            brand: brandFilter,
            minPrice,
            maxPrice,
            keyword: searchKeyword
        });
    };

    const handleAddToCart = (e, product) => {
        e.preventDefault();
        addToCart(product);
        toast.success('Đã thêm vào giỏ hàng! 🛒');
    };

    const handleBuyNow = (e, product) => {
        e.preventDefault();
        addToCart(product);
        navigate('/cart');
    };

    const totalPages = Math.max(1, Math.ceil(products.length / pageSize));
    const paginated = products.slice((page - 1) * pageSize, page * pageSize);

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar Filter */}
                <aside className="w-full md:w-64 shrink-0">
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="flex items-center gap-2 mb-6 text-gray-900 font-bold uppercase tracking-wider text-lg">
                            <Filter size={20} /> Bộ Lọc
                        </div>

                        <form onSubmit={handleSearch}>
                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Danh mục</label>
                                <div className="space-y-2">
                                    <div className="flex items-center">
                                        <input
                                            type="radio"
                                            id="cat-all"
                                            name="category"
                                            checked={categoryFilter === ''}
                                            onChange={() => setCategoryFilter('')}
                                            className="text-primary focus:ring-primary h-4 w-4 border-gray-300"
                                        />
                                        <label htmlFor="cat-all" className="ml-2 text-sm text-gray-600">Tất cả</label>
                                    </div>
                                    {categories.map((cat) => (
                                        <div key={cat._id} className="flex items-center">
                                            <input
                                                type="radio"
                                                id={`cat-${cat._id}`}
                                                name="category"
                                                checked={categoryFilter === cat._id || categoryFilter === cat.slug}
                                                onChange={() => setCategoryFilter(cat._id)}
                                                className="text-primary focus:ring-primary h-4 w-4 border-gray-300"
                                            />
                                            <label htmlFor={`cat-${cat._id}`} className="ml-2 text-sm text-gray-600">{cat.name}</label>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {uniqueBrands.length > 0 && (
                                <div className="mb-6">
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">Thương hiệu</label>
                                    <select 
                                        value={brandFilter} 
                                        onChange={(e) => setBrandFilter(e.target.value)}
                                        className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
                                    >
                                        <option value="">Tất cả thương hiệu</option>
                                        {uniqueBrands.map(b => (
                                            <option key={b} value={b}>{b}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="mb-6">
                                <label className="block text-sm font-semibold text-gray-700 mb-2">Mức giá</label>
                                <div className="flex items-center gap-2">
                                    <input 
                                        type="number" 
                                        value={minPrice} 
                                        onChange={(e) => setMinPrice(e.target.value)}
                                        placeholder="Từ 0"
                                        className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
                                    />
                                    <span>-</span>
                                    <input 
                                        type="number" 
                                        value={maxPrice} 
                                        onChange={(e) => setMaxPrice(e.target.value)}
                                        placeholder="Đến..."
                                        className="w-full border border-gray-200 rounded-lg p-2 text-sm outline-none"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full bg-surface-dark text-white font-bold uppercase tracking-wide py-3 rounded-lg hover:bg-black transition-colors">
                                Áp dụng lọc
                            </button>
                        </form>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-black italic tracking-wide uppercase">Danh Sách Sản Phẩm</h1>
                        <div className="text-sm text-gray-500 font-medium">Hiển thị {products.length} kết quả</div>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {Array.from({ length: 6 }).map((_, i) => (
                                <div key={i} className="animate-pulse bg-white rounded-2xl p-4 border border-gray-100">
                                    <div className="h-48 bg-gray-200 rounded-xl mb-4" />
                                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                                </div>
                            ))}
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 text-red-600 p-4 rounded-lg font-medium">{error}</div>
                    ) : products.length === 0 ? (
                        <div className="bg-gray-50 text-center py-16 rounded-2xl border border-dashed border-gray-200">
                            <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy sản phẩm</h3>
                            <p className="text-gray-500">Vui lòng thử điều chỉnh bộ lọc của bạn.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {paginated.map((product) => (
                                    <div key={product._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-lg transition-all duration-300 relative flex flex-col">
                                        <Link to={`/products/${product._id}`} className="block relative h-60 overflow-hidden bg-gray-100">
                                            <img src={product.image || product.images?.[0]} alt={product.name} className="w-full h-full object-cover mix-blend-multiply group-hover:scale-110 transition-transform duration-700" />
                                            {product.isFeatured && (
                                                <span className="absolute top-3 left-3 bg-black text-primary text-xs font-bold px-2 py-1 uppercase tracking-wider rounded z-10">HOT</span>
                                            )}
                                        </Link>
                                        <div className="p-5 flex-1 flex flex-col">
                                            <div className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">{product.brand}</div>
                                            <Link to={`/products/${product._id}`}>
                                                <h3 className="font-bold text-gray-900 text-lg line-clamp-1 group-hover:text-primary transition-colors">{product.name}</h3>
                                            </Link>
                                            <div className="mt-auto pt-4 flex flex-col gap-3">
                                                <span className="text-xl font-black text-surface-dark">{product.price.toLocaleString('vi-VN')}₫</span>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <button onClick={(e) => handleAddToCart(e, product)} className="bg-gray-100 text-gray-900 flex items-center justify-center py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors text-sm">
                                                        <ShoppingCart size={16} className="mr-1" /> Giỏ hàng
                                                    </button>
                                                    <button onClick={(e) => handleBuyNow(e, product)} className="bg-primary text-black flex items-center justify-center py-2 rounded-lg font-bold hover:bg-[#2ae012] transition-colors text-sm">
                                                        <Zap size={16} className="mr-1" /> Mua ngay
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 1 && (
                                <div className="mt-12 flex items-center justify-center gap-2">
                                    <button onClick={() => setPage((p) => Math.max(1, p - 1))} className={`p-2 rounded-lg flex items-center justify-center transition-colors ${page === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`} disabled={page === 1}>
                                        <ChevronLeft size={20} />
                                    </button>
                                    
                                    <div className="flex items-center gap-1">
                                        {Array.from({ length: totalPages }).map((_, i) => (
                                            <button 
                                                key={i} 
                                                onClick={() => setPage(i + 1)}
                                                className={`w-10 h-10 rounded-lg font-bold flex items-center justify-center transition-colors ${page === i + 1 ? 'bg-surface-dark text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                                            >
                                                {i + 1}
                                            </button>
                                        ))}
                                    </div>

                                    <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} className={`p-2 rounded-lg flex items-center justify-center transition-colors ${page === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`} disabled={page === totalPages}>
                                        <ChevronRight size={20} />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProductList;
