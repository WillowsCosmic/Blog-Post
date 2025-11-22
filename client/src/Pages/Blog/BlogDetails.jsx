import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import React, { useState } from 'react'
import { Link } from 'react-router'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { RouteBlogAdd, RouteBlogEdit } from '@/helpers/RouteName'
import { useFetch } from '@/hooks/useFetch'
import { getEnv } from '@/helpers/getEnv'
import Loading from '@/components/Loading'
import { showToast } from '@/helpers/showToast'
import { deleteData } from '@/helpers/handleDelete'
import { TiEdit } from 'react-icons/ti'
import { GoTrash } from 'react-icons/go'

const BlogDetails = () => {
  const [refreshData, setRefreshData] = useState(false)
  const { data: blogData, loading, error } = useFetch(`${getEnv('VITE_API_BASE_URL')}/blog/get-all`, {
    method: 'get',
    credentials: 'include'
  },[refreshData])
  const handleDelete = (id) => {
    const response = deleteData(`${getEnv('VITE_API_BASE_URL')}/blog/delete/${id}`)
    if (response) {
      setRefreshData(!refreshData)
      showToast('success', 'Data deleted')

    } else {
      showToast('error', 'Data not deleted')
    }
  }
  // console.log(blogData)
  if (loading) return <Loading />
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }
  return (
    <div>
    <Card>
      <CardHeader>
        <div>
          <Button asChild>
            <Link to={RouteBlogAdd}>
              Add Blog
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of your recent blog.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Action</TableHead>

            </TableRow>
          </TableHeader>
          <TableBody>
             {blogData && blogData.data.length > 0 ?

              blogData.data.map(blog =>
                <TableRow key={blog.id}>
                  <TableCell>{blog?.authorData?.name} </TableCell>
                  <TableCell>{blog.categoryData?.name} </TableCell>
                  <TableCell>{blog.title} </TableCell>
                  <TableCell>{blog.slug} </TableCell>
                  <TableCell>{formatDate(blog?.createdAt)} </TableCell>
                  <TableCell className="flex gap-3">
                    <Button 
                    variant="outline" 
                    className="hover:bg-pink-600 hover:text-white" asChild>
                      <Link to={RouteBlogEdit(blog.id)}>
                        <TiEdit />
                      </Link>
                    </Button>
                    <Button 
                    onClick={()=>handleDelete(blog.id)}
                    variant="outline" 
                    className="hover:bg-pink-600 hover:text-white">
                      <GoTrash />
                    </Button>
                  </TableCell>
                </TableRow>
              )
              :
              <TableRow>
                <TableCell colSpan="3">
                  Data not found
                </TableCell>
              </TableRow>
            } 
          
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  </div>
  )
}

export default BlogDetails