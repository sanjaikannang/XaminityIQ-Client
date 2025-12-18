import React, { useState } from "react";
import { getItemFromStorage } from "../utils/storage";
import UnAuthorizedPage from "../common/un-authorized-page/UnAuthorizedPage";

export function withAuthRedirection<P extends object>(
    WrappedComponent: React.ComponentType<P>
): React.FC<P> {
    const ComponentWithAuthRedirection: React.FC<P> = (props) => {

        const [unauthorized, setUnauthorized] = useState(false);
        const checkAuthentication = (): boolean => {
            const accessToken = getItemFromStorage({ key: "access_token" });
            const refreshToken = getItemFromStorage({ key: "refresh_token" });
            return !!(accessToken && refreshToken);
        };

        const userExist = checkAuthentication();

        console.log("userExist...", userExist);

        if (unauthorized) {
            return <UnAuthorizedPage />;
        }
        return <WrappedComponent {...props} />;
    };

    return ComponentWithAuthRedirection;
}
