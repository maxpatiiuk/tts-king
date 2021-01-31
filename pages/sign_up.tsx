import Layout         from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import Link from 'next/Link';

const Home = () =>
	<Layout>
		<PublicMenu />
		<div className='flex-grow flex items-center mb-10 justify-center'>
			<div className='flex gap-x-5 max-w-2xl mx-5'>
				1
			</div>
		</div>
	</Layout>;

export default Home;
