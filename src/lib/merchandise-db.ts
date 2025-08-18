
// This is a simple in-memory "database" for demonstration purposes.

export type MerchandiseItem = {
  id: string;
  name: string;
  category: "Apparel" | "Books" | "Costumes" | "Accessories";
  sellingPrice: number;
  buyingPrice: number;
  stock: number;
};

export type MerchandiseSale = {
    saleId: string;
    itemId: string;
    quantity: number;
    totalAmount: number;
    saleDate: string;
};

const initialMerchandise: MerchandiseItem[] = [
  { id: "M001", name: "VINDYAA Logo T-Shirt (Black)", category: "Apparel", sellingPrice: 499, buyingPrice: 250, stock: 50 },
  { id: "M002", name: "Bharatanatyam Practice Saree", category: "Costumes", sellingPrice: 1200, buyingPrice: 700, stock: 25 },
  { id: "M003", name: "Beginner's Guide to Carnatic Music", category: "Books", sellingPrice: 350, buyingPrice: 180, stock: 40 },
  { id: "M004", name: "Guitar Picks (Set of 5)", category: "Accessories", sellingPrice: 150, buyingPrice: 50, stock: 100 },
  { id: "M005", name: "Yoga Mat", category: "Accessories", sellingPrice: 800, buyingPrice: 450, stock: 30 },
  { id: "M006", name: "Karate Gi (Uniform)", category: "Costumes", sellingPrice: 1800, buyingPrice: 1100, stock: 20 },
  { id: "M007", name: "Sketchbook & Pencils Set", category: "Books", sellingPrice: 450, buyingPrice: 220, stock: 35 },
  { id: "M008", name: "Ankle Bells (Salangai)", category: "Accessories", sellingPrice: 600, buyingPrice: 350, stock: 15 },
];

let merchandise: MerchandiseItem[] = [...initialMerchandise];
let merchandiseSales: MerchandiseSale[] = [];
let nextId = merchandise.length + 1;
let nextSaleId = 1;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMerchandise = async (): Promise<MerchandiseItem[]> => {
  await delay(500);
  return Promise.resolve(merchandise);
};

export const getMerchandiseSales = async (): Promise<MerchandiseSale[]> => {
    await delay(200);
    return Promise.resolve(merchandiseSales);
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

export const recordMerchandiseSale = async (itemId: string, quantity: number): Promise<MerchandiseSale> => {
    await delay(300);
    const item = merchandise.find(item => item.id === itemId);
    if (!item) {
        throw new Error("Merchandise item not found");
    }
    if (item.stock < quantity) {
        throw new Error("Insufficient stock");
    }

    item.stock -= quantity;

    const newSale: MerchandiseSale = {
        saleId: `SALE${String(nextSaleId++).padStart(4, '0')}`,
        itemId,
        quantity,
        totalAmount: item.sellingPrice * quantity,
        saleDate: new Date().toISOString(),
    };

    merchandiseSales.push(newSale);
    return Promise.resolve(newSale);
};

export const addMerchandiseItem = async (itemData: Omit<MerchandiseItem, 'id'>): Promise<MerchandiseItem> => {
    await delay(500);
    const newId = `M${String(nextId++).padStart(3, '0')}`;
    const newItem: MerchandiseItem = {
        ...itemData,
        id: newId,
    };
    merchandise.push(newItem);
    return Promise.resolve(newItem);
};

export const updateMerchandiseItem = async (id: string, updates: Partial<MerchandiseItem>): Promise<MerchandiseItem> => {
    await delay(300);
    const itemIndex = merchandise.findIndex(item => item.id === id);
    if (itemIndex === -1) {
        throw new Error("Merchandise item not found");
    }
    merchandise[itemIndex] = { ...merchandise[itemIndex], ...updates };
    return Promise.resolve(merchandise[itemIndex]);
};


export const resetMerchandise = () => {
    merchandise = [...initialMerchandise];
    merchandiseSales = [];
    nextId = merchandise.length + 1;
    nextSaleId = 1;
}
