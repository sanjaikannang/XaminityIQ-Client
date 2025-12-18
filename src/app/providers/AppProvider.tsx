import { Fragment, type PropsWithChildren } from "react";
import { Provider } from "react-redux";
import store from "../store";

type AppProviderProps = PropsWithChildren & {};

export function AppProvider({ children }: AppProviderProps) {
    return (
        <Fragment>
            <Provider store={store}>{children}</Provider>
        </Fragment>
    );
}
