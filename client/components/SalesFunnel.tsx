"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Skeleton } from "@/components/ui/skeleton"
import { BarChart, DollarSign, Percent, Users } from "lucide-react"
import ResponsiveFunnelChart from './ResponsiveFunnelChart'
import type { FunnelData } from "../types"
import { fetchFunnelData } from "../services/api"

const SalesFunnel: React.FC = () => {
  const [data, setData] = useState<FunnelData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Custom hook for responsive design
  const useResponsive = () => {
    const [windowSize, setWindowSize] = useState({
      width: typeof window !== "undefined" ? window.innerWidth : 0,
    })

    useEffect(() => {
      const handleResize = () => {
        setWindowSize({
          width: window.innerWidth,
        })
      }

      window.addEventListener("resize", handleResize)
      return () => window.removeEventListener("resize", handleResize)
    }, [])

    return {
      isMobile: windowSize.width < 640,
      isTablet: windowSize.width >= 640 && windowSize.width < 1024,
      isDesktop: windowSize.width >= 1024,
      is4K: windowSize.width >= 3840,
    }
  }

  const { isMobile, is4K } = useResponsive()

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const result = await fetchFunnelData()
        setData(result)
      } catch (err) {
        setError("Failed to load funnel data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [])

  if (loading) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[250px]" />
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 my-6">
                {[...Array(4)].map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-4 w-[100px] mb-2" />
                      <Skeleton className="h-8 w-[120px]" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <Skeleton className="h-[400px] w-full rounded-lg" />
              <Skeleton className="h-[300px] w-full rounded-lg mt-6" />
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="w-full max-w-6xl mx-auto p-6">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6 text-center">
            <p className="text-red-600 font-medium text-lg">{error || "No data available"}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const summaryCards = [
    {
      title: "Total Leads",
      value: data.summary.totalLeads,
      icon: <Users className="h-5 w-5" />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      title: "Total ACV",
      value: data.summary.totalACV,
      icon: <DollarSign className="h-5 w-5" />,
      color: "text-emerald-600 bg-emerald-100",
    },
    {
      title: "Conversion Rate",
      value: `${data.summary.conversionRate}%`,
      icon: <Percent className="h-5 w-5" />,
      color: "text-purple-600 bg-purple-100",
    },
    {
      title: "Win Rate (ACV)",
      value: `${data.summary.winRate}%`,
      icon: <BarChart className="h-5 w-5" />,
      color: "text-amber-600 bg-amber-100",
    },
  ]

  return (
    <div className={`w-full mx-auto p-4 md:p-6 ${is4K ? "max-w-7xl" : "max-w-6xl"}`}>
      <Card className="shadow-md border-0 overflow-hidden">
        <CardHeader className="pb-0 pt-6 px-6 bg-gradient-to-r from-slate-50 to-slate-100 center">
          <CardTitle className={`${is4K ? "text-3xl" : "text-xl"} font-bold text-slate-800`}>
            Sales Funnel Analysis
          </CardTitle>
        </CardHeader>

        <CardContent className={`p-6 ${is4K ? "space-y-8" : "space-y-6"}`}>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {summaryCards.map((card, index) => (
              <Card key={index} className="border shadow-sm hover:shadow-md transition-shadow duration-200">
                <CardContent className="p-4 flex flex-col">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-sm text-slate-500 font-medium">{card.title}</p>
                    <div className={`rounded-full p-2 ${card.color}`}>{card.icon}</div>
                  </div>
                  <p className={`text-2xl md:text-3xl font-bold ${card.color.split(" ")[0]}`}>{card.value}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Funnel Chart */}
          <Card className="shadow-sm border overflow-hidden bg-white">
            <CardContent className="p-0">
              <div className={`w-full ${is4K ? "h-[700px]" : isMobile ? "h-[300px]" : "h-[400px]"}`}>
                <ResponsiveFunnelChart data={data.funnelData} />
              </div>
            </CardContent>
          </Card>

          {/* Data Table */}
          <Card className="shadow-sm border overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-slate-50">
                    <TableRow>
                      <TableHead className="font-semibold text-slate-700">Stage</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Count</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">ACV</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Conversion</TableHead>
                      <TableHead className="text-right font-semibold text-slate-700">Drop-off</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.funnelData.map((item, index) => (
                      <TableRow key={item.label} className="hover:bg-slate-50">
                        <TableCell className="font-medium">{item.label}</TableCell>
                        <TableCell className="text-right">{item.count}</TableCell>
                        <TableCell className="text-right">{item.formattedACV}</TableCell>
                        <TableCell className={`text-right ${index > 0 ? "text-emerald-600 font-medium" : ""}`}>
                          {index > 0 ? `${item.conversionRate}%` : "-"}
                        </TableCell>
                        <TableCell className={`text-right ${index > 0 ? "text-red-600 font-medium" : ""}`}>
                          {index > 0 ? `${item.dropOffPercentage}%` : "-"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </CardContent>
      </Card>
    </div>
  )
}

export default SalesFunnel
