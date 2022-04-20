export default {
  head: {
    titleTemplate: '%s - Technical Test',
    title: 'Prolibu',
    htmlAttrs: {
      lang: "es",
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Products prolibu' },
      { name: 'format-detection', content: 'telephone=no' },
      { 'http-equiv': 'Content-Security-Policy', content: 'upgrade-insecure-requests' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  css: [
    '@/assets/css/fonts.css',
    '@/assets/css/general-config.css',
    '@fortawesome/fontawesome-free/css/all.css',
    'material-design-icons-iconfont/dist/material-design-icons.css'
  ],
  plugins: [
    { src: '~/plugins/persistedstate.js', mode: 'client' },
    { src: '~/plugins/directives.js' }
  ],
  components: true,
  buildModules: [
    '@nuxtjs/vuetify',
  ],
  modules: [
    '@nuxtjs/axios',
    '@nuxtjs/pwa',
    'nuxt-webfontloader',
    ['nuxt-sweetalert2',
      {
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#000000'
      }
    ],
    '@luxdamore/nuxt-prune-html'
  ],
  webfontloader: {
    google: {
      families: [
        'Raleway:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,900',
        'Oswald:wght@200;300;400;500;600;700',
      ]
    }
  },
  axios: {
    baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:2000' : 'http://localhost:2000',
    https: false
  },
  loading: { color: '#ffd54c', height: '5px', throttle: 0 },
  env: {
    baseURL: process.env.NODE_ENV === 'production' ? 'http://localhost:2000' : 'http://localhost:2000',
    browserBaseURL: process.env.BROWSER_BASE_URL,
    port: process.env.PORT,
  },
  pwa: {
    manifest: {
      lang: 'es',
      name: 'Prolibu',
      theme_color: '#007bff',
      background_color: '#f0f0f0'
    },
    icon: {
      source: `static/icon.png`,
      filename: 'icon.png'
    }
  },
  vuetify: {
    defaultAssets: true,
    treeShake: true,
    customVariables: [
      '~/assets/scss/vuetify.scss',
      '~/assets/scss/texts.scss',
      '~/assets/scss/general-config.scss'
    ],
    theme: {
      dark: false,
      options: {
        customProperties: true,
        variations: false
      },
      themes: {
        light: {
          primary: '#000000',
          important: '#007bff',
          error: '#eb4747',
          background: '#f0f0f0',
          lighten1: '#78909C',
          lighten2: '#90A4AE',
          lighten3: '#B0BEC5',
          darken1: '#546E7A',
          darken2: '#455A64',
          darken3: '#37474F'
        },
      }
    },
    icons: {
      iconfont: 'fa',
    }
  },
  server: {
    host: '0.0.0.0'
  },
  build: {
    analyze: false,
    extractCSS: {
      ignoreOrder: true
    },
    productionSourceMap: false,
    productionGzip: true,
    productionGzipExtensions: ['js', 'css', 'svg'],
    html: {
      minify: {
        collapseBooleanAttributes: true,
        decodeEntities: true,
        minifyCSS: true,
        minifyJS: true,
        processConditionalComments: true,
        removeEmptyAttributes: true,
        removeRedundantAttributes: true,
        trimCustomFragments: true,
        useShortDoctype: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyElements: true,
        preserveLineBreaks: false,
        collapseWhitespace: true
      }
    }
  },
  pruneHtml: {
    enabled: process.env.NODE_ENV === 'production' ? true : false,
    hideGenericMessagesInConsole: false,
    hideErrorsInConsole: false,
    hookRenderRoute: true,
    hookGeneratePage: true,
    selectors: [
      'link[rel="preload"][as="script"]',
      'script:not([type="application/ld+json"])',
    ],
    classesSelectorsToKeep: [],
    link: [],
    script: [],
    htmlElementClass: null,
    cheerio: {
      xmlMode: false,
    },
    types: [
      'default-detect',
    ],
    headerNameForDefaultDetection: 'user-agent',
    auditUserAgent: 'lighthouse',
    isAudit: true,
    isBot: true,
    ignoreBotOrAudit: false,
    matchUserAgent: null,
    queryParametersToPrune: [
      {
        key: 'prune',
        value: 'true',
      },
    ],
    queryParametersToExcludePrune: [],
    headersToPrune: [],
    headersToExcludePrune: [],
    onBeforePrune: null,
    onAfterPrune: null,
  }
}
