export type AnimeList = Array<Anime>;

export interface Anime {
	id: number;
	sources?: string[];
	title: string;
	type: string;
	episodes?: number;
	status: string;
	animeSeason?: AnimeSeason;
	picture: string;
	thumbnail?: string;
	synonyms: string[];
	relations?: string[];
	tags: string[];
}

export interface AnimeSeason {
	season: string;
	year: number;
}

export interface DbInitOptions {
	progressUpdater(currentPercentage: number): void;
	loadingTextUpdater(loadingText: string): void;
	successCallback(): void;
}
