import { Provider } from "react-redux";
import { RouterProvider } from "react-router/dom";
import { AuthGate } from "./AuthGate.jsx";
import { router } from "./router.jsx";
import { store } from "./store.js";

export const App = () => {
  return (
    <Provider store={store}>
      <AuthGate>
        <RouterProvider router={router} />
      </AuthGate>
    </Provider>
  );
};
