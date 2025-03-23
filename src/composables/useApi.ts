import { API } from "@/api/config";
import router from "@/router";
import { LocalStoragePersistence } from "@/stores/localStoragePersistence";
import { AxiosError } from "axios";

export async function useAPI() {
    const jwtRefreshToken = LocalStoragePersistence.getRefreshJWT();
    if (!jwtRefreshToken) {
        await handleInvalidSession();
        return;
    }

    API.setTokenAuth(jwtRefreshToken);
    
    try {
        const response = await API.server.get("/refresh/");
        const { token, refresh_token, is_premium } = response.data;
        LocalStoragePersistence.setJWT(token);
        LocalStoragePersistence.setRefreshJWT(refresh_token);
        LocalStoragePersistence.setIsPremium(is_premium)

        API.setTokenAuth(token);

        return API;
    } catch (error) {
        console.log(error)
        await handleRefreshError(error);
    }
}

async function handleInvalidSession() {
    LocalStoragePersistence.deleteAll();
    router.replace("/");
}
  
async function handleRefreshError(error: unknown) {
    if (error instanceof AxiosError && error.response?.status === 401) {
        LocalStoragePersistence.deleteAll();
        router.replace("/");
    } else {
        console.error("Unexpected error during refresh:", error);
    }
}
  