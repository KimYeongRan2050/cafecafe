import { supabase } from "./supabaseClient";

// 모든 상품 조회
export async function getProducts() {
  const { data, error } = await supabase
    .from('drinks')
    .select('*')
    .in('imageclass', ['coffee', 'latte', 'bean', 'barista', 'grain', 'other']);

  if (error) {
    console.error("getProducts error:", error.message);
    throw error;
  }
  return data;
}

// 상품 추가
export async function addProduct(product) {
  const normalizedImageClass = product.imageclass?.trim() || 'barista';


  const { data, error } = await supabase
    .from('drinks')
    .insert([{
      ...product,
      imageclass: normalizedImageClass,
      is_new : true,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) {
    throw error;
  }
  return data[0];
}


// 상품 수정
export async function updateProduct(id, updates) {
  const { data, error } = await supabase
    .from('drinks')
    .update(updates)
    .eq('id', id);
  if (error) {
    console.error("updateProduct error:", error.message);
    throw error;
  }
  return data;
}

// 상품 삭제
export async function deleteProduct(id) {
  const { error } = await supabase
    .from('drinks')
    .delete()
    .eq('id', id);
  if (error) {
    console.error("deleteProduct error:", error.message);
    throw error;
  }
}

// cafe_supplies 전용 CRUD
export async function getBaristaProducts() {
  const { data, error } = await supabase
    .from('cafe_supplies')
    .select('*')
    .in('imageclass', ['coffee', 'latte', 'bean', 'barista', 'more']);

  if (error) {
    console.error("getBaristaProducts error:", error.message);
    return [];
  }
  return data;
}


export async function addBaristaProduct(product) {
  const normalizedImageClass = product.imageclass?.trim() || 'barista';

  const { data, error } = await supabase
    .from('cafe_supplies')
    .insert([{
      ...product,
      imageclass: normalizedImageClass, // 저장 시 자동 지정
      is_new: true,
      created_at: new Date().toISOString()
    }])
    .select();

  if (error) throw error;
  return data[0];
}

export async function updateBaristaProduct(id, updates) {
  const { data, error } = await supabase
    .from('cafe_supplies')
    .update(updates)
    .eq('id', id);
  if (error) throw error;
  return data;
}

export async function deleteBaristaProduct(id) {
  const { error } = await supabase
    .from('cafe_supplies')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

//재고 부족 추가
export async function getAllLowStockItems() {
  const [menuRes, baristaRes] = await Promise.all([
    supabase.from('drinks').select('id, name, stock').lt('stock', 10),
    supabase.from('cafe_supplies').select('id, name, stock').lt('stock', 10)
  ]);

  if (menuRes.error || baristaRes.error) {
    throw menuRes.error || baristaRes.error;
  }

  const combined = [...menuRes.data, ...baristaRes.data];

  return combined.map(item => ({
    ...item,
    status: Number(item.stock) < 5 ? '긴급' : '부족'
  }));
}


// 단일 상품 조회 (products 테이블)
export async function getProductById(id) {
  const { data, error } = await supabase
    .from("drinks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getProductById error:", error.message);
    return null;
  }

  return data;
}

// 단일 바리스타 상품 조회 (cafe_supplies 테이블)
export async function getBaristaProductById(id) {
  const { data, error } = await supabase
    .from("cafe_supplies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getBaristaProductById error:", error.message);
    return null;
  }

  return data;
}


