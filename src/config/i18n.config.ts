import {
	AcceptLanguageResolver,
	HeaderResolver,
	I18nOptions,
	QueryResolver
} from 'nestjs-i18n';
import { join } from 'path';

export const i18nConfig: I18nOptions = {
	fallbackLanguage: 'en',
	loaderOptions: {
		path: join(__dirname, '../i18n/'),
		watch: true
	},
	resolvers: [
		new QueryResolver(['lang', 'l']),
		new HeaderResolver(['x-custom-lang']),
		AcceptLanguageResolver
	]
};
