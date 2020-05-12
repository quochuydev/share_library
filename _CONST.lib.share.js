(function () {

  const Module = {
    name: '_CONST',
    version: '1.0',
    factory: function () {

      const _CONST = {
        IS: {
          TRUE: true,
          FALSE: false,
          ALL: '*'
        },
        ENTRY: {
          ES: {
            ORDER: 'ES_ORDER',
            USER: 'ES_USER',
            PRODUCT: 'ES_PRODUCT',
            VARIANT: 'ES_VARIANT',
            LOCATION: 'ES_LOCATION',
            CUSTOMER: 'ES_CUSTOMER',
            CUSTOMER_PHONE: 'ES_CUSTOMER_PHONE',
            CUSTOMER_EMAIL: 'ES_CUSTOMER_EMAIL',
            CUSTOMER_ADDRESS: 'ES_CUSTOMER_ADDRESS',
            COUNTRY: 'ES_COUNTRY',
            PROVINCE: 'ES_PROVINCE',
            DISTRICT: 'ES_DISTRICT',
            WARD: 'ES_WARD'
          },
        },
        get ENTRY_NAME() {
          return {
            [_CONST.ENTRY.ES.ORDER] : 'order',
            [_CONST.ENTRY.ES.USER] : 'user',
            [_CONST.ENTRY.ES.PRODUCT] : 'product',
            [_CONST.ENTRY.ES.VARIANT] : 'variant',
            [_CONST.ENTRY.ES.LOCATION] : 'location',
            [_CONST.ENTRY.ES.CUSTOMER] : 'customer',
            [_CONST.ENTRY.ES.CUSTOMER_ADDRESS] : 'customer address',
            [_CONST.ENTRY.ES.CUSTOMER_PHONE] : 'customer phone',
            [_CONST.ENTRY.ES.CUSTOMER_EMAIL] : 'customer email',
            [_CONST.ENTRY.ES.COUNTRY] : 'country',
            [_CONST.ENTRY.ES.PROVINCE] : 'province',
            [_CONST.ENTRY.ES.DISTRICT] : 'district',
            [_CONST.ENTRY.ES.WARD] : 'ward',
          }
        },
        SERVICE_CODES: {
          SELLER: 'SV_SELLER',
          ETPConnect: 'ETPConnect',
        },
        PROCESS: {
          STATUS: {
            IDLE: 'IDLE',
            RUNNING: 'RUNNING',
            FINISHED: 'FINISHED',
            MIS_CONDITION: 'MIS_CONDITION',
            TEMPORARILY_FAILED: 'TEMPORARILY_FAILED',
            FAILED: 'FAILED',
          },
          get STATUS_LIST () {
            return Object.values(_CONST.PROCESS.STATUS)
          },
          ORDER : {
            AUTO_TOOL : {
              AUTO_VERIFY: 'auto_verify',
              POS_USER_ASSIGNED : 'pos_user_assigned',
              POS_CONFIRMED : 'pos_confirmed',
              POS_STORE_ASSIGNED : 'pos_store_assigned',
              AUTO_ASSIGNED_STORE_WHEN_POS_OUTPUT : 'auto_assigned_store_when_pos_out',
              AUTO_POS_STOCK_ON_HAND : 'auto_pos_stock_on_hand',
              AUTO_POS_WAITING_FOR_OUTPUT : 'auto_pos_waiting_for_output',
              AUTO_POS_OUTPUT : 'auto_pos_output',
              POS_DELIVERING_NVC : 'pos_delivering_nvc',
              POS_DELIVERING_SELF : 'pos_delivering_self',
              POS_CANCEL_RESTOCK : 'pos_cancel_restock',
            }
          }
        },
        USER: {
          SYSTEM: 'SYSTEM'
        },
        ALERT_PROCESS_CODES : {
          API_NVC_SELLER : 'API_NVC_SELLER',
          ORDER_AUTO_PROCESS_ERROR : 'ORDER_AUTO_PROCESS_ERROR',
          ORDER_AUTO_PROCESS_NOT_RUN : 'ORDER_AUTO_PROCESS_NOT_RUN',
          INVENTORY_LEAK : 'INVENTORY_LEAK',
          ORDER_DIVIDE_ERROR : 'ORDER_DIVIDE_ERROR',
          SYNC_PRODUCT : 'SYNC_PRODUCT',
          SYNC_CUSTOMER_FAIL : 'SYNC_CUSTOMER_FAIL',
          SYNC_INVENTORY : 'SYNC_INVENTORY',
          SYNC_CUSTOMER : 'SYNC_CUSTOMER',
          SYNC_ORDER : 'SYNC_ORDER',
          REQUEST_FAILED_BY_SERVER: 'REQUEST_FAILED_BY_SERVER',
          SYNC_ORDER_TO_ETP: 'SYNC_ORDER_TO_ETP',
          SYNC_CUSTOMER_TO_ETP: 'SYNC_CUSTOMER_TO_ETP',
        },
        ALERT_PROCESS_TYPE : {
          IMMEDIATELY : 'IMMEDIATELY',
          SCHEDULE : 'SCHEDULE'
        },
        get ALERT_PROCESSES() {
          return {
            [_CONST.ALERT_PROCESS_CODES.API_NVC_SELLER] : {
              name : 'Lỗi giao nhà vận chuyển',
              value : _CONST.ALERT_PROCESS_CODES.API_NVC_SELLER,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_ERROR] : {
              name : 'Tự động xử lý đơn hàng lỗi',
              value : _CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_ERROR,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_NOT_RUN] : {
              name : 'Không tự động xử lý đơn hàng',
              value : _CONST.ALERT_PROCESS_CODES.ORDER_AUTO_PROCESS_NOT_RUN,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.INVENTORY_LEAK] : {
              name : 'Lệch tồn kho',
              value : _CONST.ALERT_PROCESS_CODES.INVENTORY_LEAK,
              type : _CONST.ALERT_PROCESS_TYPE.SCHEDULE,
            },
            [_CONST.ALERT_PROCESS_CODES.ORDER_DIVIDE_ERROR] : {
              name : 'Tách đơn hàng lỗi',
              value : _CONST.ALERT_PROCESS_CODES.ORDER_DIVIDE_ERROR,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY, 
            },
            [_CONST.ALERT_PROCESS_CODES.SYNC_PRODUCT] : {
              name : 'Đồng bộ sản phẩm lỗi',
              value : _CONST.ALERT_PROCESS_CODES.SYNC_PRODUCT,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.SYNC_CUSTOMER_FAIL] : {
              name : 'Đồng bộ khách hàng lỗi',
              value : _CONST.ALERT_PROCESS_CODES.SYNC_CUSTOMER_FAIL,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.REQUEST_FAILED_BY_SERVER] : {
              name : 'Lỗi hệ thống khi xử lý API',
              value : _CONST.ALERT_PROCESS_CODES.REQUEST_FAILED_BY_SERVER,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.SYNC_ORDER_TO_ETP] : {
              name : 'Lỗi đồng bộ đơn hàng lên ETP',
              value : _CONST.ALERT_PROCESS_CODES.SYNC_ORDER_TO_ETP,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
            [_CONST.ALERT_PROCESS_CODES.SYNC_CUSTOMER_TO_ETP] : {
              name : 'Lỗi đồng bộ khách hàng lên ETP',
              value : _CONST.ALERT_PROCESS_CODES.SYNC_CUSTOMER_TO_ETP,
              type : _CONST.ALERT_PROCESS_TYPE.IMMEDIATELY,
            },
          }
        },
        get ALERT_PROCESS_LIST() {
          return Object.values(_CONST.ALERT_PROCESSES);
        },
        get ALERT_PROCESS_LIST_WITH_TYPE() {
          return _CONST.ALERT_PROCESS_LIST.map(item => {
            item.name = item.name + (item.type === 'SCHEDULE' ? ' (Theo thời gian)' : ' (Gửi lập tức)');
            return item;
          });
        },
        INVENTORY_REASON_CODES : {
          NEW_PRODUCT: "newproduct",
          RETURNED: "returned",
          PRODUCTION_OF_GOODS: "productionofgoods",
          DAMAGED: "damaged",
          SHRINK_AGE: "shrinkage",
          PROMOTION: "promotion",
          TRANSFER: "transfer"
        },
        get INVENTORY_REASONS_LIST () {
          return {
            [_CONST.INVENTORY_REASON_CODES.NEW_PRODUCT]: {
              name: 'Sản phẩm mới',
              value: _CONST.INVENTORY_REASON_CODES.NEW_PRODUCT
            },
            [_CONST.INVENTORY_REASON_CODES.RETURNED]: {
              name: 'Hoàn trả',
              value: _CONST.INVENTORY_REASON_CODES.RETURNED
            },
            [_CONST.INVENTORY_REASON_CODES.PRODUCTION_OF_GOODS]: {
              name: 'Sản xuất thêm',
              value: _CONST.INVENTORY_REASON_CODES.PRODUCTION_OF_GOODS
            },
            [_CONST.INVENTORY_REASON_CODES.DAMAGED]: {
              name: 'Hư hỏng',
              value: _CONST.INVENTORY_REASON_CODES.DAMAGED
            },
            [_CONST.INVENTORY_REASON_CODES.SHRINK_AGE]: {
              name: 'Hao hụt',
              value: _CONST.INVENTORY_REASON_CODES.SHRINK_AGE
            },
            [_CONST.INVENTORY_REASON_CODES.PROMOTION]: {
              name: 'Khuyến mãi',
              value: _CONST.INVENTORY_REASON_CODES.PROMOTION
            },
            [_CONST.INVENTORY_REASON_CODES.TRANSFER]: {
              name: 'Điểu chuyển',
              value: _CONST.INVENTORY_REASON_CODES.TRANSFER
            }
          }
        },
        INVENTORY_TYPE_UPDATE : {
          ADJUST: 'adjust',
          SET: 'set'
        },
        EVENT : {
          BUS : {
            DIRECT : 'DIRECT',
            EXCHANGE : 'EXCHANGE'
          }
        },
        SYNC_STATUS: {
          NOT_SYNC: 'NOT_SYNC',
          SYNCING: 'SYNCING',
          SYNCED: 'SYNCED',
          MISSED_CONDITION: 'MISSED_CONDITION',
          FAILED: 'FAILED'
        },
        get SYNC_ABLE_STATUSES() {
          return [_CONST.SYNC_STATUS.NOT_SYNC, _CONST.SYNC_STATUS.FAILED, _CONST.SYNC_STATUS.MISSED_CONDITION];
        },
        get SYNC_STATUS_LIST() {
          Object.values(_CONST.SYNC_STATUS)
        },
        UPDATE_INVENTORY_TYPE: {
          ADJUST: 'adjust',
          SET: 'set'
        },
        WEBHOOK_TOPIC: {
          ORDER_CREATE: 'ORDER_CREATE',
          ORDER_UPDATE: 'ORDER_UPDATE',
          ORDER_CANCEL: 'ORDER_CANCEL',
          ORDER_UPDATE_STATUS: 'ORDER_UPDATE_STATUS',
          ORDER_UPDATE_INVOICE: 'ORDER_UPDATE_INVOICE',
          CUSTOMER_CREATE: 'CUSTOMER_CREATE',
          CUSTOMER_UPDATE_INFO: 'CUSTOMER_UPDATE_INFO',
          CUSTOMER_UPDATE_ADDRESS: 'CUSTOMER_UPDATE_ADDRESS'
        },
        get WEBHOOK_TOPIC_LIST(){
          return {
            [_CONST.WEBHOOK_TOPIC.ORDER_CREATE]: {
              value: _CONST.WEBHOOK_TOPIC.ORDER_CREATE,
              name: 'Tạo mới đơn hàng'
            },
            [_CONST.WEBHOOK_TOPIC.ORDER_CANCEL]: {
              value: _CONST.WEBHOOK_TOPIC.ORDER_CANCEL,
              name: 'Hủy đơn hàng'
            },
            [_CONST.WEBHOOK_TOPIC.ORDER_UPDATE]: {
              value: _CONST.WEBHOOK_TOPIC.ORDER_UPDATE,
              name: 'Cập nhật thông tin đơn hàng'
            },
            [_CONST.WEBHOOK_TOPIC.ORDER_UPDATE_STATUS]: {
              value: _CONST.WEBHOOK_TOPIC.ORDER_UPDATE_STATUS,
              name: 'Cập nhật trạng thái đơn hàng'
            },
            [_CONST.WEBHOOK_TOPIC.ORDER_UPDATE_INVOICE]: {
              value: _CONST.WEBHOOK_TOPIC.ORDER_UPDATE_INVOICE,
              name: 'Cập thông tin xuất hóa đơn'
            },
            [_CONST.WEBHOOK_TOPIC.CUSTOMER_CREATE]: {
              value: _CONST.WEBHOOK_TOPIC.CUSTOMER_CREATE,
              name: 'Tạo mới khách hàng'
            },
            [_CONST.WEBHOOK_TOPIC.CUSTOMER_UPDATE_INFO]: {
              value: _CONST.WEBHOOK_TOPIC.CUSTOMER_UPDATE_INFO,
              name: 'Cập nhật thông tin khách hàng'
            },
            [_CONST.WEBHOOK_TOPIC.CUSTOMER_UPDATE_ADDRESS]: {
              value: _CONST.WEBHOOK_TOPIC.CUSTOMER_UPDATE_ADDRESS,
              name: 'Cập nhật địa chỉ khách hàng'
            },
          }
        }
      };

      const ACTIVITY = {
        UNKNOWN: 'UNKNOWN',
        REQUEST: {
          ADAPTER: {
            CREATE_PRODUCT: 'REQUEST.ADAPTER.CREATE_PRODUCT',
            UPDATE_PRODUCT_PRICE: 'REQUEST.ADAPTER.UPDATE_PRODUCT_PRICE',
            UPDATE_INVENTORY: 'REQUEST.ADAPTER.UPDATE_INVENTORY',
            PROCESS_ORDER: 'REQUEST.ADAPTER.PROCESS_ORDER',
            UPDATE_CUSTOMER_INFO: 'REQUEST.ADAPTER.UPDATE_CUSTOMER_INFO',
          }
        },
        ORDER_SERVICE: {
          ETP: {
            CREATE: 'ORDER_SERVICE.ETP.CREATE',
            CANCEL: 'ORDER_SERVICE.ETP.CANCEL',
            UPDATE_INVOICE: 'ORDER_SERVICE.ETP.UPDATE_INVOICE',
          }
        },
        CUSTOMER_SERVICE: {
          ETP: {
            CREATE: 'CUSTOMER_SERVICE.ETP.CREATE',
            UPDATE_INFO: 'CUSTOMER_SERVICE.ETP.UPDATE_INFO',
            UPDATE_ADDRESS: 'CUSTOMER_SERVICE.ETP.UPDATE_ADDRESS',
          }
        }
      };

      const ACTIVITY_INFO = {
        [ACTIVITY.UNKNOWN]: {
          name: 'Không xác định'
        },
        [ACTIVITY.ORDER_SERVICE.ETP.CREATE]: {
          name: 'Tạo mới đơn hàng trên ETP'
        },
        [ACTIVITY.ORDER_SERVICE.ETP.CANCEL]: {
          name: 'Hủy đơn hàng trên ETP'
        },
        [ACTIVITY.ORDER_SERVICE.ETP.UPDATE_INVOICE]: {
          name: 'Cập nhật thông tin xuất hóa đơn trên ETP'
        },
        [ACTIVITY.CUSTOMER_SERVICE.ETP.CREATE]: {
          name: 'Tạo mới khách hàng trên ETP'
        },
        [ACTIVITY.CUSTOMER_SERVICE.ETP.UPDATE_INFO]: {
          name: 'Cập nhật thông tin khách hàng trên ETP'
        },
        [ACTIVITY.CUSTOMER_SERVICE.ETP.UPDATE_ADDRESS]: {
          name: 'Cập nhật địa chỉ khách hàng trên ETP'
        }
      };

      _CONST.ACTIVITY = ACTIVITY;
      _CONST.ACTIVITY_INFO = ACTIVITY_INFO;

      return _CONST;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    window[Module.name] = Module.factory(di);
  }
})();