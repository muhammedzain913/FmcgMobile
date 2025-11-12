export function subTotal(orderitems : [{}]) {
    orderitems.reduce((total, item) => total + item.price * item.quantity, 0)
    .toFixed(2);
}