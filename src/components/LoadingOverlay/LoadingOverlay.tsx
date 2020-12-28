import React from "react";
import "./LoadingOverlay.css";

interface IProps {
	text: string;
	progress: string;
	visible: boolean;
	spinnerVisible: boolean;
}

export function LoadingOverlay(props: IProps) {
	return (
		<div
			className={props.visible ? "loading-overlay" : "loading-overlay-hidden"}
		>
			<div>
				{props.spinnerVisible ? (
					<div className="lds-ellipsis">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				) : (
					""
				)}
				{props.progress !== "" ? (
					<h3 className="loading-overlay-progress">{props.progress}</h3>
				) : (
					""
				)}
				<h3 className="loading-overlay-text">{props.text}</h3>
			</div>
		</div>
	);
}
