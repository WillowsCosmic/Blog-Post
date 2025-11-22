import { Card, CardContent } from '@/components/ui/card'
import React, { useState } from 'react'
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
import { showToast } from '@/helpers/showToast'
import { useDispatch, useSelector } from 'react-redux'
import { setUser } from '@/redux/user/user.slice'
import { useNavigate } from 'react-router'
import { getEnv } from '@/helpers/getEnv'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Textarea } from '@/components/ui/textarea'
import Loading from '@/components/Loading'
import usericon from '@/assets/images/user.png'
import { FaCameraRetro } from "react-icons/fa";
import Dropzone from 'react-dropzone'


const Profile = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const user = useSelector((state) => state.user.user)
    const isLoggedIn = useSelector((state) => state.user.isLoggedIn)

    const [filePreview, setPreview] = useState()
    const [file, setFile] = useState()
    const [userData, setUserData] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const userid = user?.id

    const fetchUserData = async () => {
        if (!userid) return;
        
        try {
            setLoading(true);
            const response = await fetch(
                `${getEnv('VITE_API_BASE_URL')}/user/get-user/${userid}`,
                {
                    method: 'GET',
                    credentials: 'include'
                }
            );
            
            const data = await response.json();
            
            if (response.ok) {
                setUserData(data);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchUserData();
    }, [userid]);

    const formSchema = z.object({
        name: z.string().min(3, 'Name must be at least 3 characters long.'),
        email: z.email(),
        bio: z.string().optional(),
        password: z.string().optional()
    })

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            bio: '',
            password: '',
        },
    })

    React.useEffect(() => {
        if (userData?.user) {
            form.reset({
                name: userData.user.username || '',
                email: userData.user.email || '',
                bio: userData.user.bio || '',
                password: '',
            })
        }
    }, [userData])

    async function onSubmit(values) {
        try {
            const formData = new FormData();
            
            formData.append('name', values.name);
            formData.append('email', values.email);
            
            if (values.bio) {
                formData.append('bio', values.bio);
            }
            
            if (values.password && values.password.trim() !== '') {
                formData.append('password', values.password);
            }
            
            if (file) {
                formData.append('profilePhoto', file);
            }
    
            const response = await fetch(
                `${getEnv('VITE_API_BASE_URL')}/user/update-user/${userid}`,
                {
                    method: 'PUT',
                    credentials: 'include',
                    body: formData
                }
            );
            
            const data = await response.json();
    
            if (!response.ok) {
                showToast('error', data.message);
                return;
            }
    
            dispatch(setUser(data.user));
            
            setFile(null);
            setPreview(null);
            
            await fetchUserData();
            
            showToast('success', 'Profile updated successfully!');
    
        } catch (error) {
            showToast('error', error.message);
        }
    }

    if (loading || !userid) {
        return <Loading />
    }

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen text-red-500">
                Error loading profile: {error}
            </div>
        )
    }

    const handleFileSelection = (files) => {
        const file = files[0]
        const preview = URL.createObjectURL(file)
        setFile(file)
        setPreview(preview)
    }

    const getAvatarUrl = () => {
        if (filePreview) {
            return filePreview;
        }
        
        if (userData?.user?.avatar) {
            const avatarPath = userData.user.avatar;
            
            if (avatarPath.startsWith('http')) {
                return avatarPath;
            }
            
            const baseUrl = getEnv('VITE_API_BASE_URL').replace('/api', '');
            const fullUrl = `${baseUrl}${avatarPath}`;
            return fullUrl;
        }
        
        return usericon;
    };

    return (
        <Card className='max-w-screen-md mx-auto mt-10'>
            <CardContent>
                <div className="flex justify-center items-center mt-10">
                    <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                        {({ getRootProps, getInputProps }) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <Avatar className='w-25 h-25 relative group'>
                                    <AvatarImage 
                                        src={getAvatarUrl()}
                                        alt="Profile Avatar"
                                        onError={(e) => {
                                            e.target.src = usericon;
                                        }}
                                    />
                                    <div className='absolute inset-0 z-10 w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 justify-center items-center bg-black/50 bg-opacity-10 border-pink-600 rounded-full group-hover:flex hidden cursor-pointer'>
                                        <FaCameraRetro color='#ff2056' />
                                    </div>
                                </Avatar>
                            </div>
                        )}
                    </Dropzone>
                </div>
                
                <div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your Name" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

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

                            <FormField
                                control={form.control}
                                name="bio"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bio</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Enter your Bio" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Password</FormLabel>
                                        <FormControl>
                                            <Input type="password" placeholder="Leave blank to keep current" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                                
                            <Button type="submit" className="w-full">
                                Update Profile
                            </Button>
                        </form>
                    </Form>
                </div>
            </CardContent>
        </Card>
    )
}

export default Profile