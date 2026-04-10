import { delay } from '../../utils/helpers';
import { DEMO_ACCOUNTS } from '../../utils/constants';

export const login = async (email, password) => {
  await delay(600);
  const user = DEMO_ACCOUNTS.find(
    (u) => u.email === email && u.password === password
  );
  if (!user) {
    throw new Error('Invalid email or password');
  }
  const { password: _, ...safeUser } = user;
  return safeUser;
};

export const loginAsRole = async (role) => {
  await delay(400);
  const user = DEMO_ACCOUNTS.find((u) => u.role === role);
  if (!user) {
    throw new Error('No demo account for this role');
  }
  const { password: _, ...safeUser } = user;
  return safeUser;
};
