import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // <-- ADD THIS LINE
import {
  type User,
  type InsertUser,
  type Seller,
  type InsertSeller,
  type Product,
  type InsertProduct,
  type ProductWithSeller,
  type CartItem,
  type InsertCartItem,
  type CartItemWithProduct,
  type Order,
  type InsertOrder,
  type OrderWithItems,
  type OrderItem,
  type InsertOrderItem,
  type LoyaltyTransaction,
  type InsertLoyaltyTransaction,
  type EnvironmentalAction,
  type InsertEnvironmentalAction,
  type Payout,
  type InsertPayout,
  type UserWithStats,
} from '@shared/schema';
import { randomUUID } from 'crypto';

// --- FIX FOR __dirname ---
const __filename = fileURLToPath(import.meta.url); // <-- ADD THIS LINE
const __dirname = path.dirname(__filename);       // <-- ADD THIS LINE

// The path to our JSON file database
const dbPath = path.join(__dirname, 'db.json');

// Define the structure of our database file
interface DbData {
  users: User[];
  sellers: Seller[];
  products: Product[];
  cartItems: CartItem[];
  orders: Order[];
  orderItems: OrderItem[];
  loyaltyTransactions: LoyaltyTransaction[];
  environmentalActions: EnvironmentalAction[];
  payouts: Payout[];
}

// --- Database Helper Functions ---

// Reads the entire database from the JSON file.
async function readDb(): Promise<DbData> {
  try {
    const data = await fs.readFile(dbPath, 'utf-8');
    // Dates are stored as strings in JSON, so we need to parse them back to Date objects
    return JSON.parse(data, (key, value) => {
      if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/.test(value)) {
        return new Date(value);
      }
      return value;
    });
  } catch (error) {
    if (error.code === 'ENOENT') {
      // If the file doesn't exist, initialize with seed data and return it.
      console.log('Database file not found, creating with seed data.');
      const initialData = getSeedData();
      await writeDb(initialData);
      return initialData;
    }
    throw error;
  }
}

// Writes the entire database object to the JSON file.
async function writeDb(data: DbData): Promise<void> {
  await fs.writeFile(dbPath, JSON.stringify(data, null, 2), 'utf-8');
}

// --- Seeding Logic ---

