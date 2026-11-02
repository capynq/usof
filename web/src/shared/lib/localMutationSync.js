const RTK_ACTION_TYPES = {
  executeMutationFulfilled: "api/executeMutation/fulfilled",
  executeMutationRejected: "api/executeMutation/rejected",
  executeQueryFulfilled: "api/executeQuery/fulfilled",
  executeQueryRejected: "api/executeQuery/rejected",
  resetApiState: "api/resetApiState",
};
const QUERY_STATUS_PENDING = "pending";

const accepted = new WeakSet();

export const isLocalMutationData = (data) =>
  Boolean(data && typeof data === "object" && accepted.has(data));

export const localMutationSync = (store) => {
  const requests = new Map();
  let deferredMutation = false;

  return (next) => (action) => {
    const mutation = action.type === RTK_ACTION_TYPES.executeMutationFulfilled;
    const queryAccepted =
      action.type === RTK_ACTION_TYPES.executeQueryFulfilled ||
      (action.type === RTK_ACTION_TYPES.executeQueryRejected && !action.meta?.condition);
    const completion = queryAccepted || action.type === RTK_ACTION_TYPES.executeMutationRejected;
    const before = store.getState().api;

    if (mutation) deferredMutation = true;

    const result = next(action);
    const queries = store.getState().api?.queries ?? {};

    if (deferredMutation && (mutation || completion)) {
      Object.entries(queries).forEach(([key, query]) => {
        if (
          query.status === QUERY_STATUS_PENDING &&
          query.requestId !== before?.queries[key]?.requestId
        ) {
          requests.set(key, query.requestId);
        }
      });
      const pending = [
        ...Object.values(before?.queries ?? {}),
        ...Object.values(before?.mutations ?? {}),
      ].filter((request) => request.status === QUERY_STATUS_PENDING).length;

      if (pending <= 1) deferredMutation = false;
    }

    const key = action.meta?.arg?.queryCacheKey;

    if (key && requests.get(key) === action.meta?.requestId && queryAccepted) {
      requests.delete(key);
      const data = queries[key]?.data;

      if (action.type === RTK_ACTION_TYPES.executeQueryFulfilled && data && typeof data === "object")
        accepted.add(data);
    }

    if (action.type === RTK_ACTION_TYPES.resetApiState) {
      requests.clear();
      deferredMutation = false;
    }

    return result;
  };
};
