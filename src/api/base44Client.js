import { clearAllOfflineData, getUser, offlineEntities, updateUser } from '@/lib/offline-store';

// Legacy export preserved so existing imports keep working while storage is local-only.
export const base44 = {
  auth: {
    async me() {
      return getUser();
    },

    async updateMe(patch) {
      return updateUser(patch);
    },

    logout(redirectTo) {
      clearAllOfflineData();

      if (typeof window === 'undefined') return;

      if (redirectTo) {
        window.location.href = redirectTo;
        return;
      }

      window.location.reload();
    },

    redirectToLogin(redirectTo) {
      if (typeof window === 'undefined') return;
      window.location.href = redirectTo || '/onboarding';
    },
  },

  entities: offlineEntities,
};
