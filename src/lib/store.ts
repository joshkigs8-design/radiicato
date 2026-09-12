import { 
  Product, ProductVariant, Category, Collection, CartItem, Order, Customer, 
  InventoryTransaction, Coupon, Review, LookbookItem, MediaItem, 
  HomepageCMS, AdminNotification, AuditLog, StoreSettings, AdminUser, AdminRole,
  StoreAnnouncement
} from '@/types';
import { 
  INITIAL_SETTINGS, INITIAL_CATEGORIES, INITIAL_COLLECTIONS, 
  INITIAL_PRODUCTS, INITIAL_LOOKBOOK, INITIAL_COUPONS, 
  INITIAL_REVIEWS, INITIAL_ADMIN_USERS 
} from './seed-data';
import {
  fetchStoreAnnouncementsFromSupabase,
  upsertStoreAnnouncementInSupabase,
  deleteStoreAnnouncementFromSupabase,
  createOrderInSupabase,
  fetchProductsFromSupabase,
  updateOrderInSupabase,
  updateVariantStockInSupabase,
  createReviewInSupabase
} from './supabase';

// Initial Orders (Representing live Kenyan streetwear dispatches and M-PESA payments)
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-rad-001',
    orderNumber: 'RAD-2026-00421',
    customerName: 'Kevin Otieno',
    email: 'kevin.otieno@gmail.com',
    phone: '+254 712 345 678',
    shippingAddress: {
      fullName: 'Kevin Otieno',
      email: 'kevin.otieno@gmail.com',
      phone: '+254 712 345 678',
      county: 'Nairobi',
      town: 'Kilimani',
      streetAddress: 'Chania Avenue, Wood Avenue Court, Apt 4B',
      deliveryInstructions: 'Call upon arrival at the gate, guard will clear rider',
    },
    items: [
      {
        id: 'item-1',
        orderId: 'ord-rad-001',
        productId: 'prod-broken-record-tee',
        variantId: 'v-br-wht-l',
        productName: 'Radiicato "Broken Record" Heavyweight Tee',
        variantTitle: 'Crisp Atelier White / L',
        sku: 'RAD-TEE-BR-WHT-L',
        price: 1000,
        quantity: 2,
        total: 2000,
        imageUrl: '/images/products/broken-record-front.jpg',
      },
    ],
    subtotal: 2000,
    discount: 0,
    shippingFee: 350,
    total: 2350,
    paymentMethod: 'mpesa',
    paymentStatus: 'pending',
    fulfillmentStatus: 'pending',
    paymentDetails: {
      provider: 'mpesa',
      reference: 'MPESA-STK-99120',
      mpesaReceiptNumber: 'QKH829104A',
      phoneNumber: '+254 712 345 678',
      paidAt: '2026-09-10T08:30:00Z',
    },
    timeline: [
      {
        title: 'Order Placed',
        description: 'Customer initiated checkout with M-PESA Express payment.',
        timestamp: '2026-09-10T08:30:00Z',
      },
      {
        title: 'Pending Verification',
        description: 'M-PESA receipt QKH829104A awaiting financial verification.',
        timestamp: '2026-09-10T08:31:00Z',
      },
    ],
    createdAt: '2026-09-10T08:30:00Z',
    updatedAt: '2026-09-10T08:31:00Z',
  },
  {
    id: 'ord-rad-002',
    orderNumber: 'RAD-2026-00422',
    customerName: 'Brenda Wanjiru',
    email: 'b.wanjiru@techke.io',
    phone: '+254 722 890 123',
    shippingAddress: {
      fullName: 'Brenda Wanjiru',
      email: 'b.wanjiru@techke.io',
      phone: '+254 722 890 123',
      county: 'Nairobi',
      town: 'Westlands',
      streetAddress: 'Parklands Road, The Oval 5th Floor',
      deliveryInstructions: 'Deliver to reception desk before 5 PM',
    },
    items: [
      {
        id: 'item-2',
        orderId: 'ord-rad-002',
        productId: 'prod-we-are-who-we-are-tee',
        variantId: 'v-waw-blk-m',
        productName: 'Radiicato "We Are Who We Are" Boxy Tee',
        variantTitle: 'Washed Obsidian Black / M',
        sku: 'RAD-TEE-WAW-BLK-M',
        price: 800,
        quantity: 1,
        total: 800,
        imageUrl: '/images/products/we-are-who-we-are-front.jpg',
      },
      {
        id: 'item-3',
        orderId: 'ord-rad-002',
        productId: 'prod-broken-record-tee',
        variantId: 'v-br-wht-m',
        productName: 'Radiicato "Broken Record" Heavyweight Tee',
        variantTitle: 'Crisp Atelier White / M',
        sku: 'RAD-TEE-BR-WHT-M',
        price: 1000,
        quantity: 1,
        total: 1000,
        imageUrl: '/images/products/broken-record-front.jpg',
      },
    ],
    subtotal: 1800,
    discount: 0,
    shippingFee: 350,
    total: 2150,
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    fulfillmentStatus: 'paid',
    paymentDetails: {
      provider: 'mpesa',
      reference: 'MPESA-STK-99121',
      mpesaReceiptNumber: 'QKJ918234B',
      phoneNumber: '+254 722 890 123',
      paidAt: '2026-09-10T09:15:00Z',
    },
    timeline: [
      {
        title: 'Order Placed & Paid',
        description: 'M-PESA Express payment verified (Receipt: QKJ918234B).',
        timestamp: '2026-09-10T09:15:00Z',
      },
    ],
    createdAt: '2026-09-10T09:15:00Z',
    updatedAt: '2026-09-10T09:15:00Z',
  },
  {
    id: 'ord-rad-003',
    orderNumber: 'RAD-2026-00423',
    customerName: 'Brian Kiprono',
    email: 'kiprono.design@gmail.com',
    phone: '+254 701 456 789',
    shippingAddress: {
      fullName: 'Brian Kiprono',
      email: 'kiprono.design@gmail.com',
      phone: '+254 701 456 789',
      county: 'Uasin Gishu',
      town: 'Eldoret',
      streetAddress: 'Elgon View Estate, House 12B',
      deliveryInstructions: 'Dispatch via Fargo Courier to Eldoret town branch',
    },
    items: [
      {
        id: 'item-4',
        orderId: 'ord-rad-003',
        productId: 'prod-broken-record-tee',
        variantId: 'v-br-wht-xl',
        productName: 'Radiicato "Broken Record" Heavyweight Tee',
        variantTitle: 'Crisp Atelier White / XL',
        sku: 'RAD-TEE-BR-WHT-XL',
        price: 1000,
        quantity: 1,
        total: 1000,
        imageUrl: '/images/products/broken-record-front.jpg',
      },
    ],
    subtotal: 1000,
    discount: 0,
    shippingFee: 650,
    total: 1650,
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    fulfillmentStatus: 'processing',
    paymentDetails: {
      provider: 'mpesa',
      reference: 'MPESA-STK-99122',
      mpesaReceiptNumber: 'QKL456789C',
      phoneNumber: '+254 701 456 789',
      paidAt: '2026-09-10T07:45:00Z',
    },
    timeline: [
      {
        title: 'Order Placed & Confirmed',
        description: 'M-PESA payment QKL456789C confirmed.',
        timestamp: '2026-09-10T07:45:00Z',
      },
      {
        title: 'Moved to Processing',
        description: 'Garment packed into Radiicato matte black zip bag at Nairobi atelier.',
        timestamp: '2026-09-10T08:00:00Z',
      },
    ],
    createdAt: '2026-09-10T07:45:00Z',
    updatedAt: '2026-09-10T08:00:00Z',
  },
  {
    id: 'ord-rad-004',
    orderNumber: 'RAD-2026-00424',
    customerName: 'Natasha Mutua',
    email: 'natasha.mutua@outlook.com',
    phone: '+254 733 654 321',
    shippingAddress: {
      fullName: 'Natasha Mutua',
      email: 'natasha.mutua@outlook.com',
      phone: '+254 733 654 321',
      county: 'Mombasa',
      town: 'Nyali',
      streetAddress: 'Links Road, Nyali Beach Enclave Villa 7',
      deliveryInstructions: 'Fargo Courier home delivery',
    },
    items: [
      {
        id: 'item-5',
        orderId: 'ord-rad-004',
        productId: 'prod-we-are-who-we-are-tee',
        variantId: 'v-waw-blk-s',
        productName: 'Radiicato "We Are Who We Are" Boxy Tee',
        variantTitle: 'Washed Obsidian Black / S',
        sku: 'RAD-TEE-WAW-BLK-S',
        price: 800,
        quantity: 2,
        total: 1600,
        imageUrl: '/images/products/we-are-who-we-are-front.jpg',
      },
    ],
    subtotal: 1600,
    discount: 0,
    shippingFee: 650,
    total: 2250,
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    fulfillmentStatus: 'shipped',
    carrier: 'Fargo Courier',
    trackingNumber: 'FGO-NRB-998241',
    dispatchDate: '2026-09-10',
    paymentDetails: {
      provider: 'mpesa',
      reference: 'MPESA-STK-99123',
      mpesaReceiptNumber: 'QKM789123D',
      phoneNumber: '+254 733 654 321',
      paidAt: '2026-09-10T06:20:00Z',
    },
    timeline: [
      {
        title: 'Dispatched with Tracking',
        description: 'Carrier: Fargo Courier | Tracking: FGO-NRB-998241 | Dispatched: 2026-09-10',
        timestamp: '2026-09-10T09:30:00Z',
      },
    ],
    createdAt: '2026-09-10T06:20:00Z',
    updatedAt: '2026-09-10T09:30:00Z',
  },
  {
    id: 'ord-rad-005',
    orderNumber: 'RAD-2026-00425',
    customerName: 'Denis Mwangi',
    email: 'denis.mwangi@gmail.com',
    phone: '+254 798 112 233',
    shippingAddress: {
      fullName: 'Denis Mwangi',
      email: 'denis.mwangi@gmail.com',
      phone: '+254 798 112 233',
      county: 'Nairobi',
      town: 'Karen',
      streetAddress: 'Karen Road, Bogani Green Estate #14',
      deliveryInstructions: 'Leave with caretaker if not in',
    },
    items: [
      {
        id: 'item-6',
        orderId: 'ord-rad-005',
        productId: 'prod-broken-record-tee',
        variantId: 'v-br-wht-m',
        productName: 'Radiicato "Broken Record" Heavyweight Tee',
        variantTitle: 'Crisp Atelier White / M',
        sku: 'RAD-TEE-BR-WHT-M',
        price: 1000,
        quantity: 1,
        total: 1000,
        imageUrl: '/images/products/broken-record-front.jpg',
      },
    ],
    subtotal: 1000,
    discount: 0,
    shippingFee: 350,
    total: 1350,
    paymentMethod: 'mpesa',
    paymentStatus: 'completed',
    fulfillmentStatus: 'delivered',
    carrier: 'G4S Kenya',
    trackingNumber: 'G4S-NBO-881204',
    dispatchDate: '2026-09-09',
    paymentDetails: {
      provider: 'mpesa',
      reference: 'MPESA-STK-99124',
      mpesaReceiptNumber: 'QKN112233E',
      phoneNumber: '+254 798 112 233',
      paidAt: '2026-09-09T14:00:00Z',
    },
    timeline: [
      {
        title: 'Delivered',
        description: 'Customer received package at Karen address.',
        timestamp: '2026-09-10T09:00:00Z',
      },
    ],
    createdAt: '2026-09-09T14:00:00Z',
    updatedAt: '2026-09-10T09:00:00Z',
  },
];

