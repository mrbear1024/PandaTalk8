import PostForm from "@/components/admin/PostForm";
import { createPostAction } from "@/app/admin/_actions/posts";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <>
      <div className="admin-toolbar">
        <h1>New post</h1>
      </div>
      <PostForm action={createPostAction} submitLabel="Create post →" />
    </>
  );
}
