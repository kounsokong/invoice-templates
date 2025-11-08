// ==================== URL PARAMETER PARSING ====================
function getUrlParams() {
    const params = new URLSearchParams(window.location.search);
    const data = {};
    for (const [key, value] of params.entries()) {
        data[key] = decodeURIComponent(value);
    }
    return data;
}

// ==================== UTILITY FUNCTIONS ====================
function formatCurrency(value) {
    return '$' + parseFloat(value || 0).toFixed(2);
}

function changeTemplate(template) {
    document.body.className = 'template-' + template;
    
    // Update URL without reload
    const params = getUrlParams();
    params.template = template;
    const newUrl = window.location.pathname + '?' + new URLSearchParams(params).toString();
    window.history.replaceState({}, '', newUrl);
}

// ==================== POPULATE INVOICE DATA ====================
function populateInvoice() {
    const params = getUrlParams();

    // Set template
    const template = params.template || 'professional';
    document.getElementById('templateSelect').value = template;
    document.body.className = 'template-' + template;

    // Document type
    if (params.documentType) {
        document.getElementById('documentType').textContent = params.documentType.toUpperCase();
    }

    // Company info
    if (params.companyName) {
        document.getElementById('companyName').textContent = params.companyName;
    }
    if (params.companyAddress) {
        document.getElementById('companyAddress').innerHTML = params.companyAddress.replace(/\\n/g, '<br>');
    }

    // Invoice meta
    if (params.invoiceNumber) {
        document.getElementById('invoiceNumber').textContent = params.invoiceNumber;
    }
    if (params.invoiceDate) {
        document.getElementById('invoiceDate').textContent = params.invoiceDate;
    }
    if (params.dueDate) {
        document.getElementById('dueDate').textContent = params.dueDate;
    }

    // Customer info
    if (params.customerName) {
        document.getElementById('customerName').textContent = params.customerName;
    }
    if (params.customerAddress) {
        document.getElementById('customerAddress').textContent = params.customerAddress;
    }
    if (params.customerEmail) {
        document.getElementById('customerEmail').textContent = params.customerEmail;
    }

    // Line items
    if (params.items) {
        try {
            const items = JSON.parse(params.items);
            const tbody = document.getElementById('itemsBody');
            tbody.innerHTML = '';

            let subtotal = 0;

            items.forEach(item => {
                const amount = (parseFloat(item.quantity) || 0) * (parseFloat(item.price) || 0);
                subtotal += amount;

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${item.description || ''}</td>
                    <td class="text-center">${item.quantity || 0}</td>
                    <td class="text-right">${formatCurrency(item.price)}</td>
                    <td class="text-right">${formatCurrency(amount)}</td>
                `;
                tbody.appendChild(row);
            });

            // Calculate totals
            const taxRate = parseFloat(params.taxRate || 0);
            const tax = subtotal * (taxRate / 100);
            const total = subtotal + tax;

            document.getElementById('subtotal').textContent = formatCurrency(subtotal);
            document.getElementById('taxRate').textContent = taxRate.toFixed(2);
            document.getElementById('tax').textContent = formatCurrency(tax);
            document.getElementById('total').textContent = formatCurrency(total);

        } catch (e) {
            console.error('Error parsing items:', e);
            document.getElementById('itemsBody').innerHTML = '<tr><td colspan="4" style="text-align:center;color:#999;">Error loading items</td></tr>';
        }
    }

    // Notes
    if (params.notes) {
        document.getElementById('notes').innerHTML = params.notes.replace(/\\n/g, '<br>');
    }
}

// ==================== INITIALIZE ====================
document.addEventListener('DOMContentLoaded', populateInvoice);
```

---

## **How to Upload to GitHub:**

1. Go to your repository: `https://github.com/kounsokong/invoice-templates`
2. Upload all 4 files to the root directory
3. Wait 1-2 minutes for GitHub Pages to update
4. Your invoice system will be live at: `https://kounsokong.github.io/invoice-templates/`

---

## **Your AppSheet Action Formula:**
```
CONCATENATE(
  "https://kounsokong.github.io/invoice-templates/?",
  "template=modern",
  "&invoiceNumber=", [Invoice#],
  "&invoiceDate=", TEXT([Invoice_Date],"DD/MM/YYYY"),
  "&dueDate=", TEXT([Due Date],"DD/MM/YYYY"),
  "&customerName=", ENCODEURL([Client_Name]),
  "&customerAddress=", ENCODEURL([Client_Address]),
  "&customerEmail=", [Client_Email],
  "&items=", ENCODEURL([Items_JSON]),
  "&taxRate=10",
  "&notes=Thank%20you%20for%20your%20business"
)
