import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AdminCoupons = () => {
    const [coupons, setCoupons] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ code: '', discountPercentage: 10, expiryDate: '', isActive: true });
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchCoupons();
    }, []);

    const fetchCoupons = async () => {
        try {
            const { data } = await axiosClient.get('/api/coupons');
            setCoupons(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi tải coupons');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/api/coupons/${editingId}`, formData);
            } else {
                await axiosClient.post('/api/coupons', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchCoupons();
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi lưu coupon');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá mã này?')) {
            try {
                await axiosClient.delete(`/api/coupons/${id}`);
                fetchCoupons();
            } catch (error) {
                alert('Lỗi xoá coupon');
            }
        }
    };

    const openEdit = (coupon) => {
        const date = new Date(coupon.expiryDate).toISOString().split('T')[0];
        setFormData({ code: coupon.code, discountPercentage: coupon.discountPercentage, expiryDate: date, isActive: coupon.isActive });
        setEditingId(coupon._id);
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setFormData({ code: '', discountPercentage: 10, expiryDate: '', isActive: true });
        setEditingId(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Mã Giảm Giá</h1>
                <button onClick={openAdd} className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center">
                    <Plus size={20} className="mr-2" /> Thêm Mã
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold">Mã</th>
                            <th className="p-4 font-semibold">Phần trăm giảm</th>
                            <th className="p-4 font-semibold">Ngày hết hạn</th>
                            <th className="p-4 font-semibold">Trạng thái</th>
                            <th className="p-4 font-semibold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {coupons.map(c => (
                            <tr key={c._id} className="hover:bg-gray-50">
                                <td className="p-4 font-bold text-lg">{c.code}</td>
                                <td className="p-4 text-primary font-bold">{c.discountPercentage}%</td>
                                <td className="p-4">{new Date(c.expiryDate).toLocaleDateString('vi-VN')}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${c.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {c.isActive ? 'Đang bật' : 'Đã tắt'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => openEdit(c)} className="text-blue-500 hover:text-blue-700 mr-3"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(c._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden">
                        <div className="flex justify-between items-center p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold">{editingId ? 'Sửa Mã' : 'Thêm Mã'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Mã giảm giá (Code)</label>
                                    <input type="text" required value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} className="w-full border rounded-lg p-2" placeholder="VD: TET2024" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Mức giảm (%)</label>
                                    <input type="number" required min="1" max="100" value={formData.discountPercentage} onChange={e => setFormData({...formData, discountPercentage: e.target.value})} className="w-full border rounded-lg p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Ngày hết hạn</label>
                                    <input type="date" required value={formData.expiryDate} onChange={e => setFormData({...formData, expiryDate: e.target.value})} className="w-full border rounded-lg p-2" />
                                </div>
                                <div className="flex items-center mt-4">
                                    <input type="checkbox" id="isActiveC" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-2" />
                                    <label htmlFor="isActiveC" className="text-sm font-semibold">Hoạt động</label>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end gap-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 bg-gray-100 rounded-lg">Hủy</button>
                                <button type="submit" className="px-6 py-2 bg-primary font-bold rounded-lg">{editingId ? 'Cập nhật' : 'Thêm'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default AdminCoupons;
