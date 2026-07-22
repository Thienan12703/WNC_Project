import { useState, useEffect, useRef } from 'react';
import { Plus, Edit2, Trash2, X, Image as ImageIcon } from 'lucide-react';
import axiosClient from '../api/axiosClient';

const AdminBanners = () => {
    const [banners, setBanners] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ title1: '', title2: '', image: '', isActive: true });
    const [editingId, setEditingId] = useState(null);
    const fileInputRef = useRef(null);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const { data } = await axiosClient.get('/api/banners/admin');
            setBanners(data);
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi tải banners');
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const form = new FormData();
        form.append('images', file); // using existing upload array for banners
        setUploading(true);
        try {
            const { data } = await axiosClient.post('/api/upload', form, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setFormData({ ...formData, image: data.paths[0] });
        } catch (error) {
            alert('Lỗi tải ảnh');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axiosClient.put(`/api/banners/${editingId}`, formData);
            } else {
                await axiosClient.post('/api/banners', formData);
            }
            setIsModalOpen(false);
            setEditingId(null);
            fetchBanners();
        } catch (error) {
            alert(error.response?.data?.message || 'Lỗi lưu banner');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xoá banner này?')) {
            try {
                await axiosClient.delete(`/api/banners/${id}`);
                fetchBanners();
            } catch (error) {
                alert('Lỗi xoá banner');
            }
        }
    };

    const openEdit = (banner) => {
        setFormData({ title1: banner.title1, title2: banner.title2, image: banner.image, isActive: banner.isActive });
        setEditingId(banner._id);
        setIsModalOpen(true);
    };

    const openAdd = () => {
        setFormData({ title1: '', title2: '', image: '', isActive: true });
        setEditingId(null);
        setIsModalOpen(true);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Quản lý Banners</h1>
                <button onClick={openAdd} className="bg-primary text-black px-4 py-2 rounded-lg font-bold flex items-center">
                    <Plus size={20} className="mr-2" /> Thêm Banner
                </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-100">
                        <tr>
                            <th className="p-4 font-semibold">Hình ảnh</th>
                            <th className="p-4 font-semibold">Tiêu đề 1</th>
                            <th className="p-4 font-semibold">Tiêu đề 2</th>
                            <th className="p-4 font-semibold">Trạng thái</th>
                            <th className="p-4 font-semibold text-right">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {banners.map(banner => (
                            <tr key={banner._id} className="hover:bg-gray-50">
                                <td className="p-4">
                                    <img src={banner.image} alt={banner.title1} className="w-32 h-16 object-cover rounded" />
                                </td>
                                <td className="p-4">{banner.title1}</td>
                                <td className="p-4">{banner.title2}</td>
                                <td className="p-4">
                                    <span className={`px-2 py-1 rounded text-xs font-bold ${banner.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                        {banner.isActive ? 'Đang bật' : 'Đã tắt'}
                                    </span>
                                </td>
                                <td className="p-4 text-right">
                                    <button onClick={() => openEdit(banner)} className="text-blue-500 hover:text-blue-700 mr-3"><Edit2 size={18} /></button>
                                    <button onClick={() => handleDelete(banner._id)} className="text-red-500 hover:text-red-700"><Trash2 size={18} /></button>
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
                            <h2 className="text-xl font-bold">{editingId ? 'Sửa Banner' : 'Thêm Banner'}</h2>
                            <button onClick={() => setIsModalOpen(false)}><X size={24} /></button>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Tiêu đề 1 (Header 1)</label>
                                    <input type="text" required value={formData.title1} onChange={e => setFormData({...formData, title1: e.target.value})} className="w-full border rounded-lg p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Tiêu đề 2 (Header 2)</label>
                                    <input type="text" required value={formData.title2} onChange={e => setFormData({...formData, title2: e.target.value})} className="w-full border rounded-lg p-2" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold mb-1">Hình ảnh</label>
                                    <div className="flex gap-2">
                                        <input type="text" required value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 border rounded-lg p-2" placeholder="URL hoặc tải lên" />
                                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleUpload} />
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="bg-gray-100 px-4 rounded-lg flex items-center justify-center hover:bg-gray-200">
                                            {uploading ? '...' : <ImageIcon size={20} />}
                                        </button>
                                    </div>
                                    {formData.image && <img src={formData.image} alt="preview" className="mt-2 h-20 object-cover rounded" />}
                                </div>
                                <div className="flex items-center">
                                    <input type="checkbox" id="isActive" checked={formData.isActive} onChange={e => setFormData({...formData, isActive: e.target.checked})} className="mr-2" />
                                    <label htmlFor="isActive" className="text-sm font-semibold">Hiển thị (Active)</label>
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
export default AdminBanners;
