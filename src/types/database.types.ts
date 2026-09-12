export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          email: string;
          phone: string | null;
          avatar_url: string | null;
          role: 'customer' | 'admin' | 'super_admin' | 'inventory_manager' | 'order_manager' | 'content_manager';
          loyalty_points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          email: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin' | 'super_admin' | 'inventory_manager' | 'order_manager' | 'content_manager';
          loyalty_points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string;
          email?: string;
          phone?: string | null;
          avatar_url?: string | null;
          role?: 'customer' | 'admin' | 'super_admin' | 'inventory_manager' | 'order_manager' | 'content_manager';
          loyalty_points?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image_url: string | null;
          status: 'active' | 'inactive';
          display_order: number;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image_url?: string | null;
          status?: 'active' | 'inactive';
          display_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image_url?: string | null;
          status?: 'active' | 'inactive';
          display_order?: number;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      collections: {
        Row: {
          id: string;
          name: string;
          slug: string;
          subtitle: string | null;
          description: string | null;
          cover_image: string | null;
          banner_image: string | null;
          gallery_images: string[] | null;
          color_palette: string[] | null;
          status: 'draft' | 'scheduled' | 'live' | 'archived';
          is_scheduled: boolean;
          launch_date: string | null;
          display_order: number;
          piece_count_target: number | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          subtitle?: string | null;
          description?: string | null;
          cover_image?: string | null;
          banner_image?: string | null;
          gallery_images?: string[] | null;
          color_palette?: string[] | null;
          status?: 'draft' | 'scheduled' | 'live' | 'archived';
          is_scheduled?: boolean;
          launch_date?: string | null;
          display_order?: number;
          piece_count_target?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          subtitle?: string | null;
          description?: string | null;
          cover_image?: string | null;
          banner_image?: string | null;
          gallery_images?: string[] | null;
          color_palette?: string[] | null;
          status?: 'draft' | 'scheduled' | 'live' | 'archived';
          is_scheduled?: boolean;
          launch_date?: string | null;
          display_order?: number;
          piece_count_target?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          name: string;
          slug: string;
          short_description: string | null;
          description: string | null;
          price: number;
          sale_price: number | null;
          cost_price: number | null;
          sku: string;
          category_id: string | null;
          collection_id: string | null;
          brand: string;
          material: string | null;
          weight_gsm: number | null;
          fit: string | null;
          care_instructions: string | null;
          gender: 'unisex' | 'mens' | 'womens';
          tags: string[] | null;
          status: 'draft' | 'active' | 'scheduled' | 'archived' | 'sold_out';
          is_featured: boolean;
          is_limited_drop: boolean;
          drop_piece_count: number | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          short_description?: string | null;
          description?: string | null;
          price: number;
          sale_price?: number | null;
          cost_price?: number | null;
          sku: string;
          category_id?: string | null;
          collection_id?: string | null;
          brand?: string;
          material?: string | null;
          weight_gsm?: number | null;
          fit?: string | null;
          care_instructions?: string | null;
          gender?: 'unisex' | 'mens' | 'womens';
          tags?: string[] | null;
          status?: 'draft' | 'active' | 'scheduled' | 'archived' | 'sold_out';
          is_featured?: boolean;
          is_limited_drop?: boolean;
          drop_piece_count?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          short_description?: string | null;
          description?: string | null;
          price?: number;
          sale_price?: number | null;
          cost_price?: number | null;
          sku?: string;
          category_id?: string | null;
          collection_id?: string | null;
          brand?: string;
          material?: string | null;
          weight_gsm?: number | null;
          fit?: string | null;
          care_instructions?: string | null;
          gender?: 'unisex' | 'mens' | 'womens';
          tags?: string[] | null;
          status?: 'draft' | 'active' | 'scheduled' | 'archived' | 'sold_out';
          is_featured?: boolean;
          is_limited_drop?: boolean;
          drop_piece_count?: number | null;
          seo_title?: string | null;
          seo_description?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      product_images: {
        Row: {
          id: string;
          product_id: string;
          url: string;
          alt_text: string | null;
          view_type: 'front' | 'back' | 'full' | 'detail' | 'model' | 'flat_lay';
          is_primary: boolean;
          is_hover: boolean;
          display_order: number;
          width: number | null;
          height: number | null;
          storage_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          url: string;
          alt_text?: string | null;
          view_type?: 'front' | 'back' | 'full' | 'detail' | 'model' | 'flat_lay';
          is_primary?: boolean;
          is_hover?: boolean;
          display_order?: number;
          width?: number | null;
          height?: number | null;
          storage_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          url?: string;
          alt_text?: string | null;
          view_type?: 'front' | 'back' | 'full' | 'detail' | 'model' | 'flat_lay';
          is_primary?: boolean;
          is_hover?: boolean;
          display_order?: number;
          width?: number | null;
          height?: number | null;
          storage_path?: string | null;
          created_at?: string;
        };
      };
      product_variants: {
        Row: {
          id: string;
          product_id: string;
          color_name: string;
          color_hex: string;
          size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'ONE SIZE';
          sku: string;
          price_override: number | null;
          stock_quantity: number;
          low_stock_threshold: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          color_name: string;
          color_hex: string;
          size: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'ONE SIZE';
          sku: string;
          price_override?: number | null;
          stock_quantity?: number;
          low_stock_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          color_name?: string;
          color_hex?: string;
          size?: 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'XXXL' | 'ONE SIZE';
          sku?: string;
          price_override?: number | null;
          stock_quantity?: number;
          low_stock_threshold?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_number: string;
          customer_id: string | null;
          customer_name: string;
          email: string;
          phone: string;
          shipping_county: string;
          shipping_town: string;
          shipping_address: string;
          delivery_instructions: string | null;
          subtotal: number;
          discount: number;
          discount_code: string | null;
          shipping_fee: number;
          total: number;
          payment_method: 'mpesa' | 'card' | 'paystack' | 'cash_on_delivery';
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
          fulfillment_status: 'pending' | 'paid' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          mpesa_receipt_number: string | null;
          tracking_number: string | null;
          carrier: string | null;
          internal_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          customer_name: string;
          email: string;
          phone: string;
          shipping_county: string;
          shipping_town: string;
          shipping_address: string;
          delivery_instructions?: string | null;
          subtotal: number;
          discount?: number;
          discount_code?: string | null;
          shipping_fee?: number;
          total: number;
          payment_method: 'mpesa' | 'card' | 'paystack' | 'cash_on_delivery';
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          fulfillment_status?: 'pending' | 'paid' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          mpesa_receipt_number?: string | null;
          tracking_number?: string | null;
          carrier?: string | null;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_number?: string;
          customer_id?: string | null;
          customer_name?: string;
          email?: string;
          phone?: string;
          shipping_county?: string;
          shipping_town?: string;
          shipping_address?: string;
          delivery_instructions?: string | null;
          subtotal?: number;
          discount?: number;
          discount_code?: string | null;
          shipping_fee?: number;
          total?: number;
          payment_method?: 'mpesa' | 'card' | 'paystack' | 'cash_on_delivery';
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded';
          fulfillment_status?: 'pending' | 'paid' | 'processing' | 'packed' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
          mpesa_receipt_number?: string | null;
          tracking_number?: string | null;
          carrier?: string | null;
          internal_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      drop_waitlists: {
        Row: {
          id: string;
          collection_slug: string;
          contact_value: string;
          is_notified: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          collection_slug: string;
          contact_value: string;
          is_notified?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          collection_slug?: string;
          contact_value?: string;
          is_notified?: boolean;
          created_at?: string;
        };
      };
      lookbook_items: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          image_url: string;
          collection_slug: string | null;
          location_tag: string | null;
          display_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          image_url: string;
          collection_slug?: string | null;
          location_tag?: string | null;
          display_order?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          image_url?: string;
          collection_slug?: string | null;
          location_tag?: string | null;
          display_order?: number;
          created_at?: string;
        };
      };
      store_settings: {
        Row: {
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
      store_announcements: {
        Row: {
          id: string;
          title: string;
          message: string;
          badge: string | null;
          type: 'delivery' | 'drop' | 'promo' | 'general';
          link_url: string | null;
          is_active: boolean;
          priority: number;
          starts_at: string | null;
          expires_at: string | null;
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          badge?: string | null;
          type?: 'delivery' | 'drop' | 'promo' | 'general';
          link_url?: string | null;
          is_active?: boolean;
          priority?: number;
          starts_at?: string | null;
          expires_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          message?: string;
          badge?: string | null;
          type?: 'delivery' | 'drop' | 'promo' | 'general';
          link_url?: string | null;
          is_active?: boolean;
          priority?: number;
          starts_at?: string | null;
          expires_at?: string | null;
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      reviews: {
        Row: {
          id: string;
          product_id: string;
          product_name: string;
          customer_name: string;
          customer_email: string;
          rating: number;
          title: string;
          comment: string;
          is_verified_purchase: boolean;
          status: 'pending' | 'approved' | 'rejected';
          created_at: string;
        };
        Insert: {
          id?: string;
          product_id: string;
          product_name: string;
          customer_name: string;
          customer_email: string;
          rating: number;
          title: string;
          comment: string;
          is_verified_purchase?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
        Update: {
          id?: string;
          product_id?: string;
          product_name?: string;
          customer_name?: string;
          customer_email?: string;
          rating?: number;
          title?: string;
          comment?: string;
          is_verified_purchase?: boolean;
          status?: 'pending' | 'approved' | 'rejected';
          created_at?: string;
        };
      };
    };
  };
}

