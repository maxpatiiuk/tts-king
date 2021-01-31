import Layout         from '../components/Layout';
import { PublicMenu } from '../components/PublicMenu';
import { Centered }   from '../components/UI';

const Home = () =>
	<Layout>
		<PublicMenu />
		<Centered>
			<p>We are still working on this page... Come back later</p>
		</Centered>
	</Layout>;

export default Home;
