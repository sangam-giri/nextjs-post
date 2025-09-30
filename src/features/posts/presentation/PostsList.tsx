import { Post } from "../domain/types";

interface Props {
  posts: Post[];
}

export default function PostsList({ posts }: Props) {
  return (
    <ul className="space-y-4">
      {posts.map((post) => (
        <li key={post.id} className="border p-4 rounded-lg shadow">
          <h2 className="font-semibold text-lg">{post.title}</h2>
          <p>{post.body}</p>
        </li>
      ))}
    </ul>
  );
}
