import Layout         from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import Link           from 'next/link';
import { Centered }   from '../components/UI';
import useSWR         from 'swr';
import { fetcher }    from '../lib/swrHelper';

export default function Home() {

	const { data:isUserAuthorized, error } = useSWR('/api/is_user_authorized',fetcher);

	return <Layout>
		<PublicMenu />
		<Centered>
			<h1
				className='sm:text-right text-8xl font-bold bg-clip-text bg-gradient-to-l
					sm:bg-gradient-to-tr from-yellow-400 to-purple-400 text-transparent pb-3 flex-shrink-0'
			>
				<span className='sm:block'>TTS </span>
				<span>King</span>
			</h1>
			<div>
				<h2 className='text-3xl pt-2 pb-3'>Because your time is important!</h2>
				<p>
					Convert your daily news digests into a simple podcast you can listen to
					while in transit, walking or even exercising.
				</p>
				<p className='pt-4'>
					TTS King helps you stay productive no matter where you are!
				</p>
				<p className='pt-3'>
					{
						(error || !isUserAuthorized) ?
							<Link href='/sign_in'>
								<a
									className='hover:bg-red-500 hover:text-white bg-transparent text-red-500'
								>Sign up</a>
							</Link> :
							<Link href='/profile'>
								<a
									className='hover:bg-red-500 hover:text-white bg-transparent text-red-500'
								>Go to your profile</a>
							</Link>
					}
					{' '}now and see for yourself.
				</p>
			</div>
		</Centered>
	</Layout>;
}
