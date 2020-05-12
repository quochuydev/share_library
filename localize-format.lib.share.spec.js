/**
 * > npm i -g mocha
 * > mocha modules/core/share/lib/localize-format.lib.share.spec.js
 */

'use strict';

const assert = require('assert');
const LocalizeFormat = require('./localize-format.lib.share');

describe('Format currency : ', () => {

  describe('Of locale vi-VN', () => {
    const formatViCurrency = LocalizeFormat.Currency({ locale : 'vi-VN' });

    it ('should ok', () => {
      const vi_currency = formatViCurrency(1250000);
      assert.deepEqual(vi_currency, '1,250,000 ₫');
    });

    it ('should ok with custom group character', () => {
      const vi_currency = formatViCurrency(1250000, { group : '.' });
      assert.deepEqual(vi_currency, '1.250.000 ₫');
    });
  });

  describe('Of locale en-US', () => {
    
    it ('should ok', () => {
      const formatEnCurrency = LocalizeFormat.Currency({ locale : 'en-US' });
      const en_currency = formatEnCurrency(1250000);
      assert.deepEqual(en_currency, '$1,250,000.00');
    });

    it ('should allow custom currency', () => {
      const formatEnCurrency = LocalizeFormat.Currency({ locale : 'en-US', currency : 'VND' });
      const en_currency = formatEnCurrency(1250000);
      assert.deepEqual(en_currency, '₫1,250,000');
    })
  })

  describe('Of dynamic locale ja-JP', () => {
    
    it ('should ok', () => {
      const formatJpCurrency = LocalizeFormat.Currency({ locale : 'ja-JP', currency : 'JPY' });
      const jp_currency = formatJpCurrency(1250000);
      assert.deepEqual(jp_currency, '￥1,250,000');
    })
  })
});

describe('Format time : ', () => {
  const date = '2019-07-09T07:19:40.373Z';

  describe('Of locale vi-VN', () => {
    const formatViTime = LocalizeFormat.Time({ locale : 'vi-VN', timezone : 7 });

    it ('should ok', () => {
      assert.deepEqual(formatViTime(date, 'L LTS'), '09/07/2019 14:19:40');
      assert.deepEqual(formatViTime(date, 'LLLL'), 'thứ ba, 9 tháng 7 năm 2019 14:19');
    })
  })

  describe('Of locale en-US', () => {

    const formatEnTime = LocalizeFormat.Time({ locale : 'en-US', timezone : -7 });

    it ('should ok', () => {
      assert.deepEqual(formatEnTime(date, 'L LTS'), '07/09/2019 12:19:40 AM');
      assert.deepEqual(formatEnTime(date, 'LLLL'), 'Tuesday, July 9, 2019 12:19 AM');
    })
  })
})
