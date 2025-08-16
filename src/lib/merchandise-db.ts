
// This is a simple in-memory "database" for demonstration purposes.

export type MerchandiseItem = {
  id: string;
  name: string;
  category: "Apparel" | "Books" | "Costumes" | "Accessories";
  price: number;
  stock: number;
};

const initialMerchandise: MerchandiseItem[] = [
  { id: "M001", name: "VINDYAA Logo T-Shirt (Black)", category: "Apparel", price: 499, stock: 50 },
  { id: "M002", name: "Bharatanatyam Practice Saree", category: "Costumes", price: 1200, stock: 25 },
  { id: "M003", name: "Beginner's Guide to Carnatic Music", category: "Books", price: 350, stock: 40 },
  { id: "M004", name: "Guitar Picks (Set of 5)", category: "Accessories", price: 150, stock: 100 },
  { id: "M005", name: "Yoga Mat", category: "Accessories", price: 800, stock: 30 },
  { id: "M006", name: "Karate Gi (Uniform)", category: "Costumes", price: 1800, stock: 20 },
  { id: "M007", name: "Sketchbook & Pencils Set", category: "Books", price: 450, stock: 35 },
  { id: "M008", name: "Ankle Bells (Salangai)", category: "Accessories", price: 600, stock: 15 },
];

let merchandise: MerchandiseItem[] = [...initialMerchandise];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMerchandise = async (): Promise<MerchandiseItem[]> => {
  await delay(500);
  return Promise.resolve(merchandise);
};

export const updateMerchandiseStock = async (id: string, newStock: number): Promise<MerchandiseItem> => {
  await delay(300);
  const itemIndex = merchandise.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error("Merchandise item not found");
  }
  merchandise[itemIndex].stock = newStock;
  return Promise.resolve(merchandise[itemIndex]);
};

export const addMerchandiseItem = async (itemData: Omit<MerchandiseItem, 'id'>): Promise<MerchandiseItem> => {
    await delay(500);
    const newId = `M${String(merchandise.length + 1).padStart(3, '0')}`;
    const newItem: MerchandiseItem = {
        ...itemData,
        id: newId,
    };
    merchandise.push(newItem);
    return Promise.resolve(newItem);
}

export const resetMerchandise = () => {
    merchandise = [...initialMerchandise];
}
