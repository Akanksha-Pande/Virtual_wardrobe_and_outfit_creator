import React, { useState } from 'react';
import { X, Save, CheckCircle } from 'lucide-react';
import { useWardrobe, ClothingItem } from '../../contexts/WardrobeContext';

interface SaveOutfitModalProps {
  items: ClothingItem[];
  onClose: () => void;
  onSave: () => void;
}

export function SaveOutfitModal({ items, onClose, onSave }: SaveOutfitModalProps) {
  const { saveOutfit } = useWardrobe();
  const [outfitName, setOutfitName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outfitName.trim()) {
      alert('Please enter an outfit name');
      return;
    }

    try {
      setIsSaving(true);
      await saveOutfit({
        name: outfitName.trim(),
        items
      });

      setSuccess(true);
      setTimeout(() => {
        setIsSaving(false);
        setSuccess(false);
        onSave();
      }, 1200);
    } catch (err) {
      console.error('Failed to save outfit:', err);
      setIsSaving(false);
      alert('Error saving outfit');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl max-w-md w-full relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900">Save Outfit</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Outfit Preview */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Outfit Items</h3>
            <div className="flex flex-wrap gap-2">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center space-x-2 bg-gray-50 px-3 py-2 rounded-lg"
                >
                  <img
                    src={item.imagePath}
                    alt={item.name}
                    className="w-6 h-6 object-cover rounded"
                  />
                  <span className="text-xs text-gray-700">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Outfit Name *
              </label>
              <input
                type="text"
                value={outfitName}
                onChange={(e) => setOutfitName(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200"
                placeholder="e.g., Business Casual Friday"
                required
                disabled={isSaving}
              />
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSaving}
                className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSaving || success}
                className={`flex-1 px-6 py-3 rounded-xl font-semibold text-white flex items-center justify-center space-x-2 transition-all duration-200 ${
                  success
                    ? 'bg-green-500 hover:bg-green-600'
                    : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700'
                } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {success ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>{isSaving ? 'Saving...' : 'Save Outfit'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
