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

interface VerificationEmailProps {
	domain: string;
	token: string;
	username: string;
	t: (key: string, options?: TranslateOptions) => string;
}

export function EmailVerification({
	domain,
	token,
	username,
	t
}: VerificationEmailProps) {
	const confirmLink = `${domain}/auth/verification?token=${token}`;

	return (
		<Tailwind>
			<Html>
				<Body className="text-black font-sans text-base">
					<Heading className="text-2xl font-bold">
						{t('translations.verificationEmail.heading')}
					</Heading>
					<Text className="mt-4 mb-6">
						{t('translations.verificationEmail.description', {
							args: { username }
						})}
					</Text>
					<Hr className="my-4" />
					<div>
						<Link
							href={confirmLink}
							className="inline-block bg-sky-700 text-white py-2 px-4 rounded mt-2"
						>
							{t('translations.verificationEmail.link')}
						</Link>
						<Text className="leading-relaxed mb-4">
							{t('translations.verificationEmail.subDescription')}
						</Text>
					</div>
					<Hr className="my-4" />
				</Body>
			</Html>
		</Tailwind>
	);
}
