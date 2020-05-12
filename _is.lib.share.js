(function () {

  const Module = {
    name         : '_is',
    version      : '1.0',
    dependencies : {
      _ : { name : 'lodash' },
      _regex : {},
      filterText: {},
      _CONST: {},
    },
    factory      : function factory(di) {
      const _ = di._;

      const _is = {
        /**
         * @case Đăng nhập
         * 
         * @description
         * Đúng chuẩn (có @).
         * - Phần tên: Cho phép nhập tối đa 64 ký tự chữ (A-Z, a-z), số (0-9), gạch dưới (_), gạch ngang (-), dấu chấm (.)
         * - Phần domain: Cho phép ký tự chữ (A-Z, a-z), số (0-9), gạch ngang (-), dấu chấm (.)"
         * 
         * @note more generic regex : /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/
         * 
         * is that email valid ?
         * @param {*} val
         * 
         * @return {boolean}
         * 
         */
        email : function (val) {
          const _regex = di._regex;

          if (!(typeof val === 'string' && val.length >= 3)) {
            return false;
          }
    
          if (!_regex.email.test(val)) {
            return false;
          }

          if (val.split('@')[0].length > 64) {
            return false;
          }

          return true;
        },
        phone : function (val) {
          const _regex = di._regex;

          if (!_is.filledString(val)) {
            return false;
          }
    
          return _regex.phone.test(val);
        },
        isoDate(val) {
          const _regex = di._regex;
          if (!_is.filledString(val)) {
            return false;
          }
          if (!_regex.isoDate.test(val)) {
            return false;
          }
          if (Number.isNaN(new Date(val).getMilliseconds())) {
            return false;
          }
          return true;
        },
        isoDateTime(val) {
          const _regex = di._regex;
          if (!_is.filledString(val)) {
            return false;
          }
          if (!_regex.isoDateTime.test(val)) {
            return false;
          }
          if (Number.isNaN(new Date(val).getMilliseconds())) {
            return false;
          }
          return true;
        },
        /**
         * @case Đăng nhập
         * @description 1 =< Mật khẩu =< 50
         * 
         * is that password checkable 
         * @param {*} val 
         * 
         */
        checkablePassword : function (val) {
          return (typeof val === 'string' && val.length >= 1 && val.length <= 50);
        },
        /**
         * @case Chỉnh sửa User, Đổi mật khẩu
         * 
         * @description
         * 8 =< Mật khẩu mới =< 50 
         * Mật khẩu phải bao gồm các ký tự: in hoa, chữ thường, chữ số, ký tự đặc biệt
         * Không chấp nhận kí tự khoảng trắng.
         * 
         * @note too slow, need improve performance
         * 
         * is that password strong enough ?
         * @param {string} val 
         * 
         */
        strongPassword : function (val) {
          if (!(typeof val === 'string' && val.length >= 8 && val.length <= 50)) {
            return false;
          }
          if (!/[A-Z]+/.test(val)) {
            return false;
          }
          if (!/[a-z]+/.test(val)) {
            return false;
          }
          if (!/[0-9]+/.test(val)) {
            return false;
          }
          if (!/[^A-Z|a-z|0-9]+/.test(val)) {
            return false;
          }
          if (val.includes(' ')) {
            return false;
          }
          return true;
        },
        retry (error) {
          if (!error) {
            return true;
          }
          if (Array.isArray(error.reactions) && error.reactions.some(reaction => /RETRY/gi.test(reaction))) {
            return true;
          }
          if (error.message && /RETRY/gi.test(error.message)) {
            return true;
          }
          return false;
        },
        retryableLog({ log }) {
          const _CONST = di._CONST;

          return log && log.status === _CONST.PROCESS.STATUS.FAILED && _is.retry(log.error);
        },
        matchPattern(patterns, val) {
          if (typeof patterns === 'string') {
            patterns = [patterns];
          }
          if (Array.isArray(patterns)) {
            return patterns.some(pattern => pattern === val || new RegExp(pattern).test(val));
          }
          return false;
        },
        order : {
          cod (order) {
            return order && order.gateway_code && ['cod'].includes(order.gateway_code.toLowerCase());
          },
          paid(order) {
            return order.financial_status === 'paid';
          },
          receiveOnStore(order) {
            return order && Array.isArray(order.shipping_lines) && order.shipping_lines.some(shipping_line => {
              return shipping_line.code && String(shipping_line.code).toLowerCase() === 'nhận tại cửa hàng';
            });
          }
        },
        user : {
          admin (user) {
            return _is.user.adapter(user) || user.userType === "user_admin";
          },
          normal (user) {
            return user.userType === "user_normal";
          },
          location (user) {
            return user.userType === "user_location";
          },
          store (user) {
            return user.userType === "user_store";
          },
          adapter (user) {
            return user.isAdapter || user.userType === "user_adapter";
          }
        },
        filledString(val, minLength = 1, maxLength = null) {
          if (!(typeof val === 'string' || val instanceof String)) {
            return false;
          }
          if (minLength > 0 && val.length < minLength) {
            return false;
          }
          if (maxLength > 0 && val.length > maxLength) {
            return false;
          }
          return true;
        },
        filledArray(val) {
          return (Array.isArray(val) && val.length > 0)
        },
        mongoDuplicateKeyError(error) {
          return error.code === 11000 || error.codeName === "DuplicateKey";
        },
        customerKey(field) {
          const filterText = di.filterText;

          return field && Array.isArray(filterText.customer_keys) && filterText.customer_keys.includes(field);
        },
        discountShipping(discount) {
          return discount && discount.type === 'shipping';
        },
        hasReaction({ error, reaction }) {
          return error && (error.reaction === reaction || (Array.isArray(error.reactions) && error.reactions.includes(reaction)));
        },
        connectETP() {
          return di.filterText && di.filterText.app_filter === "MEOS";
        },
        discountFreeShip(discount) {
          return discount && discount.type === 'shipping';
        }
      };
  
      return _is;
    }
  };

  //-------------------------------------- FACTORING ----------------------------------------//
  let di = {};
  if (typeof module === 'object' && module.exports) {
    const path = require('path');
    
    di._ = require('lodash');
    di._regex = require('./_regex.lib.share');
    di._CONST = require('./_CONST.lib.share');
    di.filterText = require(path.resolve('./config/settings/filter_text.js'));
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();