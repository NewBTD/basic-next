
import React from 'react'

const page = async () => {
    const data = await fetch('https://dummyjson.com/posts')
    const res = await data.json()
    console.log(res)
  return (
    <div>
        <h1 className='text-3xl font-bold'>Blogs</h1>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {res.posts.map((post: any) => (
            <div key={post.id} className='border p-4 rounded-lg'>
                <h2 className='text-xl font-semibold'>{post.title}</h2>
                <p>{post.body}</p>
            </div>
            ))}
        </div>
    </div>
  )
}

export default page