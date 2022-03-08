export const replaceMap = (str) => {
	const map = str.replace("(", "").replace(")", "")
	return map.split(':')
}
export const uuid = () => {
	try {
		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
			var r = Math.random() * 16 | 0,
				v = c == 'x' ? r : (r & 0x3 | 0x8);
			return v.toString(16);
		})
	} catch (e) {
		//TODO handle the exception
		console.log(e)
	}
}
