import { Highlighter } from "../types";

export default (highlighter: Highlighter) => ({
  code: require('./code')(highlighter),
  paragraph: require('./paragraph'),
  html: require('./html')
})
