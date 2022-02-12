const handleError = (err) => {
  if (err.code === 401) {
     console.log('err', err)
  }
  console.log('err', err)
}
export default {
  // 异步操作放到action
  updateUserInfoSync (store, data) {
    setTimeout(() => {
      store.commit('updateUserInfo', { num: data.num, num2: 2 })
    }, data.time)
  }
}
