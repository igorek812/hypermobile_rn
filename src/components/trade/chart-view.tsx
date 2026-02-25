import { COLORS } from "@/src/constants/colors"
import { ChartTypeModel } from "@/src/models/chart-type-model"
import { useAppSelector } from "@/src/store/store"
import SegmentedControl from "@react-native-segmented-control/segmented-control"
import { FC, memo, useEffect, useState } from "react"
import { ActivityIndicator, TouchableOpacity, View } from "react-native"
// import { LineChart } from "react-native-gifted-charts"
// import { CandlestickChart, TCandle } from 'react-native-wagmi-charts'
import { getChartPeriod } from "@/src/helpers/date"
import hlService from "@/src/services/hl-service"
import StyledText from "../styled-text"
import TextChartView from "./test-chart-view"
// import KLineScreen from "./KLineScreen"


const ChartView: FC = memo(() => {
    console.log("ChartView render")

    const selectedAssetName = useAppSelector((state) => state.trade.selectedAssetName)
    const chartData = useAppSelector((state) => state.trade.chartData)

    const [selectedChartType, setSelectedChartType] = useState<ChartTypeModel>(ChartTypeModel._1d)

    useEffect(() => {
        if (selectedAssetName == null) return
        getChartData()
    }, [selectedChartType, selectedAssetName])

    async function getChartData() {
        if (selectedAssetName == null) {
            alert("selected asset is not init")
            return
        }

        const dateComponent = getChartPeriod({ chartType: selectedChartType })

        console.log("dateComponent 0 = ", dateComponent[0])
        console.log("dateComponent 1 = ", dateComponent[1])

        await hlService.getCandleSnapshot({
            coin: selectedAssetName,
            interval: selectedChartType,
            startTime: dateComponent[1],
            endTime: dateComponent[0]
        })
    }

    // const [cd, setCD] = useState<ChartItemModel[]>([])
    // const [cd, setCD] = useState<TLineChartPoint[]>([])
    // const [cd, setCD] = useState<TCandle[]>([])
    const [cd, setCD] = useState<any[]>([])
    console.log(cd)
    // console.log("chartData = ", chartData)

    // useEffect(() => {
    //     console.log("USEEFFECT")
    //     //const asd = [{"value": 103718}, {"value": 1}, {"value": 104840}, {"value": 104766}, {"value": 102590}, {"value": 102129}, {"value": 101312}, {"value": 103692}, {"value": 104652}, {"value": 102500}]
    //     // let temp: ChartItemModel[] = []
    //     // let temp: TLineChartPoint[] = []
    //     let temp: TCandle[] = []

    //     for (let i = 0; i < chartData.data.length; i++) {
    //         temp.push({
    //             timestamp: chartData.data[i].t,
    //             open: Number(chartData.data[i].o),
    //             high: Number(chartData.data[i].h),
    //             low: Number(chartData.data[i].l),
    //             close: Number(chartData.data[i].c)
    //         })
    //     }

    //     // console.log("temp = ", temp)

    //     setCD(temp)
    //     return () => {
    //         console.log("ChartView cancel")
    //         setCD([])
    //     }
    // }, [chartData.data])

    const getSelectedChartIndex = (): number => {
        switch (selectedChartType) {
            case ChartTypeModel._5m:
                return 0
            case ChartTypeModel._1h:
                return 1
            case ChartTypeModel._1d:
                return 2
            case ChartTypeModel._1w:
                return 3
            case ChartTypeModel._1M:
                return 4
        }
    }

    const chartSegmentControlAction = (value: number) => {
        let chartType: ChartTypeModel
        if (value == 0) {
            chartType = ChartTypeModel._5m
        } else if (value == 1) {
            chartType = ChartTypeModel._1h
        } else if (value == 2) {
            chartType = ChartTypeModel._1d
        } else if (value == 3) {
            chartType = ChartTypeModel._1w
        } else if (value == 4) {
            chartType = ChartTypeModel._1M
        } else {
            alert('unowned chart index')
            return
        }

        setCD([])

        setSelectedChartType(chartType)
    }

    return (
        <>
            <View style={{ alignItems: "flex-end", marginRight: 10, marginBottom: 10 }}>
                {/* <TouchableOpacity style={{backgroundColor: 'red'}}><StyledText>5m</StyledText></TouchableOpacity> */}

                <SegmentedControl
                    style={{ width: 200 }}
                    values={["5m", "1h", "1d", "1w", "1M"]}
                    selectedIndex={getSelectedChartIndex()}
                    backgroundColor={COLORS.HL_BG1}
                    tintColor={COLORS.HL_GREEN}
                    fontStyle={{ color: COLORS.PRIMARY_TEXT }}
                    activeFontStyle={{ color: COLORS.HL_TEXT_SECOND }}
                    onChange={(event) => {
                        chartSegmentControlAction(event.nativeEvent.selectedSegmentIndex)
                    }}
                />
            </View>
            <View style={{ height: 400, marginBottom: 30, flex: 1 }}>
                {/* <LineChart
                hideDataPoints
                    // disableScroll={true}
                    data={cd}
                    yAxisColor="lightgray"
                    xAxisColor="lightgray"
                    yAxisTextStyle={{ color: 'lightgray', }}
                    color='white'
                    dataPointsColor='white'
                    yAxisLabelWidth={50}
                    yAxisSide={0}
                    xAxisLabelTextStyle={{color: 'lightgray'}}
                    spacing={5}
                /> */}

                {chartData.isLoading
                    ? <View style={{flex: 1, justifyContent: 'center'}}>
                        <ActivityIndicator color={COLORS.PRIMARY_TEXT} />
                    </View>
                    : chartData.error != null
                        ? <View style={{justifyContent: 'center', alignItems: 'center', gap: 12, flex: 1}}>
                            <StyledText>{chartData.error}</StyledText>
                            <TouchableOpacity onPress={getChartData} style={{backgroundColor: COLORS.HL_BG1, paddingVertical: 5, paddingHorizontal: 15, borderRadius: 6}}>
                                <StyledText>Repeat</StyledText>
                            </TouchableOpacity>
                        </View>
                        : <View style={{ flex: 1 }}>
                            {/* <KLineScreen/> */}

                            <TextChartView />
                            {/* // <CandlestickChart.Provider data={cd}>
                                //     <CandlestickChart height={200}>
                                //         <CandlestickChart.Candles />
                                //         <CandlestickChart.Crosshair>
                                //             <CandlestickChart.Tooltip />
                                //         </CandlestickChart.Crosshair>
                                //     </CandlestickChart>
                                // </CandlestickChart.Provider>
                                // <LineChart.Provider data={cd}>
                                //     <LineChart height={200} yGutter={0}>
                                //         <LineChart.Path color={COLORS.HL_GREEN} >
                                //             <LineChart.HorizontalLine at={{ index: cd.length - 1 }} />
                                //             <LineChart.HorizontalLine at={{ value: cd[cd.length - 2]!.value }} color="white" />
                                //         </LineChart.Path>

                                //         <LineChart.Axis position="right" orientation="horizontal" domain={[70000, 150000]} />

                                //         <LineChart.CursorCrosshair color={COLORS.HL_GREEN} >
                                //             <LineChart.Tooltip textStyle={{
                                //                 backgroundColor: COLORS.HL_GRAY,
                                //                 borderRadius: 4,
                                //                 color: COLORS.PRIMARY_TEXT,
                                //                 fontSize: 18,
                                //                 padding: 4,
                                //             }} />
                                //         </LineChart.CursorCrosshair>

                                //     </LineChart>
                                //     <LineChart.PriceText /> 
                                //     <LineChart.DatetimeText style={{ color: COLORS.PRIMARY_TEXT }} />

                                // </LineChart.Provider> */}

                        </View>
                }
            </View>
        </>
    )
})

export default ChartView
