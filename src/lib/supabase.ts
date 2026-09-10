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
