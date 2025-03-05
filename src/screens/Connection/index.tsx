import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import Header from './components/Header';
import {createStyles} from './styles';
import {headerTabs} from './const';
import PairingItem from './components/PairingItem';
import SessionItem from './components/SessionItem';
import {useIsFocused, useNavigation} from '@react-navigation/native';
import {ERootStackRoutes, TNavigationProp} from '../../routes/types';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import WalletConnectInfoModal from '../../components/WalletConnectInfoModal';
import Modal from '../../components/Modal';
import {useWalletConnectContext} from '../../contexts';
import {useSafeAreaValues} from '../../utils/deviceHelpers';
import {TSessionItem} from './components/SessionItem/types';

const Connection = () => {
  const navigation = useNavigation<TNavigationProp<ERootStackRoutes.Home>>();

  const {web3WalletClient, isConnected: isWalletConnected} =
    useWalletConnectContext();

  const [activeTab, setActiveTab] = useState(headerTabs[0].value);

  const isSessionsTab = useMemo(() => activeTab === 'sessions', [activeTab]);

  const [pairingRaws, setPairings] = useState<any[]>(
    web3WalletClient?.core?.pairing.getPairings() || [],
  );
  const [sessionRaws, setSessions] = useState<any[]>(
    web3WalletClient?.getActiveSessions()
      ? Object.values(web3WalletClient?.getActiveSessions())
      : [],
  );
  const {bottomSpace, statusBarHeight} = useSafeAreaValues();
  const styles = createStyles({bottomSpace, statusBarHeight});

  const pairings = useMemo(
    () =>
      pairingRaws.map(pairing => {
        return {
          type: 'pairing',
          topic: pairing.topic,
          name: pairing.peerMetadata?.name || 'Unknown Connection',
          expiry: pairing.expiry,
          logo:
            pairing.peerMetadata?.icons &&
            Array.isArray(pairing.peerMetadata?.icons) &&
            pairing.peerMetadata?.icons.length > 0
              ? pairing.peerMetadata?.icons[0]
              : null,
          url: pairing.peerMetadata?.url || '',
        };
      }),
    [pairingRaws],
  );

  const sessions = useMemo(
    () =>
      sessionRaws.map(session => {
        return {
          type: 'session',
          topic: session.topic,
          name: session.peer.metadata?.name || 'Unknown Connection',
          expiry: session.expiry,
          logo:
            session.peer.metadata?.icons &&
            Array.isArray(session.peer.metadata?.icons) &&
            session.peer.metadata?.icons.length > 0
              ? session.peer.metadata?.icons[0]
              : null,
          url: session.peer.metadata?.url || '',
        };
      }),
    [sessionRaws],
  );

  const onDeletePairing = useCallback(
    (item: any) => {
      ReactNativeHapticFeedback.trigger('impactMedium', {
        enableVibrateFallback: false,
        ignoreAndroidSystemSettings: false,
      });
      Alert.alert(
        'Are you sure to delete this active session?',
        'All data of the session will be deleted and can not be restored',
        [
          {
            text: 'Cancel',
            style: 'cancel',
          },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: () => {
              web3WalletClient
                ?.disconnectSession({
                  topic: item.topic,
                  reason: {
                    message: 'User disconnected.',
                    code: 5000,
                  },
                })
                .then(() => {
                  const newPairings = pairingRaws.filter(
                    pairing => pairing.topic !== item.topic,
                  );
                  setPairings(newPairings);
                  const newSessions = sessionRaws.filter(
                    session => session.topic !== item.topic,
                  );
                  setSessions(newSessions);
                })
                .catch(() => {
                  Alert.alert(
                    'Failed to delete the active session',
                    'WalletConnect config does not match',
                  );
                });
            },
          },
        ],
      );
    },
    [web3WalletClient, pairingRaws, sessionRaws],
  );

  const onDeleteSession = useCallback(
    (item: any) => {
      const newPairings = pairingRaws.filter(
        pairing => pairing.topic !== item.topic,
      );
      setPairings(newPairings);
      const newSessions = sessionRaws.filter(
        session => session.topic !== item.topic,
      );
      setSessions(newSessions);
    },
    [pairingRaws, sessionRaws],
  );

  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const onRefresh = useCallback(() => {
    setIsRefreshing(true);
    setTimeout(() => {
      setPairings(web3WalletClient?.core?.pairing.getPairings() || []);
      setSessions(
        web3WalletClient?.getActiveSessions()
          ? Object.values(web3WalletClient?.getActiveSessions())
          : [],
      );
      setIsRefreshing(false);
    }, 600);
  }, [web3WalletClient]);

  const isFocused = useIsFocused();

  useEffect(() => {
    setTimeout(() => {
      setIsRefreshing(true);
      setTimeout(() => {
        setPairings(web3WalletClient?.core?.pairing.getPairings() || []);
        setSessions(
          web3WalletClient?.getActiveSessions()
            ? Object.values(web3WalletClient?.getActiveSessions())
            : [],
        );
        setIsRefreshing(false);
      }, 1200);
    }, 600);
  }, [web3WalletClient, isFocused, isWalletConnected]);

  const setActiveTabFunc = useCallback((activeTabValue: string) => {
    setActiveTab(activeTabValue);
  }, []);

  const renderItem = useCallback(
    ({item}: {item: TSessionItem}) => {
      if (isSessionsTab) {
        return (
          <SessionItem item={item} onDelete={() => onDeleteSession(item)} />
        );
      } else {
        return (
          <PairingItem item={item} onDelete={() => onDeletePairing(item)} />
        );
      }
    },
    [isSessionsTab, onDeletePairing, onDeleteSession],
  );

  const keyExtractor = useCallback((item: TSessionItem) => {
    return `${item.topic}-${item.type}`;
  }, []);

  const onConnection = useCallback(() => {
    navigation.navigate({
      name: ERootStackRoutes.WalletConnectScan,
      params: undefined,
    });
  }, [navigation]);

  const [showInfo, setShowInfo] = useState<boolean>(false);
  const onShowInfo = useCallback(() => setShowInfo(true), []);
  const onCloseInfo = useCallback(() => setShowInfo(false), []);

  return (
    <View style={styles.container}>
      <Header activeTab={activeTab} setActiveTab={setActiveTabFunc} />
      <FlatList
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={onRefresh} />
        }
        data={isSessionsTab ? sessions : pairings}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={() => (
          <Text style={styles.emptyText}>
            {isSessionsTab ? 'No history' : 'No active sessions'}
          </Text>
        )}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.content}
        style={styles.contentWrapper}
      />
      <TouchableOpacity
        onPress={onConnection}
        activeOpacity={0.8}
        style={styles.connectButton}>
        <Image
          source={require('../../assets/images/walletConnect.png')}
          style={styles.connectIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={onShowInfo}
        activeOpacity={0.8}
        style={styles.infoButton}>
        <Image
          source={require('../../assets/images/info.png')}
          style={styles.infoIcon}
          resizeMode="contain"
        />
      </TouchableOpacity>
      <Modal
        isVisible={showInfo}
        close={onCloseInfo}
        contentStyle={styles.infoModalStyle}
        title="WalletConnect Info">
        <WalletConnectInfoModal onConfirm={onCloseInfo} />
      </Modal>
    </View>
  );
};

export default Connection;
