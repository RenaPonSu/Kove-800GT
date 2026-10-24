import { AndroidBrand, AndroidPhoneProfile, ColoveModel, MirroringProtocol } from '../types';

export const ANDROID_PHONE_PROFILES: AndroidPhoneProfile[] = [
  {
    id: 'samsung_s23',
    brand: 'Samsung',
    modelName: 'Samsung Galaxy S23 Ultra (SM-S918B)',
    osName: 'One UI',
    osVersion: '6.1 (Android 14)',
    nativeProtocol: 'Samsung Smart View',
    cameraCutout: 'center_hole',
    accentColor: '#38bdf8',
    pairingTip: 'Use One UI Smart View quick tile and set aspect ratio to "Full screen on connected phone".'
  },
  {
    id: 'samsung_s24',
    brand: 'Samsung',
    modelName: 'Samsung Galaxy S24 Ultra (SM-S928B)',
    osName: 'One UI',
    osVersion: '6.1.1 (Android 14)',
    nativeProtocol: 'Samsung Smart View',
    cameraCutout: 'center_hole',
    accentColor: '#0ea5e9',
    pairingTip: 'Smart View with Galaxy AI low-latency video streaming at 60 FPS.'
  },
  {
    id: 'pixel_9_pro',
    brand: 'Google Pixel',
    modelName: 'Google Pixel 9 Pro XL',
    osName: 'Google Pixel OS',
    osVersion: 'Android 15',
    nativeProtocol: 'Google Cast / Miracast',
    cameraCutout: 'center_hole',
    accentColor: '#10b981',
    pairingTip: 'Swipe down & tap "Cast". In 3-dot menu, check "Enable wireless display" for Colove 800X Wi-Fi Direct.'
  },
  {
    id: 'pixel_8',
    brand: 'Google Pixel',
    modelName: 'Google Pixel 8 Pro',
    osName: 'Google Pixel OS',
    osVersion: 'Android 14',
    nativeProtocol: 'Google Cast / Miracast',
    cameraCutout: 'center_hole',
    accentColor: '#34d399',
    pairingTip: 'Connect to COLOVE-800X-GT Wi-Fi 5.8GHz and start screen streaming.'
  },
  {
    id: 'xiaomi_14',
    brand: 'Xiaomi / POCO',
    modelName: 'Xiaomi 14 Ultra (HyperOS)',
    osName: 'Xiaomi HyperOS',
    osVersion: '1.0 (Android 14)',
    nativeProtocol: 'HyperOS Wireless Display',
    cameraCutout: 'center_hole',
    accentColor: '#f97316',
    pairingTip: 'Go to Settings > Connection & sharing > Wireless display > Select Colove 800X.'
  },
  {
    id: 'oneplus_12',
    brand: 'OnePlus / OPPO',
    modelName: 'OnePlus 12 (CPH2581)',
    osName: 'OxygenOS',
    osVersion: '14.0 (Android 14)',
    nativeProtocol: 'OxygenOS Screencast',
    cameraCutout: 'left_hole',
    accentColor: '#ef4444',
    pairingTip: 'Control Center > Screencast > Select Colove 800X GT 5.8G receiver.'
  },
  {
    id: 'moto_edge_50',
    brand: 'Motorola',
    modelName: 'Motorola Edge 50 Ultra',
    osName: 'Hello UI',
    osVersion: 'Android 14',
    nativeProtocol: 'Motorola Ready For',
    cameraCutout: 'center_hole',
    accentColor: '#06b6d4',
    pairingTip: 'Use Motorola Ready For Wireless Display to cast phone screen or motorcycle dashboard mode.'
  },
  {
    id: 'huawei_pura_70',
    brand: 'Huawei / Honor',
    modelName: 'Huawei Pura 70 Ultra / Honor Magic 6',
    osName: 'EMUI / MagicOS',
    osVersion: '8.0 (Android 14)',
    nativeProtocol: 'Colove MotoCast HD',
    cameraCutout: 'pill',
    accentColor: '#ec4899',
    pairingTip: 'Enable Wireless Projection in control panel for direct Wi-Fi P2P streaming.'
  },
  {
    id: 'universal_android',
    brand: 'Universal Android',
    modelName: 'Any Android Phone (Android 10 - 15+)',
    osName: 'Android System',
    osVersion: '10 - 15+',
    nativeProtocol: 'Colove MotoCast HD',
    cameraCutout: 'center_hole',
    accentColor: '#8b5cf6',
    pairingTip: 'Works with any Android device via Wi-Fi Direct, Miracast, CarbitLink, or MotoPlay.'
  }
];

export const COLOVE_800X_VARIANTS: {
  id: ColoveModel;
  name: string;
  tagline: string;
  fuelTankLiters: number;
  weightDryKg: number;
  suspension: string;
  tftDisplay: string;
}[] = [
  {
    id: 'Colove 800X GT',
    name: 'COLOVE 800X GT (Grand Touring)',
    tagline: 'High-speed alpine touring, 19L fuel tank, dual 5.8GHz casting receiver',
    fuelTankLiters: 19,
    weightDryKg: 183,
    suspension: 'Adjustable upside-down front forks, 21" front & 18" rear spoked wheels',
    tftDisplay: '7-inch Optically Bonded Anti-Glare Vertical Rally TFT'
  },
  {
    id: 'Colove 800X Pro',
    name: 'COLOVE 800X Pro (Enduro Adventure)',
    tagline: 'Hard enduro rally raid spec, KYB 240mm suspension, 20L tank',
    fuelTankLiters: 20,
    weightDryKg: 185,
    suspension: 'Fully adjustable KYB inverted forks, 240mm ground clearance',
    tftDisplay: '7-inch Ruggedised Shock-Mounted Rally Cockpit'
  },
  {
    id: 'Colove 800X Rally',
    name: 'COLOVE 800X Rally (Dakar Champion)',
    tagline: 'Ultralight 169 kg, 270mm suspension travel, Dakar roadbook tower',
    fuelTankLiters: 19,
    weightDryKg: 169,
    suspension: 'Factory race-grade KYB 270mm long travel, carbon bashplate',
    tftDisplay: 'Vertical Tower TFT with Roadbook & GPS Mirroring'
  }
];

