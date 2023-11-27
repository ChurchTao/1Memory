import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { resources } from '@common/i18n/resources'

const language = 'en'

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: language // language to use, more information here: https://www.i18next.com/overview/configuration-options#languages-namespaces-resources
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
  })

export function changeLanguage(language: string): void {
  i18n.changeLanguage(language)
}

export default i18n
