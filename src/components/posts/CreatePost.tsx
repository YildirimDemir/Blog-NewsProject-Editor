'use client';

import { useState, useEffect } from 'react';
import { getCategories } from '@/services/apiCategories';
import { createPost } from '@/services/apiPosts';
import { uploadFile } from '@/services/apiUpload';
import Style from './posts.module.css'

export default function CreatePost() {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [text, setText] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories();

        if (Array.isArray(data.categories)) {
          setCategories(data.categories);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      let imageFile = '';
      if (image) {
        imageFile = await uploadFile(image);
      }

      await createPost({ title, text, image: imageFile, category });
      setTitle('');
      setText('');
      setCategory('');
      setImage(null);
      alert('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      setError('Failed to create post');
    }
  };

  if (isLoading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={Style.createPostPage}>
      <h1>Create New Post</h1>
      <div className={Style.createPost}>
      <form onSubmit={handleSubmit}>
        <div className={Style.inputGroup}>
          <label htmlFor="title">Title</label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='Enter title...'
          />
        </div>
        <div className={Style.inputGroup}>
          <label htmlFor="category">Category</label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select a category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div className={Style.inputGroup}>
          <label htmlFor="image" className={Style.imgLabel}>Click here for image</label>
          <input
            id="image"
            type="file"
            className={Style.imgInput}
            onChange={handleImageChange}
          />
        </div>
        <div className={Style.inputGroup}>
          <textarea
            id="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder='Write your content here...'
          ></textarea>
        </div>
        <button type="submit" className={Style.btn}>Create Post</button>
      </form>
      </div>
    </div>
  );
}
