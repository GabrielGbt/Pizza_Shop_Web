import { getDailyRevenueInPeriod } from "@/api/dashboard/get-daily-revenue-in-period";
import { 
    Card, 
    CardContent, 
    CardDescription, 
    CardHeader, 
    CardTitle 
} from "@/components/ui/card";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { subDays } from "date-fns";
import { useState } from "react";
import { DateRange } from "react-day-picker";

import {
    ResponsiveContainer,
    LineChart,
    XAxis,
    YAxis,
    CartesianGrid,
    Line,
    Tooltip,
} from 'recharts'

import colors from 'tailwindcss/colors'


export function RevenueChart() {
    const [ dateRange, setDateRange ] = useState<DateRange | undefined>({
        from: subDays(new Date(), 7),
        to: new Date(),
    })

    const { data: DailyRevenue } = useQuery({
        queryKey: ['metrics', 'month-revenue', dateRange],
        queryFn: () => getDailyRevenueInPeriod({
            from: dateRange!.from,
            to: dateRange!.to,
        }),
    })

    return (
        <Card className="col-span-6">
            <CardHeader className="flex-row items-center justify-between pb-8">
                <div className="space-y-1">
                    <CardTitle className="text-base font-medium">
                        Receita no período
                        </CardTitle>
                    <CardDescription>
                        Receita diária no período
                        </CardDescription>
                </div>

                <div className="flex items-center gap-3">
                    <Label>Período</Label>
                    <DateRangePicker date={dateRange!} onDateChange={setDateRange}/>
                </div>
            </CardHeader>
            <CardContent>
                {DailyRevenue && (
                    <ResponsiveContainer width="100%" height={240}>
                    <LineChart data={DailyRevenue} style={{ fontSize: 12 }}>
                        <XAxis dataKey="date" tickLine={false} axisLine={false} dy={15}/>

                        <YAxis 
                        stroke="#888" 
                        axisLine={false} 
                        tickLine={false}
                        width={80}
                        tickFormatter={(value: number) => 
                            (value / 100).toLocaleString('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                            })
                        }
                         />
                        <CartesianGrid vertical={false} className="stroke-muted-foreground"/>

                        <Line type="linear" strokeWidth={2} dataKey="receipt" stroke={colors.violet[500]}/>
                    </LineChart>
                </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    )
}