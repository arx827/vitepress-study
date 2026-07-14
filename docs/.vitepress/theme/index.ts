import DefaultTheme from 'vitepress/theme';
import HomeFeatures from './components/HomeFeatures.vue'

// import './custom.css'

export default {
  ...DefaultTheme,
  enhanceApp({ app }) {
    app.component('HomeFeatures', HomeFeatures)
  }
}