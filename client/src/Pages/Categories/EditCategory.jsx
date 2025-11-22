import React, { useEffect } from 'react'
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
import { Card, CardContent } from '@/components/ui/card'
import { Link, useNavigate, useParams } from 'react-router'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'

const EditCategory = () => {
  const {category_id} = useParams()
  const {data: categoryData,loading,error} = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/show/${category_id}`, {
    method: 'get',
    credentials: 'include'
  },[category_id]) 

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 characters long'),
        slug: z.string().min(3, 'Name must be at least 3 characters long')
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            slug: '',
        },
    })
    

    const categoryName = form.watch('name');
    useEffect(()=>{
        if(categoryName){
            const slug = slugify(categoryName, {lower: true})
            form.setValue('slug',slug)
        }
    },[categoryName])

    useEffect(()=>{
      if(categoryData){
        console.log(categoryData)
        form.setValue('name',categoryData.categories.name)
        form.setValue('slug',categoryData.categories.slug)
      }
    },[categoryData])
    async function onSubmit(values) {
        try {
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/category/update/${category_id}`,{
                method:'put',
                headers:{'Content-type':'application/json'},
                body:JSON.stringify(values) //Json object converted to json string
            })
            const data = await response.json()
            if(!response.ok){
                showToast('error',data.message)
            }
            showToast('success',data.message)
        } catch (error) {
            showToast('error',error.message)
        }
    }
    return (
        <div>
            <Card className='pt-5 max-w-screen md-auto'>
                <CardContent>

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
                                    name="slug"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Slug</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Slug" {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            <div className='mb-5'>
                                <Button type="submit" className={'w-full'}>Submit</Button>
                            </div>

                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}

export default EditCategory