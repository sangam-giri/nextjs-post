import { getPosts } from "@/features/posts/application/postsService";
import PostsList from "@/features/posts/presentation/PostsList";

export default async function PostsPage() {
  const posts = await getPosts();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <PostsList posts={posts} />
    </main>
  );
}
