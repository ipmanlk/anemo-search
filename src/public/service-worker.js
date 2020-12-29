const appCache = "v1";

self.addEventListener("install", (event) => {
	console.log("Log: ServiceWorker installation successful");

	// cache initially
	event.waitUntil(
		caches.open(appCache).then((cache) => {
			return cache.addAll(["/", "/index.html"]);
		})
	);
});

self.addEventListener("activate", async (event) => {
	const keyList = await caches.keys();
	keyList.map((key) => {
		if (key !== appCache) {
			return caches.delete(key);
		}
	});
	console.log("Log: ServiceWorker activation successful");
});

function isImage(fetchRequest) {
	return fetchRequest.method === "GET" && fetchRequest.destination === "image";
}

self.addEventListener("fetch", (event) => {
	event.respondWith(
		caches.open(appCache).then((cache) => {
			return cache.match(event.request).then((cachedResponse) => {
				const cacheUrlPatterns = [
					"index",
					"https://fonts.googleapis.com",
					"https://i.imgur.com/pmH5UFA.jpg",
					"https://i.imgur.com/SQoH3OL.jpg",
					"https://fonts.gstatic.com",
				];
				let isMatch = false;
				cacheUrlPatterns.every((p) => {
					if (event.request.url.includes(p)) {
						isMatch = true;
						return false;
					}
					return true;
				});
				if (cachedResponse) {
					//Case: A cached response already exists
					console.log("Log: Serving: " + event.request.url);
					return cachedResponse;
				} else if (isMatch) {
					//Case: A cached response doesn't exist and needs to be cached
					//Request, cache and respond with required resource
					return fetch(event.request)
						.then((fetchedResponse) => {
							console.log("Log: Caching: " + event.request.url);
							cache.put(event.request, fetchedResponse.clone());
							return fetchedResponse;
						})
						.catch((error) => {
							return new Response(
								JSON.stringify({
									status: false,
									serverError:
										"Oops! Something's up with the network connection",
								})
							);
						});
				} else {
					//Case: A cached response doesn't exist and no need of caching
					//Request and respond with required resource without caching
					return fetch(event.request).catch((error) => {
						if (isImage(event.request)) {
							return new Response("https://i.imgur.com/pmH5UFA.jpg", {
								headers: { "Content-Type": "image/jpeg" },
							});
						} else {
							return new Response(
								JSON.stringify({
									status: false,
									serverError:
										"Oops! Something's up with the network connection",
								})
							);
						}
					});
				}
			});
		})
	);
});
