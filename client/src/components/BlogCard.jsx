import React from 'react'
import { Card, CardContent } from './ui/card'
import { useSelector } from 'react-redux'
import { Badge } from './ui/badge'
import { Avatar, AvatarImage } from './ui/avatar'
import { IoCalendarNumberOutline } from "react-icons/io5";
import usericon from '@/assets/images/user.png'
import moment from 'moment'
import { Link } from 'react-router'
import { RouteBlogDetails } from '@/helpers/RouteName'

const BlogCard = ({ props }) => {
    const user = useSelector((state) => state.user)
    const getAvatarUrl = () => {
        if (props.authorData.avatar) {
            if (props.authorData.avatar.startsWith('http')) {
                return props.authorData.avatar
            }
            return `http://localhost:3000${props.authorData.avatar}`
        }
        return null
    }
    const getImageUrl = () => {
        if (props.featureImage) {
            if (props.featureImage.startsWith('http')) {
                return props.featureImage
            }
            return `http://localhost:3000${props.featureImage}`
        }
        return null
    }
    return (
        <Link to ={RouteBlogDetails(props.categoryData.slug,props.slug)}>
            <Card className="pt-5">
                <CardContent>
                    <div className="flex items-center justify-between">
                        <div className='flex items-center justify-between gap-2'>
                            <Avatar>
                                <AvatarImage src={getAvatarUrl() || usericon} />
                            </Avatar>
                            <span>{props.authorData.name}</span>
                        </div>
                        {props.authorData.role === 'admin' &&
                            <Badge variant="outline" className="bg-pink-500">Admin</Badge>
                        }
                    </div>
                    <div className='my-2 '>
                        <img src={getImageUrl()} className='rounded' />
                    </div>
                    <div>
                        <p className='flex items-center gap-3 mb-2'>
                            <IoCalendarNumberOutline />
                            <span>{moment(props.createdAt).format('DD-MM-YYYY')}</span>
                        </p>
                        <h2 className='text-2xl font-bold line-clanp-2'>{props.title}</h2>
                    </div>
                </CardContent>
            </Card >
        </Link>
    )
}

export default BlogCard