// Generates the initial data for the database.
function getSeedData(): DbData {
    const users: User[] = [
        { id: "user1", username: "sarah_eco", email: "sarah@example.com", password: "hashedpassword", fullName: "Sarah Johnson", role: "buyer", loyaltyPoints: 2450, loyaltyTier: "gold", totalSpent: "15640.00", treesPlanted: 12, carbonOffset: "2.40", createdAt: new Date("2024-01-15") },
        { id: "user2", username: "eco_seller", email: "seller@ecocompany.com", password: "hashedpassword", fullName: "Green Business Owner", role: "seller", loyaltyPoints: 500, loyaltyTier: "bronze", totalSpent: "0.00", treesPlanted: 0, carbonOffset: "0.00", createdAt: new Date("2024-02-01") },
        { id: "admin1", username: "admin", email: "admin@ecomarket.com", password: "hashedpassword", fullName: "Platform Admin", role: "admin", loyaltyPoints: 0, loyaltyTier: "bronze", totalSpent: "0.00", treesPlanted: 0, carbonOffset: "0.00", createdAt: new Date("2024-01-01") },
    ];

    const sellers: Seller[] = [
        { id: "seller1", userId: "user2", businessName: "EcoClothing Co.", kycStatus: "verified", taxId: "TAX123456", bankDetails: { accountNumber: "****1234", bankName: "Green Bank" }, sustainabilityScore: 85, totalSales: "45670.00", pendingBalance: "8450.00", availableBalance: "12350.00", rating: "4.80", reviewCount: 127, createdAt: new Date("2024-02-01") },
    ];

    const products: Product[] = [
        { id: "prod1", sellerId: "seller1", name: "Organic Cotton T-Shirt", description: "Made from 100% organic cotton with natural dyes", price: "899.00", category: "Clothing", tags: ["organic", "cotton", "eco-friendly"], images: ["https://images.unsplash.com/photo-1523381210434-271e8be1f52b"], sustainabilityFeatures: ["Organic materials", "Natural dyes", "Fair trade"], stockQuantity: 50, isActive: true, carbonFootprint: "2.50", recycledContent: 0, biodegradable: true, createdAt: new Date("2024-03-01"), updatedAt: new Date("2024-03-01") },
        { id: "prod2", sellerId: "seller1", name: "Bamboo Water Bottle", description: "Sustainable bamboo fiber with leak-proof design", price: "1299.00", category: "Home & Garden", tags: ["bamboo", "reusable", "zero-waste"], images: ["https://images.unsplash.com/photo-1602143407151-7111542de6e8"], sustainabilityFeatures: ["Bamboo fiber", "Reusable", "BPA-free"], stockQuantity: 30, isActive: true, carbonFootprint: "1.80", recycledContent: 0, biodegradable: true, createdAt: new Date("2024-03-02"), updatedAt: new Date("2024-03-02") },
        { id: "prod3", sellerId: "seller1", name: "Solar Garden Lights", description: "Eco-friendly outdoor lighting with automatic sensors", price: "2499.00", category: "Electronics", tags: ["solar", "energy-efficient", "outdoor"], images: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64"], sustainabilityFeatures: ["Solar powered", "Energy efficient", "Long lasting"], stockQuantity: 20, isActive: true, carbonFootprint: "5.20", recycledContent: 25, biodegradable: false, createdAt: new Date("2024-03-03"), updatedAt: new Date("2024-03-03") },
    ];

    const orders: Order[] = [
        { id: "order1", buyerId: "user1", sellerId: "seller1", status: "delivered", paymentStatus: "released", totalAmount: "3497.00", platformFee: "174.85", loyaltyPointsEarned: 175, loyaltyPointsUsed: 0, shippingAddress: { street: "123 Green Street", city: "Mumbai", state: "Maharashtra", pincode: "400001", country: "India" }, paymentIntentId: "pi_test123", escrowReleaseDate: new Date("2024-03-20"), disputeReason: null, adminNotes: null, environmentalImpact: { treesPlanted: 2, carbonOffset: 0.5 }, createdAt: new Date("2024-03-15"), updatedAt: new Date("2024-03-20") },
    ];

    return {
        users,
        sellers,
        products,
        orders,
        cartItems: [],
        orderItems: [],
        loyaltyTransactions: [],
        environmentalActions: [],
        payouts: [],
    };
}

export interface IStorage {
  // User management
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<User>): Promise<User | undefined>;
  getUserWithStats(id: string): Promise<UserWithStats | undefined>;
  
  // Seller management
  getSeller(id: string): Promise<Seller | undefined>;
  getSellerByUserId(userId: string): Promise<Seller | undefined>;
  createSeller(seller: InsertSeller): Promise<Seller>;
  updateSeller(id: string, updates: Partial<Seller>): Promise<Seller | undefined>;
  getSellerApplications(): Promise<Seller[]>;
  
  // Product management
  getProduct(id: string): Promise<Product | undefined>;
  getProductWithSeller(id: string): Promise<ProductWithSeller | undefined>;
  getProducts(filters?: { category?: string; sellerId?: string; search?: string }): Promise<ProductWithSeller[]>;
  createProduct(product: InsertProduct): Promise<Product>;
  updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined>;
  deleteProduct(id: string): Promise<boolean>;
  
  // Cart management
  getCartItems(userId: string): Promise<CartItemWithProduct[]>;
  addToCart(cartItem: InsertCartItem): Promise<CartItem>;
  updateCartItem(id: string, quantity: number): Promise<CartItem | undefined>;
  removeFromCart(id: string): Promise<boolean>;
  clearCart(userId: string): Promise<boolean>;
  
  // Order management
  getOrder(id: string): Promise<Order | undefined>;
  getOrderWithItems(id: string): Promise<OrderWithItems | undefined>;
  getOrders(filters?: { buyerId?: string; sellerId?: string; status?: string }): Promise<OrderWithItems[]>;
  createOrder(order: InsertOrder): Promise<Order>;
  updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined>;
  createOrderItem(orderItem: InsertOrderItem): Promise<OrderItem>;
  
  // Loyalty system
  getLoyaltyTransactions(userId: string): Promise<LoyaltyTransaction[]>;
  createLoyaltyTransaction(transaction: InsertLoyaltyTransaction): Promise<LoyaltyTransaction>;
  
  // Environmental tracking
  getEnvironmentalActions(userId: string): Promise<EnvironmentalAction[]>;
  createEnvironmentalAction(action: InsertEnvironmentalAction): Promise<EnvironmentalAction>;
  getTotalEnvironmentalImpact(): Promise<{ treesPlanted: number; carbonOffset: number; plasticReduced: number; wasteReduced: number }>;
  
  // Payout management
  getPayouts(sellerId?: string): Promise<Payout[]>;
  createPayout(payout: InsertPayout): Promise<Payout>;
  updatePayout(id: string, updates: Partial<Payout>): Promise<Payout | undefined>;
  
  // Admin functions
  getDisputedOrders(): Promise<OrderWithItems[]>;
  getHeldOrders(): Promise<OrderWithItems[]>;
  getPlatformStats(): Promise<{
    totalRevenue: number;
    heldFunds: number;
    platformFee: number;
    activeOrders: number;
    activeSellers: number;
    disputeCount: number;
  }>;
}


