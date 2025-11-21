import React, { useEffect, useState } from 'react';
import { Save, Trash2, Sparkles, Search, Shirt, X } from 'lucide-react';
import { useWardrobe, ClothingItem } from '../../contexts/WardrobeContext';
import { SaveOutfitModal } from './SaveOutfitModal';
import { getAISuggestion } from '../../api/api';
import { useToast } from '../Toast';

type View = 'dashboard' | 'closet' | 'outfit-creator';

interface OutfitCreatorProps {
  onNavigate: (view: View) => void;
}

export function OutfitCreator({ onNavigate }: OutfitCreatorProps) {
  const { clothingItems } = useWardrobe();
  const [selectedItems, setSelectedItems] = useState<ClothingItem[]>([]);
  const [isLoadingAI, setIsLoadingAI] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const { showToast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showSaveModal, setShowSaveModal] = useState(false);

  const categories = [
    { id: 'all', label: 'All Items' },
    { id: 'tops', label: 'Tops' },
    { id: 'bottoms', label: 'Bottoms' },
    { id: 'shoes', label: 'Shoes' },
    { id: 'accessories', label: 'Accessories' },
    { id: 'outerwear', label: 'Outerwear' }
  ];

  const filteredItems = clothingItems.filter(item => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.brand?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.colour.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const notSelected = !selectedItems.find(selected => selected.id === item.id);
    return matchesSearch && matchesCategory && notSelected;
  });

  useEffect(() => {
    if (selectedItems.length > 0) {
      setFadeIn(false);
      const t = setTimeout(() => setFadeIn(true), 50);
      return () => clearTimeout(t);
    } else {
      setFadeIn(false);
    }
  }, [selectedItems]);

  const handleDragStart = (e: React.DragEvent, item: ClothingItem) => {
    e.dataTransfer.setData('application/json', JSON.stringify(item));
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    try {
      const item = JSON.parse(e.dataTransfer.getData('application/json')) as ClothingItem;
      setSelectedItems(prev => {
        const filtered = prev.filter(existing => existing.category !== item.category);
        return [...filtered, item];
      });
    } catch (err) {
      console.warn('Invalid drop payload', err);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const removeItem = (itemId: string) =>
    setSelectedItems(prev => prev.filter(item => item.id !== itemId));

  const clearOutfit = () => setSelectedItems([]);

  const handleAISurprise = async () => {
    try {
      const userId = localStorage.getItem('userId');

      if (!userId) {
        showToast('Missing user ID. Please login again.', 'error');
        return;
      }

      setIsLoadingAI(true);
      const aiOutfit = await getAISuggestion(userId);

      if (!Array.isArray(aiOutfit)) {
        showToast('AI returned an invalid outfit.', 'error');
        setIsLoadingAI(false);
        return;
      }
      setSelectedItems(aiOutfit);
    } catch (err) {
      console.error(err);
      showToast('AI failed to generate outfit', 'error');
    } finally {
      setIsLoadingAI(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-1">Outfit Creator</h1>
          <p className="text-gray-600 text-sm">Drag items to the mannequin to visualize your outfit</p>
        </div>

        <div className="flex items-center space-x-2 mt-3 sm:mt-0">
          <button
            onClick={handleAISurprise}
            className="bg-gradient-to-r from-orange-500 to-pink-500 text-white px-3 py-2 rounded-lg font-semibold text-sm hover:from-orange-600 hover:to-pink-600 transition-all duration-200 flex items-center space-x-1"
          >
            <Sparkles className="w-4 h-4" />
            <span>Surprise Me</span>
          </button>

          {selectedItems.length > 0 && (
            <>
              <button
                onClick={clearOutfit}
                className="bg-gray-500 text-white px-3 py-2 rounded-lg font-semibold text-sm hover:bg-gray-600 transition-colors flex items-center space-x-1"
              >
                <Trash2 className="w-4 h-4" />
                <span>Clear</span>
              </button>

              <button
                onClick={() => setShowSaveModal(true)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 rounded-lg font-semibold text-sm hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-1"
              >
                <Save className="w-4 h-4" />
                <span>Save</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Two-column layout: left = items, right = avatar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: items */}
        <div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search by name, brand, or color..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all duration-200"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 transition-all duration-200"
              >
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {filteredItems.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, item)}
                  className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing group"
                >
                  <div className="overflow-hidden relative h-20 w-20 mx-auto rounded-lg mt-2">
                    <img
                      src={item.imagePath}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-2 text-center">
                    <h3 className="font-semibold text-gray-900 text-xs truncate">{item.name}</h3>
                    <p className="text-[10px] text-gray-600">{item.brand}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-white rounded-2xl shadow-sm border border-gray-100">
              <Shirt className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <h3 className="text-sm font-semibold text-gray-900 mb-1">No items found</h3>
              <p className="text-gray-600 text-xs mb-4">
                {searchTerm || selectedCategory !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add clothing items to your wardrobe first'}
              </p>
              <button
                onClick={() => onNavigate('closet')}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-3 py-2 text-xs rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
              >
                Go to Closet
              </button>
            </div>
          )}
        </div>

        {/* Right: CSS Avatar (drop zone) */}
        <div>
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col items-center">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">Outfit Preview</h2>

            {/* AI loading indicator visible independently from avatar */}
            {isLoadingAI && (
              <div className="flex items-center space-x-2 mb-3 animate-pulse">
                <Sparkles className="w-4 h-4 text-indigo-500" />
                <p className="text-sm text-indigo-500 font-medium">AI is thinking...</p>
              </div>
            )}

            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="w-full flex justify-center"
            >
              {/* avatar is always visible */}
              <CSSDummyAvatar
                selectedItems={selectedItems}
                onRemoveItem={removeItem}
                fadeIn={fadeIn}
              />
            </div>

            {selectedItems.length === 0 && (
              <div className="text-center mt-3 p-4 bg-gray-50 rounded-xl w-full">
                <Sparkles className="w-6 h-6 text-gray-300 mx-auto mb-1" />
                <p className="text-xs text-gray-500">Drag items here to see how they look together</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {showSaveModal && (
        <SaveOutfitModal
          items={selectedItems}
          onClose={() => setShowSaveModal(false)}
          onSave={() => {
            setShowSaveModal(false);
            setSelectedItems([]);
          }}
        />
      )}
    </div>
  );
}

/* ------------------ CSS Dummy Avatar + positioned items ------------------ */

function CSSDummyAvatar({
  selectedItems,
  onRemoveItem,
  fadeIn
}: {
  selectedItems: ClothingItem[];
  onRemoveItem: (id: string) => void;
  fadeIn: boolean;
}) {
  const get = (category: string) => selectedItems.find(i => i.category === category);

  const avatarWidth = 320;
  const avatarHeight = 400;

  const hasTop = !!get('tops') || !!get('outerwear');
  const hasBottom = !!get('bottoms');
  const hasShoes = !!get('shoes');

  return (
    <div
      className="relative"
      style={{ width: avatarWidth, height: avatarHeight }}
    >
      {/* Avatar card (background + body shapes) */}
      <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-gray-200 rounded-3xl flex flex-col items-center pt-6 pb-6 shadow-inner border border-transparent transition-opacity duration-300">
        {/* head (always visible) */}
        <div className="w-14 h-14 bg-amber-200 rounded-full flex items-center justify-center border-4 border-white shadow-md">
          <div className="w-6 h-6 text-amber-700" />
        </div>

        {/* upper torso (fade out when top or outerwear is present) */}
        <div
          className={`mt-1 w-20 h-28 bg-gradient-to-b from-amber-200 to-amber-300 rounded-2xl border-4 border-white shadow-md transition-opacity duration-300 ${
            hasTop ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* legs (fade out when bottoms or shoes are present) */}
        <div
          className={`mt-4 flex space-x-4 transition-opacity duration-300 ${
            hasBottom || hasShoes ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <div className="w-6 h-20 bg-gradient-to-b from-amber-200 to-amber-300 rounded-lg border-4 border-white shadow-md" />
          <div className="w-6 h-20 bg-gradient-to-b from-amber-200 to-amber-300 rounded-lg border-4 border-white shadow-md" />
        </div>

        <div className="absolute bottom-6 w-full flex justify-center pointer-events-none" />
      </div>

      {/* Clothing items overlay - each item fades in/out together via fadeIn prop */}
      {/* outerwear */}
      {get('outerwear') && (
        <div className={fadeIn ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}>
          <PositionedAvatarItem
            item={get('outerwear')!}
            topPercent={28}
            leftPercent={50}
            width={170}
            height={130}
            zIndex={50}
            translateY={-10}
            onRemove={onRemoveItem}
          />
        </div>
      )}

      {/* top */}
      {get('tops') && (
        <div className={fadeIn ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}>
          <PositionedAvatarItem
            item={get('tops')!}
            topPercent={21}
            leftPercent={50}
            width={160}
            height={120}
            zIndex={40}
            translateY={-8}
            onRemove={onRemoveItem}
          />
        </div>
      )}

      {/* bottoms */}
      {get('bottoms') && (
        <div className={fadeIn ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}>
          <PositionedAvatarItem
            item={get('bottoms')!}
            topPercent={49}
            leftPercent={50}
            width={160}
            height={110}
            zIndex={35}
            translateY={-6}
            onRemove={onRemoveItem}
          />
        </div>
      )}

      {/* shoes */}
      {get('shoes') && (
        <div className={fadeIn ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}>
          <PositionedAvatarItem
            item={get('shoes')!}
            topPercent={78}
            leftPercent={50}
            width={90}
            height={44}
            zIndex={30}
            translateY={-4}
            onRemove={onRemoveItem}
          />
        </div>
      )}

      {/* accessories */}
      {get('accessories') && (
        <div className={fadeIn ? 'opacity-100 transition-opacity duration-700' : 'opacity-0'}>
          <PositionedAvatarItem
            item={get('accessories')!}
            topPercent={18}
            leftPercent={74}
            width={56}
            height={56}
            zIndex={55}
            translateY={0}
            onRemove={onRemoveItem}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Renders the item image directly (no white card).
 */
function PositionedAvatarItem({
  item,
  topPercent,
  leftPercent,
  width,
  height,
  zIndex,
  translateY = 0,
  onRemove
}: {
  item: ClothingItem;
  topPercent: number;
  leftPercent: number;
  width: number;
  height: number;
  zIndex: number;
  translateY?: number;
  onRemove: (id: string) => void;
}) {
  const style: React.CSSProperties = {
    position: 'absolute',
    top: `${topPercent}%`,
    left: `${leftPercent}%`,
    transform: `translate(-50%, ${translateY}%)`,
    width: `${width}px`,
    height: `${height}px`,
    zIndex,
    pointerEvents: 'auto'
  };

  return (
    <div style={style} className="relative group">
      <img
        src={item.imagePath}
        alt={item.name}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          display: 'block',
          backgroundColor: 'transparent',
          boxShadow: '0 6px 20px rgba(0,0,0,0.12)'
        }}
        draggable={false}
      />

      <button
        onClick={() => onRemove(item.id)}
        className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center hover:bg-red-600"
        title="Remove"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
}
