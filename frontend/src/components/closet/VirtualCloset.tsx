import { useState } from 'react';
import { Plus, Search, Filter, Grid, List, Trash2, Shirt } from 'lucide-react';
import { useWardrobe, ClothingItem } from '../../contexts/WardrobeContext';
import { AddItemModal } from './AddItemModal';

type View = 'dashboard' | 'closet' | 'outfit-creator';

interface VirtualClosetProps {
  onNavigate?: (view: View) => void;
}

export function VirtualCloset({ }: VirtualClosetProps) {
  const { clothingItems, removeClothingItem } = useWardrobe();
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
    return matchesSearch && matchesCategory;
  });

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to remove this item from your wardrobe?')) {
      removeClothingItem(id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-6 py-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div>
          <h4 className="text-2xl font-bold text-gray-900 mb-1">My Virtual Closet</h4>
          <p className="text-gray-600 text-sm">Organize and manage your clothing collection</p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200 flex items-center space-x-2 shadow-md text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Item</span>
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-3 lg:space-y-0 lg:space-x-4">
          {/* Search */}
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

          {/* Category Filter */}
          <div className="flex items-center space-x-3">
            <Filter className="w-4 h-4 text-gray-400" />
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

            {/* View Toggle */}
            <div className="flex rounded-lg border border-gray-200 p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'grid'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  viewMode === 'list'
                    ? 'bg-indigo-100 text-indigo-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Items */}
      {filteredItems.length > 0 ? (
        <div
          className={
            viewMode === 'grid'
              ? 'grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4'
              : 'space-y-2'
          }
        >
          {filteredItems.map((item) => (
            <ItemCard
              key={item.id}
              item={item}
              viewMode={viewMode}
              onDelete={handleDeleteItem}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Shirt className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-gray-900 mb-1">No items found</h3>
          <p className="text-gray-600 text-sm mb-4">
            {searchTerm || selectedCategory !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Start building your wardrobe by adding your first item'}
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 text-sm rounded-lg font-semibold hover:from-indigo-600 hover:to-purple-700 transition-all duration-200"
          >
            Add Your First Item
          </button>
        </div>
      )}

      {showAddModal && <AddItemModal onClose={() => setShowAddModal(false)} />}
    </div>
  );
}

/* ------------------- Item Card ------------------- */
interface ItemCardProps {
  item: ClothingItem;
  viewMode: 'grid' | 'list';
  onDelete: (id: string) => void;
}

function ItemCard({ item, viewMode, onDelete }: ItemCardProps) {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-xl p-3 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200">
        <div className="flex items-center space-x-3">
          <img
            src={item.imagePath}
            alt={item.name}
            className="w-8 h-8 object-cover rounded-lg"
          />
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
            <p className="text-xs text-gray-600">{item.brand}</p>
            <div className="flex items-center space-x-1 mt-1 text-xs">
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg capitalize">
                {item.category}
              </span>
              <span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded-lg capitalize">
                {item.colour}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-1">
            <button
              onClick={() => onDelete(item.id)}
              className="p-1 text-gray-400 hover:text-red-600 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200 group">
      <div className="overflow-hidden relative h-28 w-28 mx-auto rounded-lg">

        <img
          src={item.imagePath}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute top-2 right-2 flex flex-col opacity-0 group-hover:opacity-100 transition-all">
          <button
            onClick={() => onDelete(item.id)}
            className="p-1 bg-white rounded-lg shadow text-gray-600 hover:text-red-600 transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      <div className="p-3">
        <h3 className="font-semibold text-gray-900 text-sm mb-0.5 truncate">
          {item.name}
        </h3>
        <p className="text-xs text-gray-600 mb-1">{item.brand}</p>
        <div className="flex items-center justify-between">
          <span className="text-[10px] bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md capitalize">
            {item.category}
          </span>
          <div
            className="w-3 h-3 rounded-full border border-gray-200"
            style={{
              backgroundColor: item.colour === 'white' ? '#f3f4f6' : item.colour,
            }}
            title={item.colour}
          />
        </div>
      </div>
    </div>
  );
}
