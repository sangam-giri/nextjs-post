import { fetchPosts } from "../api/postsApi";
import { Post } from "../domain/types";

export async function getPosts(): Promise<Post[]> {
    // Example of business logic: only return first 10 posts
    const posts = await fetchPosts();
    return posts.slice(0, 10);
}
