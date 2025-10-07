import React from 'react'
// import logo from '@/assets/images/logo-white.png'
import logo from '@/assets/images/logo-white.png'
import { Button } from './ui/button'
import { Link, useNavigate } from 'react-router'
import { MdLogin } from "react-icons/md";
import SearchBox from './SearchBox';
import { RouteIndex, RouteSignIn } from '@/helpers/RouteName';
import { useDispatch, useSelector } from 'react-redux';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import usericon from '@/assets/images/user.png'
import { RiUser2Fill } from "react-icons/ri";
import { BsPencilSquare } from "react-icons/bs";
import { MdLogout } from "react-icons/md";
import { getEnv } from '@/helpers/getEnv';
import { showToast } from '@/helpers/showToast';
import { removeUser } from '@/redux/user/user.slice';

const Navbar = () => {
  const user = useSelector((state) => state.user)
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const handlelogout = async() =>{
    try {
      const response = await fetch(`${getEnv('VITE_API_BASE_URL')}/auth/logout`,{
          method:'POST',
          credentials:'include',
          
      })
      const data = await response.json()
      if(!response.ok){
          showToast('error',data.message)
      }
      dispatch(removeUser())
      navigate(RouteIndex)
      showToast('success',data.message)
  } catch (error) {
      showToast('error',error.message)
  }
  } 
  return (
    <div className='flex justify-between items-center h-16 fixed w-full z-20 bg-white px-5 border-b'>
      <div>
        <img src={logo} width={120} />
      </div>
      <div className='w-[500px] '>
        <SearchBox />
      </div>
      <div>
        {!user.isLoggedIn ?
          <Button asChild>
            <Link to={RouteSignIn}>
              <MdLogin />
              Sign In
            </Link>
          </Button>
          :
          <DropdownMenu>
            <DropdownMenuTrigger><Avatar>
              <AvatarImage src={user.user.avatar || usericon} />
            </Avatar></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>
                <p>{user.user.name}</p>
                <p className='text-sm text-gray-400'>{user.user.email}</p>
                </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="">
                  <RiUser2Fill />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="">
                  <BsPencilSquare />
                  Create Blog
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handlelogout}>
                
                  <MdLogout color='red'/>
                  Logout
               
              </DropdownMenuItem>
              
            </DropdownMenuContent>
          </DropdownMenu>
        }
      </div>
    </div>
  )
}

export default Navbar