const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
    const browser = await chromium.launch({ headless: false });
    const page = await browser.newPage();

    try {
        const baseUrl = 'https://www.assist.org/transfer/results?year=75&institution=79&agreement=';
        const endUrl = '&agreementType=from&view=agreement&viewBy=major&viewSendingAgreements=false';

        // Loop through different agreement numbers
        for (let agreement = 1; agreement <= 230; agreement++) {
            // Navigate to the main URL
            const url = `${baseUrl}${agreement}${endUrl}`;
            await page.goto(url, { waitUntil: 'domcontentloaded' });

            // Wait for the search bar and type "cog"
            const searchInput = page.locator('.filterAgreements input[type="search"]');
            await searchInput.waitFor({ state: 'visible' });
            await searchInput.type('cog');
            console.log('Typed "cog" in the search bar.');

            await page.waitForTimeout(500); // Short pause to ensure tab focuses correctly

            // Check if "No results found" appears
            const noResultsFound = page.locator('.text-center');
            const isNoResultsVisible = await noResultsFound.isVisible();
            const noResultsText = await noResultsFound.textContent();

            if (noResultsText && isNoResultsVisible && noResultsText.includes("No results found")) {
                console.log('No results found for "cog". Moving on.');
                continue; // Skip
            }

            // Use Tab and Enter to select the first result
            await page.keyboard.press('Tab');
            await page.waitForTimeout(100); // Short pause
            await page.keyboard.press('Enter');
            console.log('Selected the first result using Tab and Enter.');

            // Wait for the page to load the report container dynamically
            const reportContainer = page.locator('.reportContainer');
            await reportContainer.waitFor({ state: 'attached', timeout: 10000 });
            const reportText = await reportContainer.innerText();

            // Process the text to extract required parts
            const lines = reportText.split('\n').map(line => line.trim()).filter(line => line.length > 0);

            // Extract the first line containing "From"
            const fromLine = lines.find(line => line.includes('From')) || 'No line containing "From" found.';

            // Find the second paragraph starting with "ENGIN 7"
            let enginText = '';
            let isEnginFound = false;
            let isDataFound = false;
            let enginStartIndex = -1;
            let enginEndIndex = -1;
    
            // Find all the occurrences of "ENGIN 7"
            const enginIndexes = lines
                .map((line, index) => (line.includes('ENGIN 7') ? index : -1))
                .filter(index => index !== -1);
    
            // Proceed if there are at least two occurrences of "ENGIN 7"
            if (enginIndexes.length >= 2) {
                enginStartIndex = enginIndexes[1]; // Start from the second occurrence of "ENGIN 7"
                
                // Find the line that contains "DATA C88C" after "ENGIN 7"
                for (let i = enginStartIndex + 1; i < lines.length; i++) {
                    if (lines[i].includes('DATA C88C')) {
                        enginEndIndex = i; // End before the "DATA C88C" line
                        break;
                    }
                }
    
                // Collect the text between "ENGIN 7" and "DATA C88C"
                if (enginStartIndex !== -1 && enginEndIndex !== -1) {
                    enginText = lines.slice(enginStartIndex, enginEndIndex).join('\n');
                }
            }
    
            // Combine results into final output
            const outputText = `${fromLine}\n\n${enginText}\n\n`;
            // Save to file
            const filePath = `./processed_report.txt`;
            fs.appendFileSync(filePath, outputText);
            
            await page.waitForTimeout(2000); // 2-second pause
        }
        console.log(`Complete!`);
    } catch (error) {
        console.error('Error:', error);
    } finally {
        // Close the browser
        await browser.close();
    }
})();
