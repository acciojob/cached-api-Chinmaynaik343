
import React, { useState, useEffect, useMemo } from "react";

function App() {
  const [userId, setUserId] = useState("1");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Memoize the API URL based on the input
  const apiUrl = useMemo(() => {
    return userId
      ? `https://jsonplaceholder.typicode.com/posts?userId=${userId}`
      : "https://jsonplaceholder.typicode.com/posts";
  }, [userId]);

  useEffect(() => {
    const controller = new AbortController();

    const fetchPosts = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(apiUrl, {
          signal: controller.signal,
        });

        if (!response.ok) {
          throw new Error("Failed to fetch posts");
        }

        const data = await response.json();
        setPosts(data);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError("Failed to load posts. Please try again.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    };

    fetchPosts();

    return () => {
      controller.abort();
    };
  }, [apiUrl]);

  return (
    <div>
      <h1>Cached API Posts</h1>

      <label htmlFor="userId">Enter User ID (1-10): </label>
      <input
        id="userId"
        type="number"
        min="1"
        max="10"
        value={userId}
        onChange={(e) => setUserId(e.target.value)}
      />

      {loading && <p>Loading...</p>}
      {error && <p>{error}</p>}

      {!loading &&
        !error &&
        posts.map((post) => (
          <div key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <hr />
          </div>
        ))}
    </div>
  );
}

export default App;
