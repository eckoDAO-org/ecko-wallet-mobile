import {getSignatureFromHash} from '../../utils/kadenaHelpers';
import {Pact} from '../pactLangApi';

const checkIsValidQuickSignPayload = (payload: any) =>
  payload &&
  payload.commandSigDatas &&
  Array.isArray(payload.commandSigDatas) &&
  payload.commandSigDatas.every((r: any) => Array.isArray(r.sigs) && r.cmd);

const checkHasQuickSignValidSignature = (
  commandSigDataArray: any[],
  publicKey: string,
) =>
  commandSigDataArray &&
  commandSigDataArray.filter(r =>
    r.sigs?.some((s: any) => s.pubKey === publicKey),
  )?.length > 0;

export const quickSign = (data: any, publicKey: string, secretKey: string) => {
  const isValidPayload = checkIsValidQuickSignPayload(data);
  if (!isValidPayload) {
    return null;
  }
  const hasQuickSignValidSignature = checkHasQuickSignValidSignature(
    data.commandSigDatas,
    publicKey,
  );
  if (!hasQuickSignValidSignature) {
    return null;
  }
  const signedResponses: any[] = [];
  for (let i = 0; i < data.commandSigDatas.length; i += 1) {
    const {cmd, sigs} = data.commandSigDatas[i];
    let signature: any = null;
    let hash: string | null = null;
    const signatureIndex = sigs.findIndex((s: any) => s.pubKey === publicKey);
    // account publicKey not present in sigs
    if (signatureIndex < 0) {
      signedResponses.push({
        cmd,
        sigs,
        outcome: {
          result: 'noSig',
        },
      });
    } else {
      const parsedCmd = JSON.parse(cmd);
      // find sig index for selected account
      const commandSigIndex = parsedCmd.signers.findIndex(
        (s: any) => s.pubKey === publicKey,
      );
      if (commandSigIndex > -1) {
        parsedCmd.signers[commandSigIndex].secretKey = secretKey;
        try {
          hash = Pact.crypto.hash(cmd);
          if (secretKey.length > 64) {
            signature = getSignatureFromHash(hash, secretKey);
          } else {
            signature = Pact.crypto.sign(hash, {secretKey, publicKey}).sig;
          }
        } catch (err) {
          signedResponses.push({
            commandSigData: {
              cmd,
              sigs,
            },
            outcome: {
              result: 'failure',
              msg: 'Error to sign cmd',
            },
          });
        }
      }

      sigs[signatureIndex].sig = signature;
      signedResponses.push({
        commandSigData: {
          cmd,
          sigs,
        },
        outcome: {
          result: 'success',
          hash,
        },
      });
    }
  }
  return signedResponses;
};
