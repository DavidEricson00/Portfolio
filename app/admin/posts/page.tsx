import { getPosts } from "@/lib/data/posts";
import PostsAdmin from "@/components/admin/PostsAdmin";

export default async function AdminPostsPage() {
  const posts = await getPosts();

  return <PostsAdmin initialPosts={posts} />;
}
