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
import { useNavigate, useParams } from 'react-router'
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
import { decode } from 'entities'
import Loading from '@/components/Loading'

const EditBlog = () => {
  const user = useSelector((state) => state.user)
  const { blogid } = useParams()
  const [filePreview, setPreview] = useState(null)
  const [file, setFile] = useState(null)
  const [editorKey, setEditorKey] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [isDataLoaded, setIsDataLoaded] = useState(false)
  const navigate = useNavigate()

  const { data: categoryData } = useFetch(
    `${getEnv('VITE_API_BASE_URL')}/category/all-category`,
    {
      method: 'get',
      credentials: 'include'
    }
  )

  const { data: blogData, loading: blogLoading } = useFetch(
    `${getEnv('VITE_API_BASE_URL')}/blog/edit/${blogid}`,
    {
      method: 'get',
      credentials: 'include'
    },
    [blogid]
  )

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

  useEffect(() => {
    if (blogData && blogData.blog && categoryData) {
      const blog = blogData.blog

      form.reset({
        category: blog.category?.toString() || '',
        title: blog.title || '',
        slug: blog.slug || '',
        blogContent: decode(blog.blogContent) || '',
      })

      setEditorKey(prev => prev + 1)
      setIsDataLoaded(true)
      
      
    }
  }, [blogData, categoryData])

  const blogTitle = form.watch('title')
  useEffect(() => {
    if (blogTitle) {
      const slug = slugify(blogTitle, { lower: true })
      form.setValue('slug', slug)
    }
  }, [blogTitle])

  const handleFileSelection = (files) => {
    const selectedFile = files[0]
    const preview = URL.createObjectURL(selectedFile)
    setFile(selectedFile)
    setPreview(preview)
  }

  const handleEditorData = (event, editor) => {
    const data = editor.getData()
    form.setValue('blogContent', data)
  }

  async function onSubmit(values) {
    try {
      const newValues = { ...values, author: user.user.id }
      const formData = new FormData()
      formData.append('data', JSON.stringify(newValues))

      

      const url = `${getEnv('VITE_API_BASE_URL')}/blog/update/${blogid}`
      const response = await fetch(url, {
        method: 'PUT',
        credentials: 'include',
        body: formData
      })

      const data = await response.json()

      if (!response.ok) {
        showToast('error', data.message)
        return
      }

      navigate(RouteBlog)
      showToast('success', 'Blog updated successfully')

    } catch (error) {
      showToast('error', error.message)
    }
  }

  if (blogLoading || !isDataLoaded) {
    return <Loading />
  }

  return (
    <div>
      <Card className='pt-5 max-w-screen-lg mx-auto'>
        <CardContent>
          <h1 className="text-2xl font-bold mb-4">Edit Blog</h1>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                        {categoryData?.categories?.map(category => (
                          <SelectItem
                            key={category.id}
                            value={category.id.toString()}
                          >
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
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

              <div>
                <label className='mb-2 block font-medium text-sm'>Featured image</label>
                <Dropzone onDrop={handleFileSelection}>
                  {({ getRootProps, getInputProps }) => (
                    <div {...getRootProps()} className="cursor-pointer">
                      <input {...getInputProps()} />
                      <div className='flex justify-center items-center w-40 h-40 border-2 border-dashed rounded overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors'>
                        {filePreview ? (
                          <img
                            src={filePreview}
                            alt="Featured"
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext x="50%25" y="50%25" text-anchor="middle" dy=".3em" fill="%23999"%3ENo Image%3C/text%3E%3C/svg%3E'
                            }}
                          />
                        ) : (
                          <p className="text-sm text-gray-500 text-center px-3">
                            Drop image here
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </Dropzone>
              </div>

              <FormField
                control={form.control}
                name="blogContent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Blog Content</FormLabel>
                    <FormControl>
                      <Editor
                        key={editorKey}
                        props={{
                          initialData: field.value || '',
                          onChange: handleEditorData
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit">Update Blog</Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditBlog