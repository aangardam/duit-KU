import { z } from 'zod'
import { useForm } from "react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useUserStore } from '@/shared/store/user.store';
import { useState } from 'react';
import { register } from '../../login/service/auth.service';


const schema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
})

const useRegister = () => {
    const router = useRouter()
    const { setUser, setToken, setLastSignIn } = useUserStore();
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof schema>>({
        resolver: zodResolver(schema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const handleSubmit = (data: z.infer<typeof schema>) => {
        setIsLoading(true);
        handleRegister(data.email, data.password)
    }

    const handleRegister = async (email: string, password: string) => {
        
        try {
            const res = await register(email, password)
            if (res) {
                setUser(res?.user?.id)
                setToken(res?.session?.access_token ?? '')
                setLastSignIn(`${res?.user?.last_sign_in_at}`)
                router.push('/login')
            }
        } catch (error) {
            toast.error(error instanceof Error ? error.message : String(error), { duration: 3000 })
        }
        setIsLoading(false);
    }

    return {
        form,
        handleSubmit,
        isLoading
    }
}

export default useRegister