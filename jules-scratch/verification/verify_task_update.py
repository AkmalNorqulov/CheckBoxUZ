from playwright.sync_api import sync_playwright, expect
import os

def run_verification(page):
    # Get the absolute path to the HTML file
    file_path = os.path.abspath('index.html')
    # Use the file:// protocol to open the local file
    page.goto(f'file://{file_path}')

    # 1. Add a new task
    page.get_by_placeholder("Add a new task...").fill("My first task")
    page.get_by_role("button", name="+").click()

    # 2. Click the task to edit it
    task_text_element = page.get_by_text("My first task")
    task_text_element.click()

    # 3. Change the task's text
    edit_input = page.locator(".edit-input")
    expect(edit_input).to_be_visible()
    edit_input.fill("My updated task")
    edit_input.press("Enter")

    # 4. Assert that the task text has been updated
    updated_task_text = page.get_by_text("My updated task")
    expect(updated_task_text).to_be_visible()

    # Take a screenshot for visual confirmation
    page.screenshot(path="jules-scratch/verification/verification.png")

def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        run_verification(page)
        browser.close()

if __name__ == "__main__":
    main()