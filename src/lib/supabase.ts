import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database.types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://mmxosaqhcuikgbzqlpgk.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_AH27_5iybTl_L7ixQuVWsg_f-KyshKa';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1teG9zYXFoY3Vpa2dienFscGdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODYyNzQ4OCwiZXhwIjoyMDk0MjAzNDg4fQ.9SUBRBm-M7CBRRo7F-JNgYGC-uGP1hihLErr1KtNC4U';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey || supabaseAnonKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

export type StorageBucket = 'collections' | 'products' | 'lookbook' | 'media';

/**
 * Upload an image file directly to a Supabase Storage bucket.
 * Automatically generates a unique, sanitized path if not specified.
 */
export async function uploadImageToStorage(
  bucket: StorageBucket,
  file: File,
  customPath?: string
): Promise<{ success: boolean; url: string; path: string; error?: string }> {
  if (!supabase) {
    // If Supabase is not configured yet, generate a local blob URL for seamless UI preview
    const localUrl = URL.createObjectURL(file);
    return {
      success: true,
      url: localUrl,
      path: `local-preview/${file.name}`,
    };
  }

  try {
    const fileExt = file.name.split('.').pop();
    const cleanFileName = file.name
      .replace(/\.[^/.]+$/, '')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const filePath = customPath || `${cleanFileName}_${Date.now()}.${fileExt}`;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error) {
      console.error(`Supabase Storage Upload Error (${bucket}):`, error.message);
      return { success: false, url: '', path: '', error: error.message };
    }

    const { data: publicUrlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    return {
      success: true,
      url: publicUrlData.publicUrl,
      path: data.path,
    };
  } catch (err: any) {
    console.error('Unexpected Storage Upload Failure:', err);
    return { success: false, url: '', path: '', error: err.message || 'Unknown error' };
  }
}

/**
 * Helper to upload a collection banner or cover photo.
 */
export async function uploadCollectionPhoto(
  collectionSlug: string,
  file: File,
  photoType: 'cover' | 'banner' | 'gallery'
) {
  const fileExt = file.name.split('.').pop();
  const path = `${collectionSlug}/${photoType}_${Date.now()}.${fileExt}`;
  return uploadImageToStorage('collections', file, path);
}

/**
 * Helper to upload a product photo (front, back, flat-lay, detail).
 */
export async function uploadProductPhoto(
  productSlug: string,
  file: File,
  viewType: 'front' | 'back' | 'full' | 'detail' | 'model' | 'flat_lay'
) {
  const fileExt = file.name.split('.').pop();
  const path = `${productSlug}/${viewType}_${Date.now()}.${fileExt}`;
  return uploadImageToStorage('products', file, path);
}

/**
 * Delete an object from Supabase Storage
 */
export async function deleteStorageObject(
  bucket: StorageBucket,
  path: string
): Promise<{ success: boolean; error?: string }> {
  if (!supabase) return { success: true };

  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) {
    return { success: false, error: error.message };
  }
  return { success: true };
}

/**
 * Fetch active storefront announcements from Supabase
 */
export async function fetchStoreAnnouncementsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('store_announcements')
      .select('*')
      .order('priority', { ascending: true })
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase announcements query note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase announcements fetch skipped:', err);
    return null;
  }
}

/**
 * Upsert storefront announcement in Supabase
 */
