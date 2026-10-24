import test from 'node:test';
import assert from 'node:assert/strict';
import {
  ANDROID_PHONE_PROFILES,
  COLOVE_800X_VARIANTS,
  getProtocolsForBrand,
  getBrandGuideInstructions,
  getStreamingPerformance
} from './androidMirroring';

test('ANDROID_PHONE_PROFILES contains all major Android phone brands', () => {
  const brands = ANDROID_PHONE_PROFILES.map((p) => p.brand);
  assert.ok(brands.includes('Samsung'));
  assert.ok(brands.includes('Google Pixel'));
  assert.ok(brands.includes('Xiaomi / POCO'));
  assert.ok(brands.includes('OnePlus / OPPO'));
  assert.ok(brands.includes('Motorola'));
  assert.ok(brands.includes('Universal Android'));
});

test('COLOVE_800X_VARIANTS includes GT, Pro, and Rally editions', () => {
  const ids = COLOVE_800X_VARIANTS.map((v) => v.id);
  assert.ok(ids.includes('Colove 800X GT'));
  assert.ok(ids.includes('Colove 800X Pro'));
  assert.ok(ids.includes('Colove 800X Rally'));
});

test('getProtocolsForBrand returns brand-appropriate native casting protocol', () => {
  const samsungProtocols = getProtocolsForBrand('Samsung');
  assert.ok(samsungProtocols.includes('Samsung Smart View'));

  const pixelProtocols = getProtocolsForBrand('Google Pixel');
  assert.ok(pixelProtocols.includes('Google Cast / Miracast'));

  const xiaomiProtocols = getProtocolsForBrand('Xiaomi / POCO');
  assert.ok(xiaomiProtocols.includes('HyperOS Wireless Display'));

  const oneplusProtocols = getProtocolsForBrand('OnePlus / OPPO');
  assert.ok(oneplusProtocols.includes('OxygenOS Screencast'));

  const motoProtocols = getProtocolsForBrand('Motorola');
  assert.ok(motoProtocols.includes('Motorola Ready For'));
});

test('getBrandGuideInstructions returns valid instructions for any Android brand', () => {
  const samsungGuide = getBrandGuideInstructions('Samsung');
  assert.match(samsungGuide.quickSettingName, /Smart View/i);

  const pixelGuide = getBrandGuideInstructions('Google Pixel');
  assert.match(pixelGuide.quickSettingName, /Cast/i);

  const xiaomiGuide = getBrandGuideInstructions('Xiaomi / POCO');
  assert.match(xiaomiGuide.quickSettingName, /Wireless Display/i);

  const universalGuide = getBrandGuideInstructions('Universal Android');
  assert.match(universalGuide.quickSettingName, /Wireless Projection|CarbitLink/i);
});

test('getStreamingPerformance calculates correct framerate and latency for 60fps low latency', () => {
  const lowLatency = getStreamingPerformance('low_latency_60fps');
  assert.equal(lowLatency.fps, 60);
  assert.equal(lowLatency.latencyMs, 18);

  const highDef = getStreamingPerformance('high_definition');
  assert.equal(highDef.fps, 30);
  assert.equal(highDef.latencyMs, 35);
});
