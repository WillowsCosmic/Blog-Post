import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link } from "react-router"
import logo from '@/assets/images/logo-white.png'
import { FaHome } from "react-icons/fa";
import { BiSolidCategory } from "react-icons/bi";
import { FaBloggerB } from "react-icons/fa6";
import { FaComments } from "react-icons/fa6";
import { HiUsers } from "react-icons/hi2";
import { FaHeart } from "react-icons/fa";
import { RouteBlog, RouteCategoryDetails } from "@/helpers/RouteName";
import { useState } from "react";
import { useFetch } from "@/hooks/useFetch";
import { getEnv } from "@/helpers/getEnv";

export function AppSidebar() {
  const { data: categoryData } = useFetch(`${getEnv('VITE_API_BASE_URL')}/category/all-category`, {
    method: 'get',
    credentials: 'include'
  })
  return (
    <Sidebar>
      <SidebarHeader className={'bg-white'}>
        <img src={logo} width={120} />
      </SidebarHeader>
      <SidebarContent className={'bg-white sidenav'}>
        <SidebarGroup >
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaHome />
                <Link to="">Home</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <BiSolidCategory />
                <Link to={RouteCategoryDetails}>Categories</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaBloggerB />
                <Link to={RouteBlog}>Blogs</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaComments />
                <Link to="">Comments</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <HiUsers />
                <Link to="">Users</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup >
        <SidebarGroup >
          <SidebarGroupLabel className={'sidenavlabel'}>
            Categories
          </SidebarGroupLabel>
          <SidebarMenu>
            {categoryData && categoryData.categories.length > 0 &&

              categoryData.categories.map(category =>

                <SidebarMenuItem>
                  <SidebarMenuButton>
                    <FaHeart />
                    <Link to="">{category.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            }
          </SidebarMenu>
        </SidebarGroup >
      </SidebarContent>
    </Sidebar>
  )
}