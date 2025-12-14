export const useAuth = () => {
  const { token, user } = useAuthStore(); // Zustand or React Context
  return { token, user };
};