// --- FileStorage Implementation ---

export class FileStorage implements IStorage {
    // User management
    async getUser(id: string): Promise<User | undefined> {
        const db = await readDb();
        return db.users.find(u => u.id === id);
    }
    
    async getUserByEmail(email: string): Promise<User | undefined> {
        const db = await readDb();
        return db.users.find(u => u.email === email);
    }

    async getUserByUsername(username: string): Promise<User | undefined> {
        const db = await readDb();
        return db.users.find(u => u.username === username);
    }

    async createUser(insertUser: InsertUser): Promise<User> {
        const db = await readDb();
        const newUser: User = {
            id: randomUUID(),
            role: "buyer",
            loyaltyPoints: 0,
            loyaltyTier: "bronze",
            totalSpent: "0",
            treesPlanted: 0,
            carbonOffset: "0",
            createdAt: new Date(),
            ...insertUser,
        };
        db.users.push(newUser);
        await writeDb(db);
        return newUser;
    }

    async updateUser(id: string, updates: Partial<User>): Promise<User | undefined> {
        const db = await readDb();
        const userIndex = db.users.findIndex(u => u.id === id);
        if (userIndex === -1) return undefined;

        const updatedUser = { ...db.users[userIndex], ...updates };
        db.users[userIndex] = updatedUser;
        await writeDb(db);
        return updatedUser;
    }

    async getUserWithStats(id: string): Promise<UserWithStats | undefined> {
        const db = await readDb();
        const user = db.users.find(u => u.id === id);
        if (!user) return undefined;
    
        const userOrders = db.orders.filter(order => order.buyerId === id);
        const currentYear = new Date().getFullYear();
        const currentYearActions = db.environmentalActions
          .filter(action => action.userId === id && action.createdAt.getFullYear() === currentYear);
    
        return {
          ...user,
          orderCount: userOrders.length,
          totalOrders: userOrders.length,
          currentYearImpact: {
            treesPlanted: currentYearActions
              .filter(action => action.actionType === "tree_planted")
              .reduce((sum, action) => sum + Number(action.quantity), 0),
            carbonOffset: currentYearActions
              .filter(action => action.actionType === "carbon_offset")
              .reduce((sum, action) => sum + Number(action.quantity), 0),
          }
        };
      }

    // Seller management
    async getSeller(id: string): Promise<Seller | undefined> {
        const db = await readDb();
        return db.sellers.find(s => s.id === id);
    }

    async getSellerByUserId(userId: string): Promise<Seller | undefined> {
        const db = await readDb();
        return db.sellers.find(s => s.userId === userId);
    }
    
    async createSeller(insertSeller: InsertSeller): Promise<Seller> {
        const db = await readDb();
        const newSeller: Seller = {
            id: randomUUID(),
            createdAt: new Date(),
            ...insertSeller,
        };
        db.sellers.push(newSeller);
        await writeDb(db);
        return newSeller;
    }

