import i18n from 'i18next'
import { resources } from '@common/i18n/resources'
import { refresh } from '../../ui/ui'

export function init(): void {
  const language = global.settings.general.language || 'en'
  console.log('language', language)
  i18n.init({
    resources,
    lng: language // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
  })

  i18n.on('languageChanged', function (lng) {
    console.log('change lng', lng)
    refresh()
  })
}

export default i18n
