import { PostFeed } from "../../../widgets/post-feed/ui/PostFeed.jsx";

export const ManagePosts = () => (
  <section className="management-posts">
    <h1>Question management</h1>
    <p>
      Open a question to change its categories or visibility, review reactions, or delete it. Titles
      and question text remain the author's work.
    </p>
    <PostFeed heading="All visible questions" />
  </section>
);
