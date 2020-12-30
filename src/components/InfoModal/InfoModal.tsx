import React from "react";
import { Anime } from "../../types";
import { Modal } from "../Modal/Modal";
import "./InfoModal.css";

interface IProps {
	anime?: Anime;
	isInfoModalVisible: boolean;
	handleInfoModalVisibility(isVisible: boolean): void;
}

export function InfoModal(props: IProps) {
	const { anime, isInfoModalVisible } = props;
	return (
		<Modal
			handleModalVisibility={props.handleInfoModalVisibility}
			isVisible={isInfoModalVisible}
		>
			<div className="info-modal">
				<div className="info-modal-container">
					<div>
						<img
							className="info-modal-cover"
							src={anime?.picture}
							onError={(e: any) => {
								e.target.src = "https://i.imgur.com/pmH5UFA.jpg";
							}}
						/>
						<div className="info-modal-meta">
							<span>
								Title: <a>{anime?.title}</a>
							</span>
							<span>
								Type: <a>{anime?.type}</a>
							</span>
							<span>
								Episodes: <a>{anime?.episodes}</a>
							</span>
							<span>
								Status: <a>{anime?.status}</a>
							</span>
							<span>
								Year/Season:
								<a>
									{anime?.animeSeason?.year}-{anime?.animeSeason?.season}
								</a>
							</span>
						</div>
					</div>

					<div className="info-modal-right">
						{anime?.synonyms && anime.synonyms.length > 0 && (
							<div className="info-modal-synonyms">
								<h3>Synonyms</h3>
								<hr />
								<ul>
									{anime?.synonyms.map((s, index) => (
										<li key={index}>{s}</li>
									))}
								</ul>
							</div>
						)}

						{anime?.sources && anime.sources.length > 0 && (
							<div className="info-modal-sources">
								<h3>Sources</h3>
								<hr />
								<ul>
									{anime?.sources?.map((s, index) => (
										<li key={index}>
											<a href={s} target="_blank">
												{s}
											</a>
										</li>
									))}
								</ul>
							</div>
						)}

						{anime?.relations && anime.relations.length > 0 && (
							<div className="info-modal-relations">
								<h3>Relations</h3>
								<hr />
								<ul>
									{anime?.relations?.map((r, index) => (
										<li key={index}>
											<a href={r} target="_blank">
												{r}
											</a>
										</li>
									))}
								</ul>
							</div>
						)}

						{anime?.tags && anime.tags.length > 0 && (
							<div className="info-modal-tags">
								<h3>Tags</h3>
								<hr />
								<ul>
									{anime?.tags.map((t, index) => (
										<li key={index}>{t}</li>
									))}
								</ul>
							</div>
						)}
					</div>
				</div>
			</div>
		</Modal>
	);
}
