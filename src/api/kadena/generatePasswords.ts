import {generateSeedPhrase} from '../../utils/kadenaHelpers';

export const generatePasswords: () => Promise<string[]> = async () => {
  const seeds = generateSeedPhrase();
  return seeds.split(' ');
};
