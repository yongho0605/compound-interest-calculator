// https://nuxt.com/docs/api/configuration/nuxt-config
// @ts-ignore
export default defineNuxtConfig({
  devtools: { enabled: false },
  ssr: false,
  app: {
    head: {
      title: '복리 이자 계산기',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: '월배당 주식투자를 가정한 월 복리 이자 계산기' },
        { property: 'og:title', content: '복리 이자 계산기' },
        { property: 'og:type', content: 'website' },
        { property: 'og:description', content: '월배당 주식투자를 가정한 월 복리 이자 계산기' },
        { property: 'og:image', content: '/img/og-image.png' }
      ]
    }
  },
  modules: ['@nuxtjs/tailwindcss']
})
