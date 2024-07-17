import {DefaultQueryParams} from '../types';
import {getSignatureFromHash} from '../../utils/kadenaHelpers';
import {Pact} from '../pactLangApi';
import {Platform} from 'react-native';

interface SignQueryParams extends DefaultQueryParams {
  instance: string;
  version: string;
  sourceChainId: string;
  customHost?: string | null;
  cmdValue: string;
  publicKey: string;
  signature: string;
}

const getNonceByPlatform = (platform?: string) => {
  switch (platform) {
    case 'macos':
      return `"XMDS-${new Date().toISOString()}"`;
    case 'ios':
      return `"XIDS-${new Date().toISOString()}"`;
    case 'android':
      return `"XADS-${new Date().toISOString()}"`;
    default:
      return `"${new Date().toISOString()}"`;
  }
};

export const getSign: (params: SignQueryParams) => Promise<any> = async ({
  publicKey,
  signature,
  cmdValue,
}) => {
  if (!publicKey || !signature || !cmdValue) {
    throw new Error('Wrong Parameters: request getSign');
  }

  const signingCmd = JSON.parse(cmdValue);
  const meta = Pact.lang.mkMeta(
    signingCmd.sender,
    signingCmd.chainId.toString(),
    signingCmd.gasPrice,
    signingCmd.gasLimit,
    Math.round(new Date().getTime() / 1000) - 50,
    signingCmd.ttl,
  );
  const clist = signingCmd.caps ? signingCmd.caps.map((c: any) => c.cap) : [];
  const keyPairs: any = {
    publicKey,
  };
  if (signature.length === 64) {
    keyPairs.secretKey = signature;
  }
  if (clist.length > 0) {
    keyPairs.clist = clist;
  }
  const signedCmd = Pact.api.prepareExecCmd(
    keyPairs,
    getNonceByPlatform(Platform.OS),
    signingCmd.pactCode || signingCmd.code,
    signingCmd.envData || signingCmd.data,
    meta,
    signingCmd.networkId,
  );
  if (signature.length > 64) {
    const sig = getSignatureFromHash(signedCmd.hash, signature);
    signedCmd.sigs = [{sig}];
  }
  return signedCmd;
};
