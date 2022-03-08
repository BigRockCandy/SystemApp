import {
	LogCat
} from "./LogCat.js"
console.log = (function(oriLogFunc) {
	return function() {
		try {
			LogCat.d('log', ...arguments)
			oriLogFunc.call(console, ...arguments);
		} catch (e) {
			console.info('log出错', e);

		}

	}
})(console.log);
console.debug = (function(oriLogFunc) {
	return function() {
		try {
			LogCat.d('debug', ...arguments)
			oriLogFunc.call(console, ...arguments);
		} catch (e) {
			console.info('debug出错', e);

		}

	}
})(console.debug);
console.warn = (function(oriLogFunc) {
	return function() {
		try {
			LogCat.d('warn', ...arguments)
			oriLogFunc.call(console, ...arguments);
		} catch (e) {
			console.info('warn出错', e);

		}

	}
})(console.warn);
console.error = (function(oriLogFunc) {
	return function() {
		try {
			LogCat.d('error', ...arguments)
			oriLogFunc.call(console, ...arguments);
		} catch (e) {
			console.info('error出错', e);

		}

	}
})(console.error);
