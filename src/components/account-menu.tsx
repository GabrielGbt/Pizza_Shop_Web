
import { Building, ChevronDown, LogOut } from "lucide-react";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getProfile } from "@/api/profile/get-profile";
import { GetManagedRestaurant } from "@/api/get-managed-restaurant";
import { Skeleton } from "./ui/skeleton";
import { Dialog, DialogTrigger } from "./ui/dialog";
import { StoreProfileDialog } from "./store-profile-dialog";
import { signOut } from "@/api/sing-out";
import { useNavigate } from "react-router-dom";

export function AccountMenu() {
    const navigate = useNavigate();

    const { data: profile } = useQuery({
        queryKey: ['profile'],
        queryFn: getProfile,
        staleTime: Infinity,
    })

    const { data: managedRestaurant, isLoading: isLoadingRestaurant } = useQuery({
        queryKey: ['managed-restaurant'],
        queryFn: GetManagedRestaurant,
        staleTime: Infinity,
    })

    const { mutateAsync: signOutFn, isPending: isSigninOut } = useMutation({
        mutationFn: signOut,
        onSuccess: () => {
            navigate('/sign-in', { replace: true })
        }
    })

    return (
        <Dialog>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button className="flex items-center gap-2 select-none" variant='outline' >
                    {isLoadingRestaurant ? <Skeleton className="h-8 w-12" /> : managedRestaurant?.name}
                        <ChevronDown size={18}/>
                    </Button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="flex flex-col">
                        <span>{profile?.data.name}</span>
                        <span className="text-xs font-normal text-muted-foreground">
                            {profile?.data.email}
                        </span>
                    </DropdownMenuLabel>
                    <DialogTrigger asChild>
                        <DropdownMenuItem>
                            <Building className="mr-2 h-4 w-4" />
                            <span>Perfil</span>
                        </DropdownMenuItem>
                    </DialogTrigger>

                    <DropdownMenuItem asChild className="text-rose-500 dark:text-rose-400" disabled={isSigninOut}>
                        <Button variant="outline" className="w-full" onClick={() => signOutFn()}>
                            <LogOut className="mr-2 h-4 w-4" />
                            <span>Sair</span>
                        </Button>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
            
            <StoreProfileDialog />
        </Dialog>
    )
}