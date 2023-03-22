import Head from 'next/head';
import { Header, Hero } from 'src/components';
import { API_REQUEST } from './../services/api.services';
import { GetServerSideProps } from 'next';
import { IMove, Product, MyList } from './../interfaces/app.interfaces';
import { Row } from 'src/components/row/row';
import { useInfoStore } from 'src/store';
import { Modal } from './../components/modal/Modal';
import { SubscriptionPlan } from './../components/subscription/subscription-plan';
import { getList } from './../helpers/list';

export default function Home({
	trending,
	topRated,
	tvTopRated,
	popular,
	documentary,
	history,
	comedy,
	products,
	subscription,
}: // list,
HomeProps): JSX.Element {
	//eslint-disable-next-line
	const { modal } = useInfoStore();

	//condition
	if (!subscription.length) return <SubscriptionPlan products={products} />;

	return (
		<div
			className={`relative min-h-screen bg-gradient-to-b from-gray-900/20 to-[#010511] ${modal && '!h-screen overflow-hidden'}`}
		>
			<Head>
				<title>Home | Next</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/logo.svg' />
			</Head>
			<Header />
			<main className='relative pl-4 pb-24 lg:space-y-24 lg:pl-16'>
				<Hero trending={trending} />
				<section>
					<Row title='Top Rated' movies={topRated} />
					<Row title='TV show' movies={tvTopRated} isBig={true} />
					{/* {list.length ? <Row title='My List' movies={list} /> : null} */}
					<Row title='Popular' movies={popular} />
					<Row title='History' movies={history} />
					<Row title='Comedy' movies={comedy} isBig={true} />
					<Row title='Playing' movies={trending} />
					<Row title='Documentary' movies={documentary} />
				</section>
			</main>
			{modal && <Modal />}
		</div>
	);
}

// SERVISE SITE RENDERING
export const getServerSideProps: GetServerSideProps<HomeProps> = async ({ req }) => {
	const user_id = req.cookies.user_id;
	if (!user_id) {
		return {
			redirect: { destination: '/auth', permanent: false },
		};
	}

	const [trending, topRated, tvTopRated, popular, documentary, comedy, family, history, products, subscription] =
		await Promise.all([
			fetch(API_REQUEST.trending).then(res => res.json()),
			fetch(API_REQUEST.top_rated).then(res => res.json()),
			fetch(API_REQUEST.tv_top_rated).then(res => res.json()),
			fetch(API_REQUEST.popular).then(res => res.json()),
			fetch(API_REQUEST.documentary).then(res => res.json()),
			fetch(API_REQUEST.comedy).then(res => res.json()),
			fetch(API_REQUEST.family).then(res => res.json()),
			fetch(API_REQUEST.history).then(res => res.json()),
			fetch(API_REQUEST.products_list).then(res => res.json()),
			fetch(`${API_REQUEST.subscription}/${user_id}`).then(res => res.json()),
		]);

	// const myList: MyList[] = await getList(user_id);

	return {
		props: {
			trending: trending.results,
			topRated: topRated.results,
			tvTopRated: tvTopRated.results,
			popular: popular.results,
			documentary: documentary.results,
			comedy: comedy.results,
			family: family.results,
			history: history.results,
			products: products.products.data,
			subscription: subscription.subscription.data,
			// list: myList.map(c => c.userId),
		},
	};
};

interface HomeProps {
	trending: IMove[];
	topRated: IMove[];
	tvTopRated: IMove[];
	popular: IMove[];
	documentary: IMove[];
	comedy: IMove[];
	family: IMove[];
	history: IMove[];
	products: Product[];
	subscription: string[];
	// list: IMove[];
}
