'use strict';

describe('pos', () => {
  //编号统一处理——测试
  it('should input array,then getFormattedTags',() => {
    let tags=[
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005'
    ];
    let formattedTags=getFormattedTags(tags);
    let expectItems=[
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000003',count:2},
      {barcode:'ITEM000005',count:1}
    ];
    expect(formattedTags).toEqual(expectItems);
  });

  //统计购物车中每种商品数量——测试
  it('should input array,then getCountItems',() => {
    let formattedTags=[
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000001',count:1},
      {barcode:'ITEM000003',count:2},
      {barcode:'ITEM000005',count:1}
    ];
    let countItems=getCountItems(formattedTags);
    let expectItems=[
      {barcode:'ITEM000001',count:2},
      {barcode:'ITEM000003',count:2},
      {barcode:'ITEM000005',count:1}
    ];
    expect(countItems).toEqual(expectItems);
  });

  //获取商品信息——测试
  it('should input array,then buildCartItems',() => {
    let countItems=[
      {barcode:'ITEM000003',count:2},
      {barcode:'ITEM000005',count:1}
    ];
    let allItems=loadAllItems();
    let cartItems=buildCartItems(countItems,allItems);
    let expectItems=[
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        category: '食品',
        subCategory: '水果',
        price: 15,
        count:2
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        category: '食品',
        subCategory: '零食',
        price: 4.5,
        count:1
      }
    ];
    expect(cartItems).toEqual(expectItems);
  });

  //匹配优惠信息并计算每件商品的优惠信息及其小计——测试
  it('should input array,then buildPromotedItems',() => {
    let cartItems=[
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        category: '食品',
        subCategory: '水果',
        price: 15,
        count:2
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        category: '食品',
        subCategory: '零食',
        price: 4.5,
        count:1
      }
    ];
    let promotions=loadPromotions();
    let promotedItems=buildPromotedItems(cartItems,promotions);
    let expectItems=[
      {
        barcode: 'ITEM000003',
        name: '荔枝',
        unit: '斤',
        category: '食品',
        subCategory: '水果',
        price: 15,
        count: 2,
        saved: 0,
        payPrice: 30
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        category: '食品',
        subCategory: '零食',
        price: 4.5,
        count: 1,
        saved: 0,
        payPrice: 4.5
      }
    ];
    expect(promotedItems).toEqual(expectItems);
  });

  //计算总价以及总的优惠值
  it('should input array,then calculateTotalPrice', ()=>{
    let promotedItems=[
      {
        barcode:'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        category: '食品',
        subCategory: '碳酸饮料',
        price: 3.00,
        count: 5,
        saved: 3,
        payPrice: 12
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        category: '食品',
        subCategory: '零食',
        price: 4.50,
        count: 1,
        saved: 0,
        payPrice: 4.5
      }
    ];
    let totalPrice=calculateTotalPrice(promotedItems);
    let expectItems={
      totalPayPrice:16.5,
      totalSaved:3
    }
    expect(totalPrice).toEqual(expectItems);
  });

  //获取小票信息
  it('should input array,then buildReceipt', ()=>{
    let promotedItems=[
      {
        barcode:'ITEM000001',
        name: '雪碧',
        unit: '瓶',
        category: '食品',
        subCategory: '碳酸饮料',
        price: 3.00,
        count: 5,
        payPrice: 12,
        saved: 3
      },
      {
        barcode: 'ITEM000005',
        name: '方便面',
        unit: '袋',
        category: '食品',
        subCategory: '碳酸饮料',
        price: 4.50,
        count: 1,
        payPrice: 4.5,
        saved: 0
      }
    ];
    let totalPrice={totalPayPrice: 16.5,totalSaved: 3};
    let receipt= buildReceipt(totalPrice,promotedItems);
    let expectItems={
      receiptItems:[
        {
          name: '雪碧',
          unit: '瓶',
          price: 3.00,
          count: 5,
          payPrice:12
        },
        {
          name: '方便面',
          unit: '袋',
          price: 4.50,
          count: 1,
          payPrice:4.5
        }],
      totalPayPrice:16.5,
      totalSaved:3
    }
    expect(receipt).toEqual(expectItems);
  });


  it('should print text', () => {

    const tags = [
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000001',
      'ITEM000003-2',
      'ITEM000005',
      'ITEM000005',
      'ITEM000005'
    ];

    spyOn(console, 'log');

    printReceipt(tags);

    const expectText = `***<没钱赚商店>收据***
名称：雪碧，数量：5瓶，单价：3.00(元)，小计：12.00(元)
名称：荔枝，数量：2斤，单价：15.00(元)，小计：30.00(元)
名称：方便面，数量：3袋，单价：4.50(元)，小计：9.00(元)
----------------------
总计：51.00(元)
节省：7.50(元)
**********************`;

    expect(console.log).toHaveBeenCalledWith(expectText);
  });

});





