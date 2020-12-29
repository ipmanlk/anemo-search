import Dexie from "dexie";
import axios from "axios";
import { Anime, AnimeList, DbInitOptions } from "../types";

// TODO: Rewrite this class with proper types & refactor slow methods

export class Database {
	private static db: any = new Dexie("anemoSearch");

	static init(initOptions: DbInitOptions) {
		this.db.version(1).stores({
			info: "id",
			animeOffline: "++id",
		});

		return new Promise(async (resolve, reject) => {
			initOptions.loadingTextUpdater("Checking database version...");
			console.log("Log: Checking database version");

			let latestCommit = await (
				await fetch(
					"https://api.github.com/repos/manami-project/anime-offline-database/branches/master"
				)
			)
				.json()
				.catch((e) => reject(e));

			const infoRow = await this.db.info.get(1).catch((e: any) => reject(e));
			// handle api rate limit errors (use offline sha or reject if offline db not present)
			if (!latestCommit || !latestCommit.commit) {
				if (!infoRow) reject();
				latestCommit = { commit: { sha: infoRow.commitHash } };
			}

			let isNewVersionAvailable = false;

			if (infoRow) {
				if (infoRow.commitHash === latestCommit.commit.sha) {
					initOptions.successCallback();
					resolve({ status: true });
					return;
				}

				isNewVersionAvailable = true;

				initOptions.loadingTextUpdater(
					"New database version found!./nUpdate will run in the background."
				);
				console.log("Log: New database version found");

				setTimeout(() => {
					initOptions.successCallback();
				}, 8000);
			}
			if (!isNewVersionAvailable) {
				initOptions.loadingTextUpdater(
					"Downloading database.../nBe patient. This might take some time in the first run."
				);
			}

			console.log("Log: Downloading database");
			axios
				.get("https://tinyurl.com/y7byxw23", {
					onDownloadProgress: (progressEvent) => {
						if (!isNewVersionAvailable) {
							let percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							);
							initOptions.progressUpdater(percentCompleted);
						}
					},
				})
				.then(async (res) => {
					try {
						if (isNewVersionAvailable) {
							await this.db.info.clear();
							await this.db.animeOffline.clear();
						}
						await this.db.animeOffline.bulkPut(res.data.data);
						await this.db.info.put({
							id: 1,
							commitHash: latestCommit.commit.sha,
						});
						console.log("Log: Database update completed");

						if (!isNewVersionAvailable) initOptions.successCallback();
						resolve(true);
					} catch (e: any) {
						reject(e);
					}
				})
				.catch((error) => {
					if (error.response) {
						reject(error.responderEnd);
					}
				});
		});
	}

	static async getRandomAnimeList(limit: number = 24): Promise<AnimeList> {
		const anime = await this.db.animeOffline.toArray();
		return this.getRandomRecords(anime, limit);
	}

	static getAnime(id: number): Promise<Anime> {
		return this.db.animeOffline.get(id);
	}

	static async searchAnime(
		keyword: string,
		limit: number = 20,
		skip: number = 0
	): Promise<AnimeList> {
		const key = keyword.toLowerCase();
		const animeList = await this.db.animeOffline
			.filter((anime: Anime) => {
				const title = anime.title.toLowerCase();
				return (
					title.indexOf(key) > -1 ||
					anime.tags.includes(key) ||
					anime.synonyms.includes(key)
				);
			})
			.offset(skip)
			.limit(limit)
			.toArray();

		return animeList;
	}

	private static getRandomRecords(records: Array<any>, n: number) {
		let result = new Array(n),
			len = records.length,
			taken = new Array(len);
		if (n > len)
			throw new RangeError("getRandom: more elements taken than available");
		while (n--) {
			let x = Math.floor(Math.random() * len);
			result[n] = records[x in taken ? taken[x] : x];
			taken[x] = --len in taken ? taken[len] : len;
		}
		return result;
	}
}
