export const usePostDetailsRefresh = (postRoute, discussion) => {
  const pendingCount = postRoute.pendingCount + discussion.pendingCount;
  const isFetching = postRoute.isFetching || discussion.isFetching;
  const error = postRoute.error || discussion.error;
  const onRefresh = () => {
    postRoute.applyPending();
    discussion.applyPending();
  };

  return { pendingCount, isFetching, error, onRefresh };
};
