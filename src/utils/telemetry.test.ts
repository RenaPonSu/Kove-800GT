import test from 'node:test';
import assert from 'node:assert/strict';
import {
  checkTirePressureWarning,
  estimateFuelRange,
  calculateGear,
  formatDistance,
  formatSeconds,
  calculateLeanRating,
  getSamsungS23AspectTransform,
  calculateLeanFromDeviceOrientation,
  generateCustomRoute,
  calculateDistanceToEmpty,
  calculateInstantConsumption
} from './telemetry';

test('checkTirePressureWarning detects normal, low, and critical pressure', () => {
  // Front nominal (2.1 - 2.5 bar)
  const frontNominal = checkTirePressureWarning(2.3, true);
  assert.equal(frontNominal.isWarning, false);
  assert.equal(frontNominal.isCritical, false);

  // Front low warning
  const frontLow = checkTirePressureWarning(1.7, true);
  assert.equal(frontLow.isWarning, true);

  // Rear critical
  const rearCritical = checkTirePressureWarning(1.4, false);
  assert.equal(rearCritical.isWarning, true);
  assert.equal(rearCritical.isCritical, true);

  // High pressure warning
  const rearHigh = checkTirePressureWarning(3.4, false);
  assert.equal(rearHigh.isWarning, true);
});

test('estimateFuelRange calculates realistic range from liters and consumption', () => {
  // 19L tank, 4.5L/100km -> ~422 km
  const fullRange = estimateFuelRange(19, 4.5);
  assert.equal(fullRange, 422);

  // Empty tank
  const emptyRange = estimateFuelRange(0, 4.5);
  assert.equal(emptyRange, 0);

  // Zero consumption edge case
  const zeroConsumption = estimateFuelRange(10, 0);
  assert.equal(zeroConsumption, 0);
});

test('calculateGear maps motorcycle speed and RPM accurately', () => {
  // Neutral at stop
  assert.equal(calculateGear(0, 1400), 'N');

  // 1st gear (approx 20 km/h @ 4000 rpm -> ratio ~5)
  assert.equal(calculateGear(20, 4000), 1);

  // 4th gear (approx 74 km/h @ 4000 rpm -> ratio ~18.5)
  assert.equal(calculateGear(74, 4000), 4);

  // 6th gear cruising on highway (120 km/h @ 4200 rpm -> ratio ~28.5)
  assert.equal(calculateGear(120, 4200), 6);
});

test('formatDistance formats meters and kilometers properly', () => {
  assert.equal(formatDistance(350), '350 m');
  assert.equal(formatDistance(1250), '1.3 km');
  assert.equal(formatDistance(24200), '24.2 km');
});

test('formatSeconds formats track and call duration properly', () => {
  assert.equal(formatSeconds(65), '1:05');
  assert.equal(formatSeconds(210), '3:30');
  assert.equal(formatSeconds(9), '0:09');
});

test('calculateLeanRating categorizes motorcycle lean angle properly', () => {
  assert.equal(calculateLeanRating(5).rating, 'Upright');
  assert.equal(calculateLeanRating(18).rating, 'Moderate');
  assert.equal(calculateLeanRating(30).rating, 'Spirited');
  assert.equal(calculateLeanRating(40).rating, 'Aggressive');
  assert.equal(calculateLeanRating(-48).rating, 'Limit');
});

test('getSamsungS23AspectTransform provides portrait rally and landscape modes', () => {
  const rally = getSamsungS23AspectTransform('portrait_rally');
  assert.equal(rally.orientation, 'portrait');
  assert.equal(rally.aspectClass, 'aspect-[9/16]');

  const touring = getSamsungS23AspectTransform('landscape_touring');
  assert.equal(touring.orientation, 'landscape');
  assert.equal(touring.aspectClass, 'aspect-[16/9]');
});

test('calculateLeanFromDeviceOrientation clamps and converts sensor roll', () => {
  assert.equal(calculateLeanFromDeviceOrientation(15, null, 'portrait_rally'), 15);
  assert.equal(calculateLeanFromDeviceOrientation(-35, null, 'portrait_rally'), -35);
  assert.equal(calculateLeanFromDeviceOrientation(70, null, 'portrait_rally'), 55); // clamped
  assert.equal(calculateLeanFromDeviceOrientation(null, 25, 'landscape_touring'), 25);
  assert.equal(calculateLeanFromDeviceOrientation(null, null, 'portrait_rally'), 0);
});

test('generateCustomRoute creates valid turn-by-turn route', () => {
  const route = generateCustomRoute('Gavia Pass');
  assert.equal(route.destinationName, 'Gavia Pass');
  assert.ok(route.totalDistanceKm > 0);
  assert.ok(route.currentManeuver.instruction.includes('Gavia Pass'));
  assert.ok(route.upcomingManeuvers.length >= 2);
});

test('calculateDistanceToEmpty returns accurate distance-to-empty based on consumption', () => {
  // 14.8 L available @ 4.4 L/100km -> ~336 km
  assert.equal(calculateDistanceToEmpty(14.8, 4.4), 336);
  // Full 19.0 L tank @ 4.0 L/100km -> 475 km
  assert.equal(calculateDistanceToEmpty(19.0, 4.0), 475);
  // Reserve 3.5 L @ 4.5 L/100km -> ~78 km
  assert.equal(calculateDistanceToEmpty(3.5, 4.5), 78);
  // Empty tank -> 0 km
  assert.equal(calculateDistanceToEmpty(0, 4.4), 0);
});

test('calculateInstantConsumption calculates real-time rate from speed and RPM', () => {
  // Stationary idle (0 km/h) -> 0.0 L/100km
  assert.equal(calculateInstantConsumption(0, 1400), 0.0);
  // Cruising at 74 km/h in 4th gear (~5200 rpm)
  const cruising = calculateInstantConsumption(74, 5200);
  assert.ok(cruising >= 3.8 && cruising <= 6.5);
  // High load acceleration at 100 km/h with high rpm (9000)
  const acceleration = calculateInstantConsumption(100, 9000);
  assert.ok(acceleration > cruising);
});

