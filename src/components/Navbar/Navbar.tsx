import React from "react";
import "./Navbar.css";

interface IProps {
	navbarSearchText: string;
	handleNavbarSearchChange(keyword: string): void;
	handleNavbarSearchBtnClick(): void;
}

export function Navbar(props: IProps) {
	return (
		<div className="navbar">
			<div className="navbar-container">
				<a className="navbar-brand" href="./">
					AnemoSearch
				</a>
				<div className="navbar-search">
					<input
						className="navbar-search-input"
						type="text"
						placeholder="Enter anime name here and press ENTER..."
						onChange={(e) => {
							props.handleNavbarSearchChange(e.target.value);
						}}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								props.handleNavbarSearchBtnClick();
							}
						}}
						value={props.navbarSearchText}
					/>
					<button
						className="btn-navbar-search"
						onClick={() => {
							props.handleNavbarSearchBtnClick();
						}}
					>
						Search
					</button>
				</div>
				<div className="navbar-links">
					<a
						href="https://github.com/manami-project/anime-offline-database/"
						target="_blank"
					>
						AnimeOffline
					</a>
					<a href="https://github.com/ipmanlk/anemo-search" target="_blank">
						Github
					</a>
				</div>
			</div>
		</div>
	);
}
