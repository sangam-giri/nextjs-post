import { Post } from "@/features/posts/domain/types";
import { apiClient } from "@/core/lib/apiClient";

export async function fetchPosts(): Promise<Post[]> {
    return apiClient.get<Post[]>("/posts");
}