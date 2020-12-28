import React from "react";
import { Navbar } from "../Navbar/Navbar";
import { CardList } from "../CardList/CardList";
import { InfoModal } from "../InfoModal/InfoModal";
import { Anime, AnimeList, DbInitOptions } from "../../types";
import { LoadingOverlay } from "../LoadingOverlay/LoadingOverlay";
import { Database } from "../../functions/Database";

interface IProps {}
interface IState {
	animeList: AnimeList;
	isInfoModalVisible: boolean;
	selectedAnime?: Anime;
	navbarSearchText: string;
	loadingOverlayText: string;
	isLoadingOverlayVisible: boolean;
	isLoadingOverlaySpinnerVisible: boolean;
	loadingOverlayProgress: string;
}

export class AniSearchView extends React.Component<IProps, IState> {
	constructor(props: IProps) {
		super(props);
		this.state = {
			animeList: [],
			isInfoModalVisible: false,
			navbarSearchText: "",
			loadingOverlayText: "",
			isLoadingOverlayVisible: false,
			isLoadingOverlaySpinnerVisible: true,
			loadingOverlayProgress: "",
		};

		this.handleInfoModalVisibility = this.handleInfoModalVisibility.bind(this);
		this.handleCardClick = this.handleCardClick.bind(this);
		this.handleCardListScrollToBottom = this.handleCardListScrollToBottom.bind(
			this
		);
		this.handleNavbarSearchChange = this.handleNavbarSearchChange.bind(this);
		this.handleNavbarSearchBtnClick = this.handleNavbarSearchBtnClick.bind(
			this
		);
	}

	componentDidMount() {
		this.setState({
			isLoadingOverlayVisible: true,
			loadingOverlayText: "Loading Database...",
		});

		const initOptions: DbInitOptions = {
			progressUpdater: (currentPercentage: number) => {
				this.setState({ loadingOverlayProgress: `${currentPercentage}%` });
				if (currentPercentage === 100) {
					setTimeout(() => this.setState({ loadingOverlayProgress: "" }), 1000);
				}
			},
		};

		Database.init(initOptions)
			.then(() => {
				Database.getRandomAnimeList().then((animeList: AnimeList) => {
					this.setState({ animeList: animeList });
				});

				this.setState({ isLoadingOverlayVisible: false });
			})
			.catch((e) => {
				this.setState({
					isLoadingOverlayVisible: true,
					isLoadingOverlaySpinnerVisible: false,
					loadingOverlayText: `Unable to load the database! Error: ${JSON.stringify(
						e
					)}`,
				});
			});
	}

	handleInfoModalVisibility(isVisible: boolean) {
		this.setState({ isInfoModalVisible: isVisible });
	}

	handleNavbarSearchChange(keyword: string) {
		this.setState({ navbarSearchText: keyword });

		if (keyword.trim() == "") {
			Database.getRandomAnimeList()
				.then((animeList: AnimeList) => {
					this.setState({ animeList: animeList });
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}

	handleNavbarSearchBtnClick() {
		const keyword = this.state.navbarSearchText.trim();
		if (keyword === "") return;

		Database.searchAnime(keyword)
			.then((animeList: AnimeList) => {
				this.setState({ animeList: animeList });
			})
			.catch((e) => {
				console.log(e);
			});
	}

	handleCardClick(id: number) {
		Database.getAnime(id)
			.then((anime: Anime) => {
				this.setState({
					selectedAnime: anime,
					isInfoModalVisible: true,
				});
			})
			.catch((e) => {
				console.log(e);
			});
	}

	handleCardListScrollToBottom() {
		const navbarSearchText = this.state.navbarSearchText.trim();

		if (navbarSearchText.trim() === "") {
			Database.getRandomAnimeList()
				.then((animeList: AnimeList) => {
					this.setState({
						animeList: [...this.state.animeList, ...animeList],
					});
				})
				.catch((e) => {
					console.log(e);
				});
		} else {
			Database.searchAnime(navbarSearchText, 20, this.state.animeList.length)
				.then((animeList: AnimeList) => {
					this.setState({
						animeList: [...this.state.animeList, ...animeList],
					});
				})
				.catch((e) => {
					console.log(e);
				});
		}
	}

	render() {
		return (
			<div>
				<LoadingOverlay
					text={this.state.loadingOverlayText}
					visible={this.state.isLoadingOverlayVisible}
					spinnerVisible={this.state.isLoadingOverlaySpinnerVisible}
					progress={this.state.loadingOverlayProgress}
				/>
				<InfoModal
					isInfoModalVisible={this.state.isInfoModalVisible}
					handleInfoModalVisibility={this.handleInfoModalVisibility}
					anime={this.state.selectedAnime}
				/>
				<Navbar
					handleNavbarSearchChange={this.handleNavbarSearchChange}
					navbarSearchText={this.state.navbarSearchText}
					handleNavbarSearchBtnClick={this.handleNavbarSearchBtnClick}
				/>
				<CardList
					animeList={this.state.animeList}
					handleCardListScrollToBottom={this.handleCardListScrollToBottom}
					handleCardClick={this.handleCardClick}
				/>
			</div>
		);
	}
}
