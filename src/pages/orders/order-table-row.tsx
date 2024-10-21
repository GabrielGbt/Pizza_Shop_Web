import { ArrowRight, Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TableCell, TableRow } from "@/components/ui/table";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { OrderDetails } from "./order-details";
import { OrderStatus } from "@/components/order-status";

import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelOrder } from "@/api/orders/cancel-order";
import { GetOrdersResponse } from "@/api/orders/get-orders";
import { approveOrder } from "@/api/orders/aprove-order";
import { deliverOrder } from "@/api/orders/deliver-order";
import { dispatchOrder } from "@/api/orders/dispatch-order";

export interface OrderTableRowProps{
    order: {
        orderId: string;
        createdAt: string;
        status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered';
        customerName: String;
        total: number;
    }
}

export function OrderTableRow({ order }: OrderTableRowProps) {
    const queryClient = useQueryClient();
    const [isDialogDetailOpen, setIsDialogDetailOpen] = useState(false);

    function updateOrderStatusOnCache(orderId: string, status: OrderStatus) {
        const ordersListCache = queryClient.getQueriesData<GetOrdersResponse>({
            queryKey: ['orders'],
        })

        ordersListCache.forEach(([cacheKey, cacheData]) => {
            if (!cacheData) {
                return
            }

            queryClient.setQueryData<GetOrdersResponse>(cacheKey, {
                ...cacheData,
                orders: cacheData.orders.map(order => {
                    if (order.orderId == orderId) {
                        return {...order, status }
                    }

                    return order;
                })
            })
        })
    }

    const { mutateAsync: cancelOrderFn, isPending: isCancellingOrder } = useMutation({
        mutationFn: cancelOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'canceled')
        },
    })

    const { mutateAsync: approveOrderFn, isPending: isApprovingOrderPending } = useMutation({

        mutationFn: approveOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'processing')
        },
    })
    
    const { mutateAsync: dispatchOrderFn, isPending: isDispatchingOrder } = useMutation({
        mutationFn: dispatchOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'delivering')
        },
    })

    const { mutateAsync: deliverOrderFn, isPending: isLoadingDelivered } = useMutation({
        mutationFn: deliverOrder,
        async onSuccess(_, { orderId }) {
            updateOrderStatusOnCache(orderId, 'delivered')
        },
    })
    

    return (
        <TableRow>
            <TableCell>
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" type="button" size="xs" onClick={() => setIsDialogDetailOpen(true)}>
                            <Search size={25} className="max-h-2 max-w-3" />
                            <span className="sr-only">Detalhes do pedido</span>
                        </Button>
                    </DialogTrigger>
                    
                    <OrderDetails orderId={order.orderId} open={isDialogDetailOpen}/>                    
                </Dialog>
            </TableCell>
            
            <TableCell className="font-mono text-xs font-medium">
                {order.orderId}
                </TableCell>

            <TableCell className="text-muted-foreground">
                {order.createdAt && formatDistanceToNow(order.createdAt, {
                    locale: ptBR,
                    addSuffix: true,
                })}
                </TableCell>

            <TableCell>
                <OrderStatus status={order.status}/>
                </TableCell>

            <TableCell className="font-medium">
                {order.customerName}
                </TableCell>

            <TableCell className="font-medium">
                {(order.total / 100).toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                })}
                </TableCell>

            <TableCell>

                {order.status == 'pending' && (
                    <Button 
                    onClick={() => approveOrderFn({ orderId:order.orderId })} /* APPROVE ORDER STATUS */
                    disabled={isApprovingOrderPending}
                    variant="outline" size="xs" >
                    <ArrowRight className="mr-2 h-3 w-3" />
                        Aprovar
                    </Button>  
                )}

                {order.status == 'processing' && (
                    <Button 
                    onClick={() => dispatchOrderFn({ orderId:order.orderId })} /* APPROVE ORDER STATUS */
                    disabled={isDispatchingOrder}
                    variant="outline" size="xs" >
                    <ArrowRight className="mr-2 h-3 w-3" />
                        entregar
                    </Button>  
                )}

                {order.status == 'delivering' && (
                    <Button
                    onClick={() => deliverOrderFn({ orderId:order.orderId })} /* APPROVE ORDER STATUS */
                    disabled={isLoadingDelivered}
                    variant="outline" size="xs" >
                    <ArrowRight className="mr-2 h-3 w-3" />
                        entregue
                    </Button>  
                )}

                {order.status == 'delivered' && (
                    <Button                           /* DELIVERED */
                    className="cursor-not-allowed"
                    variant="outline" size="xs" >
                    <ArrowRight className="mr-2 h-3 w-3" />
                        Já entregue
                    </Button>  
                )}

                </TableCell>

            <TableCell>
                <Button 
                    className="disabled:cursor-not-allowed"
                    disabled={!['pending', 'processing'].includes(order.status) || isCancellingOrder} 
                    onClick={() => cancelOrderFn(order)}
                    variant="ghost" size="xs" 
                    >
                        <X className="mr-2 h-3 w-3" /> Cancelar
                    </Button>    
                </TableCell>
        </TableRow>
    )
}