import Comment from '@/components/Comment'
import Loading from '@/components/Loading'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { getEnv } from '@/helpers/getEnv'
import { useFetch } from '@/hooks/useFetch'
import { decode } from 'entities'
import React from 'react'
import { useParams } from 'react-router'

const SingleBlogDetails = () => {
    const { blog } = useParams()
    const { data, loading, error } = useFetch(
        `${getEnv('VITE_API_BASE_URL')}/blog/get-blog/${blog}`,
        {
            method: 'get',
            credentials: 'include',
        },
    )
    
    if (loading) return <Loading />
    
    console.log(data)
    
    const getAvatarUrl = () => {
        if (data?.data?.authorData.avatar) {
            if (data?.data?.authorData?.avatar.startsWith('http')) {
                return data?.data?.authorData?.avatar
            }
            return `http://localhost:3000${data?.data?.authorData.avatar}`
        }
        return null
    }
    
    const getImageUrl = () => {
        if (data?.data?.featureImage) {
            if (data?.data?.featureImage.startsWith('http')) {
                return data?.data?.featureImage
            }
            return `http://localhost:3000${data?.data?.featureImage}`
        }
        return null
    }

    return ( 
        <div className='flex justify-between gap-20'>
            {data && <>
                <div className='border rounded w-[70%] p-5'>
                    <h1 className='text-2xl font-bold mb-5'>{data?.data?.title}</h1>
                    <div className="flex justify-between items-center">
                        <div className='flex justify-between items-center gap-5'>
                            <Avatar>
                                <AvatarImage src={getAvatarUrl()} />
                            </Avatar>
                            <span>{data?.data?.authorData?.name}</span>
                        </div>
                    </div>
                    <div className='my-5'>
                        <img src={getImageUrl()} className='rounded' alt={data?.data?.title} />
                    </div>
                    <div dangerouslySetInnerHTML={{ __html: decode(data?.data?.blogContent) || '' }} />
                    
                    <div className='border-t mt-5 pt-5'>
                        <Comment blogid={data?.data?.id} />
                    </div>
                </div>
            </>}
            
            <div className='border rounded w-[30%] p-5'>
                <h3 className='text-xl font-bold mb-4'>Related Posts</h3>
            </div>
        </div>
    )
}

export default SingleBlogDetails