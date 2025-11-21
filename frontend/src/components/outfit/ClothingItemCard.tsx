import React from 'react';
import { ClothingItem } from '../../contexts/WardrobeContext';

interface ClothingItemCardProps {
  item: ClothingItem;
  onDragStart: (e: React.DragEvent, item: ClothingItem) => void;
}

export function ClothingItemCard({ item, onDragStart }: ClothingItemCardProps) {
  
  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, item)}
      className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-200 cursor-grab active:cursor-grabbing group"
    >
      <div className="aspect-square overflow-hidden relative">
        <img
          src={item.imagePath}
          alt={item.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-200" />
        
        {/* Drag Indicator */}
        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-2 py-1">
            <p className="text-xs font-medium text-gray-700">Drag to outfit</p>
          </div>
        </div>
      </div>
      
      <div className="p-3">
        <h3 className="font-medium text-gray-900 text-sm mb-1 truncate">{item.name}</h3>
        <div className="flex items-center justify-between">
          <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-lg capitalize">
            {item.category}
          </span>
          <div
            className="w-3 h-3 rounded-full border border-gray-200"
            style={{ backgroundColor: item.colour === 'white' ? '#f3f4f6' : item.colour }}
            title={item.colour}
          />
        </div>
      </div>
    </div>
  );
}