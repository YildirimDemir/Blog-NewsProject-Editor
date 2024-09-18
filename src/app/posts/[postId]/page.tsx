import SinglePost from '@/components/posts/SinglePost'
import Footer from '@/components/ui/Footer/Footer'
import Navbar from '@/components/ui/navbar/Navbar'
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import React from 'react'

export default async function page() {
  const session = await getServerSession();

  if(!session){
    redirect('/login')
  }
  return (
    <>
    <Navbar />
    <SinglePost />
    <Footer />
    </>
  )
}
