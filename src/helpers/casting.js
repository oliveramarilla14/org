export const stringBoolean = (value) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new Error('String invalido');
};
