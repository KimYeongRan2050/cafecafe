import { useState } from 'react'
import Toolbar from '../layout/Header';

function LoginButton(props) {
  return(
    <button onClick={props.onClick}>로그인</button>
  );
}

function LogoutButton(props) {
  return(
    <button onClick={props.onClick}>로그아웃</button>
  );
}

function Index() {
  const [count, setCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(true);
  
  /*로그인*/
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginClick = () => {
    setIsLoggedIn(true);
  }

  const handleLogoutClick = () => {
    setIsLoggedIn(false);
  }

  let button;
  if(isLoggedIn) {
    button = <LogoutButton onClick={handleLogoutClick} />;
  } else {
    button = <LoginButton onClick={handleLoginClick} />;
  }



  return (
    <>
      <div className='main'>
        <div className='mainimg'>
          <div className='top_menu'>

            <a href="/" className='logo_box'>
              <div className='logo'>
                <p>카페카페</p>
              </div>
            </a>

            <nav>
              <div><a href="">상품</a></div>
              <div><a href="">카페소개</a></div>
              <div><a href="">주문방법</a></div>
              <div><a href="">문의</a></div>
            </nav>
            <div>

            </div>
            <div className='top_user'>
              {isLoggedIn ? (
                <>
                  <div><a href="">주문문의</a></div>
                  <div><a href="">장바구니</a></div>
                  <div><a href="">관리자</a></div>
                  <div><button onClick={handleLogout}>로그아웃</button></div>
                </>
              ) : (
                  <div><button onClick={handleLogin}>로그인</button></div>
              )}
            </div>
          </div>
        </div>

        <div className='container'>
          <h2>엄선된 원두와 정성스러운 로스팅으로 만든 프리미엄 커피</h2>

          
          <div className='menu_coffee'>

            {/* 에스프레소 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock'>50</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>에스프레소</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/* 아메리카노 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 latte'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock'>30</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>아메리카노</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/* 아이스 에스프레소 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock'>15</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>아이스 에스프레소</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노 에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/* 아이스 아메리카노 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock'>20</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>아이스 아메리카노</h4>
                <p>깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div>
            </div>
          </div>
          
          <h2>부드러운 우유거품과 달콤한 바닐라 시럽의 완벽한 조화</h2>

          <div className='menu_coffee'>

            {/* 카페라떼 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 latte'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>3</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>카페라떼</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/* 카푸치노 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 latte'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>5</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>카푸치노</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/* 카페모카 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock'>12</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>카페모카</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/* 카페 비엔나 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>3</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>카페 비엔나</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div>
            </div>
          </div>

          <div className='menu_coffee mt30'>

            {/****** 아이스 카페라떼 ******/}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 latte'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>2</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>아이스 카페라떼 </h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/******* 아이스 카푸치노 *******/}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 latte'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>1</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>아이스 카푸치노</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/****** 아이스 카페모카 *******/}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock'>22</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>아이스 카페모카</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/* 카페 비엔나 */}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>0</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>카페 비엔나</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button disabled={isDisabled}>장바구니</button>
              </div>
            </div>
          </div>


          <h2>최고급 원두부터 전문 바리스타 장비까지</h2>

          <div className='menu_coffee'>

            {/****** 케나AA ******/}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 latte'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>2</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>케나AA</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/******* 에티오피아 *******/}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 latte'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>1</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>에티오피아</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/****** 콜롬비아 *******/}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock'>22</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>콜롬비아</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button>장바구니</button>
              </div> 
            </div>

            {/****** 과테말라 *******/}
            <div className='main_coffee main_stars'>
              <div className='coffee_1 black'>
                <ul className='product_icon'>
                  <li className='best'>BEST</li>
                  <li className='sale'>SALE</li>
                  <li className='new'>NEW</li>
                </ul>

                <ul className='product_icon'>
                  <li className='stock out'>0</li>
                </ul>
              </div>

              <div className='main_txt'>
                <div className='star four'></div>
                <h4>과테말라</h4>
                <p>에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노</p>

                <div className='price'>￦4,500</div>

                <button disabled={isDisabled}>장바구니</button>
              </div>
            </div>
          </div>


          <div className='story'>
            <h2>최고급 원두부터 전문 바리스타 장비까지</h2>
          </div>
        





        </div>
      </div>
      
        
    </>
  )
}

export default Index;
