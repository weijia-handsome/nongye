// var path = require('path');
const path = require('path')
const resolve = dir => path.join(__dirname, dir)
module.exports = {

  devServer: {
    // proxy: 'http://192.168.2.156',
    // public:'172.20.3.3:8080',
    // host: 'localhost',
    // port: 8080, // 端口号配置
    proxy: {
      // '/api': {
      //   target: 'http://121.36.5.1',// 要跨域的域名
      //   changeOrigin: true, // 是否开启跨域
      //   // pathRewrite: {
      //   //   '^/api': '' // 在请求的时候 凡是/api开头的地址都可以跨域
      //   // }
      // },
      '/Agriculture': {
        target: 'http://121.36.5.1',// 要跨域的域名
        changeOrigin: true, // 是否开启跨域
        // pathRewrite: {
        //   '^/Agriculture': '' // 在请求的时候 凡是/api开头的地址都可以跨域
        // }
      },
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set('@', resolve('src'))
  },
  configureWebpack: {
    externals: {
      'AMap': 'AMap' // 高德地图配置
    }
  },

  lintOnSave: false,
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  parallel: false,
  productionSourceMap: false,
  // performance: { hints: false }
  // configureWebpack: {
  //   performance: {
  //     hints: 'warning',
  //     //入口起点的最大体积 整数类型（以字节为单位）
  //     maxEntrypointSize: 50000000,
  //     //生成文件的最大体积 整数类型（以字节为单位 300k）
  //     maxAssetSize: 30000000,
  //     //只给出 js 文件的性能提示
  //     assetFilter: function (assetFilename) {
  //       return assetFilename.endsWith('.js');
  //     }
  //   }
  // }
  css: {
    loaderOptions: {
      css: {},
      postcss: {
        plugins: [
          require('postcss-px2rem')({
            remUnit: 45 //列如设计稿尺寸为320
          })
        ]
      }
    }
  },
}
