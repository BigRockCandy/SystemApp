export const replaceMap = (str) => {
	const map = str.replace("(", "").replace(")", "")
	return map.split(':')
}
