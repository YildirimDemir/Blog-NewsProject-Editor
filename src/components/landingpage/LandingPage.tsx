'use client';

import React from 'react'
import Style from './landingpage.module.css'
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className={Style.landingPage}>
        <div className={Style.pageContent}>
            <h1>Welcome to Editor Panel</h1>
            <Link href='/posts/create-post'>Create New Post</Link>
        </div>
    </div>
  )
}
