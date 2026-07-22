import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Clock, Truck, XCircle, Package, ArrowLeft, Download, MapPin, Phone, User, CreditCard } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const statusColors = {
    'Chờ xử lý': 'bg-amber-100 text-amber-700 border-amber-200',
    'Đang giao': 'bg-blue-100 text-blue-700 border-blue-200',
    'Hoàn thành': 'bg-emerald-100 text-emerald-700 border-emerald-200',
    'Đã hủy': 'bg-red-100 text-red-700 border-red-200'
};

const statusIcons = {
    'Chờ xử lý': <Clock size={18} />,
    'Đang giao': <Truck size={18} />,
    'Hoàn thành': <CheckCircle2 size={18} />,
    'Đã hủy': <XCircle size={18} />
};

const OrderDetail = () => {
    const { id, orderCode } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const url = orderCode ? `/api/orders/track/${orderCode}` : `/api/orders/${id}`;
                const { data } = await axiosClient.get(url);
                setOrder(data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, orderCode]);

    if (loading) {
        return (
            <div className="py-20 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        );
    }
    
    if (error || !order) {
        return (
            <div className="py-20 text-center max-w-lg mx-auto">
                <div className="bg-red-50 text-red-600 p-6 rounded-2xl border border-red-100 mb-6">
                    <XCircle size={48} className="mx-auto mb-4" />
                    <h2 className="text-xl font-bold mb-2">Không tìm thấy đơn hàng</h2>
                    <p>{error || 'Mã đơn hàng không hợp lệ hoặc đã bị xóa.'}</p>
                </div>
                <Link to="/" className="inline-flex items-center text-surface-dark font-bold hover:text-primary transition-colors">
                    <ArrowLeft size={20} className="mr-2" /> Về trang chủ
                </Link>
            </div>
        );
    }

    const subtotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <div className="py-12 bg-gray-50 min-h-screen">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-black italic tracking-wide uppercase mb-1">Chi tiết đơn hàng</h1>
                        <p className="text-gray-500 font-medium">Mã vận đơn: <span className="text-primary font-bold">{order.orderCode}</span></p>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full font-bold border ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                            {statusIcons[order.status]} {order.status}
                        </span>
                    </div>
                </div>

                {/* Main Invoice Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden">
                    
                    {/* Top Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 border-b border-gray-100">
                        <div className="p-8 border-b md:border-b-0 md:border-r border-gray-100">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <User size={16} /> Thông tin người nhận
                            </h2>
                            <div className="space-y-3">
                                <p className="font-bold text-lg text-gray-900">{order.shippingAddress.fullName}</p>
                                <p className="text-gray-600 flex items-center gap-2"><Phone size={16} className="text-gray-400" /> {order.shippingAddress.phone}</p>
                                {order.shippingAddress.email && (
                                    <p className="text-gray-600 flex items-center gap-2">✉ {order.shippingAddress.email}</p>
                                )}
                                <p className="text-gray-600 flex items-start gap-2">
                                    <MapPin size={16} className="text-gray-400 mt-1 shrink-0" /> 
                                    <span>{order.shippingAddress.address}</span>
                                </p>
                            </div>
                        </div>
                        <div className="p-8">
                            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                <CreditCard size={16} /> Thông tin thanh toán
                            </h2>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Phương thức</p>
                                    <p className="font-bold text-gray-900">{order.paymentMethod}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Tình trạng</p>
                                    <p className={`font-bold inline-flex px-2 py-1 rounded text-xs ${order.paymentStatus === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                        {order.paymentStatus === 'Paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Ngày đặt</p>
                                    <p className="font-medium text-gray-900">{new Date(order.createdAt).toLocaleString('vi-VN')}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Products List */}
                    <div className="p-8 bg-gray-50/50">
                        <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-6 flex items-center gap-2">
                            <Package size={16} /> Sản phẩm đã mua
                        </h2>
                        
                        <div className="space-y-4">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                                    <div className="w-20 h-20 bg-gray-50 rounded-xl border border-gray-100 overflow-hidden shrink-0">
                                        {item.product?.image ? (
                                            <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover mix-blend-multiply" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-gray-300">
                                                <Package size={24} />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 text-center sm:text-left">
                                        <h3 className="font-bold text-gray-900 text-lg mb-1">{item.product?.name || 'Sản phẩm không tồn tại'}</h3>
                                        <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">{item.product?.brand}</p>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Đơn giá</p>
                                            <p className="font-bold text-gray-900">{item.price.toLocaleString('vi-VN')}₫</p>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">SL</p>
                                            <p className="font-bold text-gray-900 text-lg">x{item.quantity}</p>
                                        </div>
                                        <div className="text-center min-w-[100px]">
                                            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Thành tiền</p>
                                            <p className="font-black text-primary text-lg">{(item.price * item.quantity).toLocaleString('vi-VN')}₫</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Summary Section */}
                    <div className="p-8 border-t border-gray-100">
                        <div className="max-w-xs ml-auto space-y-3">
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Tạm tính</span>
                                <span className="font-medium text-gray-900">{subtotal.toLocaleString('vi-VN')}₫</span>
                            </div>
                            <div className="flex justify-between items-center text-gray-500">
                                <span>Phí vận chuyển</span>
                                <span className="font-medium text-gray-900">Miễn phí</span>
                            </div>
                            {order.discountAmount > 0 && (
                                <div className="flex justify-between items-center text-primary font-bold">
                                    <span>Giảm giá</span>
                                    <span>-{order.discountAmount.toLocaleString('vi-VN')}₫</span>
                                </div>
                            )}
                            <div className="border-t border-gray-200 pt-3 mt-3 flex justify-between items-center">
                                <span className="text-lg font-bold text-gray-900 uppercase">Tổng cộng</span>
                                <span className="text-3xl font-black text-primary drop-shadow-[0_2px_4px_rgba(57,255,20,0.2)]">
                                    {order.totalPrice.toLocaleString('vi-VN')}₫
                                </span>
                            </div>
                        </div>
                    </div>
                    
                </div>
                
                {/* Actions */}
                <div className="mt-8 flex justify-center gap-4">
                    <Link to="/products" className="px-6 py-3 bg-white border border-gray-200 text-gray-700 font-bold rounded-xl hover:bg-gray-50 transition-colors shadow-sm">
                        Tiếp tục mua sắm
                    </Link>
                    <button onClick={() => window.print()} className="px-6 py-3 bg-surface-dark text-white font-bold rounded-xl hover:bg-black transition-colors shadow-sm flex items-center gap-2">
                        <Download size={18} /> In hóa đơn
                    </button>
                </div>

            </div>
        </div>
    );
};

export default OrderDetail;
