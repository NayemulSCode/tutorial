/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useRef, useState } from 'react'
import { useQuery } from "@apollo/client"
import ApexCharts, { ApexOptions } from 'apexcharts'
import { getCSS, getCSSVariableValue } from '../../../assets/ts/_utils'
import { RECENT_SALE } from "../../../../gql/Query";

type Props = {
  className: string
}

const HomeWidget1: React.FC<Props> = ({ className }) => {
  const chartRef = useRef<HTMLDivElement | null>(null)
  const [weekView, setWeekView] = useState<any>([]);
  const [monthView, setMonthView] = useState<any>([]);
  const [amount, setAmount] = useState<any>([]);
  const [qty, setQty] = useState<any>([]);
  const [loading, setLoading] = useState(false)
  const [viewType, setViewType] = useState("week");
  const [color, setColor] = useState(true)

  const handleChange = (event: any, type: any) => {
    setViewType(type)
  }
  const { data, loading: dataLoading } = useQuery(RECENT_SALE, {
    variables: {
      type: viewType
    }
  })


  useEffect(() => {
    if (data) {
      // console.log(data)
      if (viewType === "week") {
        setMonthView([])
        setWeekView(data?.recentSales.map((item: any) => item.date.split('-')[0]))
      } else {
        setWeekView([])
        setMonthView(data?.recentSales.map((item: any) => item.date.split('-')[1]))
      }
      setAmount(data?.recentSales.map((item: any) => +item.total_amount))
      setQty(data?.recentSales.map((item: any) => +item.total_sale))
      setLoading(false)
    }
    if (dataLoading) {
      setMonthView([])
      setWeekView([])
      setAmount([])
      setQty([])
      setLoading(true)
    }
  }, [data, dataLoading])

  // console.log(weekView, amount)
  useEffect(() => {
    if (loading) {
      return
    }
    if (!chartRef.current) {
      return
    }

    const height = parseInt(getCSS(chartRef.current, 'height'))

    const chart = new ApexCharts(chartRef.current, getChartOptions(height))
    if (chart) {
      chart.render()
    }

    return () => {
      if (chart) {
        chart.destroy()
      }
    }

  }, [chartRef, data, loading, weekView, monthView])

  function getChartOptions(height: number): ApexOptions {
    const labelColor = getCSSVariableValue('--bs-gray-500')
    const borderColor = getCSSVariableValue('--bs-gray-200')
    const baseColor = getCSSVariableValue('--bs-info')
    const lightColor = getCSSVariableValue('--bs-light-info')

    return {
      series: [
        {
          name: 'Sale',
          data: amount,
        },
      ],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: 350,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {},
      legend: {
        show: false,
      },
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'solid',
        opacity: 1,
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor],
      },
      xaxis: {
        categories: weekView.length > 0 ? weekView : monthView,
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: false,
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (qty) {
            return '$' + qty
          },
        },
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColors: baseColor,
        strokeWidth: 3,
      },
    }
  }

  return (
    <div className={`card ${className}`}>
      <div className='card-header border-0 pt-5'>
        <h3 className='card-title align-items-start flex-column'>
          <span className='card-label fw-bolder fs-3 mb-1'>Recent Sales</span>
          {/* <span className='text-muted fw-bold fs-7'>More than 1000 new records</span> */}
        </h3>
        <div className='card-toolbar' data-kt-buttons='true'>
          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 me-1 ${viewType === "week" && 'active'}`}
            id='kt_charts_widget_3_month_btn' onClick={(e) => { handleChange(e, "week") }}
          >
            Week
          </a>
          <a
            className={`btn btn-sm btn-color-muted btn-active btn-active-primary px-4 ${viewType === "month" && 'active'}`}
            id='kt_charts_widget_3_week_btn' onClick={(e) => { handleChange(e, "month") }}
          >
            Month
          </a>
        </div>
      </div>

      {/* begin::Body */}
      <div className='card-body'>
        {/* begin::Chart */}
        <div ref={chartRef} id='kt_charts_widget_3_chart' style={{ height: '350px' }}></div>
        {/* end::Chart */}
      </div>
      {/* end::Body */}
    </div>
  )
}

export { HomeWidget1 }


