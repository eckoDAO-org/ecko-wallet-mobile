import {checkValidSeedPhrase} from '../../utils/kadenaHelpers';

interface ValidateSeedsParams {
  seeds: string;
}

export const validateSeeds: (
  params: ValidateSeedsParams,
) => Promise<boolean> = async ({seeds}) => {
  if (seeds) {
    const isValidSeeds = checkValidSeedPhrase(seeds);
    return !!isValidSeeds;
  } else {
    return false;
  }
};
