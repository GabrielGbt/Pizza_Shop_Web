import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, X } from "lucide-react";
import { Controller, useForm } from "react-hook-form";
import { useSearchParams } from "react-router-dom";
import { z } from "zod";


const orderFiltersSchema = z.object({
    orderId: z.string().optional(),
    customerName: z.string().optional(),
    status: z.string().optional(),
})

type OrderFiltersSchema = z.infer<typeof orderFiltersSchema>;

export function OrderTableFilters() {

    const [ searchParams, setSearchParams ] = useSearchParams();

    const orderId = searchParams.get('orderId');
    const customerName = searchParams.get('customerName');
    const status = searchParams.get('status');

    const { register, handleSubmit, control, reset } = useForm<OrderFiltersSchema>({
        resolver: zodResolver(orderFiltersSchema),
        defaultValues: {
            orderId: orderId || '',
            customerName: customerName || '',
            status: status || '',
        }
    })
    
    function handleFilter({ customerName, orderId, status }: OrderFiltersSchema) {
        setSearchParams(state => {
            console.log(customerName);
            if (orderId) {
                state.set('orderId', orderId);
            } else {
                state.delete('orderId');
            }

            if (customerName) {
                state.set('customerName', customerName);
            } else {
                state.delete('customerName');
            }

            if (status) {
                state.set('status', status);
            } else {
                state.delete('status');
            }

            state.set('pageIndex', '1')
            return state;
        })
    }

    function handleClearFilters() {
        setSearchParams(state => {
            state.delete('orderId');
            state.delete('customerName');
            state.delete('status');
            state.set('pageIndex', '1')
            return state;
        })
        reset()
    }

    return(
        <form 
            onSubmit={handleSubmit(handleFilter)} 
            className="flex items-center gap-2"
            >
            <span className="text-sm font-semibold">Filtros:</span>
            <Input placeholder="Código do pedido" className="h-8 w-auto" {...register('orderId')} />

            <Input placeholder="Nome do cliente" className="h-8 w-[320px]" {...register('customerName')} />

            <Controller 
                name="status"
                control={control}
                render={({ field: { name, onChange, value, disabled } }) => {
                    return (
                        <Select 
                            defaultValue="all" 
                            name={name} 
                            onValueChange={onChange} 
                            value={value} 
                            disabled={disabled}>

                            <SelectTrigger className="h-8 w-[180px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">todos status</SelectItem>
                                <SelectItem value="pending">pendente</SelectItem>
                                <SelectItem value="canceled">cancelado</SelectItem>
                                <SelectItem value="processing">Em preparo</SelectItem>
                                <SelectItem value="delivering">em Entrega</SelectItem>
                                <SelectItem value="delivered">Entregue</SelectItem>
                            </SelectContent>
                        </Select>
                    )
                }}
            />

            <Button type="submit" variant="outline" size="xs">
                <Search className="mr-2 h-4 w-4" />
                Filtar resultados
            </Button>
            
            <Button onClick={() => handleClearFilters()} type="button" variant="ghost" size="xs">
                <X className="mr-2 h-4 w-4" />
                Remover filtros
            </Button>
        </form>
    )
}