document.addEventListener("DOMContentLoaded", () => {
  const beep = document.getElementById("beep-sound");

  // Track lock state for each system
  const SYSTEMS = {
    lok: {
      candidates: {
        c1: { name: "A. Sharma", party: "Unity Party" },
        c2: { name: "B. Singh", party: "Progress Front" },
        c3: { name: "C. Kumar", party: "Reform Alliance" },
        c4: { name: "D. Verma", party: "Citizen First" }
      },
      red: document.getElementById("lok-red"),
      green: document.getElementById("lok-green"),
      status: document.getElementById("lok-status"),
      slip: document.getElementById("lok-slip"),
      locked: true
    },
    vid: {
      candidates: {
        c1: { name: "E. Patel", party: "Bright Future" },
        c2: { name: "F. Khan", party: "Green Alliance" },
        c3: { name: "G. Das", party: "Knowledge Party" },
        c4: { name: "H. Mehta", party: "National Front" }
      },
      red: document.getElementById("vid-red"),
      green: document.getElementById("vid-green"),
      status: document.getElementById("vid-status"),
      slip: document.getElementById("vid-slip"),
      locked: true
    }
  };

  // Play beep sound
  function playBeep() {
    if (!beep) return;
    beep.currentTime = 0;
    beep.play().catch(() => console.warn("Beep blocked until user interacts."));
  }

  // Control lights
  function setLights(system, redActive, greenActive) {
    system.red.classList.toggle("active", !!redActive);
    system.green.classList.toggle("active", !!greenActive);
  }

  // Lock/unlock helpers
  function lockSystem(system, message = "Machine locked") {
    system.locked = true;
    setLights(system, true, false);
    system.status.textContent = message;
    disableButtons(system, true);
  }

  function unlockSystem(system, message = "Ready to cast vote") {
    system.locked = false;
    setLights(system, false, true);
    system.status.textContent = message;
    disableButtons(system, false);
  }

  function disableButtons(system, disabled) {
    const sysKey = system === SYSTEMS.lok ? "lok" : "vid";
    document.querySelectorAll(`.vote-btn[data-system="${sysKey}"]`)
      .forEach(btn => btn.disabled = disabled);
  }

  // Show VVPAT slip
  function showSlip(system, candidate) {
    system.slip.innerHTML = `
      <h3>VVPAT Confirmation</h3>
      <p><strong>Candidate:</strong> ${candidate.name}</p>
      <p><strong>Party:</strong> ${candidate.party}</p>
      <p style="font-size:0.85rem; color:#6b7280;">(This slip will disappear in 7 seconds)</p>
    `;
    system.slip.classList.add("show");
    setTimeout(() => system.slip.classList.remove("show"), 7000);
  }

  // Boot sequence
  // Lok Sabha unlocks after boot
  setLights(SYSTEMS.lok, true, false);
  SYSTEMS.lok.status.textContent = "Initializing...";
  setTimeout(() => {
    unlockSystem(SYSTEMS.lok);
  }, 2000);

  // Vidhan Sabha stays locked initially
  lockSystem(SYSTEMS.vid, "Locked until Lok Sabha vote");

  // Voting logic
  document.querySelectorAll(".vote-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const sysKey = btn.dataset.system;
      const candidateId = btn.dataset.id;
      const system = SYSTEMS[sysKey];
      const candidate = system.candidates[candidateId];

      // Prevent voting if locked
      if (system.locked) {
        system.status.textContent = "Machine is locked!";
        return;
      }

      playBeep();
      showSlip(system, candidate);
      setLights(system, false, false);
      system.status.textContent = "";

      // Unlock Vidhan Sabha only after Lok Sabha vote
      if (sysKey === "lok") {
        setTimeout(() => {
          unlockSystem(SYSTEMS.vid);
        }, 200);
      }

      // Lock the machine again after slip disappears
      setTimeout(() => {
        lockSystem(system);
      }, 100);
    });
  });
});