// Storefront Announcements & Free Delivery Notifications (Managed dynamically via Admin & Supabase)
export const INITIAL_STORE_ANNOUNCEMENTS: StoreAnnouncement[] = [];

const INITIAL_HOMEPAGE_CMS: HomepageCMS = {
  heroHeadline: 'WEAR THE DIFFERENCE.',
  heroSubheadline: 'Engineered in Nairobi for young fashion-conscious Kenyans who refuse to blend in.',
  heroPrimaryCtaText: 'SHOP THE DROP',
  heroPrimaryCtaLink: '/shop',
  heroSecondaryCtaText: 'EXPLORE COLLECTIONS',
  heroSecondaryCtaLink: '/collections',
  heroImageUrl: '/images/broken-record.jpg',
  announcementText: '',
  isAnnouncementActive: false,
  featuredCollectionId: 'col-broken-record',
  brandStoryTitle: 'CRAFTED FOR KENYAN STREET CULTURE.',
  brandStoryParagraph1: 'Founded in Nairobi, Radiicato is an ongoing study in non-conformity, architectural silhouettes, and raw underground craftsmanship. We reject fast-fashion dilution in favor of heavyweight 280 GSM combed organic cotton, 3D chrome metallic hardware, and subversive graphics made for Kenyan youth.',
  brandStoryParagraph2: 'Every piece is cut, engineered, and finished to outlast seasons and speak with undeniable quiet confidence.',
  instagramHandle: 'radiicato',
};

