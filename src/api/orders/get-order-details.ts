import { api } from "@/lib/axios";

export interface GetOrderDetailsProps {
    orderId: string;
}

export interface GetOrderDetailsResponse {
    id: string;
    createdAt: string;
    status: 'pending' | 'canceled' | 'processing' | 'delivering' | 'delivered';
    totalInCents: number;
    customer: {
        name: string;
        email: string;
        phone: string;
    };
    orderItems: {
        id: string;
        priceInCents: number;
        quantity: number;
        product: {
            name: string
        }
    }[]
}

export async function getOrderDetails({ orderId }: GetOrderDetailsProps) {
    const response = await api.get<GetOrderDetailsResponse>(`/orders/${orderId}`);

    return response.data;
}