    async updateSeller(id: string, updates: Partial<Seller>): Promise<Seller | undefined> {
        const db = await readDb();
        const sellerIndex = db.sellers.findIndex(s => s.id === id);
        if (sellerIndex === -1) return undefined;

        const updatedSeller = { ...db.sellers[sellerIndex], ...updates };
        db.sellers[sellerIndex] = updatedSeller;
        await writeDb(db);
        return updatedSeller;
    }

    async getSellerApplications(): Promise<Seller[]> {
        const db = await readDb();
        return db.sellers.filter(s => s.kycStatus === "pending");
    }

    // Product management
    async getProduct(id: string): Promise<Product | undefined> {
        const db = await readDb();
        return db.products.find(p => p.id === id);
    }

    async getProductWithSeller(id: string): Promise<ProductWithSeller | undefined> {
        const db = await readDb();
        const product = db.products.find(p => p.id === id);
        if (!product) return undefined;

        const seller = db.sellers.find(s => s.id === product.sellerId);
        if (!seller) return undefined;

        return { ...product, seller };
    }

    async getProducts(filters?: { category?: string; sellerId?: string; search?: string }): Promise<ProductWithSeller[]> {
        const db = await readDb();
        let products = db.products.filter(p => p.isActive);

        if (filters?.category) {
            products = products.filter(p => p.category === filters.category);
        }
        if (filters?.sellerId) {
            products = products.filter(p => p.sellerId === filters.sellerId);
        }
        if (filters?.search) {
            const searchLower = filters.search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower)
            );
        }

        return products.map(product => {
            const seller = db.sellers.find(s => s.id === product.sellerId);
            return { ...product, seller: seller! };
        }).filter(p => p.seller);
    }

    async createProduct(insertProduct: InsertProduct): Promise<Product> {
        const db = await readDb();
        const newProduct: Product = {
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...insertProduct,
        };
        db.products.push(newProduct);
        await writeDb(db);
        return newProduct;
    }
    
    async updateProduct(id: string, updates: Partial<Product>): Promise<Product | undefined> {
        const db = await readDb();
        const productIndex = db.products.findIndex(p => p.id === id);
        if (productIndex === -1) return undefined;

        const updatedProduct = { ...db.products[productIndex], ...updates, updatedAt: new Date() };
        db.products[productIndex] = updatedProduct;
        await writeDb(db);
        return updatedProduct;
    }

    async deleteProduct(id: string): Promise<boolean> {
        const db = await readDb();
        const initialLength = db.products.length;
        db.products = db.products.filter(p => p.id !== id);
        if (db.products.length < initialLength) {
            await writeDb(db);
            return true;
        }
        return false;
    }

    // Cart management
    async getCartItems(userId: string): Promise<CartItemWithProduct[]> {
        const db = await readDb();
        const userCartItems = db.cartItems.filter(item => item.userId === userId);

        return userCartItems.map(item => {
            const product = db.products.find(p => p.id === item.productId);
            const seller = product ? db.sellers.find(s => s.id === product.sellerId) : undefined;
            return { ...item, product: { ...product!, seller: seller! } };
        }).filter(item => item.product?.id && item.product?.seller?.id);
    }

    async addToCart(insertCartItem: InsertCartItem): Promise<CartItem> {
        const db = await readDb();
        const existingItemIndex = db.cartItems.findIndex(
            item => item.userId === insertCartItem.userId && item.productId === insertCartItem.productId
        );

        if (existingItemIndex > -1) {
            db.cartItems[existingItemIndex].quantity += insertCartItem.quantity;
            await writeDb(db);
            return db.cartItems[existingItemIndex];
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            createdAt: new Date(),
            ...insertCartItem,
        };
        db.cartItems.push(newCartItem);
        await writeDb(db);
        return newCartItem;
    }

    async updateCartItem(id: string, quantity: number): Promise<CartItem | undefined> {
        const db = await readDb();
        const itemIndex = db.cartItems.findIndex(item => item.id === id);
        if (itemIndex === -1) return undefined;
    
        if (quantity <= 0) {
            const [removedItem] = db.cartItems.splice(itemIndex, 1);
            await writeDb(db);
            return removedItem;
        }
    
        db.cartItems[itemIndex].quantity = quantity;
        await writeDb(db);
        return db.cartItems[itemIndex];
    }
    
    async removeFromCart(id: string): Promise<boolean> {
        const db = await readDb();
        const initialLength = db.cartItems.length;
        db.cartItems = db.cartItems.filter(item => item.id !== id);
        if (db.cartItems.length < initialLength) {
            await writeDb(db);
            return true;
        }
        return false;
    }

    async clearCart(userId: string): Promise<boolean> {
        const db = await readDb();
        const initialLength = db.cartItems.length;
        db.cartItems = db.cartItems.filter(item => item.userId !== userId);
        if (db.cartItems.length < initialLength) {
            await writeDb(db);
            return true;
        }
        return false;
    }

    // Order management
    async getOrder(id: string): Promise<Order | undefined> {
        const db = await readDb();
        return db.orders.find(o => o.id === id);
    }

    async getOrderWithItems(id: string): Promise<OrderWithItems | undefined> {
        const db = await readDb();
        const order = db.orders.find(o => o.id === id);
        if (!order) return undefined;

        const buyer = db.users.find(u => u.id === order.buyerId);
        const seller = db.sellers.find(s => s.id === order.sellerId);
        if (!buyer || !seller) return undefined;

        const items = db.orderItems
            .filter(item => item.orderId === id)
            .map(item => {
                const product = db.products.find(p => p.id === item.productId);
                return product ? { ...item, product } : null;
            })
            .filter(Boolean) as (OrderItem & { product: Product })[];

        return { ...order, items, buyer, seller };
    }

    async getOrders(filters?: { buyerId?: string; sellerId?: string; status?: string }): Promise<OrderWithItems[]> {
        const db = await readDb();
        let orders = db.orders;

        if (filters?.buyerId) {
            orders = orders.filter(o => o.buyerId === filters.buyerId);
        }
        if (filters?.sellerId) {
            orders = orders.filter(o => o.sellerId === filters.sellerId);
        }
        if (filters?.status) {
            orders = orders.filter(o => o.status === filters.status);
        }
        
        const result: OrderWithItems[] = [];
        for (const order of orders) {
            const orderWithDetails = await this.getOrderWithItems(order.id);
            if(orderWithDetails) {
                result.push(orderWithDetails)
            }
        }
        return result;
    }

    async createOrder(insertOrder: InsertOrder): Promise<Order> {
        const db = await readDb();
        const newOrder: Order = {
            id: randomUUID(),
            createdAt: new Date(),
            updatedAt: new Date(),
            ...insertOrder,
        };
        db.orders.push(newOrder);
        await writeDb(db);
        return newOrder;
    }

    async updateOrder(id: string, updates: Partial<Order>): Promise<Order | undefined> {
        const db = await readDb();
        const orderIndex = db.orders.findIndex(o => o.id === id);
        if (orderIndex === -1) return undefined;

        const updatedOrder = { ...db.orders[orderIndex], ...updates, updatedAt: new Date() };
        db.orders[orderIndex] = updatedOrder;
        await writeDb(db);
        return updatedOrder;
    }

    async createOrderItem(insertOrderItem: InsertOrderItem): Promise<OrderItem> {
        const db = await readDb();
        const newOrderItem: OrderItem = {
            id: randomUUID(),
            ...insertOrderItem,
        };
        db.orderItems.push(newOrderItem);
        await writeDb(db);
        return newOrderItem;
    }

    // Loyalty System
    async getLoyaltyTransactions(userId: string): Promise<LoyaltyTransaction[]> {
        const db = await readDb();
        return db.loyaltyTransactions
            .filter(t => t.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }

    async createLoyaltyTransaction(insertTransaction: InsertLoyaltyTransaction): Promise<LoyaltyTransaction> {
        const db = await readDb();
        const newTransaction: LoyaltyTransaction = {
            id: randomUUID(),
            createdAt: new Date(),
            ...insertTransaction,
        };
        db.loyaltyTransactions.push(newTransaction);
        
        // Also update user's loyalty points
        const user = db.users.find(u => u.id === insertTransaction.userId);
        if (user) {
            user.loyaltyPoints += insertTransaction.points;
        }

        await writeDb(db);
        return newTransaction;
    }

    // Environmental Tracking
    async getEnvironmentalActions(userId: string): Promise<EnvironmentalAction[]> {
        const db = await readDb();
        return db.environmentalActions
            .filter(a => a.userId === userId)
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
    
    async createEnvironmentalAction(insertAction: InsertEnvironmentalAction): Promise<EnvironmentalAction> {
        const db = await readDb();
        const newAction: EnvironmentalAction = {
            id: randomUUID(),
            createdAt: new Date(),
            ...insertAction,
        };
        db.environmentalActions.push(newAction);
        await writeDb(db);
        return newAction;
    }

    async getTotalEnvironmentalImpact(): Promise<{ treesPlanted: number; carbonOffset: number; plasticReduced: number; wasteReduced: number; }> {
        const db = await readDb();
        const actions = db.environmentalActions;

        return {
            treesPlanted: actions.filter(a => a.actionType === "tree_planted").reduce((sum, a) => sum + Number(a.quantity), 2847),
            carbonOffset: actions.filter(a => a.actionType === "carbon_offset").reduce((sum, a) => sum + Number(a.quantity), 156),
            plasticReduced: 89, // static for now
            wasteReduced: 1200, // static for now
        };
    }
    
    // Payout Management
    async getPayouts(sellerId?: string): Promise<Payout[]> {
        const db = await readDb();
        let payouts = db.payouts;
        if (sellerId) {
            payouts = payouts.filter(p => p.sellerId === sellerId);
        }
        return payouts.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());
    }

    async createPayout(insertPayout: InsertPayout): Promise<Payout> {
        const db = await readDb();
        const newPayout: Payout = {
            id: randomUUID(),
            requestedAt: new Date(),
            processedAt: null,
            ...insertPayout,
        };
        db.payouts.push(newPayout);
        await writeDb(db);
        return newPayout;
    }

    async updatePayout(id: string, updates: Partial<Payout>): Promise<Payout | undefined> {
        const db = await readDb();
        const payoutIndex = db.payouts.findIndex(p => p.id === id);
        if (payoutIndex === -1) return undefined;
    
        const updatedPayout = { ...db.payouts[payoutIndex], ...updates };
        if (updates.status === "completed" || updates.status === "failed") {
          updatedPayout.processedAt = new Date();
        }
    
        db.payouts[payoutIndex] = updatedPayout;
        await writeDb(db);
        return updatedPayout;
    }
    
    // Admin functions
    async getDisputedOrders(): Promise<OrderWithItems[]> {
        return this.getOrders({ status: "disputed" });
    }

    async getHeldOrders(): Promise<OrderWithItems[]> {
        const db = await readDb();
        const orders = db.orders.filter(order => order.paymentStatus === "held" || order.status === "disputed");
        const result: OrderWithItems[] = [];
        for (const order of orders) {
            const orderWithDetails = await this.getOrderWithItems(order.id);
            if(orderWithDetails) {
                result.push(orderWithDetails)
            }
        }
        return result;
    }

    async getPlatformStats(): Promise<{ totalRevenue: number; heldFunds: number; platformFee: number; activeOrders: number; activeSellers: number; disputeCount: number; }> {
        const db = await readDb();
        const orders = db.orders;
        const sellers = db.sellers;

        return {
            totalRevenue: orders.reduce((sum, order) => sum + Number(order.totalAmount), 0),
            heldFunds: orders.filter(o => o.paymentStatus === "held").reduce((sum, order) => sum + Number(order.totalAmount), 0),
            platformFee: orders.reduce((sum, order) => sum + Number(order.platformFee), 0),
            activeOrders: orders.filter(o => ["pending", "paid", "shipped"].includes(o.status)).length,
            activeSellers: sellers.filter(s => s.kycStatus === "verified").length,
            disputeCount: orders.filter(o => o.status === "disputed").length,
        };
    }
}

export const storage = new FileStorage();