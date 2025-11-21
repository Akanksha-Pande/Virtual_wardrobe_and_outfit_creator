import { useEffect, useState } from 'react';
import { Plus, Eye, Trash2, X } from 'lucide-react';
import { useWardrobe } from '../../contexts/WardrobeContext';
import { View } from "../../types/View";

type OutfitItem = {
  id: string;
  name: string;
  category: string;
  imagePath: string;
};

type Outfit = {
  id: string;
  name: string;
  createdAt: string | Date;
  items: OutfitItem[];
};

interface SavedOutfitsProps {
  onNavigate: (view: View) => void;
}

export function SavedOutfits({ onNavigate }: SavedOutfitsProps) {
  const { outfits, fetchUserOutfits } = useWardrobe();
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [selectedOutfit, setSelectedOutfit] = useState<Outfit | null>(null);
  const [localOutfits, setLocalOutfits] = useState<Outfit[]>(outfits);

  const categoryOrder = ['outerwear', 'tops', 'bottoms', 'shoes', 'accessories'];

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (userId) fetchUserOutfits(userId);
  }, []);

  useEffect(() => {
    setLocalOutfits(outfits);
  }, [outfits]);

  const handleDeleteOutfit = async (id: string) => {
    const res = await fetch(`http://localhost:8080/api/outfits/${id}`, { method: 'DELETE' });

    if (res.ok) {
      setLocalOutfits(prev => prev.filter(o => o.id !== id));
      setConfirmDelete(null);
    } else {
      alert('Failed to delete outfit');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">

      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-2xl font-bold text-gray-900">My Saved Outfits</h4>
          <p className="text-gray-600 text-sm">Browse and manage your saved outfit combinations</p>
        </div>

        <button
          onClick={() => onNavigate('outfit-creator')}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          Create New Outfit
        </button>
      </div>

      {/* Outfit Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 xl:grid-cols-4 gap-3">
        {localOutfits.length === 0 ? (
          <p className="text-gray-500">No saved outfits yet.</p>
        ) : (
          localOutfits.map((outfit) => {
            const sortedItems = [...outfit.items].sort(
              (a, b) =>
                categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
            );

            return (
              <div
                key={outfit.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden relative group"
              >
                {/* Outfit preview */}
                <div className="relative bg-gray-50 flex flex-col items-center justify-center p-4 rounded-t-2xl">
                  <div className="relative z-10 flex flex-col items-center justify-center space-y-1 max-h-60 overflow-hidden">
                    {sortedItems.map((item) => (
                      <img
                        key={item.id}
                        src={item.imagePath}
                        alt={item.name}
                        className="w-16 h-16 object-contain rounded-md border border-gray-200"
                      />
                    ))}
                  </div>

                  {/* Hover Action Buttons */}
                  <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-all">
                    <button
                      className="bg-white p-2 rounded-full shadow-md hover:bg-gray-300"
                      onClick={() => setSelectedOutfit(outfit)}
                    >
                      <Eye className="w-3 h-3 text-gray-700" />
                    </button>

                    <button
                      className="bg-white p-2 rounded-full shadow-md hover:bg-red-300"
                      onClick={() => setConfirmDelete(outfit.id)}
                    >
                      <Trash2 className="w-3 h-3 text-gray-700" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 text-sm truncate">
                    {outfit.name}
                  </h3>
                  <p className="text-xs text-gray-500 flex items-center space-x-1 mt-1">
                    <span role="img">📅</span>
                    <span>
                      {new Date(outfit.createdAt).toLocaleDateString('en-GB', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Delete Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 shadow-xl w-full max-w-sm text-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Delete this outfit?</h2>
            <p className="text-gray-600 text-sm mb-6">This action cannot be undone.</p>

            <div className="flex justify-center space-x-3">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>

              <button
                onClick={() => handleDeleteOutfit(confirmDelete)}
                className="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Modal */}
      {selectedOutfit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl relative">
            
            {/* Close */}
            <button
              onClick={() => setSelectedOutfit(null)}
              className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-2"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="p-4 flex flex-col items-center">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{selectedOutfit.name}</h2>

              <p className="text-sm text-gray-500 mb-2">
                Created on {new Date(selectedOutfit.createdAt).toLocaleDateString('en-GB')}
              </p>

              {/* FIXED OUTFIT PREVIEW BOX */}
              <div className="relative bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl p-6 shadow-inner border w-64 h-[330px] flex items-center justify-center overflow-hidden">
                
                <div className="flex flex-col items-center justify-between h-full w-full py-2">
                  {selectedOutfit.items
                    .sort(
                      (a, b) =>
                        categoryOrder.indexOf(a.category) -
                        categoryOrder.indexOf(b.category)
                    )
                    .map((item) => (
                      <img
                        key={item.id}
                        src={item.imagePath}
                        alt={item.name}
                        className="max-h-[70px] object-contain"
                      />
                    ))}
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
