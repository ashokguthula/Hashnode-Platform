import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";

function Navbar() {
    const { user, status, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    return (
        <nav>
            <Link to="/">
                <strong>Hashnode</strong>
            </Link>

            <div>
                <Link to="/">Feed</Link>
                <Link to="/tags">Tags</Link>
                {" "}

                {status === "authenticated" ? (
                    <>
                        <Link to="/dashboard">
                            Dashboard
                        </Link>
                        {" "}

                        <Link to="/editor/new">
                            Write
                        </Link>
                        {" "}

                        <Link to="/settings">
                            Settings
                        </Link>
                        {" "}

                        {user && (
                            <Link to={`/profile/${user.id}`}>
                                {user.avatarUrl ? (
                                    <img
                                        src={user.avatarUrl}
                                        alt={user.name}
                                        width="32"
                                        height="32"
                                    />
                                ) : (
                                    user.name
                                )}
                            </Link>
                        )}
                        {" "}

                        <button
                            type="button"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>
                        {" "}

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
}

export default Navbar;