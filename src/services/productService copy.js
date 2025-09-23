import { supabase } from "../services/supabaseClient";

export async function getProducts() {
  const { data, error } = await supabase.from('products').select('*');
  if(error) {
    console.error(error);
    return [];
  }

  return[
    { id : 1,
      name : '에스프레소',
      description : '에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노 에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노 에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노',
      price : 4500,
      imageClass : 'coffee black',
      tags : ['BEST', 'SALE', 'NEW'],
      stock : 5,
      stars : 4
    },
    { id: 2,
      name: '아메리카노',
      description: '에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee black',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 30,
      stars: 4
    },
    { id: 3,
      name: '아이스 에스프레소',
      description: '에티오피아 예가체프 원두로 만든 깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee black',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 15,
      stars: 3
    },
    {
      id: 4,
      name: '아이스 아메리카노',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee black',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 5,
      name: '카페라떼',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 6,
      name: '카푸치노',
      description: '깔끔하고 진한 라떼',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 7,
      name: '카페모카',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 8,
      name: '카페 비엔나',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 9,
      name: '아이스 카페라떼',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 10,
      name: '아이스 카푸치노',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 11,
      name: '아이스 카페모카',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 12,
      name: '아이스 카페 비엔나',
      description: '깔끔하고 진한 아메리카노',
      price: 4500,
      imageClass: 'coffee latte',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 13,
      name: '케나 AA',
      description: '플로럴한 향과 깔끔한 산미가 특징인 프리미엄 원두 (200g)',
      price: 4500,
      imageClass: 'coffee beans',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 14,
      name: '브라질',
      description: '균형잡힌 바디감과 달콤한 후미가 매력적인 원두 (200g)',
      price: 4500,
      imageClass: 'coffee beans',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 15,
      name: '에티오피아 예가체프 원두',
      description: '플로럴한 향과 깔끔한 산미가 특징인 프리미엄 원두 (200g)',
      price: 4500,
      imageClass: 'coffee beans',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
    {
      id: 16,
      name: '콜롬비아 수프리모 원두',
      description: '균형잡힌 바디감과 달콤한 후미가 매력적인 원두 (200g)',
      price: 4500,
      imageClass: 'coffee beans',
      tags: ['BEST', 'SALE', 'NEW'],
      stock: 20,
      stars: 5
    },
  ]
}

