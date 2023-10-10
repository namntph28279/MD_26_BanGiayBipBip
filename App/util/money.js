export function getMonney(monney) {
    const formatter = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 0,
    });
    return formatter.format(monney).replace(/\s/g, ' ');
}