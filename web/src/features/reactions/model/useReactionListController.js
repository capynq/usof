import { POLLING_INTERVALS, livePollingOptions } from "../../../shared/config.js";
import { useStagedCollection } from "../../../shared/lib/useStagedCollection.js";
import { useGetReactionsQuery } from "../api/reactionsApi.js";

export const useReactionListController = ({ open, target, targetId }) => {
  const query = useGetReactionsQuery(
    { target, targetId },
    {
      skip: !open,
      ...livePollingOptions(POLLING_INTERVALS.reactions),
    },
  );
  const staged = useStagedCollection(query.currentData, `${target}:${targetId}`);
  const onRefresh = staged.hasPending ? staged.applyPending : query.refetch;

  return {
    data: staged.data,
    hasPending: staged.hasPending,
    pendingCount: staged.pendingCount,
    applyPending: staged.applyPending,
    isFetching: query.isFetching,
    error: query.error,
    onRefresh,
  };
};
