import DefaultTheme from 'vitepress/theme'
import Layout from './Layout.vue'
import NotFound from './NotFound.vue'
import WaveDivider from './components/WaveDivider.vue'
import './mermaid.css'
import './custom.css'

export default {
  extends: DefaultTheme,
  Layout,
  NotFound,
  enhanceApp({ app }) {
    app.component('WaveDivider', WaveDivider)
  }
}

