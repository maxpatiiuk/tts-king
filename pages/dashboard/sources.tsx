import React                    from 'react';
import Layout                   from '../../components/Layout';
import FilterUsers              from '../../components/FilterUsers';
import { Content }              from '../../components/UI';
import {
	AvailableLanguages,
	LanguageStringsStructure,
}                               from '../../lib/languages';
import {
	dangerButtonClassName,
	fieldClassName,
	successButtonClassName,
}                               from '../../components/InteractivePrimitives';
import { FirebaseDatabaseNode } from '@react-firebase/database';
import {
	DatabaseSource,
	Source,
	defaultDatabaseSources,
	sourceSubscriptions,
}                               from '../../lib/sources';

const languageStrings: LanguageStringsStructure<{
	mySources: string,
	addSource: string,
	subscribe: string,
	unsubscribe: string,
	priority: string,
	search: string,
	categoryName: string,
}> = {
	'en-US': {
		mySources: 'My sources',
		addSource: 'Add source',
		subscribe: 'Subscribe',
		unsubscribe: 'Unsubscribe',
		priority: 'Priority',
		search: '🔍\tSearch',
		categoryName: 'New Category\'s Name',
	},
};


function SourceLine({
	language,
	source: [sourceName, sourceData],
}: {
	language: AvailableLanguages['type'],
	source: [string, DatabaseSource],
}) {
	return <tr className='border-gray-300 border-b last:border-b-0'>
		<td className='pt-2 pb-2 pr-4'>{
			sourceSubscriptions[sourceName]?.label ||
			<input
				className={`w-full ${fieldClassName}`}
				type='text'
				value={sourceName}
				onChange={() => alert('Renamed')}
			/>
		}</td>
		<td className='pr-4 w-px whitespace-nowrap'>{
			'subscribed' in sourceData &&
			(
				sourceData.subscribed ?
					<button
						className={dangerButtonClassName}
						onClick={() =>
							alert('Unsubscribed')
						}
					>{
						languageStrings[language].unsubscribe
					}</button> :
					<button
						className={successButtonClassName}
						onClick={() =>
							alert('Subscribed')
						}
					>{
						languageStrings[language].subscribe
					}</button>
			)
		}</td>
		<td>
			<input
				className={`${fieldClassName} w-full`}
				type='number'
				min={0}
				value={sourceData.priority}
				onChange={() => alert('Changed')}
			/>
		</td>
	</tr>;
}

function SourceSubscriptionLine({
	language,
	source: [, sourceData],
}: {
	language: AvailableLanguages['type'],
	source: [string, Source],
}) {
	return <tr className='border-gray-300 border-b last:border-b-0'>
		<td className='pt-2 pb-2 pr-4 w-px whitespace-nowrap'>{
			sourceData.label
		}</td>
		<td className='pr-4 text-gray-600'>{
			sourceData.description
		}</td>
		<td className='w-px whitespace-nowrap'>
			<button
				className={successButtonClassName}
				onClick={() =>
					alert('Subscribed')
				}
			>{
				languageStrings[language].subscribe
			}</button>
		</td>
	</tr>;
}

export default function sources() {
	return <Layout>{
		(language) => <FilterUsers
			isProtected={true}
			redirectPath={'/sign_in'}
		>{
			({user}) => <Content>
				<FirebaseDatabaseNode
					path={`users/${user.uid}/sources_meta`}
				>{
					data => <>
						<table className='w-full'>
							<thead className='text-left text-2xl'>
							<tr>
								<th>{
									languageStrings[language].mySources
								}</th>
								<th />
								<th className='w-px whitespace-nowrap'>{
									languageStrings[language].priority
								}</th>
							</tr>
							</thead>
							<tbody>
							{Object.entries(
								(
									data.value ||
									defaultDatabaseSources(language)
								) as Record<string, DatabaseSource>,
							).sort((
								[, {
									priority: priorityLeft,
								}],
								[, {
									priority: priorityRight,
								}],
								) =>
									Number(priorityLeft) ===
									Number(priorityRight) ?
										0 :
										Number(priorityLeft) ===
										Number(priorityRight) ?
											-1 :
											1,
							).map(source =>
								<SourceLine
									key={source[0]}
									language={language}
									source={source}
								/>,
							)}
							<tr>
								<td className='pt-2 pb-2 pr-4'>
									<input
										className={`${fieldClassName} w-full`}
										placeholder={
											languageStrings[language
												].categoryName
										}
										type='text'
										value=''
										onChange={() =>
											alert('Changed')
										}
									/>
								</td>
								<td className='pr-4 w-px whitespace-nowrap'>
									<button
										className={
											successButtonClassName
										}
										onClick={() => alert('Added')}
									>{
										languageStrings[language
											].subscribe
									}</button>
								</td>
							</tr>
							</tbody>
						</table>
						<table className='mt-10 w-full'>
							<thead className='text-left'>
							<tr>
								<th
									className='text-2xl w-px whitespace-nowrap'
								>
									<div className='mb-2'>{
										languageStrings[language].addSource
									}</div>
								</th>
								<th colSpan={2}>
									<div className='flex justify-end mb-2'>
										<input
											className={fieldClassName}
											placeholder={
												languageStrings[language
													].search
											}
											type="text"
											value=''
											onChange={() => alert('Searching')}
										/>
									</div>
								</th>
							</tr>
							</thead>
							<tbody>{
								Object.entries(
									sourceSubscriptions,
								).filter(([sourceName]) =>
									Object.keys(
										data.value || {},
									).indexOf(sourceName) === -1,
								).map(source =>
									<SourceSubscriptionLine
										key={source[0]}
										language={language}
										source={source}
									/>,
								)
							}</tbody>
						</table>
					</>
				}</FirebaseDatabaseNode>

			</Content>
		}</FilterUsers>
	}</Layout>;
}
