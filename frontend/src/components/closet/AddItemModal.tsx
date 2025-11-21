import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';
import { useWardrobe } from '../../contexts/WardrobeContext';

interface AddItemModalProps {
  onClose: () => void;
}

export function AddItemModal({ onClose }: AddItemModalProps) {
  const { addClothingItem } = useWardrobe();
  const [formData, setFormData] = useState({
    name: '',
    category: 'tops' as const,
    colour: '',
    brand: '',
    imagePath: '',
    season: ''
  });
  const [uploading, setUploading] = useState(false);

  const categories = [
    { value: 'tops', label: 'Tops' },
    { value: 'bottoms', label: 'Bottoms' },
    { value: 'shoes', label: 'Shoes' },
    { value: 'accessories', label: 'Accessories' },
    { value: 'outerwear', label: 'Outerwear' }
  ];

  const colors = [
    'black', 'white', 'gray', 'red', 'blue', 'green', 'yellow', 'orange',
    'purple', 'pink', 'brown', 'navy', 'beige', 'khaki'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.[0]) return;
    const file = e.target.files[0];

    const formDataUpload = new FormData();
    formDataUpload.append("file", file);

    setUploading(true);
    try {
      const res = await fetch("http://localhost:8080/api/images/upload", {
        method: "POST",
        body: formDataUpload,
      });
      if (!res.ok) throw new Error("Upload failed");

      const data = await res.json();
      setFormData(prev => ({ ...prev, imagePath: data.url }));
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.colour || !formData.imagePath) {
      alert('Please fill in all required fields');
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return alert("No logged-in user found!");

    const payload = { ...formData, season: formData.season || "summer", userId };

    try {
      await addClothingItem(payload);
      alert("Item added successfully!");
      onClose();
    } catch (err) {
      console.error(err);
      alert("Error adding item");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white shadow-2xl rounded-3xl max-w-lg w-full max-h-[90vh] overflow-y-auto border border-gray-100 animate-slideUp relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-900">Add New Item</h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-200/60 transition">
            <X className="w-6 h-6" />
          </button>
        </div>
        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Item Photo *</label>
            <div className="relative border-2 border-dashed border-indigo-300 rounded-xl px-6 py-8 text-center bg-indigo-50/60 hover:bg-indigo-100/60 transition flex flex-col items-center">
              {formData.imagePath ? (
                <div className="relative mx-auto">
                  <img src={formData.imagePath} alt="Preview" className="w-36 h-36 object-cover rounded-xl mx-auto shadow-md border-2 border-white" />
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, imagePath: '' }))}
                    className="absolute -top-2 -right-2 p-1 bg-white border border-red-200 text-red-600 rounded-full hover:bg-red-100 shadow transition"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center cursor-pointer w-full">
                  <Camera className="w-12 h-12 text-indigo-300 mb-3" />
                  <span className="text-gray-500 mb-2 text-sm">{uploading ? "Uploading..." : "Upload item photo"}</span>
                  <span className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-semibold shadow inline-block transition text-sm">
                    Choose file
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                  />
                </label>
              )}
            </div>
          </div>
          {/* Basic Information rows */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Item Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-gray-50 shadow-sm placeholder-gray-400"
                placeholder="e.g., Blue Denim Jacket"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Category *</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-gray-50 shadow-sm"
                required
              >
                {categories.map(c => (
                  <option key={c.value} value={c.value} className="py-2">
                    {c.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Primary Colour *</label>
              <select
                name="colour"
                value={formData.colour}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-gray-50 shadow-sm"
                required
              >
                <option value="">Select a colour</option>
                {colors.map(c => (
                  <option key={c} value={c}>
                    {c.charAt(0).toUpperCase() + c.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Brand</label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-gray-50 shadow-sm placeholder-gray-400"
                placeholder="e.g., Zara, H&M, Nike"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Season</label>
            <input
              type="text"
              name="season"
              value={formData.season}
              onChange={handleInputChange}
              placeholder="e.g., summer, winter"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 bg-gray-50 shadow-sm placeholder-gray-400"
            />
          </div>
          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium bg-white hover:bg-gray-100 shadow-sm transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 transition"
            >
              {uploading ? "Uploading..." : "Add Item"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
