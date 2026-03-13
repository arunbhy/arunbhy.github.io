import React, { useEffect, useState, useMemo } from "react";
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
    const [activeTag, setActiveTag] = useState(null);

    useEffect(() => {
        window.scrollTo(0, 0);
        fetch("/blog/posts.json")
            .then((res) => res.json())
            .then((data) => setPosts(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
            .catch(() => setPosts([]));
    }, []);

    const allTags = useMemo(() => {
        const tagSet = new Set();
        posts.forEach((post) => post.tags.forEach((tag) => tagSet.add(tag)));
        return [...tagSet].sort();
    }, [posts]);

    const filteredPosts = activeTag
        ? posts.filter((post) => post.tags.includes(activeTag))
        : posts;

    return (
        <>
            <Navigation />
            <div className="blog-list-page">
                <header className="blog-list-header">
                    <h1>Writing</h1>
                    <p>Research notes, tutorials, and lessons from building ML systems.</p>
                </header>

                {allTags.length > 0 && (
                    <div className="blog-filter">
                        <button
                            className={`blog-filter-tag ${activeTag === null ? "active" : ""}`}
                            onClick={() => setActiveTag(null)}
                        >
                            All
                        </button>
                        {allTags.map((tag) => (
                            <button
                                key={tag}
                                className={`blog-filter-tag ${activeTag === tag ? "active" : ""}`}
                                onClick={() => setActiveTag(activeTag === tag ? null : tag)}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                )}

                <div className="blog-list-grid">
                    {filteredPosts.map((post) => (
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

                {filteredPosts.length === 0 && (
                    <p className="blog-list-empty">
                        {activeTag ? `No posts tagged "${activeTag}".` : "No posts yet. Check back soon."}
                    </p>
                )}
            </div>
            <Footer />
        </>
    );
};

export default BlogList;
