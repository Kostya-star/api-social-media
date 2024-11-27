import { revokedTokensCollection } from '@/DB';

const revokeToken = async (token: string): Promise<void> => {
  await revokedTokensCollection.insertOne({ token });
};

const isTokenRevoked = async (token: string): Promise<boolean> => {
  return !!(await revokedTokensCollection.findOne({ token }));
};

export default {
  revokeToken,
  isTokenRevoked,
};
