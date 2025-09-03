// This is a simple in-memory "database" for demonstration purposes.

export type MerchandiseItem = {
  id: string;
  name: string;
  category: "Apparel" | "Books" | "Costumes" | "Accessories";
  sellingPrice: number;
  buyingPrice: number;
  stock: number;
  sizes?: string[];
  taxRate?: number; // Tax rate in percentage
};

export type MerchandiseSale = {
    saleId: string;
    itemId: string;
    quantity: number;
    totalAmount: number;
    saleDate: string;
};

export type StockTransaction = {
    transactionId: string;
    itemId: string;
    type: 'in' | 'out';
    quantity: number;
    price: number; // Buying price for 'in', Selling price for 'out'
    date: string;
};

const initialMerchandise: MerchandiseItem[] = [
  { id: "M001", name: "VINDYAA Logo T-Shirt (Black)", category: "Apparel", sellingPrice: 499, buyingPrice: 250, stock: 50, sizes: ["S", "M", "L", "XL"], taxRate: 12 },
  { id: "M002", name: "Bharatanatyam Practice Saree", category: "Costumes", sellingPrice: 1200, buyingPrice: 700, stock: 25, taxRate: 5 },
  { id: "M003", name: "Beginner's Guide to Carnatic Music", category: "Books", sellingPrice: 350, buyingPrice: 180, stock: 40, taxRate: 0 },
  { id: "M004", name: "Guitar Picks (Set of 5)", category: "Accessories", sellingPrice: 150, buyingPrice: 50, stock: 100, taxRate: 18 },
  { id: "M005", name: "Yoga Mat", category: "Accessories", sellingPrice: 800, buyingPrice: 450, stock: 30, taxRate: 18 },
  { id: "M006", name: "Karate Gi (Uniform)", category: "Costumes", sellingPrice: 1800, buyingPrice: 1100, stock: 20, sizes: ["120cm", "130cm", "140cm", "150cm"], taxRate: 5 },
  { id: "M007", name: "Sketchbook & Pencils Set", category: "Books", sellingPrice: 450, buyingPrice: 220, stock: 35, taxRate: 5 },
  { id: "M008", name: "Ankle Bells (Salangai)", category: "Accessories", sellingPrice: 600, buyingPrice: 350, stock: 15, taxRate: 12 },
];

let merchandise: MerchandiseItem[] = [...initialMerchandise];
let merchandiseSales: MerchandiseSale[] = [];
let stockTransactions: StockTransaction[] = [];
let nextId = merchandise.length + 1;
let nextSaleId = 1;
let nextTransactionId = 1;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const getMerchandise = async (): Promise<MerchandiseItem[]> => {
  await delay(500);
  return Promise.resolve(merchandise);
};

export const getMerchandiseSales = async (): Promise<MerchandiseSale[]> => {
    await delay(200);
    return Promise.resolve(merchandiseSales);
};

export const getStockTransactions = async (type?: 'in' | 'out'): Promise<StockTransaction[]> => {
    await delay(200);
    let transactions = stockTransactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (type) {
        return Promise.resolve(transactions.filter(t => t.type === type));
    }
    return Promise.resolve(transactions);
};

export const updateMerchandiseStock = async (id: string, newStock: number, newBuyingPrice?: number): Promise<MerchandiseItem> => {
  await delay(300);
  const itemIndex = merchandise.findIndex(item => item.id === id);
  if (itemIndex === -1) {
    throw new Error("Merchandise item not found");
  }

  const quantityAdded = newStock - merchandise[itemIndex].stock;
  
  merchandise[itemIndex].stock = newStock;
  if (newBuyingPrice !== undefined) {
    merchandise[itemIndex].buyingPrice = newBuyingPrice;
  }

  // Log the transaction
  if (quantityAdded > 0) {
      stockTransactions.push({
          transactionId: `TIN${String(nextTransactionId++).padStart(4, '0')}`,
          itemId: id,
          type: 'in',
          quantity: quantityAdded,
          price: newBuyingPrice || merchandise[itemIndex].buyingPrice,
          date: new Date().toISOString(),
      });
  }

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
    
    const subtotal = item.sellingPrice * quantity;
    const tax = subtotal * ((item.taxRate || 0) / 100);
    const totalAmount = subtotal + tax;

    const newSale: MerchandiseSale = {
        saleId: `SALE${String(nextSaleId++).padStart(4, '0')}`,
        itemId,
        quantity,
        totalAmount: totalAmount,
        saleDate: new Date().toISOString(),
    };
    merchandiseSales.push(newSale);

     // Log the transaction
    stockTransactions.push({
        transactionId: `TOUT${String(nextTransactionId++).padStart(4, '0')}`,
        itemId: itemId,
        type: 'out',
        quantity: quantity,
        price: item.sellingPrice,
        date: new Date().toISOString(),
    });

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

    // Log the initial stock-in
     if (newItem.stock > 0) {
      stockTransactions.push({
          transactionId: `TIN${String(nextTransactionId++).padStart(4, '0')}`,
          itemId: newId,
          type: 'in',
          quantity: newItem.stock,
          price: newItem.buyingPrice,
          date: new Date().toISOString(),
      });
  }

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
    stockTransactions = [];
    nextId = merchandise.length + 1;
    nextSaleId = 1;
    nextTransactionId = 1;
}
