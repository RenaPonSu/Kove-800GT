import { MotorcycleTelemetry, RouteInfo, PointOfInterest, IncomingMessage, MusicTrack } from '../types';

export type AlexaActionType =
  | 'route_gas'
  | 'check_range'
  | 'check_tpms'
  | 'read_messages'
  | 'next_track'
  | 'navigation_prompt'
  | 'check_telemetry'
  | 'unknown';

export interface AlexaCommandResult {
  action: AlexaActionType;
  spokenResponse: string;
  targetCategory?: string;
}

/**
 * Parses rider voice queries or button prompts and generates appropriate Alexa response
 */
export function processAlexaCommand(
  rawInput: string,
  context: {
    telemetry: MotorcycleTelemetry;
    route: RouteInfo;
    pois: PointOfInterest[];
    messages: IncomingMessage[];
    currentTrack: MusicTrack;
  }
): AlexaCommandResult {
  const query = rawInput.toLowerCase().trim();

  // 1. Gas / Fuel Station routing
  if (
    query.includes('gas') ||
    query.includes('fuel station') ||
    query.includes('petrol') ||
    query.includes('refuel') ||
    query.includes('nearest station')
  ) {
    const fuelPoi = context.pois.find((p) => p.category === 'fuel');
    const name = fuelPoi ? fuelPoi.name : 'Pass Fuel Station';
    const dist = fuelPoi ? fuelPoi.distanceKm : 14.8;
    return {
      action: 'route_gas',
      targetCategory: 'fuel',
      spokenResponse: `Routing to nearest fuel at ${name}, ${dist} kilometers away. Added to Kove TFT display.`
    };
  }

  // 2. Fuel Range / DTE query
  if (
    query.includes('range') ||
    query.includes('dte') ||
    query.includes('distance to empty') ||
    query.includes('how much fuel') ||
    query.includes('fuel level')
  ) {
    const dte = context.telemetry.distanceToEmptyKm;
    const liters = context.telemetry.fuelLiters.toFixed(1);
    const rate = context.telemetry.instantConsumptionL100.toFixed(1);
    const warning = context.telemetry.isLowFuelReserve ? ' Warning: Low fuel reserve light is active.' : '';
    return {
      action: 'check_range',
      spokenResponse: `Your estimated fuel range is ${dte} kilometers with ${liters} liters remaining. Current consumption is ${rate} liters per 100 kilometers.${warning}`
    };
  }

  // 3. Tire Pressure (TPMS)
  if (
    query.includes('tire') ||
    query.includes('tyre') ||
    query.includes('pressure') ||
    query.includes('tpms')
  ) {
    const front = context.telemetry.tpmsFront.pressureBar.toFixed(1);
    const rear = context.telemetry.tpmsRear.pressureBar.toFixed(1);
    const isFrontLow = context.telemetry.tpmsFront.isLow;
    const isRearLow = context.telemetry.tpmsRear.isLow;

    let warningText = 'Tire pressures are in optimal condition.';
    if (isFrontLow && isRearLow) {
      warningText = 'Warning: both front and rear tires are low.';
    } else if (isFrontLow) {
      warningText = 'Caution: front tire pressure is low.';
    } else if (isRearLow) {
      warningText = 'Caution: rear tire pressure is low.';
    }

    return {
      action: 'check_tpms',
      spokenResponse: `Front tire is ${front} bar. Rear tire is ${rear} bar. ${warningText}`
    };
  }

  // 4. Read incoming messages
  if (
    query.includes('message') ||
    query.includes('messages') ||
    query.includes('sms') ||
    query.includes('whatsapp') ||
    query.includes('read')
  ) {
    const unread = context.messages.find((m) => !m.isRead) || context.messages[0];
    if (!unread) {
      return {
        action: 'read_messages',
        spokenResponse: 'You have no new messages.'
      };
    }
    return {
      action: 'read_messages',
      spokenResponse: `Message from ${unread.sender} on ${unread.app}: "${unread.text}"`
    };
  }

  // 5. Music controls
  if (
    query.includes('music') ||
    query.includes('song') ||
    query.includes('next') ||
    query.includes('skip') ||
    query.includes('play')
  ) {
    return {
      action: 'next_track',
      spokenResponse: `Skipping to next track on helmet intercom.`
    };
  }

  // 6. Navigation directions / turn instruction
  if (
    query.includes('turn') ||
    query.includes('direction') ||
    query.includes('navigation') ||
    query.includes('where am i') ||
    query.includes('route')
  ) {
    const current = context.route.currentManeuver;
    const next = context.route.upcomingManeuvers[0];
    const thenText = next ? ` Then in ${next.distanceMeters} meters, ${next.instruction}.` : '';
    return {
      action: 'navigation_prompt',
      spokenResponse: `In ${current.distanceMeters} meters, ${current.instruction} onto ${current.roadName}.${thenText}`
    };
  }

  // 7. Bike Telemetry check (speed, gear, temp)
  if (
    query.includes('speed') ||
    query.includes('gear') ||
    query.includes('temperature') ||
    query.includes('temp') ||
    query.includes('telemetry')
  ) {
    const speed = context.telemetry.speedKmH;
    const gear = context.telemetry.gear === 'N' ? 'Neutral' : `gear ${context.telemetry.gear}`;
    const coolant = context.telemetry.coolantTempC;
    return {
      action: 'check_telemetry',
      spokenResponse: `Current speed is ${speed} kilometers per hour in ${gear}. Engine coolant is ${coolant} degrees Celsius.`
    };
  }

  // Default friendly Alexa answer
  return {
    action: 'unknown',
    spokenResponse: `Alexa on Kove 800X GT ready. You can ask for gas stations, fuel range, tire pressure, navigation, or messages.`
  };
}
