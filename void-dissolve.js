/*!
 * Void Dissolve — organic singularities + zodiac constellation mode
 * When all three center panels dissolve, primaries form a random zodiac asterism.
 */
(function () {
  'use strict';

  const STORAGE_KEY = 'voidDissolveState';
  const PARTICLE_COUNT = 28;
  const DISSOLVE_MS = 720;
  const RESTORE_MS = 560;
  const OFFSET_RADIUS_MIN = 12;
  const OFFSET_RADIUS_MAX = 28;
  const SINGULARITY_GAP = 36;
  const PRIMARY_IDS = ['todo', 'goals', 'echo'];
  const PANEL_THEME = { todo: 'today', goals: 'goals', echo: 'echo' };
  const reducedMotion = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);

  const ZODIAC = [
  {
    "id": "aries",
    "name": "Aries",
    "caption": "The Ram — a spark of beginnings",
    "yAxis": "down",
    "scale": 100,
    "stars": [
      {
        "id": "hamal",
        "x": -0.72,
        "y": -0.05,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "sheratan",
        "x": 0.05,
        "y": -0.38,
        "role": "anchor",
        "mag": 0.9
      },
      {
        "id": "mesarthim",
        "x": 0.7,
        "y": 0.05,
        "role": "anchor",
        "mag": 0.82
      },
      {
        "id": "delta_ari",
        "x": 0.32,
        "y": 0.48,
        "role": "helper",
        "mag": 0.52
      },
      {
        "id": "epsilon_ari",
        "x": -0.32,
        "y": 0.35,
        "role": "helper",
        "mag": 0.45
      }
    ],
    "anchors": {
      "today": "hamal",
      "goals": "sheratan",
      "echo": "mesarthim"
    },
    "edges": [
      [
        "hamal",
        "sheratan"
      ],
      [
        "sheratan",
        "mesarthim"
      ],
      [
        "mesarthim",
        "delta_ari"
      ],
      [
        "delta_ari",
        "epsilon_ari"
      ],
      [
        "epsilon_ari",
        "hamal"
      ]
    ]
  },
  {
    "id": "taurus",
    "name": "Taurus",
    "caption": "The Bull — horns facing the dawn",
    "yAxis": "down",
    "scale": 92,
    "stars": [
      {
        "id": "aldebaran",
        "x": 0.05,
        "y": 0.18,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "elnath",
        "x": -0.7,
        "y": -0.62,
        "role": "anchor",
        "mag": 0.92
      },
      {
        "id": "zeta_tau",
        "x": 0.7,
        "y": -0.58,
        "role": "anchor",
        "mag": 0.82
      },
      {
        "id": "gamma_tau",
        "x": -0.42,
        "y": -0.15,
        "role": "helper",
        "mag": 0.55
      },
      {
        "id": "theta1_tau",
        "x": -0.2,
        "y": 0.28,
        "role": "helper",
        "mag": 0.48
      },
      {
        "id": "delta1_tau",
        "x": 0.42,
        "y": 0.52,
        "role": "helper",
        "mag": 0.5
      },
      {
        "id": "lambda_tau",
        "x": 0.05,
        "y": -0.78,
        "role": "helper",
        "mag": 0.46
      }
    ],
    "anchors": {
      "today": "aldebaran",
      "goals": "elnath",
      "echo": "zeta_tau"
    },
    "edges": [
      [
        "elnath",
        "gamma_tau"
      ],
      [
        "gamma_tau",
        "aldebaran"
      ],
      [
        "aldebaran",
        "zeta_tau"
      ],
      [
        "zeta_tau",
        "lambda_tau"
      ],
      [
        "lambda_tau",
        "elnath"
      ],
      [
        "aldebaran",
        "theta1_tau"
      ],
      [
        "theta1_tau",
        "delta1_tau"
      ]
    ]
  },
  {
    "id": "gemini",
    "name": "Gemini",
    "caption": "The Twins — two paths rising together",
    "yAxis": "down",
    "scale": 88,
    "stars": [
      {
        "id": "castor",
        "x": -0.38,
        "y": -0.82,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "pollux",
        "x": 0.38,
        "y": -0.82,
        "role": "anchor",
        "mag": 0.98
      },
      {
        "id": "wasat",
        "x": 0.22,
        "y": 0.05,
        "role": "anchor",
        "mag": 0.78
      },
      {
        "id": "mekbuda",
        "x": -0.48,
        "y": 0.2,
        "role": "helper",
        "mag": 0.55
      },
      {
        "id": "alhena",
        "x": 0.18,
        "y": 0.78,
        "role": "helper",
        "mag": 0.58
      },
      {
        "id": "tejat",
        "x": -0.45,
        "y": 0.62,
        "role": "helper",
        "mag": 0.5
      },
      {
        "id": "propus",
        "x": -0.68,
        "y": 0.85,
        "role": "helper",
        "mag": 0.43
      }
    ],
    "anchors": {
      "today": "castor",
      "goals": "pollux",
      "echo": "wasat"
    },
    "edges": [
      [
        "castor",
        "mekbuda"
      ],
      [
        "mekbuda",
        "tejat"
      ],
      [
        "tejat",
        "propus"
      ],
      [
        "pollux",
        "wasat"
      ],
      [
        "wasat",
        "alhena"
      ]
    ]
  },
  {
    "id": "cancer",
    "name": "Cancer",
    "caption": "The Crab — a quiet doorway of stars",
    "yAxis": "down",
    "scale": 105,
    "stars": [
      {
        "id": "acubens",
        "x": -0.72,
        "y": 0.05,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "altarf",
        "x": 0.68,
        "y": 0.08,
        "role": "anchor",
        "mag": 0.86
      },
      {
        "id": "asellus_borealis",
        "x": 0.02,
        "y": -0.62,
        "role": "anchor",
        "mag": 0.8
      },
      {
        "id": "asellus_australis",
        "x": 0.12,
        "y": 0.6,
        "role": "helper",
        "mag": 0.65
      },
      {
        "id": "iota_cnc",
        "x": -0.38,
        "y": -0.38,
        "role": "helper",
        "mag": 0.48
      },
      {
        "id": "rho_cnc",
        "x": 0.48,
        "y": -0.35,
        "role": "helper",
        "mag": 0.43
      }
    ],
    "anchors": {
      "today": "acubens",
      "goals": "asellus_borealis",
      "echo": "altarf"
    },
    "edges": [
      [
        "acubens",
        "iota_cnc"
      ],
      [
        "iota_cnc",
        "asellus_borealis"
      ],
      [
        "asellus_borealis",
        "rho_cnc"
      ],
      [
        "rho_cnc",
        "altarf"
      ],
      [
        "asellus_borealis",
        "asellus_australis"
      ]
    ]
  },
  {
    "id": "leo",
    "name": "Leo",
    "caption": "The Lion — a royal heart beneath the stars",
    "yAxis": "down",
    "scale": 90,
    "stars": [
      {
        "id": "regulus",
        "x": -0.42,
        "y": 0.18,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "algieba",
        "x": -0.35,
        "y": -0.55,
        "role": "anchor",
        "mag": 0.92
      },
      {
        "id": "denebola",
        "x": 0.78,
        "y": 0.35,
        "role": "anchor",
        "mag": 0.9
      },
      {
        "id": "zosma",
        "x": 0.2,
        "y": 0.05,
        "role": "helper",
        "mag": 0.62
      },
      {
        "id": "chertan",
        "x": 0.48,
        "y": -0.35,
        "role": "helper",
        "mag": 0.55
      },
      {
        "id": "eta_leo",
        "x": -0.78,
        "y": -0.12,
        "role": "helper",
        "mag": 0.5
      },
      {
        "id": "epsilon_leo",
        "x": 0.55,
        "y": 0.7,
        "role": "helper",
        "mag": 0.48
      }
    ],
    "anchors": {
      "today": "regulus",
      "goals": "algieba",
      "echo": "denebola"
    },
    "edges": [
      [
        "regulus",
        "eta_leo"
      ],
      [
        "eta_leo",
        "algieba"
      ],
      [
        "algieba",
        "chertan"
      ],
      [
        "chertan",
        "zosma"
      ],
      [
        "zosma",
        "regulus"
      ],
      [
        "zosma",
        "denebola"
      ],
      [
        "denebola",
        "epsilon_leo"
      ]
    ]
  },
  {
    "id": "virgo",
    "name": "Virgo",
    "caption": "The Maiden — a long river of light",
    "yAxis": "down",
    "scale": 88,
    "stars": [
      {
        "id": "spica",
        "x": 0.05,
        "y": 0.72,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "vindemiatrix",
        "x": 0.62,
        "y": -0.62,
        "role": "anchor",
        "mag": 0.9
      },
      {
        "id": "zavijava",
        "x": -0.72,
        "y": -0.58,
        "role": "anchor",
        "mag": 0.82
      },
      {
        "id": "porrima",
        "x": -0.08,
        "y": -0.2,
        "role": "helper",
        "mag": 0.65
      },
      {
        "id": "auva",
        "x": 0.42,
        "y": 0.02,
        "role": "helper",
        "mag": 0.58
      },
      {
        "id": "epsilon_vir",
        "x": -0.35,
        "y": 0.18,
        "role": "helper",
        "mag": 0.5
      },
      {
        "id": "gamma_vir",
        "x": -0.68,
        "y": 0.4,
        "role": "helper",
        "mag": 0.46
      }
    ],
    "anchors": {
      "today": "spica",
      "goals": "vindemiatrix",
      "echo": "zavijava"
    },
    "edges": [
      [
        "zavijava",
        "porrima"
      ],
      [
        "porrima",
        "vindemiatrix"
      ],
      [
        "porrima",
        "auva"
      ],
      [
        "auva",
        "spica"
      ],
      [
        "porrima",
        "epsilon_vir"
      ],
      [
        "epsilon_vir",
        "gamma_vir"
      ],
      [
        "gamma_vir",
        "spica"
      ]
    ]
  },
  {
    "id": "libra",
    "name": "Libra",
    "caption": "The Scales — balance held in the dark",
    "yAxis": "down",
    "scale": 100,
    "stars": [
      {
        "id": "zubeneschamali",
        "x": 0.0,
        "y": -0.72,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "zubenelgenubi",
        "x": -0.68,
        "y": 0.02,
        "role": "anchor",
        "mag": 0.9
      },
      {
        "id": "zubenelhakrabi",
        "x": 0.68,
        "y": 0.02,
        "role": "anchor",
        "mag": 0.8
      },
      {
        "id": "gamma_lib",
        "x": 0.0,
        "y": 0.02,
        "role": "helper",
        "mag": 0.55
      },
      {
        "id": "iota_lib",
        "x": -0.48,
        "y": 0.65,
        "role": "helper",
        "mag": 0.48
      },
      {
        "id": "theta_lib",
        "x": 0.48,
        "y": 0.65,
        "role": "helper",
        "mag": 0.45
      }
    ],
    "anchors": {
      "today": "zubeneschamali",
      "goals": "zubenelgenubi",
      "echo": "zubenelhakrabi"
    },
    "edges": [
      [
        "zubenelgenubi",
        "zubeneschamali"
      ],
      [
        "zubeneschamali",
        "zubenelhakrabi"
      ],
      [
        "zubenelgenubi",
        "gamma_lib"
      ],
      [
        "gamma_lib",
        "zubenelhakrabi"
      ],
      [
        "zubenelgenubi",
        "iota_lib"
      ],
      [
        "zubenelhakrabi",
        "theta_lib"
      ]
    ]
  },
  {
    "id": "scorpius",
    "name": "Scorpius",
    "caption": "The Scorpion — a crimson hook in the Milky Way",
    "yAxis": "down",
    "scale": 82,
    "stars": [
      {
        "id": "antares",
        "x": -0.12,
        "y": -0.02,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "shaula",
        "x": 0.55,
        "y": 0.58,
        "role": "anchor",
        "mag": 0.94
      },
      {
        "id": "sargas",
        "x": -0.72,
        "y": 0.42,
        "role": "anchor",
        "mag": 0.88
      },
      {
        "id": "dschubba",
        "x": -0.5,
        "y": -0.48,
        "role": "helper",
        "mag": 0.68
      },
      {
        "id": "acrab",
        "x": -0.78,
        "y": -0.68,
        "role": "helper",
        "mag": 0.58
      },
      {
        "id": "larawag",
        "x": 0.1,
        "y": 0.38,
        "role": "helper",
        "mag": 0.55
      },
      {
        "id": "jabbah",
        "x": 0.42,
        "y": -0.32,
        "role": "helper",
        "mag": 0.52
      },
      {
        "id": "lesath",
        "x": 0.78,
        "y": 0.78,
        "role": "helper",
        "mag": 0.48
      }
    ],
    "anchors": {
      "today": "antares",
      "goals": "shaula",
      "echo": "sargas"
    },
    "edges": [
      [
        "acrab",
        "dschubba"
      ],
      [
        "dschubba",
        "antares"
      ],
      [
        "antares",
        "larawag"
      ],
      [
        "larawag",
        "shaula"
      ],
      [
        "shaula",
        "lesath"
      ],
      [
        "antares",
        "sargas"
      ],
      [
        "sargas",
        "larawag"
      ]
    ]
  },
  {
    "id": "sagittarius",
    "name": "Sagittarius",
    "caption": "The Archer — the Teapot beside the galactic heart",
    "yAxis": "down",
    "scale": 82,
    "stars": [
      {
        "id": "kaus_australis",
        "x": -0.45,
        "y": 0.62,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "kaus_media",
        "x": 0.05,
        "y": 0.05,
        "role": "anchor",
        "mag": 0.92
      },
      {
        "id": "nunki",
        "x": 0.62,
        "y": -0.52,
        "role": "anchor",
        "mag": 0.9
      },
      {
        "id": "kaus_borealis",
        "x": -0.42,
        "y": -0.52,
        "role": "helper",
        "mag": 0.72
      },
      {
        "id": "phi_sgr",
        "x": -0.72,
        "y": -0.05,
        "role": "helper",
        "mag": 0.62
      },
      {
        "id": "lambda_sgr",
        "x": 0.35,
        "y": 0.48,
        "role": "helper",
        "mag": 0.6
      },
      {
        "id": "ascella",
        "x": 0.78,
        "y": 0.02,
        "role": "helper",
        "mag": 0.58
      },
      {
        "id": "tau_sgr",
        "x": 0.82,
        "y": -0.72,
        "role": "helper",
        "mag": 0.5
      }
    ],
    "anchors": {
      "today": "kaus_australis",
      "goals": "kaus_media",
      "echo": "nunki"
    },
    "edges": [
      [
        "kaus_borealis",
        "kaus_media"
      ],
      [
        "kaus_media",
        "kaus_australis"
      ],
      [
        "kaus_media",
        "lambda_sgr"
      ],
      [
        "lambda_sgr",
        "ascella"
      ],
      [
        "ascella",
        "nunki"
      ],
      [
        "nunki",
        "tau_sgr"
      ],
      [
        "kaus_borealis",
        "phi_sgr"
      ],
      [
        "phi_sgr",
        "kaus_australis"
      ]
    ]
  },
  {
    "id": "capricornus",
    "name": "Capricornus",
    "caption": "The Sea-Goat — an ancient vessel of stars",
    "yAxis": "down",
    "scale": 94,
    "stars": [
      {
        "id": "deneb_algedi",
        "x": 0.68,
        "y": 0.45,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "dabih",
        "x": -0.58,
        "y": -0.45,
        "role": "anchor",
        "mag": 0.9
      },
      {
        "id": "algedi",
        "x": 0.0,
        "y": -0.72,
        "role": "anchor",
        "mag": 0.84
      },
      {
        "id": "nashira",
        "x": 0.28,
        "y": 0.68,
        "role": "helper",
        "mag": 0.65
      },
      {
        "id": "zeta_cap",
        "x": -0.72,
        "y": 0.28,
        "role": "helper",
        "mag": 0.58
      },
      {
        "id": "theta_cap",
        "x": -0.15,
        "y": 0.12,
        "role": "helper",
        "mag": 0.5
      }
    ],
    "anchors": {
      "today": "deneb_algedi",
      "goals": "dabih",
      "echo": "algedi"
    },
    "edges": [
      [
        "dabih",
        "algedi"
      ],
      [
        "algedi",
        "deneb_algedi"
      ],
      [
        "deneb_algedi",
        "nashira"
      ],
      [
        "nashira",
        "zeta_cap"
      ],
      [
        "zeta_cap",
        "dabih"
      ],
      [
        "dabih",
        "theta_cap"
      ],
      [
        "theta_cap",
        "deneb_algedi"
      ]
    ]
  },
  {
    "id": "aquarius",
    "name": "Aquarius",
    "caption": "The Water Bearer — a stream falling through space",
    "yAxis": "down",
    "scale": 88,
    "stars": [
      {
        "id": "sadalsuud",
        "x": -0.45,
        "y": -0.62,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "sadalmelik",
        "x": 0.45,
        "y": -0.45,
        "role": "anchor",
        "mag": 0.9
      },
      {
        "id": "skate",
        "x": 0.28,
        "y": 0.52,
        "role": "anchor",
        "mag": 0.8
      },
      {
        "id": "albali",
        "x": -0.05,
        "y": -0.05,
        "role": "helper",
        "mag": 0.62
      },
      {
        "id": "situla",
        "x": 0.72,
        "y": 0.02,
        "role": "helper",
        "mag": 0.58
      },
      {
        "id": "lambda_aqr",
        "x": -0.62,
        "y": 0.38,
        "role": "helper",
        "mag": 0.52
      },
      {
        "id": "phi_aqr",
        "x": -0.18,
        "y": 0.72,
        "role": "helper",
        "mag": 0.48
      }
    ],
    "anchors": {
      "today": "sadalsuud",
      "goals": "sadalmelik",
      "echo": "skate"
    },
    "edges": [
      [
        "sadalsuud",
        "albali"
      ],
      [
        "albali",
        "sadalmelik"
      ],
      [
        "albali",
        "situla"
      ],
      [
        "situla",
        "skate"
      ],
      [
        "skate",
        "phi_aqr"
      ],
      [
        "phi_aqr",
        "lambda_aqr"
      ],
      [
        "lambda_aqr",
        "sadalsuud"
      ]
    ]
  },
  {
    "id": "pisces",
    "name": "Pisces",
    "caption": "The Fish — two currents joined by one thread",
    "yAxis": "down",
    "scale": 88,
    "stars": [
      {
        "id": "alrescha",
        "x": 0.0,
        "y": 0.05,
        "role": "anchor",
        "mag": 1
      },
      {
        "id": "eta_piscium",
        "x": -0.72,
        "y": -0.62,
        "role": "anchor",
        "mag": 0.88
      },
      {
        "id": "omega_piscium",
        "x": 0.72,
        "y": 0.62,
        "role": "anchor",
        "mag": 0.82
      },
      {
        "id": "gamma_piscium",
        "x": -0.55,
        "y": -0.12,
        "role": "helper",
        "mag": 0.62
      },
      {
        "id": "iota_piscium",
        "x": -0.72,
        "y": 0.38,
        "role": "helper",
        "mag": 0.55
      },
      {
        "id": "omicron_piscium",
        "x": 0.5,
        "y": 0.08,
        "role": "helper",
        "mag": 0.52
      },
      {
        "id": "alpha_piscium",
        "x": 0.72,
        "y": -0.45,
        "role": "helper",
        "mag": 0.5
      },
      {
        "id": "delta_piscium",
        "x": 0.25,
        "y": -0.7,
        "role": "helper",
        "mag": 0.45
      }
    ],
    "anchors": {
      "today": "alrescha",
      "goals": "eta_piscium",
      "echo": "omega_piscium"
    },
    "edges": [
      [
        "eta_piscium",
        "gamma_piscium"
      ],
      [
        "gamma_piscium",
        "iota_piscium"
      ],
      [
        "iota_piscium",
        "alrescha"
      ],
      [
        "alrescha",
        "omicron_piscium"
      ],
      [
        "omicron_piscium",
        "omega_piscium"
      ],
      [
        "omega_piscium",
        "alpha_piscium"
      ],
      [
        "alpha_piscium",
        "delta_piscium"
      ],
      [
        "delta_piscium",
        "alrescha"
      ]
    ]
  }
];

  /** @type {Record<string, any>} */
  const registry = Object.create(null);
  let savedState = Object.create(null);
  let stateLoaded = false;
  let activeConstellation = null; // { id, centerX, centerY }
  let constellationLayer = null;

  const layer = document.createElement('div');
  layer.id = 'ai-void-dissolve-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.documentElement.appendChild(layer);

  function loadState(cb) {
    try {
      chrome.storage.local.get([STORAGE_KEY], (res) => {
        savedState = (res && res[STORAGE_KEY] && typeof res[STORAGE_KEY] === 'object')
          ? res[STORAGE_KEY]
          : {};
        stateLoaded = true;
        if (typeof cb === 'function') cb();
      });
    } catch (e) {
      savedState = {};
      stateLoaded = true;
      if (typeof cb === 'function') cb();
    }
  }

  function persist() {
    try {
      const payload = Object.assign({}, savedState);
      if (activeConstellation) {
        payload.__constellation = {
          id: activeConstellation.id,
          cx: activeConstellation.centerX,
          cy: activeConstellation.centerY
        };
      } else {
        delete payload.__constellation;
      }
      chrome.storage.local.set({ [STORAGE_KEY]: payload });
    } catch (e) {}
  }

  function labelText(entry) {
    try {
      if (typeof t === 'function') {
        const raw = t('voidDissolveRestore');
        if (raw) return String(raw).replace('{name}', entry.label);
      }
    } catch (e) {}
    return 'Restore ' + entry.label;
  }

  function zodiacName(z) {
    if (!z) return '';
    try {
      if (typeof t === 'function') {
        const k = 'zodiacName_' + z.id;
        const v = t(k);
        if (v && v !== k) return v;
      }
    } catch (e) {}
    return z.name || z.id;
  }

  function zodiacCaption(z) {
    if (!z) return '';
    try {
      if (typeof t === 'function') {
        const k = 'zodiacCaption_' + z.id;
        const v = t(k);
        if (v && v !== k) return v;
      }
    } catch (e) {}
    return z.caption || '';
  }

  function refreshConstellationCaption() {
    if (!constellationLayer || !activeConstellation) return;
    const z = ZODIAC.find((c) => c.id === activeConstellation.id);
    if (!z) return;
    const nameEl = constellationLayer.querySelector('.ai-void-constellation-name');
    const blurbEl = constellationLayer.querySelector('.ai-void-constellation-blurb');
    if (nameEl) nameEl.textContent = zodiacName(z);
    if (blurbEl) blurbEl.textContent = zodiacCaption(z);
  }

  function rand(a, b) { return a + Math.random() * (b - a); }

  function organicOffset() {
    const r = rand(OFFSET_RADIUS_MIN, OFFSET_RADIUS_MAX);
    const a = Math.random() * Math.PI * 2;
    return { dx: Math.cos(a) * r, dy: Math.sin(a) * r };
  }

  function particleBurst(rect, inward) {
    if (reducedMotion) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement('span');
      p.className = 'ai-void-dust' + (inward ? ' is-inward' : '');
      const angle = (Math.PI * 2 * i) / PARTICLE_COUNT + (Math.random() - 0.5) * 0.4;
      const dist = 40 + Math.random() * Math.max(rect.width, rect.height) * 0.55;
      const size = 2 + Math.random() * 3.5;
      const hue = 200 + Math.random() * 80;
      p.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
      p.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
      p.style.setProperty('--sz', size + 'px');
      p.style.setProperty('--hue', String(hue));
      p.style.left = cx + 'px';
      p.style.top = cy + 'px';
      layer.appendChild(p);
      setTimeout(() => { try { p.remove(); } catch (e) {} }, DISSOLVE_MS + 80);
    }
  }

  function applyOrbPosition(entry) {
    if (!entry || !entry.singularity || !entry.anchor) return;
    const x = Math.max(12, Math.min(window.innerWidth - 44, entry.anchor.x - 18));
    const y = Math.max(12, Math.min(window.innerHeight - 44, entry.anchor.y - 18));
    entry.singularity.style.left = x + 'px';
    entry.singularity.style.top = y + 'px';
  }

  function countDissolvedPrimaries() {
    return PRIMARY_IDS.filter((id) => {
      const e = registry[id];
      return e && e.singularity;
    }).length;
  }

  function clearConstellation() {
    if (constellationLayer) {
      try { constellationLayer.remove(); } catch (e) {}
      constellationLayer = null;
    }
    activeConstellation = null;
    PRIMARY_IDS.forEach((id) => {
      const e = registry[id];
      if (e && e.singularity) e.singularity.classList.remove('is-constellation');
    });
  }

  function pickConstellation() {
    if (!ZODIAC.length) return null;
    // Avoid repeating the last one if possible
    let pool = ZODIAC;
    if (savedState.__lastZodiac && ZODIAC.length > 1) {
      pool = ZODIAC.filter((z) => z.id !== savedState.__lastZodiac);
      if (!pool.length) pool = ZODIAC;
    }
    return pool[Math.floor(Math.random() * pool.length)];
  }

  function starMap(z) {
    const m = Object.create(null);
    (z.stars || []).forEach((s) => { m[s.id] = s; });
    return m;
  }

  function formConstellation() {
    if (countDissolvedPrimaries() < 3) return;
    const z = pickConstellation();
    if (!z) return;

    clearConstellation();

    // Place figure near the visual center of the three current orbs
    const primaries = PRIMARY_IDS.map((id) => registry[id]).filter((e) => e && e.anchor);
    let cx = window.innerWidth / 2;
    let cy = window.innerHeight * 0.42;
    if (primaries.length) {
      cx = primaries.reduce((s, e) => s + e.anchor.x, 0) / primaries.length;
      cy = primaries.reduce((s, e) => s + e.anchor.y, 0) / primaries.length;
    }
    // Keep figure on-screen
    const scale = z.scale || 90;
    cx = Math.max(scale + 40, Math.min(window.innerWidth - scale - 40, cx));
    cy = Math.max(scale + 40, Math.min(window.innerHeight - scale - 60, cy));

    const sm = starMap(z);
    const anchors = z.anchors || {};
    const idToPanel = {
      [anchors.today]: 'todo',
      [anchors.goals]: 'goals',
      [anchors.echo]: 'echo'
    };

    // Move primary orbs to anchor positions (animated via CSS transition on left/top)
    PRIMARY_IDS.forEach((panelId) => {
      const entry = registry[panelId];
      if (!entry || !entry.anchor) return;
      let starId = null;
      if (panelId === 'todo') starId = anchors.today;
      else if (panelId === 'goals') starId = anchors.goals;
      else if (panelId === 'echo') starId = anchors.echo;
      const star = starId && sm[starId];
      if (!star) return;
      const x = cx + star.x * scale;
      const y = cy + star.y * scale;
      entry.anchor.x = x;
      entry.anchor.y = y;
      // keep preferred (CoG) for when constellation breaks
      if (entry.singularity) {
        entry.singularity.classList.add('is-constellation');
        entry.singularity.style.transition = reducedMotion
          ? 'none'
          : 'left 0.85s cubic-bezier(.2,.8,.2,1), top 0.85s cubic-bezier(.2,.8,.2,1), transform 0.4s ease';
      }
      applyOrbPosition(entry);
    });

    // Helper layer
    constellationLayer = document.createElement('div');
    constellationLayer.className = 'ai-void-constellation';
    constellationLayer.setAttribute('aria-hidden', 'true');

    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'ai-void-constellation-lines');
    svg.style.position = 'fixed';
    svg.style.left = '0';
    svg.style.top = '0';
    svg.style.width = '100%';
    svg.style.height = '100%';
    svg.style.pointerEvents = 'none';
    svg.style.overflow = 'visible';

    const pos = Object.create(null);
    (z.stars || []).forEach((s) => {
      pos[s.id] = {
        x: cx + s.x * scale,
        y: cy + s.y * scale,
        star: s
      };
    });

    (z.edges || []).forEach((pair) => {
      const a = pos[pair[0]];
      const b = pos[pair[1]];
      if (!a || !b) return;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', String(a.x));
      line.setAttribute('y1', String(a.y));
      line.setAttribute('x2', String(b.x));
      line.setAttribute('y2', String(b.y));
      line.setAttribute('class', 'ai-void-constellation-edge');
      svg.appendChild(line);
    });
    constellationLayer.appendChild(svg);

    // Helper stars (non-clickable)
    (z.stars || []).forEach((s) => {
      if (s.role === 'anchor') return;
      const mag = typeof s.mag === 'number' ? s.mag : 0.5;
      const size = 6 + mag * 5;
      const h = document.createElement('span');
      h.className = 'ai-void-helper-star';
      h.style.width = size + 'px';
      h.style.height = size + 'px';
      h.style.left = (pos[s.id].x - size / 2) + 'px';
      h.style.top = (pos[s.id].y - size / 2) + 'px';
      h.style.opacity = String(0.25 + mag * 0.75);
      constellationLayer.appendChild(h);
    });

    // Caption
    const cap = document.createElement('div');
    cap.className = 'ai-void-constellation-caption';
    const title = document.createElement('div');
    title.className = 'ai-void-constellation-name';
    title.textContent = zodiacName(z);
    const blurb = document.createElement('div');
    blurb.className = 'ai-void-constellation-blurb';
    blurb.textContent = zodiacCaption(z);
    cap.append(title, blurb);
    // Place caption under figure bounds
    let maxY = cy;
    Object.keys(pos).forEach((k) => { if (pos[k].y > maxY) maxY = pos[k].y; });
    cap.style.left = cx + 'px';
    cap.style.top = (maxY + 28) + 'px';
    constellationLayer.appendChild(cap);

    document.body.appendChild(constellationLayer);
    requestAnimationFrame(() => constellationLayer.classList.add('is-visible'));

    activeConstellation = { id: z.id, centerX: cx, centerY: cy, scale: scale };
    savedState.__lastZodiac = z.id;
    persist();
  }

  function placeSingularity(entry, rect) {
    removeSingularity(entry);
    const theme = PANEL_THEME[entry.id] || 'today';
    const orb = document.createElement('button');
    orb.type = 'button';
    orb.className = 'ai-void-singularity theme-' + theme;
    orb.dataset.voidId = entry.id;
    orb.setAttribute('aria-label', labelText(entry));
    orb.title = labelText(entry);

    const x = entry.anchor && typeof entry.anchor.x === 'number'
      ? entry.anchor.x
      : (rect.left + rect.width / 2);
    const y = entry.anchor && typeof entry.anchor.y === 'number'
      ? entry.anchor.y
      : (rect.top + rect.height / 2);

    if (!entry.anchor) {
      entry.anchor = { x: x, y: y, preferredX: x, preferredY: y };
    } else {
      entry.anchor.x = x;
      entry.anchor.y = y;
      if (entry.anchor.preferredX == null) entry.anchor.preferredX = x;
      if (entry.anchor.preferredY == null) entry.anchor.preferredY = y;
    }

    const glow = document.createElement('span');
    glow.className = 'ai-void-singularity-glow';
    const ring = document.createElement('span');
    ring.className = 'ai-void-singularity-ring';
    const core = document.createElement('span');
    core.className = 'ai-void-singularity-core';
    const glyph = document.createElement('span');
    glyph.className = 'ai-void-singularity-glyph';
    glyph.textContent = '◉';
    orb.append(glow, ring, core, glyph);

    orb.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      restore(entry.id);
    });
    orb.addEventListener('pointerenter', () => orb.classList.add('is-awake'));
    orb.addEventListener('pointerleave', () => orb.classList.remove('is-awake'));

    document.body.appendChild(orb);
    entry.singularity = orb;
    applyOrbPosition(entry);
    requestAnimationFrame(() => orb.classList.add('is-visible'));
  }

  function removeSingularity(entry) {
    if (entry.singularity) {
      try { entry.singularity.remove(); } catch (e) {}
      entry.singularity = null;
    }
  }

  function dissolve(id) {
    const entry = registry[id];
    if (!entry || !entry.el || entry.dissolving) return;
    if (entry.singularity || entry.el.classList.contains('ai-void-is-dissolved')) return;

    entry.dissolving = true;
    const rect = entry.el.getBoundingClientRect();
    // Frozen center of gravity + organic jitter (panel restores to original layout slot)
    const ax = rect.left + rect.width / 2;
    const ay = rect.top + rect.height / 2;
    const off = organicOffset();
    entry.anchor = {
      x: ax + off.dx,
      y: ay + off.dy,
      preferredX: ax + off.dx,
      preferredY: ay + off.dy
    };

    entry.el.classList.add('ai-void-is-dissolving');
    particleBurst(rect, false);

    const finish = () => {
      entry.el.classList.remove('ai-void-is-dissolving');
      entry.el.hidden = false;
      entry.el.classList.add('ai-void-is-dissolved');
      entry.el.setAttribute('aria-hidden', 'true');
      entry.dissolving = false;
      placeSingularity(entry, rect);
      savedState[id] = {
        dissolved: true,
        x: entry.anchor.x,
        y: entry.anchor.y
      };
      persist();
      if (typeof entry.onHide === 'function') {
        try { entry.onHide(); } catch (e) {}
      }
      // Third primary completes a zodiac figure
      if (countDissolvedPrimaries() >= 3) {
        setTimeout(formConstellation, reducedMotion ? 40 : 380);
      }
    };

    if (reducedMotion) finish();
    else setTimeout(finish, DISSOLVE_MS);
  }

  function restore(id) {
    const entry = registry[id];
    if (!entry || !entry.el || entry.dissolving) return;

    entry.dissolving = true;
    const wasConstellation = !!activeConstellation;
    if (wasConstellation) clearConstellation();

    const orb = entry.singularity;
    let rect = {
      left: entry.anchor ? entry.anchor.x - 40 : window.innerWidth / 2,
      top: entry.anchor ? entry.anchor.y - 20 : 80,
      width: 80,
      height: 40
    };
    if (orb) {
      const r = orb.getBoundingClientRect();
      rect = { left: r.left, top: r.top, width: r.width, height: r.height };
      orb.classList.add('is-collapsing');
    }
    particleBurst(rect, true);

    const finish = () => {
      removeSingularity(entry);
      entry.el.hidden = false;
      entry.el.classList.remove('ai-void-is-dissolved');
      entry.el.setAttribute('aria-hidden', 'false');
      entry.el.classList.add('ai-void-is-reforming');
      entry.dissolving = false;
      delete savedState[id];
      persist();
      if (typeof entry.onShow === 'function') {
        try { entry.onShow(); } catch (e) {}
      }
      // Remaining primaries return toward their preferred CoG
      PRIMARY_IDS.forEach((pid) => {
        if (pid === id) return;
        const e = registry[pid];
        if (!e || !e.singularity || !e.anchor) return;
        if (e.anchor.preferredX != null) e.anchor.x = e.anchor.preferredX;
        if (e.anchor.preferredY != null) e.anchor.y = e.anchor.preferredY;
        e.singularity.classList.remove('is-constellation');
        e.singularity.style.transition = reducedMotion
          ? 'none'
          : 'left 0.55s cubic-bezier(.2,.8,.2,1), top 0.55s cubic-bezier(.2,.8,.2,1)';
        applyOrbPosition(e);
      });
      setTimeout(() => {
        try { entry.el.classList.remove('ai-void-is-reforming'); } catch (e) {}
      }, RESTORE_MS);
    };

    if (reducedMotion) finish();
    else setTimeout(finish, Math.min(RESTORE_MS, 420));
  }

  function isDissolved(id) {
    return !!(savedState[id] && savedState[id].dissolved);
  }

  function register(id, opts) {
    if (!opts || !opts.el) return;
    const entry = {
      id: id,
      el: opts.el,
      label: opts.label || id,
      onHide: opts.onHide,
      onShow: opts.onShow,
      singularity: null,
      anchor: null,
      dissolving: false
    };
    registry[id] = entry;

    if (opts.trigger) {
      opts.trigger.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        dissolve(id);
      });
    }

    const applySaved = () => {
      if (savedState[id] && savedState[id].dissolved) {
        const sx = savedState[id].x || 40;
        const sy = savedState[id].y || 80;
        entry.anchor = { x: sx, y: sy, preferredX: sx, preferredY: sy };
        entry.el.hidden = false;
        entry.el.classList.add('ai-void-is-dissolved');
        entry.el.setAttribute('aria-hidden', 'true');
        placeSingularity(entry, {
          left: entry.anchor.x - 20,
          top: entry.anchor.y - 20,
          width: 40,
          height: 40
        });
        if (typeof entry.onHide === 'function') {
          try { entry.onHide({ fromStorage: true }); } catch (e) {}
        }
      }
      // After all primaries restored from storage, maybe reform constellation
      if (countDissolvedPrimaries() >= 3 && savedState.__constellation) {
        const prev = ZODIAC.find((z) => z.id === savedState.__constellation.id);
        if (prev) {
          // force that id next time pick prefers it
          savedState.__lastZodiac = null;
          setTimeout(() => {
            // temporarily bias pick
            const realPick = pickConstellation;
            // form with stored id if available
            const z = ZODIAC.find((c) => c.id === savedState.__constellation.id) || pickConstellation();
            if (!z) return;
            // monkey: set last to something else so pick isn't forced wrong
            formConstellationFrom(z, savedState.__constellation.cx, savedState.__constellation.cy);
          }, 120);
        } else {
          setTimeout(formConstellation, 120);
        }
      }
    };
    if (stateLoaded) applySaved();
    else loadState(applySaved);
  }

  function formConstellationFrom(z, cx, cy) {
    // Reuse formConstellation body with fixed z/center — simplify by setting pick
    if (countDissolvedPrimaries() < 3 || !z) return;
    clearConstellation();
    const scale = z.scale || 90;
    cx = cx != null ? cx : window.innerWidth / 2;
    cy = cy != null ? cy : window.innerHeight * 0.42;
    cx = Math.max(scale + 40, Math.min(window.innerWidth - scale - 40, cx));
    cy = Math.max(scale + 40, Math.min(window.innerHeight - scale - 60, cy));

    const sm = starMap(z);
    const anchors = z.anchors || {};
    PRIMARY_IDS.forEach((panelId) => {
      const entry = registry[panelId];
      if (!entry || !entry.anchor) return;
      let starId = panelId === 'todo' ? anchors.today : panelId === 'goals' ? anchors.goals : anchors.echo;
      const star = starId && sm[starId];
      if (!star) return;
      entry.anchor.x = cx + star.x * scale;
      entry.anchor.y = cy + star.y * scale;
      if (entry.singularity) {
        entry.singularity.classList.add('is-constellation');
        entry.singularity.style.transition = reducedMotion ? 'none' : 'left 0.85s cubic-bezier(.2,.8,.2,1), top 0.85s cubic-bezier(.2,.8,.2,1)';
      }
      applyOrbPosition(entry);
    });

    constellationLayer = document.createElement('div');
    constellationLayer.className = 'ai-void-constellation is-visible';
    constellationLayer.setAttribute('aria-hidden', 'true');
    const svgNS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(svgNS, 'svg');
    svg.setAttribute('class', 'ai-void-constellation-lines');
    svg.style.cssText = 'position:fixed;left:0;top:0;width:100%;height:100%;pointer-events:none;overflow:visible';
    const pos = Object.create(null);
    (z.stars || []).forEach((s) => {
      pos[s.id] = { x: cx + s.x * scale, y: cy + s.y * scale, star: s };
    });
    (z.edges || []).forEach((pair) => {
      const a = pos[pair[0]], b = pos[pair[1]];
      if (!a || !b) return;
      const line = document.createElementNS(svgNS, 'line');
      line.setAttribute('x1', a.x); line.setAttribute('y1', a.y);
      line.setAttribute('x2', b.x); line.setAttribute('y2', b.y);
      line.setAttribute('class', 'ai-void-constellation-edge');
      svg.appendChild(line);
    });
    constellationLayer.appendChild(svg);
    (z.stars || []).forEach((s) => {
      if (s.role === 'anchor') return;
      const mag = typeof s.mag === 'number' ? s.mag : 0.5;
      const size = 6 + mag * 5;
      const h = document.createElement('span');
      h.className = 'ai-void-helper-star';
      h.style.width = size + 'px';
      h.style.height = size + 'px';
      h.style.left = (pos[s.id].x - size / 2) + 'px';
      h.style.top = (pos[s.id].y - size / 2) + 'px';
      h.style.opacity = String(0.25 + mag * 0.75);
      constellationLayer.appendChild(h);
    });
    const cap = document.createElement('div');
    cap.className = 'ai-void-constellation-caption';
    const title = document.createElement('div');
    title.className = 'ai-void-constellation-name';
    title.textContent = zodiacName(z);
    const blurb = document.createElement('div');
    blurb.className = 'ai-void-constellation-blurb';
    blurb.textContent = zodiacCaption(z);
    cap.append(title, blurb);
    let maxY = cy;
    Object.keys(pos).forEach((k) => { if (pos[k].y > maxY) maxY = pos[k].y; });
    cap.style.left = cx + 'px';
    cap.style.top = (maxY + 28) + 'px';
    constellationLayer.appendChild(cap);
    document.body.appendChild(constellationLayer);
    activeConstellation = { id: z.id, centerX: cx, centerY: cy, scale: scale };
    savedState.__lastZodiac = z.id;
    persist();
  }

  window.addEventListener('resize', () => {
    if (activeConstellation && countDissolvedPrimaries() >= 3) {
      const z = ZODIAC.find((c) => c.id === activeConstellation.id);
      if (z) formConstellationFrom(z, window.innerWidth / 2, window.innerHeight * 0.42);
    } else {
      PRIMARY_IDS.forEach((id) => {
        const e = registry[id];
        if (e && e.singularity) applyOrbPosition(e);
      });
    }
  }, { passive: true });

  loadState();

  try {
    chrome.storage.onChanged.addListener((changes) => {
      if (changes.appLanguage) {
        try {
          if (typeof currentLang !== 'undefined') {
            currentLang = changes.appLanguage.newValue || 'en';
          }
        } catch (e) {}
        refreshConstellationCaption();
        // Update singularity tooltips
        Object.keys(registry).forEach((id) => {
          const e = registry[id];
          if (e && e.singularity) {
            const txt = labelText(e);
            e.singularity.title = txt;
            e.singularity.setAttribute('aria-label', txt);
          }
        });
      }
    });
  } catch (e) {}

  window.VoidDissolve = {
    register: register,
    dissolve: dissolve,
    restore: restore,
    isDissolved: isDissolved
  };
})();
