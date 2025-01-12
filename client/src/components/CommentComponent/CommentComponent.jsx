// mobility-report/client/src/components/CommentComponent.jsx
import useDevice from "../../hooks/useDevice.js";

export function CommentComponent({ commentId }) {
  const { deviceId, loading, api } = useDevice();

  const handleLike = async () => {
    if (!deviceId) return;
    try {
      const data = await api.post("/api/protected/like-comment", { commentId });
      // Handle success
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  if (loading) return <div>Loading...</div>;
  return <button onClick={handleLike}>Like Comment</button>;
}
