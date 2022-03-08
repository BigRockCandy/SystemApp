export const LogCat = {
	main: plus.android.runtimeMainActivity(),
	Environment: plus.android.importClass('android.os.Environment'),
	BufferedWriter: plus.android.importClass('java.io.BufferedWriter'),
	File: plus.android.importClass('java.io.File'),
	FileOutputStream: plus.android.importClass('java.io.FileOutputStream'),
	OutputStreamWriter: plus.android.importClass('java.io.OutputStreamWriter'),
	LogPath: '',

	init: function() {
		// if (this.Environment.MEDIA_MOUNTED || !this.Environment.isExternalStorageRemovable()) {
		// 	this.LogPath = this.main.getExternalFilesDir(null).getPath();
		// } else {
		// 	this.LogPath = this.main.getExternalFilesDir(null).getPath();
		// }
		this.LogPath = this.main.getExternalFilesDir(null).getPath();
		console.info('日志路径', this.LogPath)
	},
	d: function(tag, msg) {
		// console.log(msg)

		let now = new Date();
		let date = utils.getFormatDate(now);
		let datetime = utils.getFormatDateTime(now);

		msg = (typeof msg !== 'string' ? JSON.stringify(msg) : msg);

		//文件名
		let fileName = this.LogPath + "/log_" + date + ".log"
		//写入的内容
		let content = `\n${datetime} ${tag}:${msg}\n`;

		let file = new this.File(this.LogPath);
		if (!file.exists()) {
			file.mkdirs(); //创建父路径
		}
		let fos = null;
		let bw = null;
		try {
			fos = new this.FileOutputStream(fileName, true);
			bw = new this.BufferedWriter(new this.OutputStreamWriter(fos));
			bw.append(content);
		} catch (e) {
			throw new Error('e->', e)
		} finally {
			try {
				if (bw != null) {
					bw.close(); //关闭缓冲流
					fos.close(); //关闭文件输出流
				}
			} catch (closeEx) {
				throw new Error('closeEx->', closeEx)
			}
		}
	}
}

export const utils = {
	/**
	 * 2020-01-01
	 */
	getFormatDate: (dateString) => {
		const date = new Date(dateString);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		return `${year}-${month}-${day}`;
	},
	/**
	 * 2020-01-01 22:22:22
	 */
	getFormatDateTime: (dateString) => {
		const date = new Date(dateString);
		let year = date.getFullYear();
		let month = date.getMonth() + 1;
		let day = date.getDate();
		let hour = date.getHours();
		let min = date.getMinutes();
		let second = date.getSeconds();

		month = month > 9 ? month : '0' + month;;
		day = day > 9 ? day : '0' + day;
		hour = hour > 9 ? hour : '0' + hour;
		min = min > 9 ? min : '0' + min;
		second = second > 9 ? second : '0' + second;

		return `${year}-${month}-${day} ${hour}:${min}:${second}`;
	}
}
