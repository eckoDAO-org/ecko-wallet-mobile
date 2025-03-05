import '@walletconnect/react-native-compat';
import React, {useCallback, useEffect, useState} from 'react';
import Modal from '../components/Modal';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {makeSelectIsAuthorized} from '../store/auth/selectors';
import {
  MAIN_COLOR,
  MEDIUM_MONTSERRAT,
  REGULAR_MONTSERRAT,
  SEMI_BOLD_MONTSERRAT,
} from '../constants/styles';
import WalletConnectAccountSelector from '../components/WalletConnectAccountSelector';
import {TAccount} from '../store/userWallet/types';
import {
  formatJsonRpcResult,
  formatJsonRpcError,
} from '@walletconnect/jsonrpc-utils';
import JSONTree from 'react-native-json-tree';
import {getNetwork} from './networkHelpers';
import {getSignRequest} from '../store/transfer/services';
import {makeSelectAccounts} from '../store/userWallet/selectors';
import {EDefaultNetwork} from '../screens/Networks/types';
import {useShallowEqualSelector} from '../store/utils';
import {setSendResult} from '../store/history';
import WalletConnectHelpModal from '../components/WalletConnectHelpModal';
import {quickSign} from '../api/kadena/quickSign';
import {defaultChainIds} from '../api/constants';
import {useWalletConnectContext} from '../contexts';
import {makeSelectActiveNetwork} from '../store/networks/selectors';
import {WalletKitTypes} from '@reown/walletkit';

const JSONTreeTheme = {
  tree: {
    borderRadius: 10,
  },
  base00: MAIN_COLOR,
  base01: '#FFFFFF',
  base02: '#FFFFFF',
  base03: '#FFFFFF',
  base04: '#FFFFFF',
  base05: '#FFFFFF',
  base06: '#FFFFFF',
  base07: '#FFFFFF',
  base08: '#FFFFFF',
  base09: '#FFFFFF',
  base0A: '#FFFFFF',
  base0B: '#FFFFFF',
  base0C: '#FFFFFF',
  base0D: '#FFFFFF',
  base0E: '#FFFFFF',
  base0F: '#FFFFFF',
};

const labelRenderer = (raw: string) => (
  <Text style={styles.jsonLabel}>{raw}</Text>
);
const valueRenderer = (raw: string) => (
  <Text style={styles.jsonText}>{raw}</Text>
);

export const KDA_NAMESPACE = 'kadena';

export const KDA_CHAINS = [
  'kadena:mainnet01',
  'kadena:testnet04',
  'kadena:development',
];

const NETWORK_IDS: Record<string, string> = {
  mainnet: 'mainnet01',
  testnet: 'testnet04',
  devnet: 'development',
};

const KDA_METHODS = {
  KDA_SIGN: 'kadena_sign',
  KDA_QUICK_SIGN: 'kadena_quicksign',
  KDA_GET_ACCOUNTS_V1: 'kadena_getAccounts_v1',
  KDA_SIGN_V1: 'kadena_sign_v1',
  KDA_QUICK_SIGN_V1: 'kadena_quicksign_v1',
};

const KDX_METHODS = {
  KDX_SIGN: 'kaddex_sign',
  KDX_SEND_TRANSACTION: 'kaddex_send_transaction',
  KDX_SIGN_TRANSACTION: 'kaddex_sign_transaction',
};

const KDA_EVENTS = {
  ACCOUNT_CHANGED: 'account_changed',
  KDA_TRANSACTION_UPDATED: 'kadena_transaction_updated',
};

