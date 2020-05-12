(function () {

  const Module = {
    name    : '_to',
    version : '1.0',
    dependencies : {
      _do : { type : 'object' },
      _is : { type : 'object' },
      _CONST : { type : 'object' },
    },
    factory : function (di) {
      const _to = {
        date (val) {
          if (val && typeof val === 'string' || typeof val === 'number') {
            val = new Date(val);
          }
          if (val instanceof Date && !Number.isNaN(val.getMilliseconds())) {
            return val;
          }
          return null;
        },
        lastDate(from, msAgo) {
          let last_date = _to.date(from);

          if (last_date) {
            last_date = new Date(last_date);
            last_date.setMilliseconds(last_date.getMilliseconds() - msAgo);
          }

          return last_date;
        },
        featureDate(from, toMS) {
          return _to.lastDate(from, -toMS);
        },
        maxDate(...dates) {
          let max_date = null;

          for (let date of dates) {
            if (!date) { continue }
            date = _to.date(date);
            if (!date) { continue }
            if (max_date === null || date > max_date) {
              max_date = date;
            }
          }

          return max_date;
        },
        minDate(...dates) {
          let min_date = null;

          for (let date of dates) {
            if (!date) { continue }
            date = _to.date(date);
            if (!date) { continue }
            if (min_date === null || date < min_date) {
              min_date = date;
            }
          }

          return min_date;
        },
        utc7(val) {
          let date = _to.date(val);
          if (date) {
            date = new Date(date);
            date.setHours(date.getHours() + 7);
          }
          return date;
        },
        timestamp(val) {
          const date = _to.date(val);
          if (date) {
            return date.getTime();
          }
        },
        json(obj) {
          return JSON.parse(JSON.stringify(obj));
        },
        CODE({ ns = [], delimiter = '.', format }) {
          if (Array.isArray(ns)) {
            ns = ns.join(delimiter);
          }

          let prefix = '';

          if (typeof ns === 'string' && ns.length > 0) {
            prefix = ns + delimiter;
          }

          return function toCode(...paths) {
            let code = prefix + paths.join(delimiter);

            if (typeof format === 'function') {
              code = format(code);
            }

            return code;
          }
        },
        order_event_history_actions_map : {
          ASSIGNED_EMPLOYEE : 'assigned_user',
          PAYMENT_CONFIRMED : 'financial_confirm',
          CONFIRMED : 'update_status',
          CONFIRMED_AND_ASSIGNED_STORE: 'confirmed_and_assigned_store',
          ASSIGNED_STORE: 'assigned_store',
          STOCK_ON_HAND: 'update_status',
          OUT_OF_STOCK: 'update_status',
          WAITING_FOR_OUTPUT: 'update_status',
          OUTPUTTED: 'update_status',
          CARRIER_DELIVERED: 'update_status',
          CANCELLED_AND_RESTOCKED: 'cancel_order',
          CANCELLED: 'cancel_order',
        },
        orderAction(eventName) {
          const { _do } = di;

          const [topic, action] = _do.parseEventName(eventName);
      
          if (action) {
            return _to.order_event_history_actions_map[action.toUpperCase()];
          }
          
          return null;
        },
        client : { 
          error : {
            messages(requestError, defaultMessage) {
              let messages = [];

              let error = requestError;

              let body = requestError.data;

              if (body && typeof body === 'object' && Object.keys(body).length > 0) {
                error = body;
              }

              if (error.message) {
                messages.push(error.message);
              }
              else if (Array.isArray(error.messages)) {
                messages.push(...error.messages);
              }
              else if (error.code) {
                messages.push('Có lỗi xảy ra, mã lỗi : ' + error.code);
              }
              else {
                messages.push(defaultMessage);
              }

              return messages;
            },
            message(requestError, defaultMessage) {
              return _to.client.error.messages(requestError, defaultMessage).join('\n');
            }
          }
        },
        /**
         * split array to multi patches by size
         * @param {array} array 
         * @param {number} size 
         * 
         * @example
         * 
         * _to.multiPatches([1, 2, 3, 4, 5, 6, 7], 3);
         * => [
         *  [1, 2, 3],
         *  [4, 5, 6],
         *  [7]
         * ]
         * 
         */
        multiPatches(array, size) {
          const patches = [];

          if (Array.isArray(array)) {
            let patch = [];

            for (let i = 0; i < array.length; i++) {
              patch.push(array[i]);

              if (patch.length >= size || i + 1 >= array.length) {
                patches.push(patch);
                patch = [];
              }
            }
          }

          return patches;
        },
        fulfillments_carrier_status_position (carrier_status_code) {
          carrier_status_code = String(carrier_status_code).toLowerCase();
          switch (carrier_status_code) {
            case "pending":
              return 0;
            case "readytopick":
              return 1;
            case "picking":
              return 2;
            case "delivering":
              return 3;
            case "notmeetcustomer":
              return 4;
            case "waitingforreturn":
              return 5;
            case "delivered":
              return 6;
            case "cancel":
              return 7;
            case "return":
              return 8;
            default:
              return 0;
          }
        },
        financial_status_position (financial_status) {
          switch (financial_status) {
            case "pending":
              return 0;
            case "partially_paid":
            case "partiallypaid":
              return 1;
            case "paid":
              return 2;
            case "partially_refunded":
            case  "partiallyrefunded":
              return 3;
            case "refunded":
              return 4;
            case "voided":
              return 5;
            default:
              return 0;
          }
        },
        user: {
          inLocations({ user, type }) {
            const { _is } = di;

            let in_locations = null;

            if (_is.user.store(user) || _is.user.location(user)) {
              if (Array.isArray(user.in_locations)) {
                in_locations = user.in_locations;
                if (type) {
                  in_locations = in_locations.map(item => type(item));
                }
              }
            }
            
            return in_locations;
          },
          eventData(user) {
            const { _is } = di;

            if (_is.user.adapter(user)) {
              return { user_id: user._id, user };
            }
            return { user_id: user._id };
          }
        }
      };

      return _to;
    }
  };

  //------------------------------ FACTORING ---------------------------//
  let di = {};
  if (typeof module === 'object' && module.exports) {
    di._do = require('./_do.lib.share');
    di._is = require('./_is.lib.share');
    di._CONST = require('./_CONST.lib.share');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();