import { Helmet } from "react-helmet-async"
import { useForm } from "react-hook-form"
import { z } from "zod";

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { registerRestaurant } from "@/api/register-restaurant";

const SignUpSchema = z.object({
    restaurantName: z.string(),
    managerName: z.string(),
    phone: z.string(),
    email: z.string().email(),
});

type SignUpForm = z.infer<typeof SignUpSchema>;


export function SignUp () {
    
    const navigate = useNavigate();

    const { 
        register, 
        handleSubmit, 
        formState: { isSubmitting } 
    } = useForm<SignUpForm>();

    const { mutateAsync: registerRestaurantFn } = useMutation({
        mutationFn: registerRestaurant,
    })

    async function handleSignUp(data: SignUpForm) {
        try {
            console.log(data)
            await registerRestaurantFn({
                restaurantName: data.restaurantName,
                managerName: data.managerName,
                phone: data.phone,
                email: data.email,
            }) 

            toast.success('Restaurante criado com sucesso', {
                action: {
                    label: 'Faça login',
                    onClick: () => navigate(`/sign-in?email=${data.email}`),
                }
            })
        } catch {
            toast.error('Informações inválidas')
        }
    }

    return (
        <>
            <Helmet title="Cadastro" />
            <div className="p-8">
                <Button variant="ghost" asChild className="absolute right-8 top-8">
                    <Link to='/sign-in'>
                        Fazer login
                    </Link>
                </Button>
                <div className="flex w-[350px] flex-col justify-center gap-6">
                    <div className="flex flex-col gap-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Criar conta gratuita
                        </h1>
                        <p className="text-sm text-muted-foreground">Seja um parceiro e comece já suas vendas</p>

                    </div>

                    <form onSubmit={handleSubmit(handleSignUp)} className="space-y-4">
                        <div className="space-y-2"> 
                            <Label htmlFor="restaurantName">Nome do estabelecimento</Label>
                            <Input id="restaurantName" type="text" {...register('restaurantName')}/>
                        </div>

                        <div className="space-y-2"> 
                            <Label htmlFor="managerName">Seu nome</Label>
                            <Input id="managerName" type="text" {...register('managerName')}/>
                        </div>

                        <div className="space-y-2"> 
                            <Label htmlFor="email">Seu e-mail</Label>
                            <Input id="email" type="email" {...register('email')}/>
                        </div>

                        <div className="space-y-2"> 
                            <Label htmlFor="phone">Telefone</Label>
                            <Input id="phone" type="tel" {...register('phone')}/>
                        </div>

                        <Button disabled={isSubmitting} className="w-full bg-primary" type="submit">Acessar painel</Button>

                        <p className="px-6 text-center text-sm leading-relaxed text-muted-foreground">
                            Ao continuar, você concorda com os nossos <a className="underline underline-offset-4" href="">Termos de serviço</a> e
                            <a className="underline underline-offset-4" href=""> políticas de privacidade</a>
                        </p>
                    </form>
                </div>
            </div>
        </>
    )
}