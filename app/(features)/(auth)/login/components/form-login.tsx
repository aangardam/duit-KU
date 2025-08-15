'use client'

import { Form } from "@/shared/components/ui/form";
import useLogin from "../hooks/use-login";
import FormInput from "@/shared/components/form/form-input";
import { Button } from "@/shared/components/ui/button";

const FormLogin = () => {
    const { form, handleSubmit, isLoading } = useLogin();
    return (
        <div className="rounded-md max-w-md mx-auto w-full shadow-md border p-6 lg:shadow-none lg:border-none lg:p-0 lg:bg-transparent ">
            <h1 className="md:text-3xl text-2xl font-bold mb-2">Sign In to your account</h1>
            <p className="text-gray-600 mb-10">Welcome back! Please sign in.</p>         
            <Form {...form}>
                <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
                    <FormInput name="email" label="Email" placeholder="@mail" control={form.control} />
                    <FormInput
                        name="password"
                        label="Password"
                        isPassword={true}
                        type="password"
                        placeholder="p4ssW0rD123_"
                        control={form.control}
                    />
                    <div className="flex flex-col gap-2">
                        <Button
                            type="submit"
                            isLoading={isLoading}
                            disabled={isLoading}
                            className="w-full bg-green-700 hover:bg-green-800 cursor-pointer text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                        >
                            Login
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default FormLogin;