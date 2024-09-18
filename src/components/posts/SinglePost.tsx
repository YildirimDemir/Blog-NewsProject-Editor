'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Style from './posts.module.css';
import { getPostById, updatePost } from '@/services/apiPosts';
import { getCategories } from '@/services/apiCategories';
import { uploadFile } from '@/services/apiUpload';
import { FaRegComment, FaRegThumbsUp } from 'react-icons/fa';

interface Category {
  _id: string;
  name: string;
}

interface Comment {
  _id: string;
  text: string;
  user: { username: string }; 
}

interface Post {
  title: string;
  text: string;
  category: { _id: string; name: string };
  image: string;
  comments: Comment[];
  likes: string[]; 
}

export default function SinglePost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [existingImage, setExistingImage] = useState<string | null>(null); 
  const [previewImage, setPreviewImage] = useState<string | null>(null); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [post, setPost] = useState<Post | null>(null);

  const router = useRouter();
  const { postId } = useParams();

  const id = Array.isArray(postId) ? postId[0] : postId;

  useEffect(() => {
    if (id) {
      fetchPostData(id as string);
    }
    fetchCategories();
  }, [id]);

  useEffect(() => {
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(image);
    } else {
      setPreviewImage(null);
    }
  }, [image]);

  const fetchPostData = async (id: string) => {
    try {
      const postData = await getPostById(id);
      setPost(postData);
      if (postData) {
        setTitle(postData.title);
        setCategory(postData.category._id);
        setText(postData.text);
        setExistingImage(postData.image || null);
      }
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch post data:', error);
      setError('Failed to load post');
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getCategories();
      setCategories(Array.isArray(data.categories) ? data.categories : []);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      setCategories([]);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      let imageFile = existingImage || ''; 
      if (image) {
        imageFile = await uploadFile(image); 
      }

      const updatedData = {
        title,
        text,
        category,
        image: imageFile,
      };

      await updatePost(id!, updatedData);
      router.push('/posts'); 
    } catch (error) {
      console.error('Failed to update post:', error);
      setError('Failed to update post');
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={Style.createPostPage}>
      <h1>Single Post</h1>
      <a href="">
        <div className={Style.createPost}>
        <form onSubmit={handleSubmit}>
          <div className={`${Style.inputGroup} ${Style.imageInputGroup}`}>
            <label htmlFor="image" className={Style.imgLabel}>Click here for image</label>
            <input
              id="image"
              type="file"
              className={Style.imgInput}
              onChange={handleImageChange}
            />
            {previewImage ? (
              <div className={Style.existingImage}>
                <img src={previewImage} alt="Preview" />
              </div>
            ) : existingImage ? (
              <div className={Style.existingImage}>
                <img src={existingImage} alt="Current Post" />
              </div>
            ) : null}
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder='Enter title...'
              className={Style.input}
            />
          </div>
          <div className={Style.inputGroup}>
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={Style.select}
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className={Style.inputGroup}>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder='Write your content here...'
              className={Style.textarea}
            ></textarea>
          </div>
          <button type="submit" className={Style.btn}>Update</button>
        </form>
      </div>
      </a>
      <div className={Style.likeAndComments}>
        <div className={Style.numberOfData}>
          <span><FaRegThumbsUp /> {post?.likes.length || 0}</span>
          <span><FaRegComment /> {post?.comments.length || 0}</span>
        </div>
        <div className={Style.postsComments}>
          {post?.comments.length ? (
            post.comments.map((comment) => (
              <div key={comment._id} className={Style.commentBox}>
                <span>User: {comment.user?.username}</span>
                <p>{comment.text}</p>
              </div>
            ))
          ) : (
            <p>No comment yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
