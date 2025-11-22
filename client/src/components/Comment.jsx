import React, { useState, useEffect } from 'react'
import { FaComments } from "react-icons/fa";
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
import { showToast } from '@/helpers/showToast'
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import { useSelector } from 'react-redux';
import { RouteSignIn } from '@/helpers/RouteName';
import { getEnv } from '@/helpers/getEnv';

const Comment = ({ blogid }) => {
    const user = useSelector((state) => state.user)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    
    const formSchema = z.object({
        comment: z.string().min(3, 'Comment must be at least 3 characters long'),
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            comment: ''
        },
    })
    
    useEffect(() => {
        if (blogid) {
            fetchComments()
        }
    }, [blogid])
    
    const fetchComments = async () => {
        try {
            const response = await fetch(
                `${getEnv('VITE_API_BASE_URL')}/comment/blog/${blogid}`
            )
            const data = await response.json()
            if (response.ok) {
                setComments(data.comments || [])
            }
        } catch (error) {
            console.error('Fetch comments error:', error)
        } finally {
            setLoading(false)
        }
    }
    
    async function onSubmit(values) {
        try {
            const newValues = {
                ...values, 
                blogid: blogid,
                author: user.user.id
            }
            console.log(newValues)
            
            const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/comment/add`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newValues),
                credentials: 'include'
            })
            
            const data = await response.json()
            
            if (!response.ok) {
                showToast('error', data.message)
                return;
            }
            
            form.reset()
            showToast('success', data.message)
            fetchComments()
            
        } catch (error) {
            console.error('Comment submission error:', error);
            showToast('error', error.message || 'Failed to submit comment')
        }
    }
    
    return (
        <div>
            <h4 className='flex items-center gap-2 text-2xl font-bold mb-3'>
                <FaComments className='text-pink-600' />
                Comments ({comments.length})
            </h4>
            
            {user && user.isLoggedIn ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className='mb-5'>
                            <FormField
                                control={form.control}
                                name="comment"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Comment</FormLabel>
                                        <FormControl>
                                            <Textarea 
                                                placeholder="Type your comment here..." 
                                                {...field} 
                                                rows={4}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className='mb-5'>
                            <Button 
                                type="submit" 
                                className={'w-full'}
                                disabled={form.formState.isSubmitting}
                            >
                                {form.formState.isSubmitting ? 'Submitting...' : 'Submit Comment'}
                            </Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <Button asChild>
                    <Link to={RouteSignIn}>Sign In to Comment</Link>
                </Button>
            )}
            
            
        </div>
    )
}

export default Comment