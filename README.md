# 🏗️ Next.js Project Base Architecture

This document defines the **base structure, guidelines, and conventions** for all Next.js projects in our team.
It is inspired by **Clean Architecture + Feature-First** and optimized for **scalability, reusability, and clarity**.

---

## 📂 Folder Structure

```
src/
 ├─ app/                          # Next.js App Router entrypoints
 │   ├─ layout.tsx
 │   ├─ page.tsx
 │   └─ <feature>/
 │       └─ page.tsx              # Route entrypoint → delegates to feature
 │
 ├─ core/                         # Shared cross-cutting concerns
 │   ├─ config/                   # Global configuration (env, constants)
 │   │   └─ apiConfig.ts
 │   ├─ lib/                      # Generic libraries & utilities
 │   │   ├─ apiClient.ts
 │   │   └─ utils/
 │   │       └─ formatDate.ts
 │   ├─ ui/                       # Shared UI components
 │   │   └─ Button.tsx
 │   └─ store/                    # Global state (Zustand/Redux)
 │       └─ authStore.ts
 │
 ├─ features/                     # Feature-first organization
 │   └─ posts/                    # Example feature
 │       ├─ domain/               # Entities & types
 │       │   └─ types.ts
 │       ├─ api/                  # API integration (fetch, CRUD)
 │       │   └─ postsApi.ts
 │       ├─ application/          # Business logic / use cases
 │       │   └─ postsService.ts
 │       └─ presentation/         # UI components for this feature
 │           └─ PostsList.tsx
 │
 ├─ styles/                       # Global styles (Tailwind / CSS)
 │   └─ globals.css
 │
 └─ types/                        # App-wide shared types (optional)
```

---

## 🔑 Philosophy

* **`core/` = Shared**

  * Contains configuration, utilities, shared UI, and global state.
  * Anything inside `core/` should **not depend on a feature**.

* **`features/` = Isolated modules**

  * Each feature (e.g., posts, users, auth) lives in its own folder.
  * Inside each feature:

    * `domain/` → Types & entities (pure, no external deps)
    * `api/` → API calls for that feature
    * `application/` → Business logic / transformations
    * `presentation/` → UI components (React + Tailwind)

* **`app/` = Routes only**

  * The App Router layer should stay **thin**.
  * It just wires URL routes → feature presentation.

---

## ⚙️ Core Modules

### 1. API Client (`core/lib/apiClient.ts`)

Reusable wrapper around `fetch`.

```ts
import { API_BASE_URL } from "@/core/config/apiConfig";

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    cache: "no-store",
  });

  if (!res.ok) throw new Error(`API Error: ${res.status}`);

  return res.json();
}

export const apiClient = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, body: any) =>
    request<T>(url, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(url: string, body: any) =>
    request<T>(url, { method: "PUT", body: JSON.stringify(body) }),
  patch: <T>(url: string, body: any) =>
    request<T>(url, { method: "PATCH", body: JSON.stringify(body) }),
  delete: <T>(url: string) => request<T>(url, { method: "DELETE" }),
};
```

---

### 2. API Config (`core/config/apiConfig.ts`)

```ts
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://jsonplaceholder.typicode.com";
```

➡️ All API base URLs must come from **env variables**.

In `.env.local`:

```
NEXT_PUBLIC_API_BASE_URL=https://jsonplaceholder.typicode.com
```

---

### 3. UI Components (`core/ui/Button.tsx`)

```tsx
export function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      {children}
    </button>
  );
}
```

---

## 📌 Feature Example: Posts

### 1. Domain (`features/posts/domain/types.ts`)

```ts
export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}
```

### 2. API (`features/posts/api/postsApi.ts`)

```ts
import { apiClient } from "@/core/lib/apiClient";
import { Post } from "../domain/types";

export async function fetchPosts(): Promise<Post[]> {
  return apiClient.get<Post[]>("/posts");
}
```

### 3. Application (`features/posts/application/postsService.ts`)

```ts
import { fetchPosts } from "../api/postsApi";
import { Post } from "../domain/types";

export async function getLatestPosts(limit = 5): Promise<Post[]> {
  const posts = await fetchPosts();
  return posts.slice(0, limit);
}
```

### 4. Presentation (`features/posts/presentation/PostsList.tsx`)

```tsx
import { Post } from "../domain/types";

export function PostsList({ posts }: { posts: Post[] }) {
  return (
    <ul className="space-y-4">
      {posts.map((p) => (
        <li key={p.id} className="border p-4 rounded-lg shadow">
          <h2 className="font-semibold">{p.title}</h2>
          <p>{p.body}</p>
        </li>
      ))}
    </ul>
  );
}
```

### 5. Route (`app/posts/page.tsx`)

```tsx
import { getLatestPosts } from "@/features/posts/application/postsService";
import { PostsList } from "@/features/posts/presentation/PostsList";

export default async function PostsPage() {
  const posts = await getLatestPosts();

  return (
    <main className="p-8">
      <h1 className="text-2xl font-bold mb-4">Posts</h1>
      <PostsList posts={posts} />
    </main>
  );
}
```

---

## 🚀 Developer Guidelines

* **Always create new features inside `features/`**
* **Never let features depend on each other directly**

  * If they must share code → move it into `core/`
* **Business rules belong in `application/`**

  * API calls go in `api/`
  * UI stays in `presentation/`
* **Keep `app/` as thin as possible**

  * Should only render feature components and pass props

---

## ✅ Benefits

* Scales for small → enterprise apps
* Easy to onboard new developers
* Clear separation of concerns
* Reusable core modules across features
* Feature modules can be refactored, tested, or removed independently