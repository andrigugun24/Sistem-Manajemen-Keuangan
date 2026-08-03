export const formatRp = (value) => {
    if (value === undefined || value === null) return 'Rp 0';
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
};

export const formatNumber = (value) => {
    if (value === undefined || value === null) return '0';
    return new Intl.NumberFormat('id-ID').format(value);
};
