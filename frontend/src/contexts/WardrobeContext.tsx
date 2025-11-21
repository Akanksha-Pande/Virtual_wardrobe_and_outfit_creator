import { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface ClothingItem {
  id: string;
  name: string;
  category: 'tops' | 'bottoms' | 'shoes' | 'accessories' | 'outerwear';
  colour: string;
  imagePath: string;
  brand?: string;
  season?: string;
  userId?: string;
}

export interface Outfit {
  id: string;
  name: string;
  items: ClothingItem[];
  createdAt: Date;
  image?: string;
}

interface WardrobeContextType {
  clothingItems: ClothingItem[];
  outfits: Outfit[];
  fetchUserOutfits: (userId: string) => Promise<void>;
  addClothingItem: (item: Omit<ClothingItem, "id"> & { userId: string }) => Promise<void>;
  removeClothingItem: (id: string) => Promise<void>;
  saveOutfit: (outfit: { name: string; items: ClothingItem[] }) => Promise<void>;
}

const WardrobeContext = createContext<WardrobeContextType | undefined>(undefined);

export function WardrobeProvider({ children }: { children: ReactNode }) {
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [outfits, setOutfits] = useState<Outfit[]>([]);

  const mapOutfitResponse = (o: any): Outfit => ({
    id: o.id,
    name: o.name,
    createdAt: new Date(o.createdAt),
    items: o.items.map((it: any) => ({
      id: it.id,
      name: it.name || '',
      category: it.category,
      colour: it.colour,
      imagePath: it.imagePath,
      brand: it.brand,
      season: it.season,
      userId: it.userId
    })),
    image: o.items.length > 0 ? o.items[0].imagePath : undefined
  });

  const fetchUserOutfits = async (userId: string) => {
    const res = await fetch(`http://localhost:8080/api/outfits/user/${userId}`);
    if (res.ok) {
      const data = await res.json();
      setOutfits(data.map(mapOutfitResponse));
    }

    const resClothing = await fetch(`http://localhost:8080/api/clothing/user/${userId}`);
    if (resClothing.ok) {
      const data = await resClothing.json();
      setClothingItems(data);
    } else {
      console.error("Failed to fetch clothing items");
    }
  };

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      fetchUserOutfits(userId);
    }
  }, []);

  const addClothingItem = async (item: Omit<ClothingItem, "id"> & { userId: string }) => {
    const res = await fetch("http://localhost:8080/api/clothing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });

    if (res.ok) {
      const saved = await res.json();
      setClothingItems((prev) => [...prev, saved]);
    } else {
      console.error("Failed to add clothing item");
    }
  };

  const removeClothingItem = async (id: string) => {
    const res = await fetch(`http://localhost:8080/api/clothing/${id}`, { method: 'DELETE' });
    if (res.ok) {
      setClothingItems(prev => prev.filter(item => item.id !== id));
    }
  };

  const saveOutfit = async (outfit: { name: string; items: ClothingItem[] }) => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("No logged-in user found");
      return;
    }

    const res = await fetch("http://localhost:8080/api/outfits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: outfit.name,
        userId,
        items: outfit.items.map((it) => it.id),
      }),
    });

    if (res.ok) {
      const saved = await res.json();
      setOutfits((prev) => [...prev, mapOutfitResponse(saved)]);
    } else {
      console.error("Failed to save outfit");
      alert("Error saving outfit");
    }
  };

  return (
    <WardrobeContext.Provider
      value={{
        clothingItems,
        outfits,
        fetchUserOutfits,
        addClothingItem,
        removeClothingItem,
        saveOutfit
      }}
    >
      {children}
    </WardrobeContext.Provider>
  );
}

export function useWardrobe() {
  const context = useContext(WardrobeContext);
  if (!context) {
    throw new Error("useWardrobe must be used within WardrobeProvider");
  }
  return context;
}
