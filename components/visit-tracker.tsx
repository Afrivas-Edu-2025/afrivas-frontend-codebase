"use client";

import { useEffect } from "react";
import { collectClientDeviceContext } from "@/lib/security/device-context";

const VISIT_FLAG_KEY = "afrivas_visit_tracked";
const API_BASE_URL =
	process.env.NEXT_PUBLIC_API_URL || "http://localhost:5050/api/v1";

export default function VisitTracker() {
	useEffect(() => {
		if (typeof window === "undefined") return;
		if (sessionStorage.getItem(VISIT_FLAG_KEY)) return;

		const token =
			localStorage.getItem("authToken") || localStorage.getItem("accessToken");

		fetch(`${API_BASE_URL}/auth/visit`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				...(token ? { Authorization: `Bearer ${token}` } : {}),
			},
			body: JSON.stringify({
				clientContext: collectClientDeviceContext(),
			}),
		})
			.then(() => {
				sessionStorage.setItem(VISIT_FLAG_KEY, "1");
			})
			.catch(() => {
				// No UI side effects needed; this runs in background.
			});
	}, []);

	return null;
}
