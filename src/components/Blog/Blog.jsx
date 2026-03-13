import React, { useState } from "react";
import "./Blog.css";
import posts from "../../assets/files/BlogDetails.js";
import useInView from "../../hooks/useInView";

const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
};

const BlogCard = ({ post, index, expanded, onToggle }) => {
    const [ref, isInView] = useInView();

    return (
        <article
            ref={ref}
            className={`blog-card ${isInView ? "animate-in" : ""}`}
            style={{ transitionDelay: `${index * 100}ms` }}
        >
            <div className="blog-card-meta">
                <time className="blog-date">{formatDate(post.date)}</time>
                <div className="blog-tags">
                    {post.tags.map((tag, i) => (
                        <span key={i} className="blog-tag">{tag}</span>
                    ))}
                </div>
            </div>
            <h3 className="blog-title">{post.title}</h3>
            <p className="blog-summary">{post.summary}</p>

            {expanded && post.content && (
                <div className="blog-content">
                    {post.content.split("\n\n").map((para, i) => (
                        <p key={i}>{para}</p>
                    ))}
                </div>
            )}

            <div className="blog-action">
                {post.link ? (
                    <a href={post.link} target="_blank" rel="noopener noreferrer" className="blog-read-more">
                        Read on external site <i className="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                ) : post.content ? (
                    <button
                        type="button"
                        className="blog-read-more"
                        onClick={onToggle}
                        aria-expanded={expanded}
                    >
                        {expanded ? "Show less" : "Read more"} <i className={`fa-solid fa-chevron-${expanded ? "up" : "down"}`}></i>
                    </button>
                ) : null}
            </div>
        </article>
    );
};

const Blog = () => {
    const [titleRef, titleInView] = useInView();
    const [expandedIndex, setExpandedIndex] = useState(null);

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

    const sortedPosts = [...posts].sort((a, b) => new Date(b.date) - new Date(a.date));

    return (
        <section id="blog" className="blog-section">
            <h1 ref={titleRef} className={titleInView ? "animate-in" : ""}>WRITING</h1>
            <div className="blog-grid">
                {sortedPosts.map((post, index) => (
                    <BlogCard
                        key={index}
                        post={post}
                        index={index}
                        expanded={expandedIndex === index}
                        onToggle={() => toggleExpand(index)}
                    />
                ))}
            </div>
        </section>
    );
};

export default Blog;
