import { Provider } from "react-redux";
import { RouterProvider } from "react-router/dom";
import { AuthGate } from "./AuthGate.jsx";
import { router } from "./router.jsx";
import { store } from "./store.js";
import { CRTScreen } from "../shared/ui/crt-screen/index.js";

export const App = () => {
  return (
    <Provider store={store}>
      <CRTScreen>
        <AuthGate>
          <RouterProvider router={router} />
        </AuthGate>
      </CRTScreen>
    </Provider>
  );
};
