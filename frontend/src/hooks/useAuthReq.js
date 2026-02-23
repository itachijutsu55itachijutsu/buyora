import { useAuth, useUser } from "@clerk/clerk-react";
import { useEffect } from "react";
import api from "../lib/axios";

let isInterceptorRegistered = false;

function useAuthReq() {
  const { isSignedIn, getToken, isLoaded } = useAuth();
  const { user } = useUser();

  // Sync user to DB
  useEffect(() => {
    if (!isSignedIn || !user) return;

    const syncUser = async () => {
      try {
        const token = await getToken();
        await api.post('/users/sync', {
          email: user.primaryEmailAddress?.emailAddress,
          name: user.fullName,
          imageUrl: user.imageUrl
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (error) {
        console.error('User sync failed:', error);
      }
    };

    syncUser();
  }, [isSignedIn, user]);

  // Axios interceptor
  useEffect(() => {
    if (isInterceptorRegistered) return;
    isInterceptorRegistered = true;

    const interceptor = api.interceptors.request.use(async (config) => {
      if (isSignedIn) {
        const token = await getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    return () => {
      api.interceptors.request.eject(interceptor);
      isInterceptorRegistered = false;
    };
  }, [isSignedIn, getToken]);

  return { isSignedIn, isClerkLoaded: isLoaded };
}

export default useAuthReq;