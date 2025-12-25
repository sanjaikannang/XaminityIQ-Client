import store from "../store";
import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";
import { Fragment, type PropsWithChildren } from "react";

type AppProviderProps = PropsWithChildren & {};

export function AppProvider({ children }: AppProviderProps) {
    return (
        <Fragment>
            <Provider store={store}>{children}
                <Toaster/>
            </Provider>
        </Fragment>
    );
}
