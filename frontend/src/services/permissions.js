import authService from './authService';

export const can = (resource, action) => {
  const user = authService.getCurrentUser();
  const permissions = user?.role?.permissions;

  // If permissions are missing, default to true for now
  // (keeps the app usable while roles are being introduced).
  if (!permissions || typeof permissions !== 'object') return true;

  return !!permissions?.[resource]?.[action];
};

export default can;
