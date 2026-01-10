import * as SecureStore from "expo-secure-store";
import { expoClient } from "@better-auth/expo/client";
import { createAuthClient } from "better-auth/react";
import { getBaseUrl } from "./base-url";
import type { Auth } from "@workspace/auth";
import { inferAdditionalFields } from "better-auth/client/plugins";

export const authClient = createAuthClient({
    baseURL: getBaseUrl(),
    plugins: [
        inferAdditionalFields<Auth>(),
        expoClient({
            scheme: "expo",
            storagePrefix: "expo",
            storage: SecureStore,
        }),
    ],
});