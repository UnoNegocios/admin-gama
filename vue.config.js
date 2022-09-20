module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],

  pwa: {
    name: 'Dominio Medios',
    short_name: 'Dominio Medios',
    themeColor: '#a1133c',
    msTileColor: '#a1133c',
    backgroundColor: '#a1133c',
    manifestOptions: {
      icons: [
        {
          src: '/favicon-16x16.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: '/favicon-16x16.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    //workboxPluginMode: 'InjectManifest'
  },

  lintOnSave: false
}