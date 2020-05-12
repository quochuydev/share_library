(function () {

  const Module = {
    name: '_regex',
    version: '1.0',
    factory: function () {

      const _regex = {
        email : /^(\w+([\.\-\_]\w+)*)@\w+([\.\-\_]\w+)*(\.\w+)$/, // this not test length 
        phone: /^[0-9]{8,11}$/,
        isoDate: /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])$/,
        isoDateTime: /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/,
        tax_code : /^[0-9]{10}(-(?!000)[0-9]{3}){0,1}$/
      };

      return _regex;
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