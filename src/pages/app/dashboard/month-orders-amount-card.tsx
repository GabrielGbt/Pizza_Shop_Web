import { getMonthOrdersAmount } from "@/api/dashboard/get-month-orders-amount";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Utensils } from "lucide-react";

export function MonthOrdersAmountCard() {
    const { data: MonthOrdersAmount } = useQuery({
        queryKey: ['metrics', 'month-orders-amount'],
        queryFn: getMonthOrdersAmount,
    })

    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-base font-semibold">
                    Pedidos (mês)
                    </CardTitle>
                <Utensils className="h4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent className="space-y-1">
            {MonthOrdersAmount && (
                    <>
                    <span className="text-2xl font-bold tracking-tight">
                        {MonthOrdersAmount.amount.toLocaleString('pt-BR')}
                        </span>
                    <p className="text-xs text-muted-foreground">
                        {MonthOrdersAmount.diffFromLastMonth > 0 ? (
                            <>
                            <span className="text-emerald-500 dark:text-emerald-400">+{MonthOrdersAmount.diffFromLastMonth}%</span>
                            em relação a ontem
                            </>
                        ) : (
                            <>
                            <span className="text-rose-500 dark:text-rose-400">{MonthOrdersAmount.diffFromLastMonth}% </span>
                            em relação a ontem
                            </>
                        )}
                    </p>
                </>
                )}
            </CardContent>
        </Card>
    )
}