import React from 'react';
import {Image, View} from 'react-native';
import BabenaIcon from '../../assets/images/babena-icon.svg';
import BackAlleyIcon from '../../assets/images/backalley-icon.svg';
import HypeIcon from '../../assets/images/hype-icon.svg';
import KapyIcon from '../../assets/images/kapy-icon.svg';
import KaycIcon from '../../assets/images/kayc-icon.svg';
import KDAIcon from '../../assets/images/kda-icon.svg';
import KDLIcon from '../../assets/images/kdl-icon.svg';
import KDSIcon from '../../assets/images/kds-icon.svg';
import KDXIcon from '../../assets/images/kdx-icon.svg';
import KishuIcon from '../../assets/images/kishu-icon.svg';
import WalletIcon from '../../assets/images/logo.svg';
import MokIcon from '../../assets/images/mok-icon.svg';
import CyberflyIcon from '../../assets/images/cfly.svg';
import {styles} from './styles';

export const getAssetImageView = (tokenAddress: string, size = 40) => {
  switch (tokenAddress) {
    case 'coin':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <KDAIcon height={size} width={size} />
        </View>
      );
    case 'kaddex.kdx':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <KDXIcon height={size} width={size} />
        </View>
      );
    case 'free.backalley':
    case 'free.backalley-token':
      return (
        <View style={styles.imageNoRadius}>
          <BackAlleyIcon height={size} width={size} />
        </View>
      );
    case 'kdlaunch.token':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <KDLIcon height={size} width={size} />
        </View>
      );
    case 'kdlaunch.kdswap-token':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <KDSIcon height={size} width={size} />
        </View>
      );
    case 'free.babena':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <View style={styles.defaultImageBackground}>
            <BabenaIcon height="24" width="24" />
          </View>
        </View>
      );
    case 'hypercent.prod-hype-coin':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <HypeIcon height={size} width={size} />
        </View>
      );
    case 'runonflux.flux':
    case 'kdlaunch.runonflux.flux':
      return (
        <Image
          source={require('../../assets/images/flux-icon.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'kaddex.skdx':
      return (
        <Image
          source={require('../../assets/images/sdkx-icon.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'arkade.token':
      return (
        <Image
          source={require('../../assets/images/arkade-icon.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'free.kishu-ken':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <KishuIcon height={size} width={size} />
        </View>
      );
    case 'free.KAYC':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <KaycIcon fill="#000000" height={size} width={size} />
        </View>
      );
    case 'free.anedak':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <View style={styles.defaultImageBackground}>
            <Image
              source={require('../../assets/images/anedak-icon.png')}
              style={styles.imageContent}
            />
          </View>
        </View>
      );
    case 'mok.token':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <MokIcon height={size} width={size} />
        </View>
      );
    case 'free.kapybara-token':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <KapyIcon height={size} width={size} />
        </View>
      );
    case 'n_b742b4e9c600892af545afb408326e82a6c0c6ed.zUSD':
      return (
        <Image
          source={require('../../assets/images/zUSD.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'free.cyberfly_token':
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <CyberflyIcon height={size} width={size} />
        </View>
      );
    case 'n_e309f0fa7cf3a13f93a8da5325cdad32790d2070.heron':
      return (
        <Image
          source={require('../../assets/images/heron-icon.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'free.maga':
      return (
        <Image
          source={require('../../assets/images/maga-icon.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'free.crankk01':
      return (
        <Image
          source={require('../../assets/images/crankk.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'free.finux':
      return (
        <Image
          source={require('../../assets/images/finux.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    case 'n_582fed11af00dc626812cd7890bb88e72067f28c.bro':
      return (
        <Image
          source={require('../../assets/images/bro.png')}
          style={[styles.image, {width: size, height: size}]}
        />
      );
    default:
      return (
        <View style={[styles.image, {width: size, height: size}]}>
          <View
            style={[
              styles.defaultImageBackground,
              {width: size, height: size},
            ]}>
            <WalletIcon
              height={size === 40 ? 24 : size - 10}
              width={size === 40 ? 24 : size}
            />
          </View>
        </View>
      );
  }
};
