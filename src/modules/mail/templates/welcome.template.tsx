import { API_NAME, CLIENT_URL } from '@/common/constants';
import { Body, Heading, Hr, Link, Text } from '@react-email/components';

import { Html } from '@react-email/html';
import { Tailwind } from '@react-email/tailwind';
import { TranslateOptions } from 'nestjs-i18n';
import * as React from 'react';

interface WelcomeTemplateProps {
	username: string;
	t: (key: string, options?: TranslateOptions) => string;
}

export const WelcomeTemplate = ({ username, t }: WelcomeTemplateProps) => {
	return (
		<Tailwind>
			<Html>
				<Body className="font-sans text-base text-black">
					<Heading className="text-2xl font-bold">
						{t('translations.welcome.hello')}, {username}! 👋
					</Heading>
					<Text className="mt-4 mb-6">
						{t('translations.welcome.thanks', { args: { API_NAME } })}
						<br />
						<br />
						{t('translations.welcome.firstStep')}
					</Text>
					<Hr className="my-4" />
					<div>
						<Text className="leading-relaxed mb-4">
							{t('translations.welcome.anyQuestions')}
						</Text>
						<Link
							href={CLIENT_URL}
							className="inline-block bg-sky-700 text-white py-2 px-4 rounded mt-2"
						>
							{t('translations.welcome.switch', { args: { API_NAME } })}
						</Link>
					</div>
					<Hr className="my-4" />
					<Text className="mt-2">
						{t('translations.welcome.anyQuestions')},
						<br />
						{API_NAME} 👩‍💻👨‍💻
					</Text>
				</Body>
			</Html>
		</Tailwind>
	);
};