export const useWalletConnect = () => {
  const {web3WalletClient, isInitialized, setIsConnected} =
    useWalletConnectContext();

  const dispatch = useDispatch();

  const isAuthorized = useSelector(makeSelectIsAuthorized);
  const accountsList = useShallowEqualSelector(makeSelectAccounts);
  const selectedNetwork = useShallowEqualSelector(makeSelectActiveNetwork);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isHelpVisible, setHelpIsVisible] = useState<boolean>(false);
  const [modalTitle, setModalTitle] = useState<string>('');
  const [modalContentType, setModalContentType] = useState<string | null>('');
  const [modalContentProps, setModalContentProps] = useState<any>({});

  const onSessionProposal = useCallback(
    (proposal: WalletKitTypes.SessionProposal) => {
      if (proposal) {
        setModalTitle('Session Proposal');
        setModalContentProps({
          proposal,
          selectedAccounts: [],
        });
        setModalContentType('session_proposal');
        setIsVisible(true);
      }
    },
    [],
  );

  const onSessionRequest = useCallback(
    async (requestEvent: any) => {
      const {topic, params} = requestEvent;
      const {request} = params;

      switch (request.method) {
        case KDA_METHODS.KDA_GET_ACCOUNTS_V1:
          {
            const getAccounts = async () => {
              const sessions = web3WalletClient?.getActiveSessions();
              console.log('onSessionRequest', 'KDA_GET_ACCOUNTS_V1');
              const isActiveSession = sessions && sessions[topic];
              if (isActiveSession) {
                const walletConnectAccounts = sessions![
                  topic
                ].namespaces?.kadena?.accounts?.filter(acc =>
                  acc.includes(getNetwork(selectedNetwork.network)),
                );
                const sessionAccounts = walletConnectAccounts?.map(account => {
                  const publicKey = account.split(':')[2];
                  const cleanAccount = `k:${publicKey}`;
                  return {
                    account,
                    publicKey,
                    kadenaAccounts: [
                      {
                        name: cleanAccount,
                        contract: 'coin',
                        chains: defaultChainIds,
                      },
                    ],
                  };
                });
                const response = formatJsonRpcResult(requestEvent.id, {
                  accounts: sessionAccounts || [],
                });
                await web3WalletClient?.respondSessionRequest({
                  topic,
                  response,
                });
              }
            };
            try {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  try {
                    await getAccounts();
                    resolve(true);
                  } catch (innerError) {
                    reject(innerError);
                  }
                }, 300);
              });
            } catch (e) {
              await new Promise((resolve, reject) => {
                setTimeout(async () => {
                  try {
                    await getAccounts();
                    resolve(true);
                  } catch (innerError) {
                    reject(innerError);
                  }
                }, 1200);
              });
            }
          }
          break;
        case KDA_METHODS.KDA_SIGN:
        case KDA_METHODS.KDA_SIGN_V1:
        case KDA_METHODS.KDA_QUICK_SIGN:
        case KDA_METHODS.KDA_QUICK_SIGN_V1:
        case KDX_METHODS.KDX_SIGN:
          setModalTitle('Sign');
          setModalContentProps({
            event: requestEvent,
            topic,
          });
          setModalContentType('session_request');
          setIsVisible(true);
          break;

        case KDX_METHODS.KDX_SEND_TRANSACTION:
        case KDX_METHODS.KDX_SIGN_TRANSACTION:
          setModalTitle('Send / Sign Transaction');
          setModalContentProps({
            event: requestEvent,
            topic,
          });
          setModalContentType('session_request');
          setIsVisible(true);
          break;

        default:
          break;
      }
    },
    [web3WalletClient, selectedNetwork],
  );

  const onSessionEvent = useCallback(async (sessionEvent: any) => {
    try {
      const {params} = sessionEvent;
      const {event} = params;
      switch (event?.name) {
        case KDA_EVENTS.KDA_TRANSACTION_UPDATED:
          {
            const {params: transactionDetail} = event;
            dispatch(
              setSendResult({
                ...transactionDetail,
                coinShortName: '',
                amount: 0,
                requestKey: transactionDetail.reqKey,
                status:
                  transactionDetail?.result?.status === 'success' ||
                  transactionDetail?.result?.error?.message?.includes(
                    'resumePact: pact completed:',
                  )
                    ? 'success'
                    : transactionDetail?.result?.status === 'failure'
                    ? 'failure'
                    : 'pending',
                createdTime: new Date().toISOString(),
                sender: '',
                sourceChainId: '',
                receiver: '',
                targetChainId: '',
              }),
            );
          }
          break;
        default:
          break;
      }
    } catch (e) {}
  }, []);

  const onSessionDelete = useCallback(() => {
    setIsConnected(false);
  }, []);

  useEffect(() => {
    try {
      if (isInitialized && web3WalletClient) {
        web3WalletClient?.on('session_proposal', onSessionProposal);
        web3WalletClient?.on('session_request', onSessionRequest);
        web3WalletClient?.on('session_delete', onSessionDelete);
        web3WalletClient?.events?.on('session_event', onSessionEvent);
        return () => {
          web3WalletClient?.off('session_proposal', onSessionProposal);
          web3WalletClient?.off('session_request', onSessionRequest);
          web3WalletClient?.off('session_delete', onSessionDelete);
          web3WalletClient?.events?.off('session_event', onSessionEvent);
        };
      }
    } catch (e) {}
  }, [
    isInitialized,
    web3WalletClient,
    onSessionProposal,
    onSessionRequest,
    onSessionDelete,
  ]);

  const closeModal = useCallback(() => {
    setIsVisible(false);
    setIsLoading(false);
    setTimeout(() => {
      setModalTitle('');
      setModalContentProps({});
      setModalContentType(null);
    }, 600);
  }, []);

  const closeHelpModal = useCallback(() => {
    setHelpIsVisible(false);
  }, []);

  const onReject = useCallback(async () => {
    setIsLoading(true);
    try {
      if (modalContentType === 'session_request') {
        const {topic, event} = modalContentProps;
        const {id} = event;

        const response = formatJsonRpcError(id, {
          code: 5000,
          message: 'User rejected.',
        });
        await web3WalletClient?.respondSessionRequest({
          topic,
          response,
        });

        closeModal();
      } else if (modalContentType === 'session_proposal') {
        const {proposal} = modalContentProps;
        const {id} = proposal;

        await web3WalletClient?.rejectSession({
          id,
          reason: {
            message: 'User rejected.',
            code: 5000,
          },
        });

        closeModal();
      }
    } catch (e) {
      setIsLoading(false);
      setHelpIsVisible(true);
    }
  }, [web3WalletClient, closeModal, modalContentProps, modalContentType]);

  const onApprove = useCallback(async () => {
    setIsLoading(true);
    try {
      if (modalContentType === 'session_request') {
        const {topic, event} = modalContentProps;
        const {
          id: eventId,
          params: {
            request: {method, params: cmdValue},
          },
        } = event;

        switch (method) {
          case KDX_METHODS.KDX_SIGN:
          case KDA_METHODS.KDA_SIGN:
            {
              const foundAccount = (accountsList || []).find(
                (item: any) =>
                  item.accountName === cmdValue?.sender ||
                  item.publicKey === cmdValue?.sender ||
                  item.publicKey === cmdValue?.signingPubKey,
              );
              const signResultData = await getSignRequest({
                network: getNetwork(
                  selectedNetwork?.network || EDefaultNetwork.devnet,
                ),
                instance: cmdValue.networkId,
                version: cmdValue.networkVersion || '0.0',
                sourceChainId: cmdValue.chainId || '2',
                cmdValue: JSON.stringify(cmdValue),
                publicKey: foundAccount?.publicKey || '',
                signature: foundAccount?.privateKey || '',
              });
              const response = formatJsonRpcResult(eventId, {
                status: 'success',
                signedCmd: signResultData,
              });
              await web3WalletClient?.respondSessionRequest({
                topic,
                response,
              });
            }
            break;
          case KDA_METHODS.KDA_SIGN_V1:
            {
              const networkId =
                NETWORK_IDS[
                  selectedNetwork?.network || EDefaultNetwork.mainnet
                ];
              const foundAccount = (accountsList || []).find(
                (item: any) =>
                  item.accountName === cmdValue?.sender ||
                  item.publicKey === cmdValue?.sender ||
                  item.publicKey === cmdValue?.signingPubKey,
              );
              const signResultData = await getSignRequest({
                cmdValue: JSON.stringify({
                  ...cmdValue,
                  networkId: cmdValue.networkId || networkId,
                  pactCode: cmdValue.code,
                }),
                publicKey: foundAccount?.publicKey || '',
                signature: foundAccount?.privateKey || '',
              });
              const response = formatJsonRpcResult(eventId, {
                chainId: cmdValue.chainId || '2',
                body: signResultData,
              });
              await web3WalletClient?.respondSessionRequest({
                topic,
                response,
              });
            }
            break;
          case KDA_METHODS.KDA_QUICK_SIGN:
            {
              const foundAccount = (accountsList || []).find(
                (item: any) =>
                  item.accountName === cmdValue?.sender ||
                  item.publicKey === cmdValue?.sender ||
                  item.publicKey === cmdValue?.signingPubKey,
              );
              const quickSignData = quickSign(
                cmdValue?.commandSigDatas,
                foundAccount?.publicKey,
                foundAccount?.privateKey,
              );
              const response = formatJsonRpcResult(eventId, {
                status: 'success',
                quickSignData,
              });
              await web3WalletClient?.respondSessionRequest({
                topic,
                response,
              });
            }
            break;
          case KDA_METHODS.KDA_QUICK_SIGN_V1:
            {
              const foundAccount = (accountsList || []).find((item: any) =>
                cmdValue.commandSigDatas.find((cmdSigData: any) =>
                  cmdSigData.sigs.find(
                    (sig: any) => sig.pubKey === item.publicKey,
                  ),
                ),
              );
              const quickSignData = quickSign(
                cmdValue,
                foundAccount?.publicKey,
                foundAccount?.privateKey,
              );
              const response = formatJsonRpcResult(eventId, {
                responses: quickSignData,
              });
              await web3WalletClient?.respondSessionRequest({
                topic,
                response,
              });
            }
            break;
          default:
            break;
        }

        closeModal();
      } else if (modalContentType === 'session_proposal') {
        const {proposal, selectedAccounts} = modalContentProps;
        const {id} = proposal;
        const accounts: string[] = [];

        KDA_CHAINS.forEach((chain: string) => {
          selectedAccounts.forEach((acc: TAccount) => {
            accounts.push(`${chain}:${acc.publicKey}`);
          });
        });
        await web3WalletClient?.approveSession({
          id,
          namespaces: {
            [KDA_NAMESPACE]: {
              chains: KDA_CHAINS,
              accounts,
              methods: Object.values(KDA_METHODS),
              events: Object.values(KDA_EVENTS),
            },
          },
        });

        setTimeout(() => setIsConnected(false), 600);
        setTimeout(() => setIsConnected(true), 1200);

        closeModal();
      }
    } catch (e) {
      setIsLoading(false);
      setHelpIsVisible(true);
    }
  }, [
    selectedNetwork,
    web3WalletClient,
    accountsList,
    closeModal,
    modalContentType,
    modalContentProps,
  ]);

  const onSelectAccounts = useCallback(
    (accounts: TAccount[]) => {
      setModalContentProps({
        ...modalContentProps,
        selectedAccounts: accounts,
      });
    },
    [modalContentProps],
  );

  if (!isAuthorized) {
    return null;
  }
  return (
    <Modal isVisible={isVisible} close={closeModal} title={modalTitle || ''}>
      <View style={styles.content}>
        {modalContentType === 'session_proposal' ? (
          <WalletConnectAccountSelector onSelectAccounts={onSelectAccounts} />
        ) : null}
        {modalContentType === 'session_request' ? (
          <ScrollView
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
            horizontal={true}
            style={styles.jsonScroll}
            contentContainerStyle={styles.jsonContent}>
            <JSONTree
              data={modalContentProps?.event?.params || {}}
              theme={JSONTreeTheme as any}
              invertTheme={false}
              hideRoot={true}
              labelRenderer={labelRenderer as any}
              valueRenderer={valueRenderer as any}
            />
          </ScrollView>
        ) : null}
        <View style={styles.buttons}>
          <TouchableOpacity
            disabled={isLoading}
            onPress={onReject}
            style={styles.redButton}>
            <Text style={styles.buttonText}>{'Reject'}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={
              isLoading ||
              (modalContentType === 'session_proposal' &&
                (modalContentProps?.selectedAccounts || []).length === 0)
            }
            onPress={onApprove}
            style={styles.greenButton}>
            <Text style={styles.buttonText}>{'Approve'}</Text>
          </TouchableOpacity>
          {isLoading ? (
            <View style={styles.loading}>
              <ActivityIndicator size="small" color={MAIN_COLOR} />
            </View>
          ) : null}
        </View>
      </View>
      <Modal
        isVisible={isHelpVisible}
        close={closeHelpModal}
        contentStyle={styles.helpModalStyle}
        title="WalletConnect Help">
        <WalletConnectHelpModal onConfirm={closeHelpModal} />
      </Modal>
    </Modal>
  );
};

const windowHeight = Dimensions.get('window').height;

export const styles = StyleSheet.create({
  content: {
    paddingVertical: 12,
  },
  contentWrapper: {
    width: '100%',
    paddingTop: 16,
    paddingHorizontal: 20,
  },
  checkBoxWrapper: {
    marginBottom: 24,
  },
  buttons: {
    width: '100%',
    paddingHorizontal: 20,
  },
  redButton: {
    marginTop: 16,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#FF6058',
    padding: 12,
  },
  greenButton: {
    marginTop: 16,
    width: '100%',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#27CA40',
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontFamily: MEDIUM_MONTSERRAT,
    fontWeight: '700',
    fontSize: 14,
  },
  jsonScroll: {
    marginTop: 8,
    marginBottom: 8,
    width: '100%',
  },
  jsonContent: {
    paddingHorizontal: 20,
  },
  jsonLabel: {
    fontFamily: SEMI_BOLD_MONTSERRAT,
    fontWeight: '600',
    fontSize: 14,
  },
  jsonText: {
    fontFamily: REGULAR_MONTSERRAT,
    fontWeight: '400',
    fontSize: 14,
  },
  helpModalStyle: {
    minHeight: windowHeight * 0.4 - 48,
  },
  loading: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 16,
  },
});
