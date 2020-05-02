import moment from 'moment';

class Order {
  constructor(id, items, totalAmount, date) {
    this.id = id;
    this.items = items;
    this.totalAmount = totalAmount;
    this.date = moment(date).format('DD-MM-YYYY, hh:mm');
  }
}

export default Order;
