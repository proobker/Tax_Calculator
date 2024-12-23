function calculateTax() { // Function to calculate tax based on user inputs
            const monthlyIncome = parseFloat(document.getElementById('monthlyIncome').value) || 0; // Get monthly income from input field, default to 0 if invalid
            const dearnessAllowance = parseFloat(document.getElementById('dearnessAllowance').value) || 0; // Get dearness allowance from input field, default to 0 if invalid
            const festivalAllowance = parseFloat(document.getElementById('festivalAllowance').value) || 0; // Get festival allowance from input field, default to 0 if invalid
            const clothingAllowance = parseFloat(document.getElementById('clothingAllowance').value) || 0; // Get clothing allowance from input field, default to 0 if invalid
            const insurance = Math.min(parseFloat(document.getElementById('insurance').value) || 0, 40000); // Get insurance premium, limit to a maximum of 40,000
            const citInput = parseFloat(document.getElementById('cit').value) || 0; // Get CIT amount from input field, default to 0 if invalid
            const filingStatus = document.querySelector('input[name="filingStatus"]:checked').value; // Get selected filing status (single or married)
            const epfPercentage = parseFloat(document.getElementById('epf').value) || 0; // Get EPF percentage from input field, default to 0 if invalid
            const basicYearlyIncome = monthlyIncome * 12; //Calculate yearly basic income
            const donate = parseFloat(document.getElementById('donation').value) || 0; //Get Donation amount from input field, default to 0 if invalid
            const annualIncome = (monthlyIncome + dearnessAllowance) * 12 + festivalAllowance + clothingAllowance; // Calculate total annual income from monthly income and allowances
            const citAmount = citInput * 12 //multiply the cit amount by 12
            const epfAmount = (basicYearlyIncome * epfPercentage * 2) / 100; // Calculate EPF deduction based on percentage
            let sumEpfCit = 0; // Define sumEpfCit variable
            const conditionEPF = Math.min(1 / 3 * annualIncome, 300000); //one third of the income or 300000
            if (epfAmount + citAmount >= conditionEPF) {
                sumEpfCit = (epfAmount + citAmount) - conditionEPF;
            } else {
                sumEpfCit = epfAmount + citAmount;
            }
            var totalDeductions = insurance + sumEpfCit + donate; // Calculate total deductions (EPF, insurance, and CIT)
            const finalTaxableIncome = annualIncome - totalDeductions; // Calculate final taxable income after deductions
            let tax = 0; // Variable to store the total tax
            let taxBreakdown = ""; // Variable to store the breakdown of the tax calculation
            // Define tax brackets based on filing status
            const brackets = filingStatus === "married" ? [ // Set tax brackets for married individuals
                { limit: 600000, rate: 0.01 }, // Tax rate 1% for income up to 600,000
                { limit: 800000, rate: 0.10 }, // Tax rate 10% for income up to 800,000
                { limit: 1100000, rate: 0.20 }, // Tax rate 20% for income up to 1,100,000
                { limit: 2000000, rate: 0.30 }, // Tax rate 30% for income up to 2,000,000
                { limit: 5000000, rate: 0.36 }, // Tax rate 36% for income up to 5,000,000
                { rate: 0.39 } // Tax rate 39% for income over 5,000,000
            ] : [ // Set tax brackets for single individuals
                { limit: 500000, rate: 0.01 }, // Tax rate 1% for income up to 500,000
                { limit: 700000, rate: 0.10 }, // Tax rate 10% for income up to 700,000
                { limit: 1000000, rate: 0.20 }, // Tax rate 20% for income up to 1,000,000
                { limit: 2000000, rate: 0.30 }, // Tax rate 30% for income up to 2,000,000
                { limit: 5000000, rate: 0.36 }, // Tax rate 36% for income up to 5,000,000
                { rate: 0.39 } // Tax rate 39% for income over 5,000,000
            ];
            // Calculate tax based on the tax brackets
            let previousLimit = 0; // Variable to store the previous limit of the bracket
            for (let i = 0; i < brackets.length; i++) { // Loop through the tax brackets
                const { limit, rate } = brackets[i]; // Destructure limit and rate for each bracket
                if (finalTaxableIncome > previousLimit) { // If the final taxable income exceeds the previous limit
                    const taxableAmount = limit ? Math.min(finalTaxableIncome, limit) - previousLimit : finalTaxableIncome - previousLimit; // Calculate the taxable amount within the current bracket
                    const taxForBracket = taxableAmount * rate; // Calculate tax for this bracket
                    tax += taxForBracket; // Add tax for this bracket to total tax
                    taxBreakdown += `<tr><td>${(rate * 100).toFixed(0)}%</td><td>Rs.${previousLimit + 1} to Rs.${limit}</td><td>Rs.${taxForBracket.toFixed(2)}</td></tr>`; // Add tax breakdown for this bracket to the table
                    previousLimit = limit; // Update the previous limit to the current bracket's limit
                } else {
                    break; // Break the loop if taxable income does not exceed the current bracket
                }
            }
            // Constructing the output table
            let output = `
    <table class="result-table"> 
      <thead class="result-table">
        <tr>
           <h2>Calculating Taxable income</h2>
          <th class="result-table">Particulars</th>
          <th class="result-table">Amount</th>
        </tr>
      </thead>
      <tbody class="result-table">
        <tr><td>Monthly Basic Salary</td><td>Rs ${monthlyIncome.toFixed(2)}</td></tr>
        <tr><td>Your Annual Basic Salary</td><td>Rs ${(monthlyIncome * 12).toFixed(2)}</td></tr>
        <tr><td>Annual Dearness Allowance</td><td>Rs ${(dearnessAllowance * 12).toFixed(2)}</td></tr>
        <tr><td>Annual Festival Allowance</td><td>Rs ${festivalAllowance.toFixed(2)}</td></tr>
        <tr><td>Annual Clothing Allowance</td><td>Rs ${clothingAllowance.toFixed(2)}</td></tr>
        <tr><td><h1><bold><u>Total Assessable Income</td><td><strong>Rs ${annualIncome.toFixed(2)}</strong></u></bold></h1></td></tr>
      </tbody>
      </table>
      <br><br>
      <table>
      <tbody class="result-table">
        <h2>Calculating Tax Deduction</h2>
        <th class="result-table">Particulars</th>
        <th class="result-table">Amount</th>
        <tr><td>Citizen Investment Trust Deduction (Yearly)</td><td>Rs ${citAmount.toFixed(2)}</td></tr>
        <tr><td>Employees' Provident Fund (Yearly)</td><td>Rs ${epfAmount.toFixed(2)}</td></tr>
        <tr><td>Life Insurance Premium (Yearly)</td><td>Rs ${insurance.toFixed(2)}</td></tr>
        <tr><td>Donations (Yearly)</td><td>Rs ${donate.toFixed(2)}</td></tr>
        <tr><td><h1><bold><u>Total Tax Free Amount</td><td><stron+g>Rs ${totalDeductions.toFixed(2)}</strong></u></bold></h1></td></tr>
        <tr><td><h1><bold><u>Final Taxable Income</strong></td><td><strong>Rs ${finalTaxableIncome.toFixed(2)}</u></bold></h1></td></tr>
      </tbody>
    </table>
    <br>
    <h2>Tax Calculation Breakdown:</h2>
    <table style="width: 100%(; border-collapse: collapse;">
      <thead class="result-table">
        <tr>
          <th>Tax Rate</th>
          <th>Taxable Income</th>
          <th>Tax</th>
        </tr>
      </thead>
      <tbody class="result-table">
        ${taxBreakdown}
      </tbody>
    </table>
    <h1><u>Total Tax Paying Amount: Rs ${tax.toFixed(2)}</u></h1>
  `;
            // Display the table output
            document.getElementById('result').innerHTML = output; // Set the HTML content of the result div to the output table
        }

        function resetFields() {
            document.getElementById('monthlyIncome').value = ''; //Reset Monthly income Field
            document.getElementById('dearnessAllowance').value = ''; //Reset Dearness Allowance Field
            document.getElementById('festivalAllowance').value = ''; //Reset Festival Allowance Field
            document.getElementById('clothingAllowance').value = ''; //Reset CLothing Allowance Field
            document.getElementById('donation').value = ''; //Reset Donation Field
            document.getElementById('insurance').value = ''; //Reset Life insurance Field
            document.getElementById('epf').value = ''; //Reset Employees' Provident Fund (EPF) Field
            document.getElementById('cit').value = ''; //Reset Citizen Investment Trust (CIT) Field
            document.querySelector('input[name="filingStatus"][value="single"]').checked = true; //Reset Relationship Status Field
            document.getElementById('result').innerHTML = ''; //Reset Result Field
        }