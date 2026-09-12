'use client';

import { useEffect, useState } from 'react';
import { store } from './store';
import { 
  Product, Category, Collection, CartItem, Order, 
  Review, LookbookItem, HomepageCMS, AdminNotification, 
  AuditLog, StoreSettings, AdminUser 
} from '@/types';

export function useStore() {
  const [, setTick] = useState(0);

  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  return {
    // State Getters
    products: store.getProducts(),
    categories: store.getCategories(),
    collections: store.getCollections(),
    cart: store.getCart(),
    cartSummary: store.getCartTotal(),
    wishlist: store.getWishlist(),
    orders: store.getOrders(),
    coupons: store.getCoupons(),
    reviews: store.getAllReviews(),
    lookbook: store.getLookbook(),
    cms: store.getHomepageCMS(),
    settings: store.getSettings(),
    notifications: store.getNotifications(),
    auditLogs: store.getAuditLogs(),
    currentAdmin: store.getCurrentAdmin(),
    isAdminAuthenticated: store.getIsAdminAuthenticated(),
    adminUsers: store.getAdminUsers(),
    storeAnnouncements: store.getStoreAnnouncements(),
    activeAnnouncement: store.getActiveStoreAnnouncement(),

    // Product & Collection Queries
    getProductBySlug: (slug: string) => store.getProductBySlug(slug),
    getProductById: (id: string) => store.getProductById(id),
    getCollectionBySlug: (slug: string) => store.getCollectionBySlug(slug),
    getOrderById: (id: string) => store.getOrderById(id),
    getReviewsForProduct: (productId: string) => store.getReviewsForProduct(productId),

    // Cart Actions
    addToCart: (item: Parameters<typeof store.addToCart>[0]) => store.addToCart(item),
    updateCartQuantity: (id: string, qty: number) => store.updateCartQuantity(id, qty),
    removeFromCart: (id: string) => store.removeFromCart(id),
    clearCart: () => store.clearCart(),

    // Wishlist Actions
    toggleWishlist: (productId: string) => store.toggleWishlist(productId),
    isInWishlist: (productId: string) => store.isInWishlist(productId),

    // Order & Checkout Actions
    placeOrder: (order: Parameters<typeof store.placeOrder>[0]) => store.placeOrder(order),
    validateCoupon: (code: string, subtotal: number) => store.validateCoupon(code, subtotal),

    // Admin Operations
    saveProduct: (prod: Product) => store.saveProduct(prod),
    deleteProduct: (id: string) => store.deleteProduct(id),
    updateVariantStock: (variantId: string, stock: number, reason: 'adjustment' | 'restock' | 'sale') => 
      store.updateVariantStock(variantId, stock, reason),
    updateOrderStatus: (orderId: string, status: Order['fulfillmentStatus'], note?: string) => 
      store.updateOrderStatus(orderId, status, note),
    updateOrderTracking: (orderId: string, tracking: string, carrier?: string, dispatchDate?: string) => 
      store.updateOrderTracking(orderId, tracking, carrier, dispatchDate),
    saveCollection: (col: Collection) => store.saveCollection(col),
    deleteCollection: (id: string) => store.deleteCollection(id),
    saveCategory: (cat: Category) => store.saveCategory(cat),
    updateHomepageCMS: (cms: Partial<HomepageCMS>) => store.updateHomepageCMS(cms),
    updateSettings: (settings: Partial<StoreSettings>) => store.updateSettings(settings),
    switchAdminRole: (role: AdminUser['role']) => store.switchAdminRole(role),
    loginAdmin: (email: string, role?: Parameters<typeof store.loginAdmin>[1]) => store.loginAdmin(email, role),
    logoutAdmin: () => store.logoutAdmin(),
    registerAdmin: (data: Parameters<typeof store.registerAdmin>[0]) => store.registerAdmin(data),
    requestPasswordReset: (email: string) => store.requestPasswordReset(email),
    completePasswordReset: (email: string, code: string) => store.completePasswordReset(email, code),
    markNotificationRead: (id: string) => store.markNotificationRead(id),
    addReview: (review: Parameters<typeof store.addReview>[0]) => store.addReview(review),
    updateReviewStatus: (reviewId: string, status: Review['status']) => store.updateReviewStatus(reviewId, status),
    
    // Storefront Announcements & Delivery Banners
    addStoreAnnouncement: (ann: Parameters<typeof store.addStoreAnnouncement>[0]) => store.addStoreAnnouncement(ann),
    updateStoreAnnouncement: (id: string, updates: Parameters<typeof store.updateStoreAnnouncement>[1]) => store.updateStoreAnnouncement(id, updates),
    deleteStoreAnnouncement: (id: string) => store.deleteStoreAnnouncement(id),
    toggleStoreAnnouncement: (id: string) => store.toggleStoreAnnouncement(id),
    setActiveStoreAnnouncement: (id: string) => store.setActiveStoreAnnouncement(id),
  };
}

