const logoutPermission = {
  action: 'update:any',
  attributes: '*',
  resource: 'auth',
};

const userRoleViewPermission = {
  action: 'read:own',
  attributes: '*, !permissions',
  resource: 'role',
};

const userUserDeleteTokens = {
  action: 'delete:own',
  attributes: '*',
  resource: 'token',
};

const userUserUpdatePermission = {
  action: 'update:own',
  attributes: '*',
  resource: 'user',
};

const userUserViewPermission = {
  action: 'read:any',
  attributes: '*, !age, !password',
  resource: 'user',
};