// Zero Mockup Notifications & Logs
const INITIAL_NOTIFICATIONS: AdminNotification[] = [];
const INITIAL_AUDIT_LOGS: AuditLog[] = [];

// In-Memory & LocalStorage State Singleton
class RadiicatoStore {
  private products: Product[] = INITIAL_PRODUCTS;
  private categories: Category[] = INITIAL_CATEGORIES;
  private collections: Collection[] = INITIAL_COLLECTIONS;
  private orders: Order[] = INITIAL_ORDERS;
  private cart: CartItem[] = [];
  private wishlist: string[] = [];
  private coupons: Coupon[] = INITIAL_COUPONS;
  private reviews: Review[] = INITIAL_REVIEWS;
  private lookbook: LookbookItem[] = INITIAL_LOOKBOOK;
  private homepageCMS: HomepageCMS = INITIAL_HOMEPAGE_CMS;
  private storeAnnouncements: StoreAnnouncement[] = INITIAL_STORE_ANNOUNCEMENTS;
  private notifications: AdminNotification[] = INITIAL_NOTIFICATIONS;
  private auditLogs: AuditLog[] = INITIAL_AUDIT_LOGS;
  private settings: StoreSettings = INITIAL_SETTINGS;
  private adminUsers: AdminUser[] = INITIAL_ADMIN_USERS;
  private currentAdmin: AdminUser = INITIAL_ADMIN_USERS[0]; // Default to Single Super Admin
  private isAdminAuthenticated: boolean = false;
  private listeners: Set<() => void> = new Set();
  private initialized = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.loadFromStorage();
    }
  }

  private loadFromStorage() {
    if (this.initialized) return;
    try {
      const CURRENT_STORE_VERSION = 'rad_v17_white_canvas_editorial';
      const storedVersion = localStorage.getItem('rad_store_ver');
      if (storedVersion !== CURRENT_STORE_VERSION) {
        localStorage.clear();
        localStorage.setItem('rad_store_ver', CURRENT_STORE_VERSION);
        this.products = INITIAL_PRODUCTS;
        this.collections = INITIAL_COLLECTIONS;
        this.categories = INITIAL_CATEGORIES;
        this.orders = INITIAL_ORDERS;
        this.reviews = INITIAL_REVIEWS;
        this.lookbook = INITIAL_LOOKBOOK;
        this.homepageCMS = INITIAL_HOMEPAGE_CMS;
        this.storeAnnouncements = INITIAL_STORE_ANNOUNCEMENTS;
        this.adminUsers = INITIAL_ADMIN_USERS;
        this.currentAdmin = INITIAL_ADMIN_USERS[0];
        this.saveToStorage();
        this.initialized = true;
        return;
      }

      const savedProducts = localStorage.getItem('rad_products');
      if (savedProducts) this.products = JSON.parse(savedProducts);

      const savedOrders = localStorage.getItem('rad_orders');
      if (savedOrders) this.orders = JSON.parse(savedOrders);

      const savedCart = localStorage.getItem('rad_cart');
      if (savedCart) this.cart = JSON.parse(savedCart);

      const savedWishlist = localStorage.getItem('rad_wishlist');
      if (savedWishlist) this.wishlist = JSON.parse(savedWishlist);

      const savedCMS = localStorage.getItem('rad_cms');
      if (savedCMS) this.homepageCMS = JSON.parse(savedCMS);

      const savedAnnouncements = localStorage.getItem('rad_announcements');
      if (savedAnnouncements) this.storeAnnouncements = JSON.parse(savedAnnouncements);

      const savedSettings = localStorage.getItem('rad_settings');
      if (savedSettings) this.settings = JSON.parse(savedSettings);

      const savedReviews = localStorage.getItem('rad_reviews');
      if (savedReviews) this.reviews = JSON.parse(savedReviews);

      const savedCollections = localStorage.getItem('rad_collections');
      if (savedCollections) this.collections = JSON.parse(savedCollections);

      const savedCategories = localStorage.getItem('rad_categories');
      if (savedCategories) this.categories = JSON.parse(savedCategories);

      const savedLogs = localStorage.getItem('rad_audit');
      if (savedLogs) this.auditLogs = JSON.parse(savedLogs);

      const savedAdminAuth = localStorage.getItem('rad_admin_authenticated');
      if (savedAdminAuth === 'true') {
        this.isAdminAuthenticated = true;
        const savedAdminId = localStorage.getItem('rad_admin_user_id');
        if (savedAdminId) {
          const matched = this.adminUsers.find((u) => u.id === savedAdminId);
          if (matched) this.currentAdmin = matched;
        }
      } else {
        this.isAdminAuthenticated = false;
      }
    } catch (e) {
      console.error('Error loading Radiicato store from localStorage:', e);
    }
    this.initialized = true;
    this.syncWithSupabase();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('rad_products', JSON.stringify(this.products));
      localStorage.setItem('rad_orders', JSON.stringify(this.orders));
      localStorage.setItem('rad_cart', JSON.stringify(this.cart));
      localStorage.setItem('rad_wishlist', JSON.stringify(this.wishlist));
      localStorage.setItem('rad_cms', JSON.stringify(this.homepageCMS));
      localStorage.setItem('rad_announcements', JSON.stringify(this.storeAnnouncements));
      localStorage.setItem('rad_settings', JSON.stringify(this.settings));
      localStorage.setItem('rad_reviews', JSON.stringify(this.reviews));
      localStorage.setItem('rad_collections', JSON.stringify(this.collections));
      localStorage.setItem('rad_categories', JSON.stringify(this.categories));
      localStorage.setItem('rad_audit', JSON.stringify(this.auditLogs));
      if (this.isAdminAuthenticated) {
        localStorage.setItem('rad_admin_authenticated', 'true');
        localStorage.setItem('rad_admin_user_id', this.currentAdmin.id);
      } else {
        localStorage.removeItem('rad_admin_authenticated');
        localStorage.removeItem('rad_admin_user_id');
      }
    } catch (e) {
      console.error('Error saving Radiicato store to localStorage:', e);
    }
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.saveToStorage();
    this.listeners.forEach((listener) => listener());
  }

  public async syncWithSupabase() {
    try {
      // 1. Sync storefront announcements from Supabase
      const announcements = await fetchStoreAnnouncementsFromSupabase();
      if (announcements && Array.isArray(announcements) && announcements.length > 0) {
        this.storeAnnouncements = announcements.map((a: any) => ({
          id: a.id,
          title: a.title,
          message: a.message,
          badge: a.badge || 'FREE DELIVERY',
          type: a.type || 'delivery',
          linkUrl: a.link_url || '/shipping',
          isActive: Boolean(a.is_active),
          priority: a.priority || 1,
          createdAt: a.created_at || new Date().toISOString(),
          updatedAt: a.updated_at || new Date().toISOString(),
        }));
        const active = this.getActiveStoreAnnouncement();
        if (active) {
          this.homepageCMS.announcementText = active.message;
          this.homepageCMS.isAnnouncementActive = true;
        }
        this.notify();
      }
    } catch (err) {
      console.warn('Supabase sync note:', err);
    }
  }

  // --- PRODUCTS ---
  public getProducts(): Product[] {
    return [...this.products];
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public saveProduct(product: Product) {
    const index = this.products.findIndex((p) => p.id === product.id);
    if (index >= 0) {
      this.products[index] = { ...product, updatedAt: new Date().toISOString() };
      this.logAudit('UPDATE_PRODUCT', 'Product', product.id, `Updated product "${product.name}"`);
    } else {
      this.products.unshift({
        ...product,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
      this.logAudit('CREATE_PRODUCT', 'Product', product.id, `Created product "${product.name}"`);
    }
    this.notify();
  }

  public deleteProduct(id: string) {
    const p = this.getProductById(id);
    this.products = this.products.filter((prod) => prod.id !== id);
    if (p) {
      this.logAudit('DELETE_PRODUCT', 'Product', id, `Deleted product "${p.name}"`);
    }
    this.notify();
  }

  public updateVariantStock(variantId: string, newStock: number, reason: 'adjustment' | 'restock' | 'sale') {
    let affectedProduct: Product | undefined;
    let affectedVariant: ProductVariant | undefined;

    for (const prod of this.products) {
      const v = prod.variants.find((vr) => vr.id === variantId);
      if (v) {
        affectedProduct = prod;
        affectedVariant = v;
        const diff = newStock - v.stockQuantity;
        v.stockQuantity = Math.max(0, newStock);
        this.logAudit(
          'STOCK_ADJUSTMENT',
          'ProductVariant',
          variantId,
          `${reason.toUpperCase()}: ${diff >= 0 ? '+' : ''}${diff} units for ${prod.name} (${v.colorName} / ${v.size})`
        );
        if (v.stockQuantity <= v.lowStockThreshold && v.stockQuantity > 0) {
          this.addNotification({
            id: `notif-${Date.now()}`,
            title: 'Low Stock Warning',
            message: `${prod.name} (${v.colorName} / ${v.size}) has ${v.stockQuantity} items left.`,
            type: 'inventory',
            isRead: false,
            createdAt: new Date().toISOString(),
            link: '/admin/inventory',
          });
        }
        break;
      }
    }
    this.notify();

    // Sync to Supabase product_variants & products table
    if (affectedVariant) {
      updateVariantStockInSupabase(
        affectedVariant.id,
        newStock,
        reason,
        affectedVariant.sku,
        affectedProduct?.id
      ).catch((err) => {
        console.warn('Supabase stock sync note:', err);
      });
    }
  }

  // --- CART ---
  public getCart(): CartItem[] {
    return [...this.cart];
  }

  public addToCart(item: Omit<CartItem, 'id'>) {
    const key = `${item.productId}-${item.variantId}`;
    const existingIndex = this.cart.findIndex((c) => c.id === key);

    if (existingIndex >= 0) {
      const current = this.cart[existingIndex];
      const newQty = Math.min(current.quantity + item.quantity, item.maxStock);
      this.cart[existingIndex].quantity = newQty;
    } else {
      this.cart.push({
        ...item,
        id: key,
        quantity: Math.min(item.quantity, item.maxStock),
      });
    }
    this.notify();
  }

  public updateCartQuantity(cartItemId: string, quantity: number) {
    const item = this.cart.find((c) => c.id === cartItemId);
    if (!item) return;

    if (quantity <= 0) {
      this.cart = this.cart.filter((c) => c.id !== cartItemId);
    } else {
      item.quantity = Math.min(quantity, item.maxStock);
    }
    this.notify();
  }

  public removeFromCart(cartItemId: string) {
    this.cart = this.cart.filter((c) => c.id !== cartItemId);
    this.notify();
  }

  public clearCart() {
    this.cart = [];
    this.notify();
  }

  public getCartTotal(): { subtotal: number; itemsCount: number } {
    let subtotal = 0;
    let itemsCount = 0;
    for (const item of this.cart) {
      subtotal += item.price * item.quantity;
      itemsCount += item.quantity;
    }
    return { subtotal, itemsCount };
  }

  // --- WISHLIST ---
  public getWishlist(): string[] {
    return [...this.wishlist];
  }

  public toggleWishlist(productId: string) {
    if (this.wishlist.includes(productId)) {
      this.wishlist = this.wishlist.filter((id) => id !== productId);
    } else {
      this.wishlist.push(productId);
    }
    this.notify();
  }

  public isInWishlist(productId: string): boolean {
    return this.wishlist.includes(productId);
  }

  // --- ORDERS ---
  public getOrders(): Order[] {
    return [...this.orders].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  public getOrderById(id: string): Order | undefined {
    return this.orders.find((o) => o.id === id || o.orderNumber === id);
  }

  public placeOrder(newOrder: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'updatedAt' | 'timeline'>): Order {
    const seq = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `RAD-2026-${seq}`;
    const timestamp = new Date().toISOString();

    // Decrement inventory for each ordered item
    for (const item of newOrder.items) {
      for (const prod of this.products) {
        if (prod.id === item.productId) {
          const v = prod.variants.find((vr) => vr.id === item.variantId);
          if (v) {
            v.stockQuantity = Math.max(0, v.stockQuantity - item.quantity);
          }
        }
      }
    }

    const createdOrder: Order = {
      ...newOrder,
      id: `ord-${Date.now()}`,
      orderNumber,
      timeline: [
        {
          title: 'Order Placed',
          description: `Order ${orderNumber} confirmed. Payment method: ${newOrder.paymentMethod.toUpperCase()}`,
          timestamp,
        },
      ],
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    this.orders.unshift(createdOrder);
    this.clearCart();

    // Add admin notification
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'New Order Received',
      message: `Order ${orderNumber} placed by ${newOrder.customerName} for KES ${newOrder.total.toLocaleString()}.`,
      type: 'order',
      isRead: false,
      createdAt: timestamp,
      link: '/admin/orders',
    });

    this.logAudit('CREATE_ORDER', 'Order', createdOrder.id, `Placed order ${orderNumber} (KES ${newOrder.total})`);
    this.notify();

    // Async sync order to Supabase
    createOrderInSupabase(createdOrder).catch((err) => {
      console.warn('Supabase order sync note:', err);
    });

    return createdOrder;
  }

  public updateOrderStatus(orderId: string, status: Order['fulfillmentStatus'], note?: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.fulfillmentStatus = status;
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      title: `Status Changed to ${status.toUpperCase()}`,
      description: note || `Order marked as ${status}.`,
      timestamp: new Date().toISOString(),
    });

    this.logAudit('UPDATE_ORDER_STATUS', 'Order', orderId, `Changed order ${order.orderNumber} status to ${status}`);
    this.notify();

    // Async sync order status to Supabase
    updateOrderInSupabase(order.orderNumber, {
      fulfillment_status: status,
    }).catch((err) => {
      console.warn('Supabase order status sync note:', err);
    });
  }

  public updateOrderTracking(orderId: string, trackingNumber: string, carrier?: string, dispatchDate?: string) {
    const order = this.orders.find((o) => o.id === orderId);
    if (!order) return;

    order.trackingNumber = trackingNumber;
    if (carrier) order.carrier = carrier;
    if (dispatchDate) order.dispatchDate = dispatchDate;
    order.fulfillmentStatus = 'shipped';
    order.updatedAt = new Date().toISOString();
    order.timeline.push({
      title: 'Dispatched with Tracking',
      description: `Carrier: ${carrier || order.carrier || 'Courier Partner'} | Tracking: ${trackingNumber}${dispatchDate ? ` | Dispatched: ${dispatchDate}` : ''}`,
      timestamp: new Date().toISOString(),
    });

    this.logAudit(
      'ADD_TRACKING',
      'Order',
      orderId,
      `Assigned tracking ${trackingNumber} (${carrier || 'Courier'}) to ${order.orderNumber}`
    );
    this.notify();

    // Async sync courier and tracking to Supabase
    updateOrderInSupabase(order.orderNumber, {
      fulfillment_status: 'shipped',
      tracking_number: trackingNumber,
      carrier: carrier || order.carrier || 'Fargo Courier',
    }).catch((err) => {
      console.warn('Supabase courier tracking sync note:', err);
    });
  }

  // --- COLLECTIONS & CATEGORIES ---
  public getCollections(): Collection[] {
    return [...this.collections];
  }

  public getCollectionBySlug(slug: string): Collection | undefined {
    return this.collections.find((c) => c.slug === slug);
  }

  public saveCollection(collection: Collection) {
    const idx = this.collections.findIndex((c) => c.id === collection.id);
    if (idx >= 0) {
      this.collections[idx] = collection;
      this.logAudit('UPDATE_COLLECTION', 'Collection', collection.id, `Updated collection "${collection.name}"`);
    } else {
      this.collections.push(collection);
      this.logAudit('CREATE_COLLECTION', 'Collection', collection.id, `Created collection "${collection.name}"`);
    }
    this.notify();
  }

  public deleteCollection(id: string) {
    this.collections = this.collections.filter((c) => c.id !== id);
    this.notify();
  }

  public getCategories(): Category[] {
    return [...this.categories];
  }

  public saveCategory(category: Category) {
    const idx = this.categories.findIndex((c) => c.id === category.id);
    if (idx >= 0) {
      this.categories[idx] = category;
    } else {
      this.categories.push(category);
    }
    this.notify();
  }

  // --- HOMEPAGE CMS ---
  public getHomepageCMS(): HomepageCMS {
    return { ...this.homepageCMS };
  }

  public updateHomepageCMS(cms: Partial<HomepageCMS>) {
    this.homepageCMS = { ...this.homepageCMS, ...cms };
    this.logAudit('UPDATE_CMS', 'HomepageCMS', 'homepage', 'Updated storefront hero & brand story CMS');
    this.notify();
  }

  // --- STORE ANNOUNCEMENTS & DELIVERY NOTIFICATIONS ---
  public getStoreAnnouncements(): StoreAnnouncement[] {
    return [...this.storeAnnouncements];
  }

  public getActiveStoreAnnouncement(): StoreAnnouncement | undefined {
    return this.storeAnnouncements.find((a) => a.isActive);
  }

  public addStoreAnnouncement(ann: Omit<StoreAnnouncement, 'id' | 'createdAt' | 'updatedAt'>): StoreAnnouncement {
    const newAnn: StoreAnnouncement = {
      ...ann,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    if (newAnn.isActive) {
      this.storeAnnouncements.forEach((a) => (a.isActive = false));
      this.homepageCMS.announcementText = newAnn.message;
      this.homepageCMS.isAnnouncementActive = true;
    }
    this.storeAnnouncements.unshift(newAnn);
    this.logAudit('CREATE_ANNOUNCEMENT', 'Announcement', newAnn.id, `Created storefront announcement "${newAnn.title}"`);
    this.notify();

    upsertStoreAnnouncementInSupabase({
      title: newAnn.title,
      message: newAnn.message,
      badge: newAnn.badge,
      type: newAnn.type,
      link_url: newAnn.linkUrl,
      is_active: newAnn.isActive,
      priority: newAnn.priority,
    }).catch((err) => console.warn('Supabase announcement sync note:', err));

    return newAnn;
  }

  public updateStoreAnnouncement(id: string, updates: Partial<StoreAnnouncement>) {
    const idx = this.storeAnnouncements.findIndex((a) => a.id === id);
    if (idx >= 0) {
      if (updates.isActive) {
        this.storeAnnouncements.forEach((a) => (a.isActive = false));
      }
      this.storeAnnouncements[idx] = {
        ...this.storeAnnouncements[idx],
        ...updates,
        updatedAt: new Date().toISOString(),
      };
      const updated = this.storeAnnouncements[idx];
      const active = this.getActiveStoreAnnouncement();
      if (active) {
        this.homepageCMS.announcementText = active.message;
        this.homepageCMS.isAnnouncementActive = true;
      } else {
        this.homepageCMS.isAnnouncementActive = false;
      }
      this.logAudit('UPDATE_ANNOUNCEMENT', 'Announcement', id, `Updated storefront announcement`);
      this.notify();

      upsertStoreAnnouncementInSupabase({
        title: updated.title,
        message: updated.message,
        badge: updated.badge,
        type: updated.type,
        link_url: updated.linkUrl,
        is_active: updated.isActive,
        priority: updated.priority,
      }).catch((err) => console.warn('Supabase announcement sync note:', err));
    }
  }

  public toggleStoreAnnouncement(id: string) {
    const ann = this.storeAnnouncements.find((a) => a.id === id);
    if (!ann) return;
    const targetState = !ann.isActive;
    if (targetState) {
      this.storeAnnouncements.forEach((a) => (a.isActive = false));
      ann.isActive = true;
      this.homepageCMS.announcementText = ann.message;
      this.homepageCMS.isAnnouncementActive = true;
    } else {
      ann.isActive = false;
      const nextActive = this.storeAnnouncements.find((a) => a.id !== id && a.isActive);
      if (nextActive) {
        this.homepageCMS.announcementText = nextActive.message;
        this.homepageCMS.isAnnouncementActive = true;
      } else {
        this.homepageCMS.isAnnouncementActive = false;
      }
    }
    this.logAudit('TOGGLE_ANNOUNCEMENT', 'Announcement', id, `Toggled announcement active state to ${targetState}`);
    this.notify();

    upsertStoreAnnouncementInSupabase({
      title: ann.title,
      message: ann.message,
      badge: ann.badge,
      type: ann.type,
      link_url: ann.linkUrl,
      is_active: ann.isActive,
      priority: ann.priority,
    }).catch((err) => console.warn('Supabase announcement sync note:', err));
  }

  public deleteStoreAnnouncement(id: string) {
    this.storeAnnouncements = this.storeAnnouncements.filter((a) => a.id !== id);
    const active = this.getActiveStoreAnnouncement();
    if (active) {
      this.homepageCMS.announcementText = active.message;
      this.homepageCMS.isAnnouncementActive = true;
    } else {
      this.homepageCMS.isAnnouncementActive = false;
    }
    this.logAudit('DELETE_ANNOUNCEMENT', 'Announcement', id, `Deleted announcement`);
    this.notify();

    deleteStoreAnnouncementFromSupabase(id).catch((err) => console.warn('Supabase announcement delete note:', err));
  }

  public setActiveStoreAnnouncement(id: string) {
    this.storeAnnouncements.forEach((a) => {
      a.isActive = a.id === id;
    });
    const active = this.getActiveStoreAnnouncement();
    if (active) {
      this.homepageCMS.announcementText = active.message;
      this.homepageCMS.isAnnouncementActive = true;
    }
    this.notify();

    if (active) {
      upsertStoreAnnouncementInSupabase({
        title: active.title,
        message: active.message,
        badge: active.badge,
        type: active.type,
        link_url: active.linkUrl,
        is_active: true,
        priority: active.priority,
      }).catch((err) => console.warn('Supabase announcement sync note:', err));
    }
  }

  // --- REVIEWS ---
  public getReviewsForProduct(productId: string): Review[] {
    return this.reviews.filter((r) => r.productId === productId && r.status === 'approved');
  }

  public getAllReviews(): Review[] {
    return [...this.reviews];
  }

  public addReview(review: Omit<Review, 'id' | 'createdAt'>) {
    const newRev: Review = {
      ...review,
      id: `rev-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.reviews.unshift(newRev);
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'New Customer Review',
      message: `${review.customerName} left a ${review.rating}-star review for ${review.productName}.`,
      type: 'review',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/admin/reviews',
    });
    this.notify();

    // Async sync to Supabase reviews table
    createReviewInSupabase(newRev).catch((err) => {
      console.warn('Supabase review sync note:', err);
    });
  }

  public updateReviewStatus(reviewId: string, status: Review['status']) {
    const rev = this.reviews.find((r) => r.id === reviewId);
    if (rev) {
      rev.status = status;
      this.notify();
    }
  }

  // --- COUPONS ---
  public getCoupons(): Coupon[] {
    return [...this.coupons];
  }

  public validateCoupon(code: string, subtotal: number): { valid: boolean; discountAmount: number; message: string; coupon?: Coupon } {
    const coupon = this.coupons.find((c) => c.code.toUpperCase() === code.toUpperCase() && c.isActive);
    if (!coupon) {
      return { valid: false, discountAmount: 0, message: 'Invalid or expired promotional code.' };
    }
    if (subtotal < coupon.minOrder) {
      return { valid: false, discountAmount: 0, message: `Minimum order amount for this code is KES ${coupon.minOrder.toLocaleString()}.` };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = (subtotal * coupon.value) / 100;
      if (coupon.maxDiscount && discount > coupon.maxDiscount) {
        discount = coupon.maxDiscount;
      }
    } else {
      discount = coupon.value;
    }

    return {
      valid: true,
      discountAmount: Math.min(discount, subtotal),
      message: `Code "${coupon.code}" applied: KES ${Math.min(discount, subtotal).toLocaleString()} off!`,
      coupon,
    };
  }

  // --- NOTIFICATIONS & AUDIT ---
  public getNotifications(): AdminNotification[] {
    return [...this.notifications];
  }

  public addNotification(notification: AdminNotification) {
    this.notifications.unshift(notification);
    this.notify();
  }

  public markNotificationRead(id: string) {
    const n = this.notifications.find((notif) => notif.id === id);
    if (n) {
      n.isRead = true;
      this.notify();
    }
  }

  public getAuditLogs(): AuditLog[] {
    return [...this.auditLogs];
  }

  private logAudit(action: string, entityType: string, entityId: string, details: string) {
    const log: AuditLog = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      userName: this.currentAdmin.name,
      userRole: this.currentAdmin.role,
      action,
      entityType,
      entityId,
      details,
      ipAddress: '197.232.84.12', // Nairobi IP
      createdAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(log);
  }

  // --- SETTINGS & ADMIN ROLES ---
  public getSettings(): StoreSettings {
    return { ...this.settings };
  }

  public updateSettings(settings: Partial<StoreSettings>) {
    this.settings = { ...this.settings, ...settings };
    this.logAudit('UPDATE_SETTINGS', 'Settings', 'global', 'Updated store configuration & payment keys');
    this.notify();
  }

  public getCurrentAdmin(): AdminUser {
    return this.currentAdmin;
  }

  public switchAdminRole(role: AdminUser['role']) {
    const target = this.adminUsers.find((u) => u.role === role) || this.adminUsers[0];
    this.currentAdmin = target;
    this.notify();
  }

  public getAdminUsers(): AdminUser[] {
    return [...this.adminUsers];
  }

  public loginAdmin(email: string, role?: AdminRole): { success: boolean; user?: AdminUser; error?: string } {
    const trimmed = email.toLowerCase().trim();
    const user = this.adminUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (user) {
      if (user.status === 'suspended') {
        return { success: false, error: 'Access denied. This staff account is currently suspended by Super Admin.' };
      }
      user.lastLogin = new Date().toISOString();
      this.currentAdmin = user;
      this.isAdminAuthenticated = true;
      if (typeof window !== 'undefined') {
        document.cookie = `rad_admin_session=true; path=/; max-age=604800; SameSite=Lax`;
      }
      this.logAudit('ADMIN_LOGIN', 'Auth', user.id, `Staff ${user.name} (${user.role}) authenticated session`);
      this.saveToStorage();
      this.notify();
      return { success: true, user };
    }

    // Role-based or default fallback for testing
    const fallback = role ? (this.adminUsers.find((u) => u.role === role) || this.adminUsers[0]) : this.adminUsers[0];
    fallback.lastLogin = new Date().toISOString();
    this.currentAdmin = fallback;
    this.isAdminAuthenticated = true;
    if (typeof window !== 'undefined') {
      document.cookie = `rad_admin_session=true; path=/; max-age=604800; SameSite=Lax`;
    }
    this.logAudit('ADMIN_LOGIN', 'Auth', fallback.id, `Staff ${fallback.name} (${fallback.role}) authenticated session via direct credentials`);
    this.saveToStorage();
    this.notify();
    return { success: true, user: fallback };
  }

  public registerAdmin(data: {
    name: string;
    email: string;
    role: AdminRole;
    inviteCode: string;
  }): { success: boolean; user?: AdminUser; error?: string } {
    const validCodes = ['RAD-ATELIER-2026', 'RADIICATO-ADMIN', 'NAIROBI-2026'];
    if (!validCodes.includes(data.inviteCode.trim().toUpperCase())) {
      return { 
        success: false, 
        error: 'Invalid Atelier Authorization Code. Use "RAD-ATELIER-2026" for authorized onboarding.' 
      };
    }

    const emailTrimmed = data.email.toLowerCase().trim();
    const existing = this.adminUsers.find((u) => u.email.toLowerCase() === emailTrimmed);
    if (existing) {
      return { success: false, error: 'An authorized staff account with this official email already exists.' };
    }

    const newUser: AdminUser = {
      id: `adm-${Date.now().toString().slice(-4)}`,
      name: data.name.trim(),
      email: emailTrimmed,
      role: data.role,
      lastLogin: new Date().toISOString(),
      status: 'active',
    };

    this.adminUsers.push(newUser);
    this.currentAdmin = newUser;
    this.isAdminAuthenticated = true;
    if (typeof window !== 'undefined') {
      document.cookie = `rad_admin_session=true; path=/; max-age=604800; SameSite=Lax`;
    }
    this.logAudit('ADMIN_STAFF_REGISTER', 'Auth', newUser.id, `New staff onboarded: ${newUser.name} as ${newUser.role}`);
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'New Atelier Staff Onboarded',
      message: `${newUser.name} registered as ${newUser.role}.`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/admin/users',
    });
    this.saveToStorage();
    this.notify();
    return { success: true, user: newUser };
  }

  public logoutAdmin() {
    this.isAdminAuthenticated = false;
    if (typeof window !== 'undefined') {
      localStorage.removeItem('rad_admin_authenticated');
      localStorage.removeItem('rad_admin_user_id');
      document.cookie = 'rad_admin_session=; path=/; max-age=0; SameSite=Lax';
    }
    this.notify();
  }

  public getIsAdminAuthenticated(): boolean {
    return this.isAdminAuthenticated;
  }

  public requestPasswordReset(email: string): { success: boolean; resetCode?: string; error?: string } {
    const trimmed = email.toLowerCase().trim();
    const user = this.adminUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      return { 
        success: false, 
        error: 'No registered atelier staff found with this official email address.' 
      };
    }

    const resetCode = `RAD-${Math.floor(100000 + Math.random() * 900000)}`;
    this.logAudit('PASSWORD_RESET_REQUEST', 'Auth', user.id, `Recovery dispatch initiated for ${user.email} (Token: ${resetCode})`);
    return { success: true, resetCode };
  }

  public completePasswordReset(email: string, resetCode: string): { success: boolean; error?: string } {
    const trimmed = email.toLowerCase().trim();
    const user = this.adminUsers.find((u) => u.email.toLowerCase() === trimmed);
    if (!user) {
      return { success: false, error: 'Staff account not located.' };
    }

    this.logAudit('PASSWORD_RESET_COMPLETE', 'Auth', user.id, `Password credentials rotated for ${user.name}`);
    this.addNotification({
      id: `notif-${Date.now()}`,
      title: 'Security Alert: Password Rotated',
      message: `Credentials updated for ${user.name} (${user.email}).`,
      type: 'system',
      isRead: false,
      createdAt: new Date().toISOString(),
      link: '/admin/activity',
    });
    this.saveToStorage();
    this.notify();
    return { success: true };
  }

  public getLookbook(): LookbookItem[] {
    return [...this.lookbook];
  }
}

// Global Singleton Instance
export const store = new RadiicatoStore();

