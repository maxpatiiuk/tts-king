import Layout         from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import Link from 'next/Link';

const Home = () =>
	<Layout>
		<PublicMenu />
		<div className='flex-grow flex items-center mb-10 justify-center'>
			<div className='flex gap-x-5 max-w-2xl mx-5'>
				<h1
					className='text-right text-8xl font-bold bg-clip-text bg-gradient-to-tr
					from-yellow-400 to-purple-400 text-transparent pb-3 flex-shrink-0'
				>TTS<br />King</h1>
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
						<Link href='/sign_up'>
							<a
								className='hover:bg-red-500 hover:text-white bg-transparent text-red-500'
							>Sign up</a>
						</Link> now and see for yourself.
					</p>
				</div>
			</div>
		</div>
	</Layout>;

export default Home;
