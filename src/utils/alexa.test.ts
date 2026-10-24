import test from 'node:test';
import assert from 'node:assert/strict';
import { processAlexaCommand } from './alexa';
import { INITIAL_TELEMETRY, DEFAULT_ROUTE, SAMPLE_POIS, SAMPLE_PLAYLIST } from './telemetry';

const mockContext = {
  telemetry: {
    ...INITIAL_TELEMETRY,
    distanceToEmptyKm: 142,
    fuelLiters: 6.4,
    instantConsumptionL100: 4.5,
    isLowFuelReserve: false,
    speedKmH: 78,
    gear: 4 as const,
    coolantTempC: 88,
    tpmsFront: { pressureBar: 2.3, pressurePsi: 33.3, tempC: 28, isLow: false },
    tpmsRear: { pressureBar: 2.5, pressurePsi: 36.2, tempC: 31, isLow: false }
  },
  route: DEFAULT_ROUTE,
  pois: SAMPLE_POIS,
  messages: [
    {
      id: 'm1',
      sender: 'Marco',
      app: 'WhatsApp' as const,
      text: 'Stelvio summit cafe meetup!',
      timestamp: '14:25',
      isRead: false
    }
  ],
  currentTrack: SAMPLE_PLAYLIST[0]
};

test('Alexa parses gas station query and returns route action', () => {
  const result = processAlexaCommand('Alexa, where is the nearest gas station?', mockContext);
  assert.equal(result.action, 'route_gas');
  assert.match(result.spokenResponse, /fuel/i);
});

test('Alexa reports fuel range and DTE accurately', () => {
  const result = processAlexaCommand('Alexa, what is my fuel range?', mockContext);
  assert.equal(result.action, 'check_range');
  assert.match(result.spokenResponse, /142 kilometers/);
  assert.match(result.spokenResponse, /6.4 liters/);
});

test('Alexa reports tire pressures with status', () => {
  const result = processAlexaCommand('Alexa, check my tire pressure', mockContext);
  assert.equal(result.action, 'check_tpms');
  assert.match(result.spokenResponse, /Front tire is 2.3 bar/);
  assert.match(result.spokenResponse, /optimal/i);
});

test('Alexa reads unread incoming message', () => {
  const result = processAlexaCommand('Alexa, read my messages', mockContext);
  assert.equal(result.action, 'read_messages');
  assert.match(result.spokenResponse, /Marco/);
  assert.match(result.spokenResponse, /Stelvio summit cafe meetup!/);
});

test('Alexa navigation prompt repeats turn directions', () => {
  const result = processAlexaCommand('Alexa, repeat navigation directions', mockContext);
  assert.equal(result.action, 'navigation_prompt');
  assert.match(result.spokenResponse, /Sharp right|Turn right/i);
});
