import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';

const OrderTracking = () => {
    const [orderCode, setOrderCode] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (orderCode.trim()) {
            navigate(`/track/${orderCode.trim()}`);
        }
    };

    return (
        <div className="py-20 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-3xl font-black italic tracking-wide uppercase mb-4">Tra cứu đơn hàng</h1>
            <p className="text-gray-500 mb-8">Vui lòng nhập mã vận đơn (VD: BDM-123456) để xem tình trạng đơn hàng của bạn.</p>
            
            <form onSubmit={handleSearch} className="relative max-w-lg mx-auto">
                <input 
                    type="text" 
                    value={orderCode}
                    onChange={(e) => setOrderCode(e.target.value)}
                    placeholder="Nhập mã đơn hàng..." 
                    className="w-full pl-6 pr-14 py-4 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-primary shadow-sm text-lg uppercase transition-all"
                    required
                />
                <button type="submit" className="absolute right-2 top-2 bottom-2 bg-surface-dark text-white rounded-full w-12 flex items-center justify-center hover:bg-primary hover:text-black transition-colors">
                    <Search size={20} />
                </button>
            </form>
        </div>
    );
};

export default OrderTracking;
