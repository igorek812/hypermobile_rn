import Moment from 'moment';
import { ChartTypeModel } from '../models/chart-type-model';

export function formatDate({ timestamp }: { timestamp: number }): string {
    return Moment(timestamp).format('DD.MM.yyyy - HH:mm:ss')
}


export function getChartPeriod({ chartType }: { chartType: ChartTypeModel }): number[] {
    const endTime = Moment.now()

    let unit: "d" | "y"
    let value: number

    switch (chartType) {
        case ChartTypeModel._5m:
            unit = 'd'
            value = -1
            break
        case ChartTypeModel._1h:
            unit = 'd'
            value = -14
            break
        case ChartTypeModel._1d:
            unit = 'y'
            value = -1
            break
        case ChartTypeModel._1w:
            unit = 'y'
            value = -6
            break
        case ChartTypeModel._1M:
            unit = 'y'
            value = -28
            break
        default:
            throw new Error("UNOWNED CHART TYPE")
    }

    
    const startTime = Moment(endTime).add(value, unit)
    const startTimeTimestamp = startTime.format("x")

    return [endTime, Number(startTimeTimestamp)]
}