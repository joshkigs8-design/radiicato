export type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'ONE SIZE';

export type ProductStatus = 'draft' | 'active' | 'scheduled' | 'archived' | 'sold_out';
export type CollectionStatus = 'draft' | 'scheduled' | 'live' | 'archived';
export type OrderStatus = 'pending' | 'paid' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentProvider = 'mpesa' | 'card' | 'paystack' | 'cash_on_delivery';

export interface ProductImage {
  id: string;
  productId: string;
  url: string;
  altText: string;
  isPrimary: boolean;
  isHover: boolean;
  displayOrder: number;
}

export interface ProductVariant {
  id: string;
  productId: string;
  colorName: string;
  colorHex: string;
  size: Size;
  sku: string;
  priceOverride?: number;
  stockQuantity: number;
  lowStockThreshold: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string;
  price: number; // in KES
  salePrice?: number;
  costPrice?: number;
  sku: string;
  categoryId: string;
  collectionId?: string;
  brand: string;
  material: string;
  fit: string;
  careInstructions: string;
  gender: 'unisex' | 'mens' | 'womens';
  tags: string[];
  status: ProductStatus;
  isFeatured: boolean;
  isLimitedDrop: boolean;
  dropDate?: string;
  dropPieceCount?: number;
  images: ProductImage[];
  variants: ProductVariant[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive';
  seoTitle?: string;
  seoDescription?: string;
  displayOrder: number;
}

export interface Collection {
  id: string;
  name: string;
  slug: string;
  description: string;
  coverImage: string;
  bannerImage: string;
  status: CollectionStatus;
  launchDate?: string;
  displayOrder: number;
  isScheduled: boolean;
  productIds: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: string;
}

export interface CartItem {
  id: string; // unique item key e.g. productId-variantId
  productId: string;
  variantId: string;
  name: string;
  slug: string;
  image: string;
  price: number;
  colorName: string;
  colorHex: string;
  size: Size;
  quantity: number;
  maxStock: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  county: string;
  town: string;
  streetAddress: string;
  deliveryInstructions?: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  variantId: string;
  productName: string;
  variantTitle: string; // e.g. "Black / L"
  sku: string;
  price: number;
  quantity: number;
  total: number;
  imageUrl: string;
}

export interface PaymentDetails {
  provider: PaymentProvider;
  reference: string;
  mpesaReceiptNumber?: string;
  phoneNumber?: string;
  paidAt?: string;
}

export interface OrderTimelineEvent {
  title: string;
  description: string;
  timestamp: string;
}

export interface Order {
  id: string;
  orderNumber: string; // e.g. RAD-2026-000123
  customerId?: string;
  customerName: string;
  email: string;
  phone: string;
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shippingFee: number;
  total: number;
  paymentMethod: PaymentProvider;
  paymentStatus: PaymentStatus;
  fulfillmentStatus: OrderStatus;
  trackingNumber?: string;
  internalNotes?: string;
  paymentDetails?: PaymentDetails;
  timeline: OrderTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  ordersCount: number;
  totalSpent: number;
  lastOrderDate?: string;
  isActive: boolean;
  notes?: string;
  registeredAt: string;
  savedAddresses?: ShippingAddress[];
}

export interface InventoryRecord {
  variantId: string;
  productId: string;
  productName: string;
  color: string;
  size: Size;
  sku: string;
  stock: number;
  lowStockThreshold: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
}

export interface InventoryTransaction {
  id: string;
  variantId: string;
  productName: string;
  variantTitle: string;
  sku: string;
  changeAmount: number;
  previousStock: number;
  newStock: number;
  reason: 'sale' | 'restock' | 'adjustment' | 'return' | 'damaged';
  note?: string;
  createdBy: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  value: number;
  minOrder: number;
  maxDiscount?: number;
  startDate: string;
  endDate?: string;
  usageLimit?: number;
  timesUsed: number;
  isActive: boolean;
  applicableCollections?: string[];
  applicableProducts?: string[];
}

export interface Review {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  isVerifiedPurchase: boolean;
  status: 'approved' | 'pending' | 'rejected';
  createdAt: string;
}

export interface LookbookItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  collectionSlug?: string;
  displayOrder: number;
}

export interface MediaItem {
  id: string;
  fileName: string;
  url: string;
  fileSize: number;
  mimeType: string;
  uploadedAt: string;
}

export interface HomepageCMS {
  heroHeadline: string;
  heroSubheadline: string;
  heroPrimaryCtaText: string;
  heroPrimaryCtaLink: string;
  heroSecondaryCtaText: string;
  heroSecondaryCtaLink: string;
  heroImageUrl: string;
  announcementText: string;
  isAnnouncementActive: boolean;
  featuredCollectionId: string;
  brandStoryTitle: string;
  brandStoryParagraph1: string;
  brandStoryParagraph2: string;
  instagramHandle: string;
}

export interface StoreAnnouncement {
  id: string;
  title: string;
  message: string;
  badge: string;
  type: 'delivery' | 'drop' | 'promo' | 'general';
  linkUrl?: string;
  isActive: boolean;
  priority: number;
  startsAt?: string;
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  type: 'order' | 'inventory' | 'payment' | 'review' | 'system';
  isRead: boolean;
  createdAt: string;
  link?: string;
}

export type AdminRole = 'SUPER_ADMIN' | 'ADMIN' | 'INVENTORY_MANAGER' | 'ORDER_MANAGER' | 'CONTENT_MANAGER';

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  avatarUrl?: string;
  lastLogin?: string;
  status: 'active' | 'suspended';
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  entityType: string;
  entityId: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}

export interface ShippingZone {
  id: string;
  name: string;
  counties: string[];
  standardFee: number;
  expressFee: number;
  freeShippingThreshold: number;
  estimatedDays: string;
}

export interface StoreSettings {
  storeName: string;
  tagline: string;
  contactEmail: string;
  contactPhone: string;
  currency: string;
  country: string;
  address: string;
  mpesaPaybill: string;
  mpesaAccountName: string;
  mpesaPasskey: string;
  paystackPublicKey: string;
  enableMpesa: boolean;
  enablePaystack: boolean;
  socialInstagram: string;
  socialTiktok: string;
  socialTwitter: string;
}

