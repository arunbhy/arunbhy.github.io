import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import "./BlogList.css";

const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const BlogList = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch("/blog/posts.json")
            .then((res) => res.json())
            .then((data) => setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
            .catch(() => setPosts([]));
    }, []);

    return (
        <>
            <Navigation />
            <div className="blog-list-page">
                <header className="blog-list-header">
                    <h1>Writing</h1>
                    <p>Research notes, tutorials, and lessons from building ML systems.</p>
                </header>

                <div className="blog-list-grid">
                    {posts.map((post) => (
                        <Link to={`/blog/${post.slug}`} key={post.slug} className="blog-list-card">
                            <article>
                                <div className="blog-list-card-top">
                                    <div className="blog-list-tags">
                                        {post.tags.map((tag, i) => (
                                            <span key={i} className="blog-list-tag">{tag}</span>
                                        ))}
                                    </div>
                                    <span className="blog-list-read-time">{post.readTime} min read</span>
                                </div>
                                <h2>{post.title}</h2>
                                <p className="blog-list-excerpt">{post.excerpt}</p>
                                <time className="blog-list-date">{formatDate(post.date)}</time>
                            </article>
                        </Link>
                    ))}
                </div>

                {posts.length === 0 && (
                    <p className="blog-list-empty">No posts yet. Check back soon.</p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default BlogList;
