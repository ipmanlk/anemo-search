import React from "react";
import "./Modal.css";

interface IProps {
	children: any;
	isVisible: boolean;
	handleModalVisibility(isVisible: boolean): void;
}

export function Modal(props: IProps) {
	return (
		<div
			onClick={(e: any) => {
				if (e.target.classList.contains("modal"))
					props.handleModalVisibility(false);
			}}
			className={props.isVisible ? "modal" : "modal-hidden"}
		>
			<div className="modal-container">
				<button
					className="btn-modal-close"
					onClick={() => {
						props.handleModalVisibility(false);
					}}
				>
					X
				</button>
				<div>{props.children}</div>
			</div>
		</div>
	);
}