export async function upsertStoreAnnouncementInSupabase(announcement: {
  id?: string;
  title: string;
  message: string;
  badge?: string;
  type?: 'delivery' | 'drop' | 'promo' | 'general';
  link_url?: string;
  is_active?: boolean;
  priority?: number;
}) {
  const client = supabaseAdmin || supabase;
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { data, error } = await (client as any)
      .from('store_announcements')
      .upsert({
        ...announcement,
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) return { success: false, error: error.message };
    return { success: true, data };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Delete storefront announcement from Supabase
 */
export async function deleteStoreAnnouncementFromSupabase(id: string) {
  const client = supabaseAdmin || supabase;
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    const { error } = await (client as any)
      .from('store_announcements')
      .delete()
      .eq('id', id);

    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

/**
 * Fetch products from Supabase
 */
export async function fetchProductsFromSupabase() {
  if (!supabase) return null;
  try {
    const { data, error } = await supabase
      .from('products')
      .select(`
        *,
        images:product_images(*),
        variants:product_variants(*)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.warn('Supabase products query note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase products fetch skipped:', err);
    return null;
  }
}

/**
 * Create order and order items in Supabase
 */
export async function createOrderInSupabase(order: any) {
  const client = supabaseAdmin || supabase;
  if (!client) return { success: false, error: 'Supabase not initialized' };

  try {
    const { data: orderData, error: orderError } = await (client as any)
      .from('orders')
      .insert({
        order_number: order.orderNumber,
        customer_name: order.customerName,
        email: order.email,
        phone: order.phone,
        shipping_county: order.shippingAddress?.county || 'Nairobi',
        shipping_town: order.shippingAddress?.town || 'Nairobi',
        shipping_address: order.shippingAddress?.streetAddress || '',
        delivery_instructions: order.shippingAddress?.deliveryInstructions || null,
        subtotal: order.subtotal,
        discount: order.discount,
        discount_code: order.discountCode || null,
        shipping_fee: order.shippingFee,
        total: order.total,
        payment_method: order.paymentMethod,
        payment_status: order.paymentStatus,
        fulfillment_status: order.fulfillmentStatus,
        mpesa_receipt_number: order.paymentDetails?.mpesaReceiptNumber || null,
      })
      .select()
      .single();

    if (orderError) {
      console.warn('Supabase Order Insert note:', orderError.message);
      return { success: false, error: orderError.message };
    }

    // Insert line items if order items array is present
    if (order.items && Array.isArray(order.items) && order.items.length > 0 && orderData?.id) {
      const itemsToInsert = order.items.map((item: any) => {
        let validProductId = item.productId;
        if (item.productId === 'prod-broken-record-tee') {
          validProductId = '11111111-1111-1111-1111-111111111111';
        } else if (item.productId === 'prod-we-are-who-we-are-tee') {
          validProductId = '22222222-2222-2222-2222-222222222222';
        } else if (item.productId === 'prod-skull-cap-teaser') {
          validProductId = '33333333-3333-3333-3333-333333333333';
        }

        return {
          order_id: orderData.id,
          product_id: typeof validProductId === 'string' && validProductId.length === 36 ? validProductId : null,
          variant_id: null,
          product_name: item.productName || 'Radiicato Garment',
          variant_title: item.variantTitle || 'Standard',
          sku: item.sku || 'RAD-SKU',
          price: item.price,
          quantity: item.quantity,
          total: item.total || item.price * item.quantity,
          image_url: item.imageUrl || null,
        };
      });

      const { error: itemsError } = await (client as any)
        .from('order_items')
        .insert(itemsToInsert);

      if (itemsError) {
        console.warn('Supabase Order Items Insert note:', itemsError.message);
      }
    }

    return { success: true, data: orderData };
  } catch (err: any) {
    console.warn('Supabase order creation note:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update order fulfillment, courier tracking, and status in Supabase
 */
export async function updateOrderInSupabase(
  orderIdOrNumber: string,
  updates: {
    fulfillment_status?: string;
    tracking_number?: string;
    carrier?: string;
    internal_notes?: string;
  }
) {
  const client = supabaseAdmin || supabase;
  if (!client) return { success: false, error: 'Supabase not initialized' };

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(orderIdOrNumber);
    let query = (client as any).from('orders').update({
      ...updates,
      updated_at: new Date().toISOString(),
    });

    if (isUuid) {
      query = query.or(`id.eq.${orderIdOrNumber},order_number.eq.${orderIdOrNumber}`);
    } else {
      query = query.eq('order_number', orderIdOrNumber);
    }

    const { data, error } = await query.select();
    if (error) {
      console.warn('Supabase Order Update note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase order update note:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Update product variant stock and reflect changes in Supabase product_variants and products tables
 */
export async function updateVariantStockInSupabase(
  variantIdOrSku: string,
  newStock: number,
  reason: string = 'adjustment',
  sku?: string,
  productId?: string
) {
  const client = supabaseAdmin || supabase;
  if (!client) return { success: false, error: 'Supabase not initialized' };

  try {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(variantIdOrSku);
    let updateQuery = (client as any).from('product_variants').update({
      stock_quantity: Math.max(0, newStock),
      updated_at: new Date().toISOString(),
    });

    if (isUuid) {
      updateQuery = updateQuery.eq('id', variantIdOrSku);
    } else if (sku) {
      updateQuery = updateQuery.eq('sku', sku);
    } else {
      updateQuery = updateQuery.eq('sku', variantIdOrSku);
    }

    const { data: variantData, error: variantError } = await updateQuery.select('id, product_id, sku, stock_quantity');

    if (variantError) {
      console.warn('Supabase Product Variant stock update note:', variantError.message);
    }

    // Reflect in products table status (mark sold_out if all variants exhausted)
    const effectiveProductId = productId || (variantData && variantData[0]?.product_id);
    if (effectiveProductId) {
      const isProductUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(effectiveProductId);
      if (isProductUuid) {
        const { data: allVariants } = await (client as any)
          .from('product_variants')
          .select('stock_quantity')
          .eq('product_id', effectiveProductId);

        if (allVariants && Array.isArray(allVariants) && allVariants.length > 0) {
          const totalRemaining = allVariants.reduce((sum: number, v: any) => sum + (v.stock_quantity || 0), 0);
          const newStatus = totalRemaining <= 0 ? 'sold_out' : 'active';
          await (client as any)
            .from('products')
            .update({ status: newStatus, updated_at: new Date().toISOString() })
            .eq('id', effectiveProductId);
        }
      }
    }

    // Insert inventory transaction record if variant id is valid UUID
    const targetVariantId = variantData && variantData[0]?.id;
    if (targetVariantId && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(targetVariantId)) {
      await (client as any)
        .from('inventory_transactions')
        .insert({
          variant_id: targetVariantId,
          change_amount: 0,
          previous_stock: 0,
          new_stock: Math.max(0, newStock),
          reason: reason === 'restock' ? 'restock' : reason === 'sale' ? 'sale' : 'adjustment',
          note: `Admin inventory stock update to ${newStock}`,
        });
    }

    return { success: true, data: variantData };
  } catch (err: any) {
    console.warn('Supabase inventory update note:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Create a customer review in Supabase
 */
export async function createReviewInSupabase(review: {
  id?: string;
  productId: string;
  productName: string;
  customerName: string;
  customerEmail: string;
  rating: number;
  title: string;
  comment: string;
  isVerifiedPurchase?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
}) {
  const client = supabaseAdmin || supabase;
  if (!client) return { success: false, error: 'Supabase client not initialized' };

  try {
    let validProductId = review.productId;
    if (validProductId === 'prod-broken-record-tee') {
      validProductId = '11111111-1111-1111-1111-111111111111';
    } else if (validProductId === 'prod-we-are-who-we-are-tee') {
      validProductId = '22222222-2222-2222-2222-222222222222';
    } else if (validProductId === 'prod-skull-cap-teaser') {
      validProductId = '33333333-3333-3333-3333-333333333333';
    }

    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    const finalProductId = uuidRegex.test(validProductId) ? validProductId : '11111111-1111-1111-1111-111111111111';

    const { data, error } = await (client as any)
      .from('reviews')
      .insert({
        product_id: finalProductId,
        product_name: review.productName,
        customer_name: review.customerName,
        customer_email: review.customerEmail,
        rating: Math.max(1, Math.min(5, Math.round(review.rating))),
        title: review.title,
        comment: review.comment,
        is_verified_purchase: review.isVerifiedPurchase ?? true,
        status: review.status || 'approved',
      })
      .select()
      .single();

    if (error) {
      console.warn('Supabase Review Insert Note:', error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  } catch (err: any) {
    console.warn('Supabase Review creation note:', err);
    return { success: false, error: err.message };
  }
}

/**
 * Fetch reviews from Supabase
 */
export async function fetchReviewsFromSupabase(productId?: string) {
  if (!supabase) return null;
  try {
    let query = (supabase as any).from('reviews').select('*').order('created_at', { ascending: false });
    if (productId) {
      let validProductId = productId;
      if (validProductId === 'prod-broken-record-tee') {
        validProductId = '11111111-1111-1111-1111-111111111111';
      } else if (validProductId === 'prod-we-are-who-we-are-tee') {
        validProductId = '22222222-2222-2222-2222-222222222222';
      } else if (validProductId === 'prod-skull-cap-teaser') {
        validProductId = '33333333-3333-3333-3333-333333333333';
      }
      query = query.eq('product_id', validProductId);
    }
    const { data, error } = await query;
    if (error) {
      console.warn('Supabase reviews query note:', error.message);
      return null;
    }
    return data;
  } catch (err) {
    console.warn('Supabase reviews fetch skipped:', err);
    return null;
  }
}

