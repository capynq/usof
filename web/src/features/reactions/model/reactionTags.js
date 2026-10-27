export const reactionTags = (
  _result,
  _error,
  { target, targetId, postId, skipRefresh },
) =>
  skipRefresh
    ? []
    : [
      { type: "ReactionList", id: `${target}-${targetId}` },
      { type: "Post", id: target === "post" ? targetId : postId },
      "PostList",
      "FavoriteList",
      "User",
      "CurrentUser",
      "AdminList",
      ...(target === "comment"
        ? [
          { type: "Comment", id: targetId },
          { type: "CommentList", id: postId },
        ]
        : []),
    ];
