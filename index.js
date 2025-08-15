// Desc:   Calculates and displays an invoice for
// Mo's Lawncare Services based on user input.
// Author: Keith Bishop
// Dates:  August 15, 2025

/**
 * A helper function to get a DOM element by its ID.
 * @param {string} id The ID of the DOM element.
 * @returns {HTMLElement} The DOM element.
 */
const $ = (id) => {
  return document.getElementById(id);
};

// Define format options for printing.
const cur2Format = new Intl.NumberFormat("en-CA", {
  style: "currency",
  currency: "CAD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Define format for non-currency numbers (like sq ft).
const numFormat = new Intl.NumberFormat("en-CA", {
  style: "decimal",
});

// Define program constants.
const BORDER_AREA_PERCENT = 0.04;
const MOWING_AREA_PERCENT = 0.95;
const BORDER_COST_PER_SQFT = 0.35;
const MOWING_COST_PER_SQFT = 0.07;
const FERTILIZER_COST_PER_SQFT = 0.05;
const HST_RATE = 0.15;
const ENV_TAX_RATE = 0.014;

/**
 * Processes user input, calculates invoice details, and displays the results.
 */
const processInvoice = () => {
  // 1. Get user inputs from the form.
  const customerName = $("customerName").value;
  const streetAddress = $("streetAddress").value;
  const city = $("city").value;
  const province = $("province").value;
  const postalCode = $("postalCode").value;
  const phone = $("phone").value;
  const sqft = parseFloat($("sqft").value);

  // 2. Validate the square footage input.
  // The 'required' attribute in HTML handles blank fields.
  if (isNaN(sqft) || sqft <= 0) {
    alert("Please enter a valid, positive number for property size.");
    $("sqft").focus();
    return; // Stop execution if input is invalid
  }

  // 3. Perform invoice calculations.
  const borderCost = sqft * BORDER_AREA_PERCENT * BORDER_COST_PER_SQFT;
  const mowingCost = sqft * MOWING_AREA_PERCENT * MOWING_COST_PER_SQFT;
  const fertilizerCost = sqft * FERTILIZER_COST_PER_SQFT;

  const totalCharges = borderCost + mowingCost + fertilizerCost;
  const hst = totalCharges * HST_RATE;
  const envTax = totalCharges * ENV_TAX_RATE;
  const invoiceTotal = totalCharges + hst + envTax;

  // 4. Display the results on the page.
  // Format and display customer details.
  const customerDetails = `${customerName}, ${streetAddress}\n${city}, ${province} ${postalCode}\n${phone}`;
  $("customerDetailsOutput").textContent = customerDetails;

  // Display property size.
  $("propertySizeOut").textContent = numFormat.format(sqft);

  // Populate the invoice table with formatted currency values.
  $("borderCostOut").textContent = cur2Format.format(borderCost);
  $("mowingCostOut").textContent = cur2Format.format(mowingCost);
  $("fertilizerCostOut").textContent = cur2Format.format(fertilizerCost);
  $("totalChargesOut").textContent = cur2Format.format(totalCharges);
  $("hstOut").textContent = cur2Format.format(hst);
  $("envTaxOut").textContent = cur2Format.format(envTax);
  $("invoiceTotalOut").textContent = cur2Format.format(invoiceTotal);

  // Make the output section visible.
  $("invoice-output").style.display = "block";
};

/**
 * Main program execution starts here, after the DOM is fully loaded.
 * It attaches the event listener to the button.
 */
window.addEventListener("DOMContentLoaded", () => {
  // Attach the processInvoice function to the button's click event.
  $("calculateBtn").addEventListener("click", processInvoice);

  // Add a click listener for the Print button, if it exists.
  const printBtn = $("printBtn");
  if (printBtn) {
    printBtn.addEventListener("click", () => {
      window.print();
    });
  }

  /**
   * Converts a string to Title Case (capitalizes the first letter of each word).
   * @param {string} str The string to convert.
   * @returns {string} The Title Cased string.
   */
  const toTitleCase = (str) => {
    if (!str) return "";
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  /**
   * Adds auto-formatting to an input field to convert its value to Title Case.
   * @param {HTMLInputElement} inputElement The input element to format.
   */
  const autoFormatTitleCase = (inputElement) => {
    inputElement.addEventListener("input", (e) => {
      // Preserve cursor position to avoid it jumping to the end
      const start = e.target.selectionStart;
      const end = e.target.selectionEnd;
      e.target.value = toTitleCase(e.target.value);
      e.target.setSelectionRange(start, end);
    });
  };

  /**
   * Adds auto-formatting for the postal code input field.
   * Converts to uppercase and adds a space.
   * @param {HTMLInputElement} inputElement The postal code input element.
   */
  const autoFormatPostalCode = (inputElement) => {
    inputElement.addEventListener("input", (e) => {
      let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
      if (value.length > 3) {
        value = value.slice(0, 3) + " " + value.slice(3);
      }
      e.target.value = value;
    });
  };

  /**
   * Adds auto-formatting for the phone number input field.
   * As the user types, it adds hyphens to match the xxx-xxx-xxxx format.
   * @param {HTMLInputElement} inputElement The phone number input element.
   */
  const autoFormatPhoneNumber = (inputElement) => {
    inputElement.addEventListener("input", (e) => {
      // 1. Remove all non-digit characters from the input value.
      let digits = e.target.value.replace(/\D/g, "");

      // 2. Rebuild the string with hyphens in the correct positions.
      let formattedValue = "";
      if (digits.length > 0) {
        formattedValue = digits.substring(0, 3);
      }
      if (digits.length > 3) {
        formattedValue += "-" + digits.substring(3, 6);
      }
      if (digits.length > 6) {
        formattedValue += "-" + digits.substring(6, 10);
      }

      // 3. Update the input field's value with the formatted version.
      e.target.value = formattedValue;
    });
  };

  // Attach auto-formatting logic to input fields.
  autoFormatTitleCase($("customerName"));
  autoFormatTitleCase($("streetAddress"));
  autoFormatTitleCase($("city"));
  autoFormatPostalCode($("postalCode"));
  autoFormatPhoneNumber($("phone"));

  /**
   * Enables navigation between form inputs using the Enter key, similar to Tab.
   * @param {HTMLFormElement} formElement The form to apply the behavior to.
   */
  const enableEnterKeyNavigation = (formElement) => {
    // Get all focusable elements within the form in the order they appear.
    const focusableElements = Array.from(
      formElement.querySelectorAll("input, select, button")
    );

    focusableElements.forEach((element, index) => {
      element.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
          // If the element is a button, allow the default 'click' or 'reset' action.
          if (element.tagName === "BUTTON") {
            return; // Do not prevent default, let the browser handle the click.
          }

          // For input fields, prevent default and move to the next element.
          event.preventDefault();
          const nextElement = focusableElements[index + 1];
          if (nextElement) {
            nextElement.focus();
          }
        }
      });
    });
  };

  // Attach the Enter key navigation logic to the invoice form.
  const invoiceForm = $("invoiceForm");
  enableEnterKeyNavigation(invoiceForm);

  // Add a listener for the form's reset event.
  invoiceForm.addEventListener("reset", () => {
    // Hide the invoice output when the form is cleared.
    $("invoice-output").style.display = "none";

    // Set focus back to the first input field for a better UX.
    $("customerName").focus();
  });
});
