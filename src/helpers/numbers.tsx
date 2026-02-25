const numeral = require('numeral');

export const formatPrice = (val: any): string => {
    return numeral(val).format('0,0.00')
}

export const formatVolume = (val: any): string => {
    return numeral(val).format('0.0 a').toUpperCase()
}