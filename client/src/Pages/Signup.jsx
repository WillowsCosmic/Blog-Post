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
import { Link, useNavigate } from 'react-router'
import { RouteSignIn } from '@/helpers/RouteName'
import { getEnv } from '@/helpers/getEnv'
import { showToast } from '@/helpers/showToast'
import GoogleLogin from '@/components/GoogleLogin'


const Signup = () => {

    const navigate = useNavigate()
    const formSchema = z.object({
        name:z.string().min(3, 'Name must be atleast 3 characters long'),
        email: z.email(),
        password: z.string().min(8, 'password must be atleast 8 characters'),
        confirmPassword: z.string().refine(data => data.password === data.confirmPassword, 'Password and confirm password should be same'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name:'',
            email: '',
            password: '',
            confirmPassword:'',
        },
    })
     async function onSubmit(values) {
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/register`,{
                method:'post',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify(values) //Json object converted to json string
            })
            const data = await response.json()
            if(!response.ok){
                showToast('error',data.message)
            }

            navigate(RouteSignIn)
            showToast('success',data.message)
        } catch (error) {
            showToast('error',error.message)
        }
    }

    return (
        <div className="flex justify-center items-center h-screen w-screen">
            <Card className={'w-[400px] p-5 shadow-lg'}>
                <h1 className="text-2xl font-bold text-center mb-5 loginh1">Create your Account</h1>
                <div>
                    <GoogleLogin />
                    <div className='border my-5 flex items-center justify-center'>
                        <span className='absolute bg-white text-sm'>Or</span>
                    </div>
                </div>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className='mb-5 '>
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
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
                                            <Input type="password" placeholder="Enter your Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mb-5 '>
                            <FormField
                                control={form.control}
                                name="confirmPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Confirm Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Confirm Password" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <div className='mb-5'>
                        <Button type="submit"  className={'w-full'}>Sign Up</Button>
                        </div>
                        <div>
                            <p className='inter text-sm flex justify-center items-center gap-2'>Already have an account?
                            <Link to={RouteSignIn} className='inter text-sm text-blue-400 hover:underline'>Sign in</Link></p>
                        </div>
                    </form>
                </Form>
            </Card>
        </div>
    )
}

export default Signup