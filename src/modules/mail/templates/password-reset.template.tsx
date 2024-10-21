import {
	Body,
	Heading,
	Hr,
	Link,
	Tailwind,
	Text
} from '@react-email/components';
import { Html } from '@react-email/html';
import { TranslateOptions } from 'nestjs-i18n';
import * as React from 'react';

interface PasswordResetTemplateProps {
	domain: string;
	token: string;
	t: (key: string, options?: TranslateOptions) => string;
}

export function ResetPasswordTemplate({
	domain,
	token,
	t
}: PasswordResetTemplateProps) {
	const resetLink = `${domain}/auth/new-password?token=${token}`;

	return (
		<Tailwind>
			<Html>
				<Body className="text-black font-sans text-base">
					<Heading className="text-2xl font-bold">
						{t('translations.passwordReset.heading')}
					</Heading>
					<Text className="mt-4 mb-6">
						{t('translations.passwordReset.description')}
					</Text>
					<Hr className="my-4" />
					<div>
						<Link
							href={resetLink}
							className="inline-block bg-sky-700 text-white py-2 px-4 rounded mt-2"
						>
							{t('translations.passwordReset.link')}
						</Link>
						<Text className="leading-relaxed mb-4">
							{t('translations.passwordReset.subDescription')}
						</Text>
						<Hr className="my-4" />
					</div>
				</Body>
			</Html>
		</Tailwind>
	);
}
