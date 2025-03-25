import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'priceFormat',
  standalone: true
})
export class PriceFormatPipe implements PipeTransform {
  transform(value: number, currency: string = 'USD'): string {
    // Định dạng số với 2 chữ số thập phân
    const formattedPrice = value.toFixed(2);
    
    // Thêm ký hiệu tiền tệ
    let currencySymbol = '$';
    switch(currency.toUpperCase()) {
      case 'EUR':
        currencySymbol = '€';
        break;
      case 'GBP':
        currencySymbol = '£';
        break;
      case 'JPY':
        currencySymbol = '¥';
        break;
      case 'VND':
        currencySymbol = '₫';
        break;
    }

    // Thêm dấu phẩy ngăn cách hàng nghìn
    const parts = formattedPrice.split('.');
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    // Kết hợp lại với ký hiệu tiền tệ
    return `${currencySymbol}${parts.join('.')}`;
  }
} 