const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const results = document.getElementById("results");
const message = document.getElementById("message");

// API adresas
const API_URL = "https://restcountries.com/v3.1/all?fields=name,capital,flags";

// Mygtukas aktyvus tik tada, kai įvestas tekstas.

searchInput.addEventListener("input", function () {
  searchButton.disabled = searchInput.value.trim().length === 0;
});

// Šalių paieškos funkcija.

async function searchCountries() {
  const searchValue = searchInput.value.trim().toLowerCase();

  // Išvalome ankstesnius rezultatus.

  results.innerHTML = "";
  message.innerHTML = "";
  message.className = "";

  if (searchValue.length === 0) {
    return;
  }

  try {
    // Gauname visas šalis iš API.

    const response = await fetch(API_URL);

    if (!response.ok) {
      throw new Error("Nepavyko gauti duomenų");
    }

    const countries = await response.json();

    // Atrenkame šalis pagal įvestą pavadinimą.

    const matchingCountries = countries.filter((country) => {
      return country.name.common.toLowerCase().includes(searchValue);
    });

    // Jeigu šalių nerasta.

    if (matchingCountries.length === 0) {
      message.textContent =
        "Blogai įvestas žodis arba duomenų apie valstybę nėra.";

      message.className = "error";

      return;
    }

    // Atvaizduojame rastas šalis.

    matchingCountries.forEach((country) => {
      const countryDiv = document.createElement("div");
      countryDiv.classList.add("country");

      // Šalies vėliava.

      const flag = document.createElement("img");
      flag.src = country.flags.png;
      flag.alt = country.name.common + " flag";

      // Šalies pavadinimas.

      const name = document.createElement("h3");
      name.textContent = country.name.common;

      // Šalies sostinė.

      const capital = document.createElement("p");

      capital.textContent =
        "Capital: " +
        (country.capital
          ? country.capital.join(", ")
          : "No capital information");

      // Sudedame elementus į kortelę.

      countryDiv.appendChild(flag);
      countryDiv.appendChild(name);
      countryDiv.appendChild(capital);

      // Pridedame kortelę į rezultatų lauką.

      results.appendChild(countryDiv);
    });

    console.log("Rastos valstybės:", matchingCountries);
  } catch (error) {
    message.textContent =
      "Nepavyko gauti valstybių duomenų. Bandykite dar kartą.";

    message.className = "error";

    console.error("Paieškos klaida:", error);
  }
}

// Paieška paspaudus mygtuką.

searchButton.addEventListener("click", searchCountries);

// Paieška paspaudus Enter.

searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter" && !searchButton.disabled) {
    searchCountries();
  }
});
