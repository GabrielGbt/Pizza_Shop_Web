import { Button } from "./ui/button";
import { Textarea } from "@/components/ui/textarea"
import { DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "./ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "./ui/input";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { GetManagedRestaurant, GetManagedRestaurantResponse } from "@/api/get-managed-restaurant";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod'
import { updateProfile } from "@/api/profile/update-profile";
import { toast } from "sonner";

const StoreProfileSchema = z.object({
    name: z.string().min(1),
    description: z.string(),
});

type StoreProfileData = z.infer<typeof StoreProfileSchema>;


export function StoreProfileDialog() {
    const queryClient = useQueryClient();
    
    const { data: managedRestaurant } = 
        useQuery({
        queryKey: ['managed-restaurant'],
        queryFn: GetManagedRestaurant,
        staleTime: Infinity,
    });

    const { register, handleSubmit, formState: { isSubmitting } } = useForm<StoreProfileData>({
        resolver: zodResolver(StoreProfileSchema),
        values: {
            name: managedRestaurant?.name ?? '',
            description: managedRestaurant?.description?? '',
        }
    });

    function updateManagedRestaurantCache({ name, description }: StoreProfileData) {
        const cached = queryClient.getQueryData<GetManagedRestaurantResponse>([
            'managed-restaurant'
        ])

        if (cached) {
            queryClient.setQueryData<GetManagedRestaurantResponse>(
                ['managed-restaurant'], {
                ...cached,
                name,
                description
            })
        }
        return cached!;
    }

    const { mutateAsync: updateProfileFn } = useMutation({
        mutationFn: updateProfile,
        onMutate({ name, description }) {
            const cached = updateManagedRestaurantCache({ name, description })

            return { previousProfile: cached }
        },
        onError(_, __, context) {
            updateManagedRestaurantCache(context!.previousProfile)
        },
    });

    async function handleUpdateProfile(data: StoreProfileData) {
        try {
            await updateProfileFn({
                name: data.name,
                description: data.description,
            })

            toast.success('Perfil atualizado com sucesso!')
        } catch {
            toast.error('Perfil não atualizado');
        }
    }

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle >Perfil da loja</DialogTitle>
                <DialogDescription>
                    Atualize as informações do seu estabelecimento visíveis ao seu cliente
                </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(handleUpdateProfile)}>

                <div className="space-y-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="name">
                            Nome
                        </Label>
                        <Input className="col-span-3" id="name" {...register('name')}/>
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <label>
                            Descrição do negócio
                        </label>
                        <Textarea className="col-span-3" id="name" {...register('description')}/>
                    </div>
                </div>
                
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="ghost" >
                            Cancelar
                            </Button>
                    </DialogClose>

                    
                        <Button type="submit" variant="success" disabled={isSubmitting}>
                            Salvar
                            </Button>
                    
                </DialogFooter>
            </form>
        </DialogContent>
    )
}