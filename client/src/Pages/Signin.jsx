import React from 'react'
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from 'react-hook-form'
import { Card } from '@/components/ui/card'
import { Link } from 'react-router'
import { RouteSignUp } from '@/helpers/RouteName'


const Signin = () => {

    const formSchema = z.object({
        email: z.email(),
        password: z.string().min(8, 'password must be atleast 8 characters')
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })
    function onSubmit(values) {
        console.log(values)
    }


    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Card className={'w-[400px] p-5 shadow-lg'}>
                <h1 className="text-2xl font-bold text-center mb-5 loginh1">Login into your Account</h1>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className='mb-5 '>
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email address" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mb-5 '>
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mb-5'>
                        <Button type="submit" className={'w-full'}>Sign In</Button>
                        </div>
                        <div>
                            <p className='inter text-sm flex justify-center items-center gap-2'>Don&apos;t have an account?
                            <Link to={RouteSignUp} className='inter text-sm text-blue-400 hover:underline'>Sign up</Link></p>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

export default Signin