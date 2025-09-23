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

export function AppSidebar() {
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
                <Link to="">Categories</Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaBloggerB />
                <Link to="">Blogs</Link>
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
                <HiUsers/>
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
            <SidebarMenuItem>
              <SidebarMenuButton>
                <FaHeart />
                <Link to="">Category Item</Link>
              </SidebarMenuButton>
            </SidebarMenuItem> 
          </SidebarMenu>
        </SidebarGroup >
      </SidebarContent>
    </Sidebar>
  )
}