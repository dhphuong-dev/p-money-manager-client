enum Theme {
  DARK,
  LIGHT
}
enum Language {
  EN,
  VI
}
enum Currency {
  USD,
  VND
}
enum TimeFormat {
  'YYYY-MM-DD',
  'DD-MM-YYYY',
  'MM-DD-YYYY'
}
interface ISetting {
  theme: Theme;
  language: Language;
  currency: Currency;
  timeFormat: TimeFormat;
}

export { Theme, Language, Currency, TimeFormat, type ISetting };
