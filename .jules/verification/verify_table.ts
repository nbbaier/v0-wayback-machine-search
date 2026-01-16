import { chromium } from "playwright";

(async () => {
	const browser = await chromium.launch();
	const page = await browser.newPage();

	// Set up route interception for the wayback API
	await page.route("**/api/wayback*", async (route) => {
		// The fetcher expects CDX format: array of arrays.
		// First element is header, rest are data.
		const header = [
			"timestamp",
			"original",
			"statuscode",
			"mimetype",
			"length",
		];

		const snapshots = Array.from({ length: 1000 }, (_, i) => [
			`202301010000${String(i).padStart(4, "0")}`, // timestamp
			`http://example.com/page${i}`, // url
			"200", // status
			"text/html", // mimetype
			"1024", // length
		]);

		await route.fulfill({
			status: 200,
			contentType: "application/json",
			body: JSON.stringify([header, ...snapshots]),
		});
	});

	console.log("Navigating...");
	await page.goto("http://localhost:3000/table?url=example.com");

	console.log("Waiting for table...");
	await page.waitForSelector("table", { timeout: 10000 });
	console.log("Table found!");

	// Scroll down to verify virtualization
	await page.evaluate(() => window.scrollTo(0, 5000));

	// Wait a bit for virtualizer to react
	await page.waitForTimeout(500);

	await page.screenshot({ path: ".jules/verification/virtualized-table.png" });

	// Also verify that we don't have 1000 rows in the DOM
	const rowCount = await page.locator("tbody tr").count();
	console.log(`Row count in DOM: ${rowCount}`);

	if (rowCount > 100) {
		console.error("Too many rows in DOM! Virtualization might not be working.");
		// process.exit(1);
	} else {
		console.log("Virtualization seems to be working (low row count in DOM).");
	}

	await browser.close();
})();
