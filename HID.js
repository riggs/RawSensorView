/*
 * Created by riggs on 10/2/15.
 */

HID = (function () {

  var API = {};

  var on_error = function (reject) {
    if (chrome.runtime.lastError) {
      reject(chrome.runtime.lastError);
    }
  };

  var promise_from_callback = function (func, parser) {
    // Take chrome.hid API function as argument.

    if (parser === undefined) {   // Most callbacks are passed 0 or 1 element.
      parser = function () { return arguments[0]; };
    }

    return function () {  // Return function to be called in place of func.
      var args = Array.prototype.slice.call(arguments);

      return new Promise(function (resolve, reject) {
        args.push(function () {   // Push new callback function to args to pass to func.
          on_error(reject);
          resolve(parser.apply(null, arguments));
        });
        func.apply(null, args);   // Call original function with original args & added callback.
      });
    };
  };

  API.getDevices = promise_from_callback(chrome.hid.getDevices);

  API.connect = promise_from_callback(chrome.hid.connect);

  API.disconnect = promise_from_callback(chrome.hid.disconnect);

  API.receive = promise_from_callback(chrome.hid.receive,
                                      function (reportId, data) { return {reportId: reportId, data: data}; });

  API.send = promise_from_callback(chrome.hid.send);

  API.receiveFeatureReport = promise_from_callback(chrome.hid.receiveFeatureReport);

  API.sendFeatureReport = promise_from_callback(chrome.hid.sendFeatureReport);

  return API;
})();
