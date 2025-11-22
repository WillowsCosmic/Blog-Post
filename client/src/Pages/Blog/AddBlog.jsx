import React, { useEffect, useState } from 'react'
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
import { Link, useNavigate } from 'react-router'
import slugify from 'slugify'
import { showToast } from '@/helpers/showToast'
import { getEnv } from '@/helpers/getEnv'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFetch } from '@/hooks/useFetch'
import Dropzone from 'react-dropzone'
import Editor from '@/components/Editor'
import { useSelector } from 'react-redux'
import { RouteBlog } from '@/helpers/RouteName'


const AddBlog = () => {
  const user = useSelector((state)=>state.user)
  const [filePreview, setPreview] = useState()
  const [file, setFile] = useState()
  const [userData, setUserData] = useState(null)
  const navigate = useNavigate()



  const { data: categoryData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
    method: 'get',
    credentials: 'include'
  })

  const formSchema = z.object({
    category: z.string().min(1, 'Please select a category'),
    title: z.string().min(3, 'Title must be at least 3 characters long'),
    slug: z.string().min(3, 'Slug must be at least 3 characters long'),
    blogContent: z.string().min(3, 'Blog Content must be at least 3 characters long'),
  })

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: '',
      title: '',
      slug: '',
      blogContent: '',
    },
  })

  const blogTitle = form.watch('title');
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true })
      form.setValue('slug', slug)
    }
  }, [blogTitle])

  const handleFileSelection = (files) => {
    const file = files[0]
    const preview = URL.createObjectURL(file)
    setFile(file)
    setPreview(preview)
  }

  const handleEditorData = (event, editor) => {
    const data = editor.getData()
    form.setValue('blogContent', data)
  }

const getImageUrl = () => {
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

  async function onSubmit(values) {
    try {
      const newValues = { ...values, author: user.user.id}
      console.log(newValues)
      const formData = new FormData();
      formData.append('data',JSON.stringify(newValues))
      
      if (file) {
          formData.append('featureImage', file);
      }

      const response = await fetch(
          `${getEnv('VITE_API_BASE_URL')}/blog/add`,
          {
              method: 'POST',
              credentials: 'include',
              body: formData
          }
      );
      
      const data = await response.json();

      if (!response.ok) {
          showToast('error', data.message);
          return;
      }
      setFile()
      setPreview()
      navigate(RouteBlog)
      showToast('success',data.message)

      setFile(null);
      setPreview(null);
      

  } catch (error) {
      showToast('error', error.message);
  }
  }
  return (
    <div>
      <Card className='pt-5 max-w-screen md-auto'>
        <CardContent>
        <h1 className="text-2xl font-bold mb-4">Add Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className='mb-5 '>
                <FormField
                  control={form.control}
                  name="category"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoryData && categoryData.categories.length > 0 &&
                            categoryData.categories.map(category => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}  // ✅ Convert to string
                              >
                                {category.name}
                              </SelectItem>
                            ))
                          }
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className='mb-5 '>
                <FormField
                  control={form.control}
                  name="title"  // ✅ Changed from 'blogTitle' to 'title'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter Blog Title" {...field} />
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

              <div className='mb-5 '>
                <span className='mb-2 block'>Featured image </span>
                <Dropzone onDrop={acceptedFiles => handleFileSelection(acceptedFiles)}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className='flex justify-center items-center w-36 h-36 border-2 border-dashed rounded'>
                        <img src={filePreview} />
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>
              <div className='mb-5 '>
                <FormField
                  control={form.control}
                  name="blogContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Blog Content</FormLabel>
                      <FormControl>
                        <Editor props={{ intitalData: '', onChange: handleEditorData }} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className='mb-5'>

                <Button type="submit" >Submit</Button>
              </div>

            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}



export default AddBlog