import { supabase } from '../services/supabaseClient';

// 모든 상품 조회
export async function getProducts() {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .in('imageclass', ['coffee', 'latte', 'bean', 'barista', 'more']);

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
    .from('products')
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
    .from('products')
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
    .from('products')
    .delete()
    .eq('id', id);
  if (error) {
    console.error("deleteProduct error:", error.message);
    throw error;
  }
}

// barista_products 전용 CRUD
export async function getBaristaProducts() {
  const { data, error } = await supabase
    .from('barista_products')
    .select('*')
    .in('imageclass', ['coffee', 'latte', 'bean', 'barista', 'more']);

  if (error) {
    console.error("getBaristaProducts error:", error.message);
    return [];
  }
  return data;
}


export async function addBaristaProduct(product) {
  // bean, barista, more → barista로 통일
  const normalizedImageClass = ['coffee', 'latte', 'bean', 'barista', 'more'].includes(product.imageclass)
    ? 'barista'
    : product.imageclass;

  const { data, error } = await supabase
    .from('barista_products')
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
    .from('barista_products')
    .update(updates)
    .eq('id', id);
  if (error) {
    console.error("updateProduct error:", error.message);
    throw error;
  }
  return data;
}

export async function deleteBaristaProduct(id) {
  const { error } = await supabase
    .from('barista_products')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