/**
 * Returns available mirroring protocols suitable for a given Android phone brand
 */
export function getProtocolsForBrand(brand: AndroidBrand): MirroringProtocol[] {
  switch (brand) {
    case 'Samsung':
      return ['Samsung Smart View', 'Colove MotoCast HD', 'CarbitLink', 'MotoPlay'];
    case 'Google Pixel':
      return ['Google Cast / Miracast', 'Colove MotoCast HD', 'CarbitLink', 'MotoPlay'];
    case 'Xiaomi / POCO':
      return ['HyperOS Wireless Display', 'Colove MotoCast HD', 'CarbitLink', 'MotoPlay'];
    case 'OnePlus / OPPO':
      return ['OxygenOS Screencast', 'Colove MotoCast HD', 'CarbitLink', 'MotoPlay'];
    case 'Motorola':
      return ['Motorola Ready For', 'Colove MotoCast HD', 'CarbitLink', 'MotoPlay'];
    case 'Huawei / Honor':
      return ['Colove MotoCast HD', 'CarbitLink', 'MotoPlay'];
    case 'Universal Android':
    default:
      return ['Colove MotoCast HD', 'CarbitLink', 'MotoPlay', 'Google Cast / Miracast'];
  }
}

/**
 * Returns brand-specific pairing guidance for Colove 800X
 */
export function getBrandGuideInstructions(brand: AndroidBrand) {
  switch (brand) {
    case 'Samsung':
      return {
        quickSettingName: 'Smart View',
        menuPath: 'Quick Settings shade > Smart View > Tap COLOVE-800X-GT',
        aspectTip: 'Tap the blue floating Smart View icon on your phone > "Set aspect ratio" > "Full screen on connected device" to fill the 7" TFT.',
        audioTip: 'Samsung Media Output automatically pairs with Cardo/Sena helmet intercom while casting video via 5.8GHz Wi-Fi.'
      };
    case 'Google Pixel':
      return {
        quickSettingName: 'Screen Cast',
        menuPath: 'Settings > Connected devices > Connection preferences > Cast > 3-dots > "Enable wireless display"',
        aspectTip: 'Android 14/15 adapts automatically to the 9:16 portrait rally display ratio.',
        audioTip: 'Bluetooth A2DP routes high-definition voice and Alexa guidance to helmet headset.'
      };
    case 'Xiaomi / POCO':
      return {
        quickSettingName: 'Wireless Display / Cast',
        menuPath: 'Settings > Connection & sharing > Cast / Wireless display > Select COLOVE-800X',
        aspectTip: 'HyperOS allows screen projection with phone screen turned off or dimmed to reduce heat in motorcycle pocket.',
        audioTip: 'Dual-audio mode keeps helmet intercom active for voice commands.'
      };
    case 'OnePlus / OPPO':
      return {
        quickSettingName: 'Screencast',
        menuPath: 'Control Center > Screencast tile > Search for COLOVE-800X-GT receiver',
        aspectTip: 'OxygenOS Multi-Screen Connect supports 60 FPS ultra-low latency projection.',
        audioTip: 'Seamless Bluetooth audio handover to motorcycle Cardo Packtalk mesh.'
      };
    case 'Motorola':
      return {
        quickSettingName: 'Ready For / Cast',
        menuPath: 'Swipe down > Ready For > Screen Mirroring > COLOVE-800X-GT',
        aspectTip: 'Supports full phone mirror or customized dashboard launcher view.',
        audioTip: 'Crystal-clear helmet audio with low latency.'
      };
    case 'Huawei / Honor':
    case 'Universal Android':
    default:
      return {
        quickSettingName: 'Wireless Projection / CarbitLink',
        menuPath: 'Settings > Connected devices > Wireless projection OR open CarbitLink / MotoPlay app',
        aspectTip: 'Ensure Wi-Fi 5.8GHz is connected to SSID: COLOVE-800X-GT_5G_62A with standard password.',
        audioTip: 'Pair helmet headset via Bluetooth for voice turn alerts and calls.'
      };
  }
}

/**
 * Returns performance streaming parameters for Colove 800X TFT
 */
export function getStreamingPerformance(latencyMode: 'low_latency_60fps' | 'balanced' | 'high_definition') {
  switch (latencyMode) {
    case 'low_latency_60fps':
      return {
        fps: 60,
        latencyMs: 18,
        bitrateMbps: 12,
        resolution: '1080x1920 (FHD 60Hz)'
      };
    case 'high_definition':
      return {
        fps: 30,
        latencyMs: 35,
        bitrateMbps: 20,
        resolution: '1440x2560 (2K HDR)'
      };
    case 'balanced':
    default:
      return {
        fps: 60,
        latencyMs: 24,
        bitrateMbps: 15,
        resolution: '1080x1920 (FHD)'
      };
  }
}
