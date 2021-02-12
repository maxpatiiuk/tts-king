import React       from 'react';
import Layout      from '../../components/Layout';
import {
	PrivateMenu,
}                  from '../../components/PrivateMenu';
import FilterUsers from '../../components/FilterUsers';
import {
	Content,
}                  from '../../components/UI';
import {
	Loading,
	ModalDialog,
}                  from '../../components/ModalDialog';
import Image       from 'next/image';
import {
	FirebaseDatabaseMutation,
	FirebaseDatabaseNode,
}                  from '@react-firebase/database';
import {
	useRouter,
}                  from 'next/router';
import {
	LanguageStringsStructure,
}                  from '../../lib/languages';
import {
	ButtonPrimary,
	ButtonSecondary,
	DangerLink,
	LabeledField,
}                  from '../../components/InteractivePrimitives';
import {
	RunMutation,
}                  from '../../lib/runMuttation';

const languageStrings: LanguageStringsStructure<{
	downloadData: string,
	signOut: string,
	deleteAccountConfirmationTitle: string,
	deleteAccountConfirmation: string,
	deleteAccountConsequences: string,
	deleteAccount: string,
	cancelDeleteAccount: string,
	downloadAndDeleteAccount: string,
}> = {
	'en-US': {
		downloadData: 'Download my data',
		signOut: 'Sign out',
		deleteAccountConfirmationTitle: 'Delete account?',
		deleteAccountConfirmation: `Are you sure you want to delete your
			account?`,
		deleteAccountConsequences: `You listening stats and saved stories
			would be permanently deleted.`,
		deleteAccount: 'Yes, delete',
		cancelDeleteAccount: 'No, don\'t delete',
		downloadAndDeleteAccount: 'Download my data and delete',
	},
};


function downloadFile({
	data,
	fileName,
}: {
	data: string,
	fileName: string,
}) {
	const element = document.createElement('a');
	element.setAttribute(
		'href',
		'data:text/plain;charset=utf-8,' + encodeURIComponent(data),
	);
	element.setAttribute('download', fileName);

	element.style.display = 'none';
	document.body.appendChild(element);

	element.click();

	document.body.removeChild(element);
}

export default function dashboard() {

	const [
		isLoading,
		setIsLoading,
	] = React.useState<boolean>(false);
	const downloadUserData = React.useRef<boolean>(false);
	const deleteUserData = React.useRef<false | RunMutation>(false);
	const [
		showDeleteUserPrompt,
		setShowDeleteUserPrompt,
	] = React.useState<boolean>(false);
	const router = useRouter();

	return (
		<Layout>{
			(language) => <>
				{
					isLoading && <Loading />
				}
				<PrivateMenu />
				<FilterUsers
					isProtected={true}
					redirectPath={'/sign_in'}
				>{
					({user, firebase}) => <Content
						className='flex flex-col'
					>

						<div className='flex justify-center'>
							<Image
								className='rounded-full'
								src={user.photoURL}
								alt={user.displayName}
								width={96}
								height={96}
							/>
						</div>

						<LabeledField label='Name'>
							{user.displayName}
						</LabeledField>

						<LabeledField label='Email'>
							{user.email}
						</LabeledField>

						{
							downloadUserData.current &&
							<FirebaseDatabaseNode
								path={`users/${user.uid}`}
							>{
								({isLoading, value}) => {

									if (!downloadUserData.current) {
										setIsLoading(false);
										return <Loading />;
									}

									if (isLoading || isLoading === null)
										return <Loading />;

									downloadUserData.current = false;

									downloadFile({
										data: value,
										fileName: `${user.uid}.json`,
									});

									setIsLoading(false);

									if (deleteUserData.current !== false) {
										deleteUserData.current(undefined);
										deleteUserData.current = false;

									}

									return <Loading />;
								}
							}</FirebaseDatabaseNode>
						}
						<DangerLink props={{
							onClick: () => {
								setIsLoading(true);
								downloadUserData.current = true;
							},
						}}>Download my data</DangerLink>

						{
							showDeleteUserPrompt &&
							<ModalDialog
								title={
									languageStrings[language
										].deleteAccountConfirmationTitle
								}
								buttons={
									<FirebaseDatabaseMutation
										type='set'
										path={`users/${user.uid}`}
									>{
										({runMutation}) => <>
											<ButtonSecondary props={{
												onClick: () =>
													setShowDeleteUserPrompt(
														false,
													),
											}}>
												{languageStrings[language
													].cancelDeleteAccount}
											</ButtonSecondary>
											<ButtonPrimary props={{
												onClick: () => {
													setIsLoading(true);
													downloadUserData.current =
														true;
													deleteUserData.current =
														runMutation;
												},
											}}>
												{languageStrings[language
													].downloadAndDeleteAccount}
											</ButtonPrimary>
										</>
									}</FirebaseDatabaseMutation>
								}
							>
								{languageStrings[
									language].deleteAccountConfirmation}
								<br /><br />
								{languageStrings[
									language].deleteAccountConsequences}
							</ModalDialog>
						}
						<DangerLink props={{
							onClick: () =>
								setShowDeleteUserPrompt(true),
						}}>Delete account</DangerLink>

						<DangerLink props={{
							onClick: async () => {
								await firebase.auth().signOut();
								await router.push('/');
							},
						}}>Sign out</DangerLink>

					</Content>
				}</FilterUsers>
			</>
		}</Layout>
	);
};
