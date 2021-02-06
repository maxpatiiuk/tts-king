import Layout         from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import { Centered }   from '../components/UI';

const pricing = () =>
	<Layout>
		<PublicMenu />
		<Centered>
			<h1 className='text-9xl font-bold'>It's free! For now...</h1>
			<p className='text-xl'>Enjoy it while you can</p>
		</Centered>
	</Layout>;

export default pricing;
