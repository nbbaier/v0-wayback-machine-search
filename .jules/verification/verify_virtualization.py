from playwright.sync_api import sync_playwright

def verify_table_virtualization():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        context = browser.new_context(viewport={'width': 1280, 'height': 800})
        page = context.new_page()

        # Navigate to the table page with a known URL to trigger search
        page.goto("http://localhost:3000/table?url=google.com")

        print("Navigated to page. Waiting for table...")
        # Increase timeout because wayback API might be slow
        try:
            page.wait_for_selector("table", timeout=30000)
            print("Table found")

            page.wait_for_selector("tbody tr", timeout=30000)
            print("Rows found")

            rows = page.locator("tbody tr").count()
            print(f"Number of rows in DOM: {rows}")

            page.screenshot(path=".jules/verification/table_initial.png")
            print("Initial screenshot taken")

        except Exception as e:
            print(f"Error: {e}")
            page.screenshot(path=".jules/verification/error.png")
        finally:
            browser.close()

if __name__ == "__main__":
    verify_table_virtualization()
