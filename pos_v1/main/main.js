'use strict';
//调用者集合
function printReceipt(tags){
    let allItems=loadAllItems();
    let formattedTags=getFormattedTags(tags);
    let countItems=getCountItems(formattedTags);
    let cartItems=buildCartItems(countItems,allItems);
    let promotions=loadPromotions();
    let promotedItems=buildPromotedItems(cartItems,promotions);
    let totalPrice=calculateTotalPrice(promotedItems);
    let receipt=buildReceipt(totalPrice,promotedItems);
    let receiptString=bulidreceiptString(receipt);
}
function getFormattedTags(tags) {
    let result = tags.map((tag)=> {
        if (tag.includes('-')) {
            let item = tag.split('-');
            return {barcode: item[0], count: parseInt(item[1])};
        } else {
            return {barcode: tag, count: 1};
        }
    });
    return result;
}

function _exitByBarcode(array, barcode) {
    let result = array.find((item)=> {
        return item.barcode === barcode;
    });
    return result;
}

function getCountItems(formattedTags) {
    let result = [];
    for (let formatedTag of formattedTags) {
        let item = _exitByBarcode(result, formatedTag.barcode);
        if (item === undefined) {
            result.push({barcode: formatedTag.barcode, count: formatedTag.count});
        } else {
            item.count += formatedTag.count;
        }

    }
    return result;
}
function buildCartItems(countItems, allItems) {
    let result = countItems.map((countItem)=> {
        let item = _exitByBarcode(allItems, countItem.barcode);
        return {
            barcode: item.barcode,
            name: item.name,
            unit: item.unit,
            category: item.category,
            subCategory: item.subCategory,
            price: item.price,
            count: countItem.count
        }
    });
    return result;
}
function buildPromotedItems(cartItems,promotions) {
    let promotion = promotions[0];
    let result = cartItems.map((cartItem)=> {
        let saved = 0;
        let exit = false;
        for (let item of promotion.barcodes) {
            if (item === cartItem.barcode) {
                exit = true;
                break;
            }
        }
        if (exit && promotion.type === 'BUY_TWO_GET_ONE_FREE') {
            let savedCount = Math.floor(cartItem.count / 3);
            saved = savedCount * cartItem.price;
        }
        let payPrice = cartItem.count * cartItem.price - saved;
        return {
            barcode: cartItem.barcode,
            name: cartItem.name,
            unit: cartItem.unit,
            category: cartItem.category,
            subCategory: cartItem.subCategory,
            price: cartItem.price,
            count: cartItem.count,
            saved,
            payPrice
        };
    });
    return result;
}
function calculateTotalPrice(promotedItems){
    let result={totalPayPrice:0,totalSaved:0};
    for(let item of promotedItems){
        result.totalPayPrice+=item.payPrice;
        result.totalSaved+=item.saved;
    }
    return result;
}

function buildReceipt(totalPrice,promotedItems) {
    let receiptItems=promotedItems.map((item)=>{
        return {
            name: item.name,
            unit: item.unit,
            price: item.price,
            count: item.count,
            payPrice:item.payPrice,
        }
    });
    return {
        receiptItems,
        totalPayPrice:totalPrice.totalPayPrice,
        totalSaved: totalPrice.totalSaved
    }
}
function bulidreceiptString(receipt){

    let receiptString='';
    for(let item  of receipt.receiptItems){
        receiptString += `名称：${item.name}，数量：${item.count}${item.unit}，单价：${item.price.toFixed(2)}(元)，小计：${item.payPrice.toFixed(2)}(元)`;
        receiptString += '\n';
    }
    let receipts=`***<没钱赚商店>收据***
${receiptString}----------------------
总计：${receipt.totalPayPrice.toFixed(2)}(元)
节省：${receipt.totalSaved.toFixed(2)}(元)
**********************`;
    console.log(receipts);
    return receipts;
}