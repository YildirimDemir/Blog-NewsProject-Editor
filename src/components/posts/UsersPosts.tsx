'use client';

import React, { useEffect, useState } from 'react';
import Style from './posts.module.css';
import Image from 'next/image';
import { FaRegThumbsUp, FaRegComment } from 'react-icons/fa';
import { deletePost, getPosts } from '@/services/apiPosts';
import { getDownloadURL, ref } from 'firebase/storage'; 
import { storage } from '@/firebase'; 
import { getSession } from 'next-auth/react';
import { requestUser } from '@/services/apiUsers';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UsersPosts() {
    const [posts, setPosts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        async function fetchData() {
            try {
                const session = await getSession(); 

                if (session && session.user && session.user.email) {
                    const user = await requestUser(session.user.email);

                    if (user && user._id) {
                        const data = await getPosts(user._id); 

                        if (Array.isArray(data)) {
                            const postsWithImages = await Promise.all(data.map(async (post) => {
                                if (post.image) {
                                    const imageRef = ref(storage, post.image);
                                    post.imageUrl = await getDownloadURL(imageRef); 
                                }
                                return post;
                            }));
                            setPosts(postsWithImages);
                        } else {
                            console.error('Unexpected data format:', data);
                        }
                    } else {
                        console.error('User not found');
                    }
                } else {
                    console.error('User not authenticated');
                }
            } catch (error) {
                console.error('Error fetching posts:', error);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await deletePost(id);
            setPosts(posts.filter(post => post._id !== id));
        } catch (error) {
            console.error('Error deleting post:', error);
        }
    };

    const handleRedirect = (postId: string) => {
        router.push(`/posts/${postId}`);
    };

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <div className={Style.allPostsPage}>
            <h1>All Posts</h1>
            <div className={Style.allPosts}>
                {posts.length === 0 ? (
                    <p>No posts created</p>
                ) : (
                    posts.map((post) => (
                        <div key={post._id} className={Style.postBox} onClick={() => handleRedirect(post._id)} style={{ cursor: 'pointer' }}>
                            <div className={Style.postBoxImg}>
                                {post.imageUrl && <Image src={post.imageUrl} alt={post.title} width={200} height={200} />}
                            </div>
                            <div className={Style.postBoxInfo}>
                                <h3><span>Title:</span> {post.title}</h3>
                                <p><span>Category:</span> {post.category ? post.category.name : 'No category'}</p>
                                <p><span>Author:</span> {post.author ? post.author.username : 'No author'}</p>
                                <p><span>Text:</span> {post.text.slice(0, 50)}...</p>
                            </div>
                            <div className={Style.postBoxData}>
                                <span><FaRegThumbsUp /> {post.likes.length}</span>
                                <span><FaRegComment /> {post.comments.length}</span>
                            </div>
                            <button onClick={() => handleDelete(post._id)}>Delete</button>
                        </div>
                    ))
                )}
            </div>
            <Link className={Style.createUserLink} href='/posts/create-post'>Create</Link>
        </div>
    );
}
