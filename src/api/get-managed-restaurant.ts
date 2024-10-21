import { api } from "@/lib/axios";

export interface GetManagedRestaurantResponse {
    id: string,
    name: string,
    description: string,
    email: string,
    phone: string | null,
    createdAt: Date | null,
    updatedAt: Date | null,
    managerId: string | null,
}

export async function GetManagedRestaurant() {
    const response = await api.get<GetManagedRestaurantResponse>(
        '/managed-restaurant',
    )

    return response.data;
}