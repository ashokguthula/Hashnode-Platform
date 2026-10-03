import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import PostEditor from "./pages/PostEditor";
import Feed from "./pages/Feed";
import PostDetail from "./pages/PostDetail";
import TagPage from "./pages/TagPage";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Navbar from "./components/layout/Navbar";
import Tags from "./pages/Tags";


function App() {
    return (
        <BrowserRouter>
            <Navbar />
            <Routes>
                {/* Public routes */}
                <Route path="/" element={<Feed />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/feed" element={<Feed />} />
                <Route path="/post/:slug" element={<PostDetail />} />
                <Route path="/tag/:slug" element={<TagPage />} />
                <Route path="/tags" element={<Tags />} />
                <Route path="/profile/:id" element={<Profile />} />

                {/* Protected routes */}
                <Route element={<ProtectedRoute />}>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/editor/new" element={<PostEditor />} />
                    <Route path="/editor/:id" element={<PostEditor />} />
                    <Route path="/settings" element={<Settings />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;