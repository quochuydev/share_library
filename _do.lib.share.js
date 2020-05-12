(function () {

  const Module = {
    name         : '_do',
    version      : '1.0',
    dependencies : {
      _   : { name : 'lodash' },
      _is : { name : '_is'    },
      _CONST : { name : '_CONST' },
      filterText : {},
    },
    factory      : function (di) {
      const _ = di._;

      const _do = {       
        randomPassword : function randomPassword() {
          const chars = [
            _.random(65, 90 ), // A-Z
            _.random(35, 126), // random
            _.random(35, 38 ), // special
            _.random(97, 122), // a-z
            _.random(48, 57 ), // 0 - 9
          ];

          const length = Math.ceil(8 + Math.random() * 42);

          for (let i = chars.length; i < length; i++) {
            chars.push(_.random(35, 126));
          }

          let pass = chars.map(char => String.fromCharCode(char)).join('');

          if (di._is.strongPassword(pass)) { return pass }
          else { return _do.randomPassword() }
        },
        date : {
          cast : (val) => {
            if (val instanceof Date) { return val }
            if (typeof val === 'number' || typeof val === 'string') {
              val = new Date(val);
            }
            if (Number.isNaN(val)) { throw new TypeError('Invalid date ', val) }
            return val;
          },
          min : function (date1, date2) {
            date1 = _do.date.cast(date1);
            date2 = _do.date.cast(date2);

            return date1 < date2 ? date1 : date2;
          },
          max : function (date1, date2) {
            date1 = _do.date.cast(date1);
            date2 = _do.date.cast(date2);

            return date1 > date2 ? date1 : date2;
          }
        },
        Compile(matchingPattern) {
          return function compile(template, data) {
            if (!(data && typeof data === 'object')) {
              return template;
            }
            let result = template.toString ? template.toString() : '';
            result = result.replace(matchingPattern, function (matcher) {
              var path = matcher.slice(1, -1).trim();
              return data[path];
            });
            return result;
          }
        },
        delay(ms) {
          return new Promise(resolve => {
            if (ms > 0) {
              setTimeout(resolve, ms);
            }
            return resolve();
          })
        },
        parseEventName(eventName) {
          let topic = null, action = null;

          if (typeof eventName !== 'string') {
            return [topic, action];
          }

          topic = action = '*';
      
          const name_paths = eventName.split('.');

          action = name_paths.pop();

          if (name_paths.length > 0) {
            topic = name_paths.join('.');
          }
      
          return [topic, action];
        },
        waitEvent({ emitter, resolveEvent, rejectEvents }) {
          return new Promise((resolve, reject) => {
            if (resolveEvent) {
              emitter.once(resolveEvent, data => {
                return resolve(data);
              })
            }
            if (rejectEvents) {
              for (let rejectEvent of rejectEvents) {
                emitter.once(rejectEvent, error => {
                  return reject(error);
                });
              }
            }
          })
        },
        traverse({ source = {}, match, work, paths = [], maxDepth = 10, curDepth = 0 }) {
          if (curDepth >= maxDepth) { 
            throw new Error(`Reached max depth ${maxDepth}`);
          }

          if (source && typeof source === 'object') {
            for (let key in source) {
              let value = source[key];
              if (match({ source, paths, source, key, value })) {
                work({ source, paths, key, value });
              }
              else {
                _do.traverse({ source : value, match, work, paths : [...paths, key], maxDepth, curDepth : curDepth + 1 });
              }
            }
          }
        },
        Filter: {
          /**
           * check and set filter is_deleted
           * @note mutate filter
           * 
           * @example 
           * 
           * is_deleted: undefined => is_deleted: false,
           * is_deleted: true      => is_deleted: true,
           * is_deleted: '*'       => is_deleted: undefined
           */
          isDeleted ({ filter, field = 'is_deleted' }) {
            const { _CONST } = di;
            
            if (!(filter && typeof filter === 'object')) { 
              return filter;
            }
            if (filter[field] === undefined) {
              filter[field] = false;
            }
            else if (filter[field] === _CONST.IS.ALL) {
              delete filter[field];
            }
            return filter;
          }
        },
        /**
         * Join list strings
         * @param {string[]} strings list strings will be joined
         *
         * @return {string} joined string
         *
         * @example
         * joins(['David', 'Beckham']) => 'David Beckham'
         * joinS([null, 'David']) => 'David'
         * joinS([null, undefined]) => ''
         */
        joinS(strings, delimiter = ' ', deniedValues = [null, undefined, '']) {
          let validStrings = [];
          if (Array.isArray(strings)) {
            strings.forEach(s => {
              if (!deniedValues.includes(s)) {
                validStrings.push(s);
              }
            });
          }
          return validStrings.join(delimiter);
        },
        /**
         * Parse entry filter, return key, value, maybe used to render message
         * 
         * @example
         * 
         * _do.parseEntryFilter({ entry : 'ES_LOCATION', filter : { shop_id : 100000, code_location : 'HCM_SELL' } });
         * => { field: 'code_location', key: 'code', value: 'HCM_SELL' }
         * => ERR_ENTRY_NOT_FOUND message : No location found with code HCM_SELL
         * 
         * _do.parseEntryFilter({ entry : 'ES_ORDER', filter : { shop_id : 100000, _id : 10000012305023 } });
         * => { field: '_id', key: 'id', value: 10000012305023 }
         * 
        */
        parseEntryFilter({ entry, filter }) {
          const { _CONST } = di;
          
          switch (entry) {
            case _CONST.ENTRY.ES.LOCATION : {
              if (filter.id) { return { field: 'id', key: 'id', value: filter.id }}
              if (filter.code_location) { return { field: 'code_location', key: 'code', value: filter.code_location} }
            }
            default: {
              if (filter.id) { return { field: 'id', key: 'id', value: filter.id }}
              if (filter._id) { return { field: '_id', key: 'id', value: filter.id }}
              return { field: null, key: 'filter', value: JSON.stringify(filter) }
            }
          }
        },
        removeCustomerKeys({ data }) {
          const filterText = di.filterText;

          if (Array.isArray(filterText.customer_keys)) {
            for (let key of filterText.customer_keys) {
              data[key] = undefined;
            }
          }

          return data;
        },
        keepOldCustomerKeysData({ data, oldData }) {
          const filterText = di.filterText;

          if (Array.isArray(filterText.customer_keys)) {
            for (let key of filterText.customer_keys) {
              data[key] = oldData[key];
            }
          }

          return data;
        },
        getOrderInvoiceBarcode({ order }) {
          let last_order_number = _.get(order, 'etp.last_order_number');

          return last_order_number || order._id;          
        },
        getShippingFee(order) {
          return _.get(order, 'shipping_lines[0].price', 0);
        },
        getActivityInfo({ code }) {
          const { ACTIVITY, ACTIVITY_INFO } = di._CONST;
          return ACTIVITY_INFO[code] || ACTIVITY_INFO[ACTIVITY.UNKNOWN];
        }
      };

      _do.compile = _do.Compile(/{.+?}/g);

      return _do;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    const path = require('path');

    di._           = require('lodash');
    di._is         = require('./_is.lib.share.js');
    di._CONST      = require('./_CONST.lib.share');
    di.filterText = require(path.resolve('./config/settings/filter_text.js'));

    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();