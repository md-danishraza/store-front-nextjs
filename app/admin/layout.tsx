import React from 'react'
import SideBar from './SideBar'
import { Separator } from '@/components/ui/separator'
function DashboardLayout({children}:{children:React.ReactNode}) {

  return (
    <>
        <h2 className='text-2xl pl-4'>Dashboard</h2>
        <Separator/>
        <section className='grid lg:grid-cols-12 gap-12 mt-12'>
            {/* sidebar */}
            <div className='lg:col-span-2'>
                <SideBar/>
            </div>
            {/* children pages  */}
            <div className='lg:col-span-10 px-4'>
                {children}
            </div>
        </section>
    </>
  )
}

export default DashboardLayout
