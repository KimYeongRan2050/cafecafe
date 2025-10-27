import React, { useEffect, useState } from 'react';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { getProducts, getBaristaProducts } from '../services/productService';

function Index({ cart, setCart, showCartPopup, setShowCartPopup, onSignupClick }) {
  const [products, setProducts] = useState([]);

  // 로딩/에러 상태 추가
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 매장 전용 팝업 상태
  const [showStoreOnlyPopup, setShowStoreOnlyPopup] = useState(false);
  const [storeOnlyItem, setStoreOnlyItem] = useState(null);  

  useEffect(() => {
    async function fetchData() {
      try {
        const productData = await getProducts();
        const baristaData = await getBaristaProducts();
        const combined = [...productData, ...baristaData]
        .sort((a, b) => Number(a.id) - Number(b.id));

        setProducts(combined);
        setLoading(false);
      } catch (err) {
        console.error("데이터 로딩 실패:", err);
        setError("상품을 불러오는 중 오류가 발생했습니다.");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  //커피&라떼 제품 판별
  const isStoreOnly = (product) => {
    const category = (product.imageclass || "").toLowerCase();
    return ["coffee", "latte", "grain", "other"].includes(category);
  };

  const handleAddToCart = (product) => {
    if (isStoreOnly(product)){
      setStoreOnlyItem(product);
      setShowStoreOnlyPopup(true);
      return; // 장바구니 추가 방지
    }

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

  const closeStoreOnlyPopup = () => {
    setShowStoreOnlyPopup(false);
    setStoreOnlyItem(null);
  };


  // 카테고리별 필터링
  const beanProducts = products.filter(p => (p.imageclass || "").toLowerCase() === "bean");
  const baristaProducts = products.filter(p => (p.imageclass || "").toLowerCase() === "barista");
  const moreProducts = products.filter(p => {
    const cls = (p.imageclass || "").toLowerCase();
    return cls !== "bean" && cls !== "barista" && cls !== "coffee" && cls !== "latte" && cls !== "grain" && cls !== "other";
  });
  const coffeeProducts = products.filter(p => (p.imageclass || "").toLowerCase() === "coffee");
  const latteProducts = products.filter(p => (p.imageclass || "").toLowerCase() === "latte");
  const grainProducts = products.filter(p => (p.imageclass || "").toLowerCase() === "grain");
  const otherProducts = products.filter(p => (p.imageclass || "").toLowerCase() === "other");

useEffect(() => {
  if (showStoreOnlyPopup) {
    const scrollY = window.scrollY;
    document.body.style.cssText = `
      position: fixed;
      top: -${scrollY}px;
      overflow-y: scroll;
      width: 100%;
    `;
    return () => {
      document.body.style.cssText = '';
      window.scrollTo(0, scrollY);
    };
  }
}, [showStoreOnlyPopup]);


  return (
    <div className='main'>
      
      <div className='container'>
        {/* 로딩/에러 처리 */}
        {loading && <p style={{ margin: "100px", fontSize:"24px", color:"#c35930" }}>상품을 불러오는 중입니다...</p>}
        {error && <p style={{ margin: "100px", fontSize:"24px", color: 'red' }}>{error}</p>}

        {!loading && !error && (
          <>
            <h2 id='beanSection'>엄선된 원두로 직접 정성스러운 로스팅한 원두</h2>
            <div className='menu_coffee_full'>
              <div className="coffee_product">
                {beanProducts.length > 0 ? (
                  beanProducts.map(p => (
                    <ProductCard key={`${p.table}-${p.id}`} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                  ))
                ) : (
                  <p>원두 상품이 없습니다.</p>
                )}
              </div>
            </div>

            <h2 id='cafereumSection'>장비 하나로 나도 바리스타</h2>
            <div className='menu_coffee_full'>
              <div className="coffee_product">
                  {baristaProducts.length > 0 ? (
                    baristaProducts.map(p => (
                      <ProductCard key={`${p.table}-${p.id}`} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                    ))
                  ) : (
                    <p>바리스타 상품이 없습니다.</p>
                  )}
              </div>
            </div>

            <h2 id='otherSection'>그외의 상품</h2>
            <div className='menu_coffee_full'>
              <div className="coffee_product">
                {moreProducts.length > 0 ? (
                  moreProducts.map(p => (
                    <ProductCard key={`${p.table}-${p.id}`} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                  ))
                ) : (
                  <p>그외 상품이 없습니다.</p>
                )}
              </div>
            </div>

            <div className='store-drink'>
              <h4>[매장 전용 음료]</h4>
              <h2 id='storeCoffeeSection'>엄선된 원두로 정성스러운 로스팅으로 만든 프리미엄 커피</h2>
              <div className='menu_coffee_full'>
                <div className="coffee_product">
                  {coffeeProducts.length > 0 ? (
                    coffeeProducts.map(p => (
                      <ProductCard key={`${p.table}-${p.id}`} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                    ))
                  ) : (
                    <p>커피 상품이 없습니다.</p>
                  )}
                </div>
              </div>

              <h2 id='storeLatteSection'>부드러운 우유거품과 달콤한 바닐라 시럽의 완벽한 조화</h2>
              <div className='menu_coffee_full'>
                <div className="coffee_product">
                  {latteProducts.length > 0 ? (
                    latteProducts.map(p => (
                      <ProductCard key={`${p.table}-${p.id}`} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                    ))
                  ) : (
                    <p>라떼 상품이 없습니다.</p>
                  )}
                </div>
              </div>

              <h2 id='storeChildrenSection'>우리 아이들도 한잔씩 </h2>
              <div className='menu_coffee_full'>
                <div className="coffee_product">
                  {otherProducts.length > 0 ? (
                    otherProducts.map(p => (
                      <ProductCard key={`${p.table}-${p.id}`} product={p} onAddToCart={handleAddToCart} onCancel={handleCancelFromCart} />
                    ))
                  ) : (
                    <p>상품이 없습니다.</p>
                  )}
                </div>
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

      {/* 매장 전용 안내 팝업 */}
      {showStoreOnlyPopup && storeOnlyItem && (
        <div className="popup-overlay">
          <div className="popup-message">
            <div className="popup-message">
              <h3>매장 전용 상품 안내</h3>

              <p className='popup-txt'>
                <strong>{storeOnlyItem.name}</strong>은 매장에서만 구매 가능한 상품입니다.
              </p>

            </div>
            <button onClick={closeStoreOnlyPopup} className='close-btn'>닫기</button>
          </div>
        </div>
      )}

    </div>

  );
}

export default Index;
