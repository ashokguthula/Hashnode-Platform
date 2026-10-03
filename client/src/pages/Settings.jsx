import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "../hooks/useAuth";

function Settings() {
    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [bio, setBio] = useState("");
    const [avatarUrl, setAvatarUrl] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        if (user) {
            setName(user.name || "");
            setBio(user.bio || "");
            setAvatarUrl(user.avatarUrl || "");
        }
    }, [user]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            const response = await api.put("/users/me", {
                name,
                bio,
                avatarUrl,
            });

            setUser(response.data.user);
            setSuccess("Profile updated successfully.");
        } catch (error) {
            console.error("Failed to update profile:", error);

            setError(
                error.response?.data?.message ||
                "Failed to update profile."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main>
            <h1>Settings</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        value={name}
                        onChange={(event) =>
                            setName(event.target.value)
                        }
                        required
                    />
                </div>

                <div>
                    <label htmlFor="bio">Bio</label>
                    <textarea
                        id="bio"
                        value={bio}
                        onChange={(event) =>
                            setBio(event.target.value)
                        }
                        maxLength={200}
                    />
                </div>

                <div>
                    <label htmlFor="avatarUrl">
                        Avatar URL
                    </label>
                    <input
                        id="avatarUrl"
                        type="url"
                        value={avatarUrl}
                        onChange={(event) =>
                            setAvatarUrl(event.target.value)
                        }
                    />
                </div>

                {error && <p>{error}</p>}
                {success && <p>{success}</p>}

                <button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save Changes"}
                </button>
            </form>

            <button
                type="button"
                onClick={() => navigate(`/profile/${user.id}`)}
            >
                View Profile
            </button>
        </main>
    );
}

export default Settings;