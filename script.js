// Add after populateInvoice() function in script.js

function populateKhmerTemplate(params) {
    // Add document title
    const header = document.querySelector('.header');
    if (document.body.classList.contains('template-khmer')) {
        // Add Khmer company info
        const companyInfo = document.querySelector('.company-info');
        companyInfo.innerHTML = `
            <div style="font-size: 14px;">អង្គបូឌៀ ឡូជីស្ទីក ឯ.ក</div>
            <div style="font-size: 14px;">吴哥物流有限公司</div>
            <h1>${params.companyName || 'Angkobodia Logistics Co., Ltd'}</h1>
            <p style="font-size: 13px; font-weight: normal;">គោលនយោបាយអាករ (VATTIN): K008-100314888</p>
            <p>${params.companyAddress || 'No. W41, Room G3, Ground Floor, City Tower Building<br>Mao Tse Tong Blvd, Phnom Penh<br>Tel: 023 434 304/31'}</p>
        `;
        
        // Add document title after header
        if (!document.querySelector('.document-title')) {
            const titleDiv = document.createElement('div');
            titleDiv.className = 'document-title';
            titleDiv.innerHTML = '<h2>វិក្កយបត្រពន្ធ<br>TAX INVOICE</h2>';
            header.after(titleDiv);
        }
        
        // Add invoice info on right
        const billTo = document.querySelector('.bill-to');
        if (!document.querySelector('.invoice-info-right')) {
            const invoiceInfoRight = document.createElement('div');
            invoiceInfoRight.className = 'invoice-info-right';
            invoiceInfoRight.innerHTML = `
                <p><strong>Invoice No:</strong> <span id="khmerInvoiceNumber">${params.invoiceNumber || 'INV-001'}</span></p>
                <p><strong>Date:</strong> <span id="khmerInvoiceDate">${params.invoiceDate || ''}</span></p>
            `;
            billTo.after(invoiceInfoRight);
        }
        
        // Update table headers to Khmer
        const thead = document.querySelector('.items-table thead tr');
        thead.innerHTML = `
            <th style="width: 50px;">ល.រ<br>No</th>
            <th>បរិយាយមុខទំនិញ<br>Description</th>
            <th style="width: 80px;">បរិមាណ<br>Quantity</th>
            <th style="width: 100px;">តម្លៃឯកតា<br>Unit Price</th>
            <th style="width: 120px;">តម្លៃសរុប<br>Amount (USD)</th>
        `;
        
        // Add exchange rate
        const totals = document.querySelector('.totals');
        if (!document.querySelector('.exchange-rate')) {
            const exchangeDiv = document.createElement('div');
            exchangeDiv.className = 'exchange-rate';
            exchangeDiv.innerHTML = 'អត្រាប្តូរប្រាក់ / Exchange Rate: 4,020';
            totals.before(exchangeDiv);
        }
        
        // Update totals labels
        document.querySelector('.totals').innerHTML = `
            <div class="totals-row">
                <span>សរុប / Subtotal:</span>
                <span id="subtotal">$0.00</span>
            </div>
            <div class="totals-row">
                <span>អាករលើតម្លៃបន្ថែម (VAT <span id="taxRate">0</span>%):</span>
                <span id="tax">$0.00</span>
            </div>
            <div class="totals-row total">
                <span>សរុបរួមជាដុល្លារ / Grand Total USD:</span>
                <span id="total">$0.00</span>
            </div>
            <div class="totals-row">
                <span>សរុបរួមជារៀល / Grand Total KHR:</span>
                <span id="totalKHR">0៛</span>
            </div>
        `;
        
        // Add signatures
        const footer = document.querySelector('.footer');
        footer.innerHTML = `
            <div class="signature">
                <p style="margin-top: 5px;">Customer's Signature & Name<br>ហត្ថលេខា និងឈ្មោះអតិថិជន</p>
            </div>
            <div class="signature">
                <p style="margin-top: 5px;">Seller's Signature & Name<br>ហត្ថលេខា និងឈ្មោះអ្នកលក់</p>
            </div>
        `;
        
        // Add note
        if (!document.querySelector('.note-section')) {
            const noteDiv = document.createElement('div');
            noteDiv.className = 'note-section';
            noteDiv.innerHTML = 'Note: Original Invoice for Customer, Copied Invoice for Seller.';
            footer.after(noteDiv);
        }
    }
}

// Update the populateInvoice function to call this
// Add this at the end of populateInvoice() function, before the closing brace:

    // Handle Khmer template special formatting
    if (template === 'khmer') {
        populateKhmerTemplate(params);
        
        // Update KHR total if available
        const totalUSD = parseFloat(document.getElementById('total').textContent.replace('$', ''));
        const totalKHR = Math.round(totalUSD * 4020);
        const totalKHRElement = document.getElementById('totalKHR');
        if (totalKHRElement) {
            totalKHRElement.textContent = totalKHR.toLocaleString() + '៛';
        }
    }
```

## **Summary of Changes:**

1. ✅ Added "Khmer Tax Invoice" option to template dropdown
2. ✅ Created Khmer template styles in `templates.css`
3. ✅ Added JavaScript to handle special Khmer formatting
4. ✅ Bilingual headers (Khmer/English)
5. ✅ Dual currency display (USD and KHR)
6. ✅ Signature sections for both parties
7. ✅ Exchange rate display

## **Usage in AppSheet:**
```
CONCATENATE(
  "https://kounsokong.github.io/invoice-templates/?",
  "template=khmer",
  "&invoiceNumber=", [Invoice#],
  "&invoiceDate=", TEXT([Invoice_Date],"MM/DD/YYYY"),
  "&customerName=", ENCODEURL([Client_Name]),
  "&customerAddress=", ENCODEURL([Client_Address]),
  "&items=", ENCODEURL([Items_JSON]),
  "&taxRate=10"
)
