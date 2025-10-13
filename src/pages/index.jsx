import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getBaristaProducts } from '../services/productService';

function Index({ cart, setCart, showCartPopup, setShowCartPopup, onSignupClick }) {
  const [products, setProducts] = useState([]);

  // 로딩/에러 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [baristaProducts, setBaristaProducts] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const productData = await getProducts();
        const sortedProducts = productData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setProducts(sortedProducts);

        const baristaData = await getBaristaProducts();
        const sortedBarista = baristaData.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        setBaristaProducts(sortedBarista);

        setLoading(false);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        setError("상품을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    setCart(prevCart => {
      const exists = prevCart.find(item => item.id === product.id);
      if (exists) {
        const newQuantity = exists.quantity + 1;
        if (newQuantity > product.stock) {
          alert("재고보다 많이 담을 수 없습니다.");
          return prevCart;
        }
        return prevCart.map(item =>
          item.id === product.id ? { ...item, quantity: newQuantity } : item
        );
      }
      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

  const handleCancelFromCart = (product) => {
    setCart(prevCart => {
      return prevCart.map(item => {
        if (item.id === product.id) {
          const newQty = item.quantity - 1;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean);
    });
  };

  // 카테고리별 필터링 (안전 처리: description, imageClass가 없을 경우 대비)
  const coffeeProducts = products.filter(
    p => p.description && 
    !p.description.includes('g') && 
    !(p.imageclass || '').includes('latte') &&
    !(p.imageclass || '').includes('barista')
  );
  const latteProducts = products.filter(
    p => (p.imageclass || '').includes('latte')
  );

  return (
    <div className='main'>
      
      <div className='container'>
        {/* 로딩/에러 처리 */}
        {loading && <p style={{ marginTop: "100px", fontSize:"24px", color:"#c35930" }}>상품을 불러오는 중입니다...</p>}
        {error && <p style={{ marginTop: "100px", fontSize:"24px", color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            <h2 id='coffeeSection'>엄선된 원두와 정성스러운 로스팅으로 만든 프리미엄 커피</h2>
            <div className='menu_coffee_full'>
              <div className="coffee_product">
                  {coffeeProducts.length > 0 ? (
                    coffeeProducts.map(p => (
                      <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                    ))
                  ) : (
                    <p>커피 상품이 없습니다.</p>
                  )}
              </div>
            </div>

            <h2 id='latteSection'>부드러운 우유거품과 달콤한 바닐라 시럽의 완벽한 조화</h2>
            <div className='menu_coffee_full'>
              <div className="coffee_product">
                {latteProducts.length > 0 ? (
                  latteProducts.map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                  ))
                ) : (
                  <p>라떼 상품이 없습니다.</p>
                )}
              </div>
            </div>

            <h2 id='cafereumSection'>최고급 원두부터 전문 바리스타 장비까지</h2>
            <div className='menu_coffee_full'>
              <div className="coffee_product">
                {baristaProducts.length > 0 ? (
                  baristaProducts.map(p => (
                    <ProductCard key={p.id} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                  ))
                ) : (
                  <p>바리스타 상품이 없습니다.</p>
                )}
              </div>
            </div>
          </>
        )}

        <div id='storeSection' className='story'>
          <h2>카페 라베 소개</h2>
        </div>
      </div>

      <div className='footer'>
        <Footer />
      </div>

    </div>

  );
}

export default Index;
