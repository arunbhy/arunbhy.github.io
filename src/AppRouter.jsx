import React from "react";
import { Routes, Route } from "react-router-dom";
import App from "./App";
import BlogList from "./components/Blog/BlogList";
import BlogPost from "./components/Blog/BlogPost";

const AppRouter = () => {
    return (
        <Routes>
            <Route path="/" element={<App />} />
            <Route path="/blog" element={<BlogList />} />
            <Route path="/blog/:slug" element={<BlogPost />} />
        </Routes>
    );
};

export default AppRouter;
