import { getOrderDetails } from "@/api/orders/get-order-details";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

export interface OrderDetailsProps {
    orderId: string;
    open: boolean;
}

export function OrderDetails({ orderId, open }: OrderDetailsProps) {
    const { data: orderDetails } = useQuery({
        queryKey: ['order', orderId],
        queryFn: () => getOrderDetails({ orderId }),
        staleTime: 1000,
        enabled: open,
    })

    if(!orderDetails) {
        return null;
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Pedido: {213}</DialogTitle>
                <DialogDescription>
                    Detalhes do pedido
                </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
                <Table>
                    <TableBody>
                        <TableRow>
                            <TableCell className="text-muted-foreground">Status</TableCell>
                            <TableCell className="flex justify-end">
                                <div className="flex items-center gap-2">
                                    <span className="h-2 w-2 rounded-full bg-slate-400" />
                                    <span className="font-medium text-muted-foreground">
                                        {orderDetails?.status}
                                    </span>
                                </div>
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Cliente</TableCell>
                            <TableCell className="flex justify-end">
                                {orderDetails?.customer.name}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Telefone</TableCell>
                            <TableCell className="flex justify-end">
                                {orderDetails?.customer.phone}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">E-mail</TableCell>
                            <TableCell className="flex justify-end">
                                {orderDetails?.customer.email}
                            </TableCell>
                        </TableRow>

                        <TableRow>
                            <TableCell className="text-muted-foreground">Realizado </TableCell>
                            <TableCell className="flex justify-end">
                            {orderDetails.createdAt && formatDistanceToNow(orderDetails.createdAt, {
                                locale: ptBR,
                                addSuffix: true,
                            })}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>

                <Table>
                    <TableHeader>
                        <TableHead>Produto</TableHead>
                        <TableHead className="text-right">Qnt.</TableHead>
                        <TableHead className="text-right">Preço</TableHead>
                        <TableHead className="text-right">Subtotal</TableHead>
                    </TableHeader>
                    {orderDetails.orderItems.map(item => {
                        return (
                            <TableBody key={item.id}>
                                <TableRow>
                                    <TableCell>{item.product.name}</TableCell>
                                    <TableCell className="text-right">{item.quantity}</TableCell>
                                    <TableCell className="text-right">
                                        {(item.priceInCents / 100).toLocaleString('pt-BR', {
                                             style: 'currency',
                                             currency: 'BRL',
                                        })}
                                        </TableCell>
                                    <TableCell className="text-right">
                                        {(item.priceInCents * item.quantity / 100)
                                           .toLocaleString('pt-BR', {
                                             style: 'currency',
                                             currency: 'BRL',
                                        })}
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        )
                    })}
                    
                    <TableFooter>
                        <TableRow>
                            <TableCell colSpan={3} className="text-right">Total</TableCell>
                            <TableCell className="text-right">
                                {(orderDetails.totalInCents / 100).toLocaleString('pt-BR', {
                                     style: 'currency',
                                     currency: 'BRL',
                                })}
                            </TableCell>
                        </TableRow>
                    </TableFooter>
                </Table>
            </div>
        </DialogContent>
    )
}