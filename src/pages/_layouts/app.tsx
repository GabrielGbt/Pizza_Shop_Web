import { Header } from "@/components/header";
import { Outlet, useNavigate } from "react-router-dom";

export function AppLayout() {
    const navigate = useNavigate()

    return (
        <div className="flex min-h-min flex-col antialiased">
            <Header />

            <div className="flex flex-1 flex-col gap-4 p-8 pt-6">
                <Outlet />
            </div>
        </div>
    )
}