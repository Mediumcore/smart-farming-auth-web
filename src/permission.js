import router from './router'
import store from './store'
import {Message} from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import {getToken} from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'
import {getInfo} from "@/api/user";

NProgress.configure({showSpinner: false}) // NProgress Configuration

const whiteList = ['/login', '/logout'] // no redirect whitelist

router.beforeEach(async (to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  //determine whether the user has logged in
  const hasToken = getToken()
  if (whiteList.indexOf(to.path) !== -1) {
    // in the free login whitelist, go directly
    next()
  } else if (hasToken) {
    //判断token对应的用户是否为admin，如果为admin继续转，否则跳转到别的页面
    getInfo(hasToken).then(res => {
      const {data} = res
      if (!data) {
        next(`/login?redirect=${to.path}`)
      }
      const role = data.role;
      if (role === 'admin') {
        next()
      } else {
        window.location.href = data.url
      }
    })

  } else {
    /* has no token*/
    // other pages that do not have permission to access are redirected to the login page.
    next(`/login?redirect=${to.path}`)
    NProgress.done()

  }

})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
