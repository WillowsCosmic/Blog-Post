import { AppSidebar } from '@/components/AppSidebar'
import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
import { SidebarProvider } from '@/components/ui/sidebar'
import React from 'react'
import { Outlet } from 'react-router'

const Layout = () => {
    return (
        //navbar
        <SidebarProvider>
            <Navbar />
            <AppSidebar />
            <main className='w-full'>
                <div className='w-full min-h-[calc(105vh-10vh)] py-25 px-10'>
                    <Outlet />
                </div>
                <Footer />
            </main>
        </SidebarProvider>
    )
}

export default Layout