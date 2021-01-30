/*
*
* Error Boundary for React Components. Catches exceptions and provides a stack trace
*
* */

'use strict';

import React            from 'react';
import { ModalDialog }  from './ModalDialog';
import { ButtonDanger } from './InteractivePrivitives';

type ErrorBoundaryState =
	{
		has_error: false,
	} | {
	has_error: true,
	error: {toString: () => string},
	errorInfo: {componentStack: string}
};

export default class ErrorBoundary extends React.Component<{children: JSX.Element}, ErrorBoundaryState> {
	state: ErrorBoundaryState = {
		has_error: false,
	};

	componentDidCatch(error: {toString: () => string}, errorInfo: {componentStack: string}): void {
		console.log(error, errorInfo);
		this.setState({
			has_error: true,
			error,
			errorInfo,
		});
	}

	render(): JSX.Element {
		if (this.state.has_error)
			return <ModalDialog
				title={'Unexpected Error'}
				buttons={<>
					<ButtonDanger
						props={{
							onClick: window.location.reload
						}}
					>
						Reload
					</ButtonDanger>
					<ButtonDanger
						props={{
							onClick: window.history.back
						}}
					>
						Previous page
					</ButtonDanger>
				</>}
			>
				<p>An unexpected error has occurred.</p>
				<details style={{whiteSpace: 'pre-wrap'}}>
					{this.state.error && this.state.error.toString()}
					<br />
					{this.state.errorInfo.componentStack}
				</details>
			</ModalDialog>;
		else
			return this.props.children;
	}
}