(function () {

  const Module = {
    name    : 'LocalizeFormat',
    version : '1.0',
    dependencies : {
      Intl   : { name: 'Intl'   },
      moment : { name: 'moment' }
    },
    factory : function ({ Intl, moment }) {
      const Public = {};
      /**------------------ Utils ------------------- */
      {
        Public.utils = {
          LocaleDetectors: {
            ['vi-VN']: ({ locale, language, region }) => locale === 'vi-VN' || language === 'vi' || region === 'VN',
            ['en-US']: ({ locale, language, region }) => locale === 'en-US' || language === 'en' || region === 'US',
          },
          toArray : function (type, ...values) {
            let res = [];

            for (let val of values) {
              if (Array.isArray(val)) {
                res = res.concat(val);
              }
              else if (typeof val === type) {
                res.push(val);
              }
            }

            return res;
          }
        };
      }
      /**------------------ Money ------------------- */
      {
        /**
         * Formatter money and currency
         * 
         * @module Formatter 
         * 
         * @see [Intl.NumberFormat](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/NumberFormat)
         * 
         * @typedef {(number : number, options : object) => string} formatNumber
         * 
         * @typedef {({ fallbackLocale : string | string[], dynamicFormatter : boolean }) => formatNumber} FormatNumber
         * 
         */

        /**
         * @param {object} dependencies
         * @param {object} dependencies.Formatters
         * @param {object} dependencies.FormatterOptions
         * 
         * @return {FormatNumber}
         */
        function FormatNumberFactory({ Formatters, FormatterOptions } = {}) {

          return function FormatNumber(config) {

            config = Object.assign({ fallbackLocale : 'en', dynamicFormatter : true }, config);

            const Formatter = getFormatter(config, FormatterOptions);

            return function formatNumber(number, options) {
              options = { ...config, ...options };

              return Formatter.format(number, options);
            }

          }

          /**
           * @param {NumberFormatOptions} infos
           * 
           * @return {formatNumber | null}
           */
          function getFormatter(infos, FormatterOptions) {
            const locale = detectLocale(infos);

            if (locale) {
              let exists_Formatter;
              if (Array.isArray(locale)) {
                for (let loc of locale) {
                  exists_Formatter = Formatters[loc];
                  if (exists_Formatter) { break }
                }
              }
              else {
                exists_Formatter = Formatters[locale];
              }

              if (exists_Formatter) {
                return typeof exists_Formatter === 'function' ? exists_Formatter(infos) : exists_Formatter;
              }

              if (infos.dynamicFormatter) {
                const Formatter = new Intl.NumberFormat(locale, { ...FormatterOptions, ...infos });

                Formatters[locale] = Formatter;

                return typeof Formatter === 'function' ? Formatter(infos) : Formatter;
              }
            }
            if (!Formatters[infos.fallbackLocale]) {
              Formatters[infos.fallbackLocale] = new Intl.NumberFormat(infos.fallbackLocale, FormatterOptions);
            }
            return Formatters[infos.fallbackLocale];
          }

          /**
           * 
           * @param {NumberFormatOptions} infos 
           * 
           * @return {string | null} locale
           */
          function detectLocale({ locale, language, region }) {
            if (locale) {
              const supported_locale = Intl.NumberFormat.supportedLocalesOf(locale);
              if (supported_locale.length > 0) {
                return supported_locale[0];
              }
            }
            if (language) {
              if (region) {
                locale = language + '-' + region;
                const supported_locale = Intl.NumberFormat.supportedLocalesOf(locale);
                if (supported_locale.length > 0) {
                  return supported_locale[0];
                }
              }
            }
            for (let locale in Public.utils.LocaleDetectors) {
              const detector = Public.utils.LocaleDetectors[locale];

              if (detector({ locale, language, region })) {
                return locale;
              }
            }
          }
        }

        const MoneyFormatFactory = {
          vi: () => {
            const numberFormat = new Intl.NumberFormat('vi-VN');

            return {
              format(number, { group = ',', excludeFraction = true } = {}) {
                number = Number(number);

                if (Number.isNaN(number)) { return '' }

                if (excludeFraction) {
                  number = Math.round(number);
                }

                let result = '';
                let decimal = group === ',' ? '.' : ',';
                const parts = numberFormat.formatToParts(number);

                for (let p of parts) {
                  if (p.type === 'group') {
                    p.value = group;
                  }
                  if (p.type === 'decimal') {
                    p.value = decimal;
                  }
                  if (excludeFraction) {
                    if (['decimal', 'fraction'].includes(p.type)) {
                      continue;
                    }
                  }
                  result += p.value;
                }

                return result;
              },
            };
          },
        };

        const MoneyFormatters = {
          ['vi-VN']: MoneyFormatFactory.vi(),
          ['en-US']: new Intl.NumberFormat('en-US'),
        };

        const CurrencyFormatters = {
          ['vi-VN']: {
            format: (number, options) => MoneyFormatters['vi-VN'].format(number, options) + ' ₫'
          },
          ['en-US']: ({ currency = 'USD' }) => new Intl.NumberFormat('en-US', { style: 'currency', currency }),
        };

        Object.assign(Public, {
          Money: FormatNumberFactory({ Formatters: MoneyFormatters }),
          Currency: FormatNumberFactory({ Formatters: CurrencyFormatters, FormatterOptions : { style : 'currency' } })
        });
      }

      /**------------------ Time -------------------- */
      {
        /**
         * Format time 
         * 
         * @module Format
         * 
         * @see [moment](https://momentjs.com/docs/#/displaying) Localized formats
         * 
         * @typedef {Object<string, any>} FormatTimeOptions
         * @property {string | string[]} fallbackLocale
         * @property {string | number} defaultTimeZone
         * @property {string} defaultFormat
         * @property {Custom[]} customFormat
         * 
         * @typedef {{ match : Function, map : Object<string, string> }} Custom
         * 
         * @typedef {(date : string | Date, format : string, options : object ) => string} formatTime
         * 
         */

        /**
         * @param {FormatTimeOptions} config
         * @return {formatTime}
         */
        function FormatTime(config) {

          return function formatTime(date, format, options) {
            if (!(date instanceof Date) && ( typeof date === 'number' || typeof date === 'string')) {
              date = new Date(date);
            }
            if (Number.isNaN(date.getMilliseconds())) { return }

            let infos = { timezone : config.defaultTimeZone, ...config, ...options };

            infos.locale = Public.utils.toArray('string', infos.fallbackLocale, infos.locale);

            format = getFormat(format, infos);

            return moment(date).utcOffset(infos.timezone).locale(infos.locale).format(format);
          }
        }

        function getFormat(format, infos) {
          if (!(typeof format === 'string' && format.length > 0)) {
            format = infos.defaultFormat;
          }

          if (!(Array.isArray(infos.customFormat) && infos.customFormat.length > 0 )) { return format }

          for (let custom of infos.customFormat) {
            if (custom.match(infos)) {
              return custom.map[format] || format;
            }
          }

          return format;
        }

        Public.Time = FormatTime;
      }

      return Public;
    }
  };

  let di = {};

  if (typeof module === 'object' && module.exports) {
    di.Intl = require('intl');
    di.moment = require('moment');
    module.exports = Module.factory(di);
  }
  else if (typeof window === 'object') {
    di = window;
    window[Module.name] = Module.factory(di);
  }
})();