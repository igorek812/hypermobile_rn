import Moment from 'moment';

export function formatDate({timestamp}: {timestamp: number}): string {
    return Moment(timestamp).format('dd.MM.yyyy - HH:mm:ss')
}