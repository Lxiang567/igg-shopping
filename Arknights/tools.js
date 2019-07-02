var tools = {
  /* 取cookie
    * @params  key <string>  要取的那条cookie的名称
    * @return  <string> 取到的cookie的值
    */
  getCookie: function (key) {
    let str = document.cookie
    let arr = str.split('; ')
    let obj = {}
    arr.forEach(item => {
      let subArr = item.split('=')
      // 把存的cookie解码之后放进obj
      obj[subArr[0]] = decodeURIComponent(subArr[1])
    })
    return obj[key]
  },

  /* 存cookie
  * @params  key <string> 存cookie的名称
  * @params  value <string> 存cookie的值
  * @params  [option] <object>  {path: '/', exipres: 10}
  */ 
  setCookie: function (key, value, option) {
    // 先把value编码
    value = encodeURIComponent(value)
    let str = `${key}=${value}`
    if (option) {
      // 有option选项
      if (option.path) {
        str += `;path=${option.path}`
      }
      
      if (option.expires) {
        // 如果有过期时间，就加上expires这个选项
        let date = new Date()
        date.setDate(date.getDate() + option.expires)
        str += `;expires=${date}`
      }
    }
    document.cookie = str
  },

  /* 删除cookie
   * @params key <string> 要删除的那条cookie的名称
   * @params [path] <string> 原来存的这条cookie的path
  */
  removeCookie:  function (key, path) {
    this.setCookie(key, '', { path, expires: -1})
  },

  /** 发送ajax get请求
   * @params url <string> 请求的url
   * @params query <object> 这次请求要携带的参数
   * @params fn <function> 回调函数（就是回头再来调用，把一个函数作为参数取传递，在逻辑执行到一定程度的时候再来调用）
   * @params isJson <boolean> 请求的数据格式是否为json，默认为true
   *  */
  get: function (url, query, fn, isJson = true) {
    // 参数默认值ES6，如果传了就以传的为准，如果没传，默认为true

    // 拼接query到url上
    if (query) {
      url += '?'
      // 遍历对象使用for...in
      for (var key in query) {
        url += `${key}=${query[key]}&`
      }
      // 把多余的&去掉
      url = url.slice(0, -1)
    }
    // 1、创建核心对象
    var xhr = new XMLHttpRequest()
    // 2、 打开连接
    xhr.open('get', url)
    // 3、发送请求
    xhr.send()
    // 4、监听状态码和状态值的改变
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          // 因为get方法只负责封装一个通用的get请求，到死得到数据之后要干什么事我是不知道的，
          // 所以你传给我一个fn，我来调用fn通过参数把响应结果给出去
          // 逻辑短路（如果第一部分已经能够决定整个表达式的结果了，那么第二部分就不执行了）
          // fn有效才执行，为了避免没传参数的时候报错
          var result = isJson ? JSON.parse(xhr.responseText) : xhr.responseText
          fn && fn(result)
        }
      }
    }
  },

  /** 发送ajax post请求
   * @params url <string> 请求的url
   * @params query <object> 这次请求要携带的参数
   * @params fn <function> 回调函数（就是回头再来调用，把一个函数作为参数取传递，在逻辑执行到一定程度的时候再来调用）
   * @params isJson <boolean> 请求的数据格式是否为json，默认为true
   *  */
  post: function (url, query, fn, isJson = true) {
    var str = ''
    if (query) {
      for (var key in query) {
        str += `${key}=${query[key]}&`
      }
      str = str.slice(0, -1)
    }
    var xhr = new XMLHttpRequest()
    xhr.open('post', url)
    xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded")
    xhr.send(str)
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          var result = isJson ? JSON.parse(xhr.responseText) : xhr.responseText
          fn && fn(result)
        }
      }
    }
  }
}
