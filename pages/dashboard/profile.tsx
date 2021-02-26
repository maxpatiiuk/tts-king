import React           from 'react';
import Layout          from '../../components/Layout';
import { PrivateMenu } from '../../components/PrivateMenu';
import FilterUsers     from '../../components/FilterUsers';
import { Content }     from '../../components/UI';
import {
	Loading,
	ModalDialog,
}                      from '../../components/ModalDialog';
import Image           from 'next/image';
import { useRouter }   from 'next/router';
import {
	AvailableLanguages,
	LanguageStringsStructure,
}                      from '../../lib/languages';
import {
	ButtonDanger,
	ButtonPrimary,
	ButtonSuccess,
	DangerLink,
	LabeledField,
}                      from '../../components/InteractivePrimitives';
import firebase        from 'firebase/app';

const languageStrings: LanguageStringsStructure<{
	downloadData: string,
	signOut: string,
	deleteAccountConfirmationTitle: string,
	deleteAccountConfirmation: string,
	deleteAccountConsequences: string,
	deleteAccount: string,
	cancelDeleteAccount: string,
	downloadAndDeleteAccount: string,
	noSavedData: string,
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
		noSavedData: 'We don\'t have any saved data on you',
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
		downloadUserData,
		setDownloadUserData,
	] = React.useState<boolean>(false);
	const [
		deleteUserData,
		setDeleteUserData,
	] = React.useState<boolean>(false);
	const [
		showDeleteUserPrompt,
		setShowDeleteUserPrompt,
	] = React.useState<boolean>(false);
	const [
		currentUser,
		setCurrentUser,
	] = React.useState<firebase.UserInfo | false>(false);
	const [
		currentLanguage,
		setCurrentLanguage,
	] = React.useState<AvailableLanguages['type'] | false>(false);


	const router = useRouter();

	async function signOut() {
		await router.push('/');
		await firebase.auth().signOut();
	}

	React.useEffect(() => {

		async function deleteUserAccount() {
			if (!deleteUserData || !currentUser)
				return;
			setDeleteUserData(false);
			await firebase.database().ref(
				`users/${currentUser.uid}`,
			).set(null);
			await signOut();
		}

		if (!downloadUserData && deleteUserData)
			return void (
				deleteUserAccount()
			);

		if (!downloadUserData || !currentUser)
			return;

		if (!currentLanguage)
			return;

		firebase.database().ref(`users/${currentUser.uid}`).on(
			'value',
			(value) => {
				downloadFile({
					data: value.val() ||
						languageStrings[currentLanguage].noSavedData,
					fileName: `${currentUser.uid}.json`,
				});

				setDownloadUserData(false);

				if (deleteUserData)
					void (
						deleteUserAccount()
					);
			},
		);

		return;

	}, [
		downloadUserData,
		currentUser,
		deleteUserData,
		currentLanguage,
	]);

	return (
		<Layout>{
			(language) => <>

				{
					!currentLanguage &&
					setCurrentLanguage(language)
				}

				{
					void (
						console.log(
							{
								downloadUserData,
								deleteUserData,
							},
						)
					)
				}
				{
					(
						downloadUserData ||
						deleteUserData
					) && <Loading />
				}
				<PrivateMenu />
				<FilterUsers
					isProtected={true}
					redirectPath={'/sign_in'}
				>{
					({user}) => <Content
						className='flex-col'
					>

						{
							!currentUser &&
							setCurrentUser(user)
						}

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

						<DangerLink props={{
							onClick: () =>
								setDownloadUserData(true),
						}}>Download my data</DangerLink>

						{
							showDeleteUserPrompt &&
							<ModalDialog
								title={
									languageStrings[language
										].deleteAccountConfirmationTitle
								}
								buttons={<>
									<ButtonPrimary props={{
										onClick: () =>
											setShowDeleteUserPrompt(
												false,
											),
									}}>
										{languageStrings[language
											].cancelDeleteAccount}
									</ButtonPrimary>
									<ButtonSuccess props={{
										onClick: () => {
											setDownloadUserData(true);
											setDeleteUserData(true);
										},
									}}>
										{languageStrings[language
											].downloadAndDeleteAccount}
									</ButtonSuccess>
									<ButtonDanger props={{
										onClick: () =>
											setDeleteUserData(true),
									}}>
										{languageStrings[language
											].deleteAccount}
									</ButtonDanger>
								</>}
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
							onClick: signOut,
						}}>Sign out</DangerLink>

					</Content>
				}</FilterUsers>
			</>
		}</Layout>
	);
}
