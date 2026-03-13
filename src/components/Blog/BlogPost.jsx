import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import "highlight.js/styles/github-dark.min.css";
import Navigation from "../Navigation/Navigation";
import Footer from "../Footer/Footer";
import "./BlogPost.css";

const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
};

const BlogPost = () => {
    const { slug } = useParams();
    const [meta, setMeta] = useState(null);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        setLoading(true);

        Promise.all([
            fetch("/blog/posts.json").then((r) => r.json()),
            fetch(`/blog/${slug}.md`).then((r) => {
                if (!r.ok) throw new Error("Not found");
                return r.text();
            }),
        ])
            .then(([posts, md]) => {
                const post = posts.find((p) => p.slug === slug);
                setMeta(post || null);
                setContent(md);
                setLoading(false);
            })
            .catch(() => {
                setLoading(false);
            });
    }, [slug]);

    if (loading) {
        return (
            <>
                <Navigation />
                <div className="blog-post-page">
                    <div className="blog-post-loading">Loading...</div>
                </div>
            </>
        );
    }

    if (!meta) {
        return (
            <>
                <Navigation />
                <div className="blog-post-page">
                    <div className="blog-post-not-found">
                        <h1>Post not found</h1>
                        <Link to="/blog" className="blog-back-link">
                            <i className="fa-solid fa-arrow-left"></i> Back to all posts
                        </Link>
                    </div>
                </div>
            </>
        );
    }

    return (
        <>
            <Navigation />
            <div className="blog-post-page">
                <article className="blog-post-article">
                    <Link to="/blog" className="blog-back-link">
                        <i className="fa-solid fa-arrow-left"></i> All posts
                    </Link>

                    <header className="blog-post-header">
                        <div className="blog-post-tags">
                            {meta.tags.map((tag, i) => (
                                <span key={i} className="blog-post-tag">{tag}</span>
                            ))}
                        </div>
                        <h1>{meta.title}</h1>
                        <div className="blog-post-meta">
                            <time>{formatDate(meta.date)}</time>
                            <span className="blog-post-separator">·</span>
                            <span>{meta.readTime} min read</span>
                        </div>
                    </header>

                    <div className="blog-post-content">
                        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
                            {content}
                        </ReactMarkdown>
                    </div>
                </article>
            </div>
            <Footer />
        </>
    );
};

export default BlogPost;
