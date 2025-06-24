// Minimalne pseudo-ikony
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.input-row i.fa-user')
            .forEach(icon => icon.textContent = '👤');
    document.querySelectorAll('.input-row i.fa-lock')
            .forEach(icon => icon.textContent = '🔒');
    document.querySelectorAll('.input-row i.fa-search')
            .forEach(icon => icon.textContent = '🔎');
  });
  
  const statuses      = ["Nowy", "W trakcie", "Zakończony", "Odrzucony", "Oczekuje"];
  const femaleNames   = ["Anna", "Katarzyna", "Joanna", "Agnieszka", "Ewa"];
  const maleNames     = ["Piotr", "Marek", "Tomasz", "Paweł", "Marcin"];
  const realNames     = [...femaleNames, ...maleNames];
  const sampleComments = [
    "Testowy komentarz: wszystko w porządku.",
    "Komentarz: wymagane dalsze sprawdzenie.",
    "Rekord wymaga aktualizacji.",
    "Brak zastrzeżeń.",
    "Dane weryfikowane."
  ];
  const maritalStatus = [
    "Kawaler/Panna",
    "Żonaty/Zamężna",
    "Rozwiedziony/rozwiedziona",
    "Wdowiec/Wdowa"
  ];
  const jobs = [
    "Inżynier", "Lekarz", "Nauczyciel",
    "Programista", "Kierowca", "Architekt", "Ekonomista"
  ];
  
  function getRandomDate() {
    const start = new Date(1960, 0, 1).getTime();
    const end   = new Date(2024,11,31).getTime();
    return new Date(start + Math.random() * (end - start))
           .toLocaleDateString();
  }
  
  // Generacja 133 wniosków
  const wnioski = [];
  for (let i = 1; i <= 133; i++) {
    const imie    = realNames[Math.floor(Math.random()*realNames.length)];
    const comment = sampleComments[Math.floor(Math.random()*sampleComments.length)];
    wnioski.push({
      numer: i,
      wniosek: "wniosek " + i,
      imie,
      status: statuses[(i - 1) % statuses.length],
      dataUtworzenia: getRandomDate(),
      komentarz: comment,
      plec: femaleNames.includes(imie) ? "Kobieta" : "Mężczyzna",
      wiek: 18 + Math.floor(Math.random() * 73),
      stanCywilny: maritalStatus[Math.floor(Math.random()*maritalStatus.length)],
      zawod: jobs[Math.floor(Math.random()*jobs.length)]
    });
  }
  
  const debugMode = true;
  function logDebug(message, type="info") {
    if (!debugMode) return;
    const logPanel = document.getElementById("logPanel");
    logPanel.style.display = "block";
    const entry = document.createElement("div");
    entry.classList.add("log-entry", "log-" + type);
    entry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logPanel.appendChild(entry);
    logPanel.scrollTop = logPanel.scrollHeight;
    console.log("DEBUG:", message);
  }
  
  /* ---------- Inicjalizacja ---------- */
  function init() {
    document.getElementById("loginButton").addEventListener("click", login);
    document.getElementById("username")
            .addEventListener("keydown", e => e.key==="Enter" && document.getElementById("password").focus());
    document.getElementById("password")
            .addEventListener("keydown", e => e.key==="Enter" && login());
    document.getElementById("searchButton").addEventListener("click", search);
    document.getElementById("resetButton").addEventListener("click", resetSearch);
    document.getElementById("searchInput")
            .addEventListener("keydown", e => e.key==="Enter" && search());
    document.getElementById("logoutButtonTopBar").addEventListener("click", logout);
    document.getElementById("toggleLogsBtn").addEventListener("click", toggleLogPanel);
    document.getElementById("username").focus();
  }
  
  let logsCollapsed = false;
  function toggleLogPanel() {
    const container = document.getElementById("logPanelContainer");
    logsCollapsed = !logsCollapsed;
    if (logsCollapsed) {
      container.style.width = "40px";
      document.getElementById("logPanel").style.display = "none";
      document.getElementById("logPanelHeader").style.justifyContent = "center";
      document.getElementById("toggleLogsBtn").textContent = ">>";
      logDebug("Panel logów zminimalizowano", "info");
    } else {
      container.style.width = "320px";
      document.getElementById("logPanel").style.display = "block";
      document.getElementById("logPanelHeader").style.justifyContent = "space-between";
      document.getElementById("toggleLogsBtn").textContent = "||";
      logDebug("Panel logów przywrócono", "info");
    }
  }
  
  function login() {
    const user = document.getElementById("username").value.trim();
    const pass = document.getElementById("password").value.trim();
    const loginError   = document.getElementById("loginError");
    const loginSection = document.getElementById("loginSection");
  
    if (!user || !pass) {
      loginError.textContent = "Wpisz login i hasło!";
      loginError.style.display = "block";
      loginSection.classList.add("shake");
      setTimeout(() => loginSection.classList.remove("shake"), 500);
      logDebug("Nieudane logowanie - puste pola", "error");
      return;
    }
    logDebug("Próba logowania dla: " + user, "info");
  
    setTimeout(() => {
      if (user === "lukasz" && pass === "mistrzu") {
        loginError.style.display = "none";
        loginSection.style.display = "none";
        document.getElementById("searchSection").style.display = "block";
        document.getElementById("topBar").style.display = "flex";
        document.getElementById("userName").textContent = user;
        document.getElementById("userRole").textContent = "ADMIN";
        document.getElementById("searchInput").focus();
        logDebug("Logowanie udane.", "success");
      } else {
        loginError.textContent = "Błędne dane logowania!";
        loginError.style.display = "block";
        loginSection.classList.add("shake");
        setTimeout(() => loginSection.classList.remove("shake"), 500);
        logDebug("Logowanie nieudane.", "error");
      }
    }, 400);
  }
  
  function search() {
    const query        = document.getElementById("searchInput").value.trim().toLowerCase();
    const resultsDiv   = document.getElementById("searchResults");
    const searchError  = document.getElementById("searchError");
    const resultsCount = document.getElementById("resultsCount");
    resultsDiv.innerHTML = "";
    searchError.style.display = "none";
    resultsCount.textContent = "";
    logDebug("Wyszukiwanie: '" + query + "'", "info");
  
    setTimeout(() => {
      let filtered = [];
  
      if (query === "") {
        filtered = wnioski;
        logDebug("Puste zapytanie – wszystkie rekordy (" + filtered.length + ").", "info");
      } else {
        const num = parseInt(query.replace(/\D/g, ""), 10);
        if (!isNaN(num)) {
          filtered = wnioski.filter(item => item.numer === num);
          logDebug("Wyszukiwano rekord o numerze " + num + ". Znaleziono: " + filtered.length, "info");
        }
        if (filtered.length === 0) {
          filtered = wnioski.filter(item => item.wniosek.toLowerCase().includes(query));
          logDebug("Wyszukiwano rekordy zawierające '" + query + "'. Znaleziono: " + filtered.length, "info");
        }
      }
  
      if (filtered.length === 0) {
        searchError.textContent = "Nie znaleziono wyniku.";
        searchError.style.display = "block";
        logDebug("Brak wyników wyszukiwania.", "error");
        return;
      }
  
      const sortCriterion  = document.getElementById("sortSelect").value;
      const sortedRecords  = sortRecords(filtered, sortCriterion);
      sortedRecords.forEach(item => resultsDiv.appendChild(createRecordElement(item)));
      resultsCount.textContent = "Znaleziono: " + sortedRecords.length + " rekordów.";
    }, 300);
  }
  
  function sortRecords(records, criterion) {
    return records.sort((a, b) => {
      if (criterion === "numer") {
        return a.numer - b.numer;
      } else if (criterion === "dataUtworzenia") {
        return new Date(a.dataUtworzenia) - new Date(b.dataUtworzenia);
      } else if (criterion === "imie") {
        return a.imie.localeCompare(b.imie);
      }
      return 0;
    });
  }
  
  function createRecordElement(item) {
    const box = document.createElement("div");
    box.className = "record-box";
    box.setAttribute("data-test", "record-" + item.numer);
    box.innerHTML = `
      <div class="record-header">${item.wniosek}</div>
      <div class="record-details"><strong>Imię:</strong> ${item.imie} |
        <strong>Status:</strong> ${item.status}</div>
      <div class="record-details"><strong>Data:</strong> ${item.dataUtworzenia}</div>
      <div class="record-comment">${item.komentarz}</div>`;
    box.addEventListener("click", () => toggleRecordDetails(box, item));
    return box;
  }
  
  function toggleRecordDetails(box, item) {
    const existing = box.querySelector(".record-expanded");
    if (existing) {
      existing.remove();
      logDebug("Zwinieto szczegóły rekordu " + item.numer, "info");
    } else {
      const details = document.createElement("div");
      details.className = "record-expanded";
      details.innerHTML = `
        <div><strong>Płeć:</strong> ${item.plec}</div>
        <div><strong>Wiek:</strong> ${item.wiek}</div>
        <div><strong>Stan cywilny:</strong> ${item.stanCywilny}</div>
        <div><strong>Zawód:</strong> ${item.zawod}</div>`;
      box.appendChild(details);
      logDebug("Rozwinięto szczegóły rekordu " + item.numer, "info");
    }
  }
  
  function resetSearch() {
    document.getElementById("searchInput").value = "";
    document.getElementById("searchResults").innerHTML = "";
    document.getElementById("searchError").style.display = "none";
    document.getElementById("resultsCount").textContent = "";
    logDebug("Reset wyszukiwania.", "info");
  }
  
  function logout() {
    document.getElementById("searchSection").style.display = "none";
    document.getElementById("loginSection").style.display = "block";
    document.getElementById("topBar").style.display = "none";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    resetSearch();
    document.getElementById("username").focus();
    logDebug("Wylogowano użytkownika.", "info");
  }
  
  document.addEventListener("DOMContentLoaded", init);
  