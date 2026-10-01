 /* =========================================================
   CSC AI ACADEMY
   APP.JS
   ========================================================= */


/* =========================================================
   COURSES
========================================================= */

const COURSES = [
  {
    id: 1,
    name: "AI Tools",
    desc: "Master practical AI tools for research, writing, images, productivity and everyday creation.",
    min: "STARTER"
  },
  {
    id: 2,
    name: "AI App Development",
    desc: "Plan and build AI-powered apps with modern no-code and code-assisted workflows.",
    min: "BASIC"
  },
  {
    id: 3,
    name: "Website with AI",
    desc: "Create responsive, polished websites faster using AI-assisted design and development.",
    min: "BASIC"
  },
  {
    id: 4,
    name: "Cinematic AI Video",
    desc: "Create realistic cinematic AI videos, scenes, prompts, voice and visual continuity.",
    min: "STANDARD"
  },
  {
    id: 5,
    name: "AI Content Creation",
    desc: "Build repeatable systems for social posts, scripts, graphics and content campaigns.",
    min: "STANDARD"
  },
  {
    id: 6,
    name: "AI Business",
    desc: "Explore practical ways to apply AI to products, services, customer support and operations.",
    min: "STANDARD"
  }
];


/* =========================================================
   PAYMENT PLANS
   ONLY 5K / 10K / 20K
========================================================= */

const PLANS = [
  {
    id: "STARTER",
    name: "STARTER",
    price: 5000,
    priceText: "₦5,000",
    paymentUrl: "https://selar.com/5e16655d91",
    features: [
      "AI Tools"
    ],
    rank: 1
  },

  {
    id: "BASIC",
    name: "BASIC",
    price: 10000,
    priceText: "₦10,000",
    paymentUrl: "https://selar.com/716p7u4a6b",
    features: [
      "AI Tools",
      "AI App Development",
      "Website with AI"
    ],
    rank: 2
  },

  {
    id: "STANDARD",
    name: "STANDARD",
    price: 20000,
    priceText: "₦20,000",
    paymentUrl: "https://selar.com/4d167101ig",
    features: [
      "AI Tools",
      "AI App Development",
      "Website with AI",
      "Cinematic AI Video",
      "AI Content Creation",
      "AI Business"
    ],
    rank: 3,
    popular: true
  }
];


/* =========================================================
   GLOBAL VARIABLES
========================================================= */

let currentPlan = null;


/* =========================================================
   PAGE NAVIGATION
========================================================= */

function go(page) {

  document.querySelectorAll(".page").forEach(function(section) {
    section.classList.remove("active");
  });

  const target = document.getElementById(page);

  if (target) {
    target.classList.add("active");
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });

  const navLinks = document.querySelector(".nav-links");

  if (navLinks) {
    navLinks.classList.remove("open");
  }

}


/* =========================================================
   ESCAPE HTML
========================================================= */

function escapeHtml(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}


/* =========================================================
   FORMAT MONEY
========================================================= */

function formatMoney(amount) {

  return "₦" + Number(amount).toLocaleString("en-NG");

}


/* =========================================================
   RENDER COURSES
========================================================= */

function renderCourses() {

  const grid = document.getElementById("coursesGrid");

  if (!grid) return;

  grid.innerHTML = COURSES.map(function(course) {

    return `
      <article class="card course">

        <div class="course-num">
          ${course.id}
        </div>

        <div>

          <div class="level">
            ${escapeHtml(course.min)}
          </div>

          <h3>
            ${escapeHtml(course.name)}
          </h3>

          <p>
            ${escapeHtml(course.desc)}
          </p>

        </div>

      </article>
    `;

  }).join("");

}


/* =========================================================
   RENDER PRICING
========================================================= */

function renderPricing() {

  const grid = document.getElementById("pricingGrid");

  if (!grid) return;

  grid.innerHTML = PLANS.map(function(plan) {

    return `
      <article class="card price-card ${plan.popular ? "popular" : ""}">

        ${
          plan.popular
          ? `<div class="popular-badge">POPULAR</div>`
          : ""
        }

        <h3>
          ${escapeHtml(plan.name)}
        </h3>

        <div class="price">
          ${formatMoney(plan.price)}
        </div>

        <ul>

          ${plan.features.map(function(feature) {

            return `
              <li>
                ${escapeHtml(feature)}
              </li>
            `;

          }).join("")}

        </ul>

        <button
          class="btn premium w100"
          onclick="startPayment('${plan.id}')"
        >
          Get ${escapeHtml(plan.name)}
        </button>

      </article>
    `;

  }).join("");


  renderCompareTable();

}


/* =========================================================
   COMPARE TABLE
========================================================= */

function renderCompareTable() {

  const table = document.getElementById("compareTable");

  if (!table) return;

  table.innerHTML = `
    <div class="table-scroll">

      <table>

        <thead>

          <tr>

            <th>
              Course
            </th>

            <th>
              ₦5K
            </th>

            <th>
              ₦10K
            </th>

            <th>
              ₦20K
            </th>

          </tr>

        </thead>

        <tbody>

          ${COURSES.map(function(course) {

            return `
              <tr>

                <td>
                  ${escapeHtml(course.name)}
                </td>

                <td class="${
                  isCourseIncluded(course.name, "STARTER")
                    ? "yes"
                    : ""
                }">

                  ${
                    isCourseIncluded(course.name, "STARTER")
                      ? "✓"
                      : "—"
                  }

                </td>

                <td class="${
                  isCourseIncluded(course.name, "BASIC")
                    ? "yes"
                    : ""
                }">

                  ${
                    isCourseIncluded(course.name, "BASIC")
                      ? "✓"
                      : "—"
                  }

                </td>

                <td class="${
                  isCourseIncluded(course.name, "STANDARD")
                    ? "yes"
                    : ""
                }">

                  ${
                    isCourseIncluded(course.name, "STANDARD")
                      ? "✓"
                      : "—"
                  }

                </td>

              </tr>
            `;

          }).join("")}

        </tbody>

      </table>

    </div>
  `;

}


/* =========================================================
   CHECK COURSE ACCESS
========================================================= */

function isCourseIncluded(courseName, planId) {

  const plan = PLANS.find(function(item) {
    return item.id === planId;
  });

  if (!plan) return false;

  return plan.features.includes(courseName);

}


/* =========================================================
   GET PLAN
========================================================= */

function getPlan(planId) {

  return PLANS.find(function(plan) {
    return plan.id === planId;
  });

}


/* =========================================================
   PAYMENT
   OPENS SELAR LINK
========================================================= */

function startPayment(planId) {

  const plan = getPlan(planId);

  if (!plan) {

    alert("Payment plan not found.");

    return;
  }


  currentPlan = plan;


  /*
   * Save the selected plan temporarily.
   */

  localStorage.setItem(
    "csc_pending_plan",
    JSON.stringify(plan)
  );


  /*
   * Open the correct Selar payment page.
   */

  window.open(
    plan.paymentUrl,
    "_blank"
  );


  /*
   * Inform the student what to do next.
   */

  setTimeout(function() {

    const proceed = confirm(
      "You are being taken to Selar to complete your payment.\n\n" +
      "After completing your payment, click OK to continue your registration."
    );

    if (proceed) {

      showPaymentRegistration(plan);

    }

  }, 800);

}


/* =========================================================
   PAYMENT REGISTRATION
========================================================= */

function showPaymentRegistration(plan) {

  const name = prompt(
    "Enter your full name:"
  );

  if (!name) return;


  const phone = prompt(
    "Enter your WhatsApp/phone number:"
  );

  if (!phone) return;


  completePurchase(
    name,
    phone,
    plan
  );

}


/* =========================================================
   COMPLETE PURCHASE
========================================================= */

function completePurchase(
  name,
  phone,
  plan
) {

  const user = {

    id:
      "CSC-" +
      Date.now().toString().slice(-8),

    name: name,

    phone: phone,

    plan: plan.id,

    planName: plan.name,

    amount: plan.price,

    courses: plan.features,

    paidAt:
      new Date().toISOString()

  };


  /*
   * Save current user.
   */

  localStorage.setItem(
    "csc_user",
    JSON.stringify(user)
  );


  /*
   * Save student record.
   */

  const users =
    JSON.parse(
      localStorage.getItem("csc_users") || "[]"
    );


  users.push(user);


  localStorage.setItem(
    "csc_users",
    JSON.stringify(users)
  );


  /*
   * Show success.
   */

  alert(
    "Registration saved successfully!\n\n" +
    "Plan: " + plan.name + "\n" +
    "Amount: " + formatMoney(plan.price) + "\n\n" +
    "Welcome to CSC AI ACADEMY!"
  );


  /*
   * Open dashboard.
   */

  if (window.location.pathname.includes("index.html") ||
      window.location.pathname === "/") {

    if (typeof go === "function") {
      go("dashboard");
    }

  } else {

    window.location.href = "dashboard.html";

  }

}


/* =========================================================
   LOADER
========================================================= */

function hideLoader() {

  const loader = document.getElementById("loader");

  if (!loader) return;

  loader.classList.add("is-hidden");

  setTimeout(function() {

    loader.style.display = "none";

  }, 300);

}


function showLoader() {

  const loader = document.getElementById("loader");

  if (!loader) return;

  loader.style.display = "flex";

  loader.classList.remove("is-hidden");

}


/*
 * IMPORTANT:
 * Loader automatically disappears after 1 second.
 */

setTimeout(
  hideLoader,
  1000
);


/* =========================================================
   CERTIFICATE
========================================================= */

function generateCertificateId() {

  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  let code = "";

  for (let i = 0; i < 4; i++) {

    code +=
      letters[
        Math.floor(
          Math.random() * letters.length
        )
      ];

  }


  return "CSC-" + code;

}


function generateCertificate() {

  const nameInput =
    document.getElementById("certName");

  const planInput =
    document.getElementById("certPlan");


  if (!nameInput || !planInput) return;


  const name =
    nameInput.value.trim();


  const plan =
    planInput.value;


  if (!name) {

    alert(
      "Please enter your full name."
    );

    return;
  }


  const id =
    generateCertificateId();


  const date =
    new Date().toLocaleDateString(
      "en-NG",
      {
        day: "numeric",
        month: "long",
        year: "numeric"
      }
    );


  const certificate = {

    id: id,

    name: name,

    plan: plan,

    date: date,

    issuedAt:
      new Date().toISOString()

  };


  localStorage.setItem(
    "csc_certificate_" + id,
    JSON.stringify(certificate)
  );


  const preview =
    document.getElementById(
      "certificatePreview"
    );


  if (!preview) return;


  preview.classList.remove("empty");


  preview.innerHTML = `

    <div class="mini-label">
      CSC AI ACADEMY
    </div>

    <h2>
      CERTIFICATE
    </h2>

    <div>
      OF COMPLETION
    </div>

    <div class="cert-line"></div>

    <div>
      This certificate is proudly presented to
    </div>

    <div class="cert-name">
      ${escapeHtml(name)}
    </div>

    <div>
      for completing the
      <strong>
        ${escapeHtml(plan)}
      </strong>
      learning program.
    </div>

    <div class="cert-line"></div>

    <div>
      Certificate ID:
      <strong>
        ${escapeHtml(id)}
      </strong>
    </div>

    <div>
      Issued:
      ${escapeHtml(date)}
    </div>

    <br>

    <div class="signature">
      Chris Vincent
    </div>

    <strong>
      Founder & Owner
    </strong>

  `;

}


/* =========================================================
   VERIFY CERTIFICATE
========================================================= */

function verifyCertificate() {

  const input =
    document.getElementById(
      "verifyId"
    );

  const result =
    document.getElementById(
      "verifyResult"
    );


  if (!input || !result) return;


  const id =
    input.value.trim().toUpperCase();


  if (!id) {

    result.innerHTML = `
      <div class="notice danger">
        Please enter a certificate ID.
      </div>
    `;

    return;
  }


  const data =
    localStorage.getItem(
      "csc_certificate_" + id
    );


  if (!data) {

    result.innerHTML = `
      <div class="notice danger">
        Certificate not found.
      </div>
    `;

    return;
  }


  const certificate =
    JSON.parse(data);


  result.innerHTML = `

    <div class="notice success">

      ✓ Certificate Verified

      <br><br>

      <strong>
        Name:
      </strong>

      ${escapeHtml(certificate.name)}

      <br>

      <strong>
        Plan:
      </strong>

      ${escapeHtml(certificate.plan)}

      <br>

      <strong>
        Date:
      </strong>

      ${escapeHtml(certificate.date)}

      <br>

      <strong>
        ID:
      </strong>

      ${escapeHtml(certificate.id)}

    </div>

  `;

}


/* =========================================================
   CONTACT FORM
========================================================= */

function setupContactForm() {

  const form =
    document.getElementById(
      "contactForm"
    );


  if (!form) return;


  form.addEventListener(
    "submit",
    function(event) {

      event.preventDefault();


      const name =
        document.getElementById(
          "contactName"
        )?.value.trim() || "";


      const phone =
        document.getElementById(
          "contactPhone"
        )?.value.trim() || "";


      const message =
        document.getElementById(
          "contactMessage"
        )?.value.trim() || "";


      const whatsappMessage =
        "Hello Chris Vincent, I am " +
        name +
        ".%0A%0A" +
        "Phone: " +
        phone +
        "%0A%0A" +
        message;


      const whatsappURL =
        "https://wa.me/2348120897686?text=" +
        encodeURIComponent(
          whatsappMessage
        );


      window.open(
        whatsappURL,
        "_blank"
      );

    }
  );

}


/* =========================================================
   AI ASSISTANT
========================================================= */

function setupAI() {

  const button =
    document.getElementById(
      "aiButton"
    );

  const panel =
    document.getElementById(
      "aiPanel"
    );

  const close =
    document.getElementById(
      "closeAI"
    );

  const form =
    document.getElementById(
      "aiForm"
    );

  const input =
    document.getElementById(
      "aiInput"
    );

  const messages =
    document.getElementById(
      "aiMessages"
    );


  if (!button || !panel) return;


  button.addEventListener(
    "click",
    function() {

      panel.classList.toggle(
        "open"
      );

    }
  );


  if (close) {

    close.addEventListener(
      "click",
      function() {

        panel.classList.remove(
          "open"
        );

      }
    );

  }


  if (!form || !input || !messages) return;


  form.addEventListener(
    "submit",
    async function(event) {

      event.preventDefault();


      const question =
        input.value.trim();


      if (!question) return;


      addAIMessage(
        question,
        "user"
      );


      input.value = "";


      const thinking =
        addAIMessage(
          "Thinking...",
          "bot"
        );


      try {

        const response =
          await fetch(
            "/.netlify/functions/ai",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                message: question
              })
            }
          );


        const data =
          await response.json();


        if (
          thinking &&
          thinking.parentNode
        ) {

          thinking.remove();

        }


        if (
          data &&
          data.reply
        ) {

          addAIMessage(
            data.reply,
            "bot"
          );

        } else {

          addAIMessage(
            localAIReply(question),
            "bot"
          );

        }

      } catch(error) {

        if (
          thinking &&
          thinking.parentNode
        ) {

          thinking.remove();

        }


        addAIMessage(
          localAIReply(question),
          "bot"
        );

      }

    }
  );

}


function addAIMessage(
  text,
  type
) {

  const messages =
    document.getElementById(
      "aiMessages"
    );


  if (!messages) return null;


  const div =
    document.createElement(
      "div"
    );


  div.className =
    "ai-msg " + type;


  div.textContent =
    text;


  messages.appendChild(div);


  messages.scrollTop =
    messages.scrollHeight;


  return div;

}


/* =========================================================
   LOCAL AI FALLBACK
========================================================= */

function localAIReply(question) {

  const q =
    question.toLowerCase();


  if (
    q.includes("price") ||
    q.includes("payment") ||
    q.includes("pay")
  ) {

    return (
      "CSC AI ACADEMY currently has three plans: " +
      "STARTER ₦5,000, BASIC ₦10,000 and STANDARD ₦20,000."
    );

  }


  if (
    q.includes("course") ||
    q.includes("learn")
  ) {

    return (
      "CSC AI ACADEMY teaches practical AI skills " +
      "including AI tools, AI app development, websites " +
      "with AI, cinematic AI video, content creation " +
      "and AI business."
    );

  }


  if (
    q.includes("whatsapp") ||
    q.includes("contact")
  ) {

    return (
      "You can contact Chris Vincent on WhatsApp " +
      "at 08120897686."
    );

  }


  if (
    q.includes("certificate")
  ) {

    return (
      "After completing your learning program, " +
      "you can use the Certificate section to generate " +
      "and verify your CSC AI ACADEMY certificate."
    );

  }


  return (
    "Welcome to CSC AI ACADEMY. " +
    "I can help you with courses, pricing, payments, " +
    "certificates and contacting Chris Vincent."
  );

}


/* =========================================================
   MOBILE NAVIGATION
========================================================= */

function setupMobileNav() {

  const toggle =
    document.querySelector(
      ".nav-toggle"
    );

  const nav =
    document.querySelector(
      ".nav-links"
    );


  if (!toggle || !nav) return;


  toggle.addEventListener(
    "click",
    function() {

      nav.classList.toggle(
        "open"
      );

    }
  );

}


/* =========================================================
   CURRENT USER
========================================================= */

function getCurrentUser() {

  try {

    return JSON.parse(
      localStorage.getItem(
        "csc_user"
      ) || "null"
    );

  } catch(error) {

    return null;

  }

}


/* =========================================================
   LOGOUT
========================================================= */

function logout() {

  localStorage.removeItem(
    "csc_user"
  );

  window.location.href =
    "index.html";

}


/* =========================================================
   RENDER EVERYTHING
========================================================= */

function renderAll() {

  renderCourses();

  renderPricing();

}


/* =========================================================
   PAGE ROUTING
========================================================= */

function handleRoute() {

  const hash =
    window.location.hash
      .replace("#", "")
      .trim();


  if (!hash) {

    go("home");

    return;

  }


  const validPages = [
    "home",
    "founder",
    "courses",
    "pricing",
    "certificate",
    "contact",
    "dashboard"
  ];


  if (
    validPages.includes(hash)
  ) {

    go(hash);

  } else {

    go("home");

  }

}


/* =========================================================
   INITIALIZATION
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function() {

    renderAll();

    setupContactForm();

    setupAI();

    setupMobileNav();

    handleRoute();


    /*
     * Make sure loader can NEVER
     * remain on screen.
     */

    setTimeout(
      hideLoader,
      1000
    );

  }
);


/* =========================================================
   HASH CHANGE
========================================================= */

window.addEventListener(
  "hashchange",
  handleRoute
);


/* =========================================================
   GLOBAL FUNCTIONS
========================================================= */

window.go =
  go;

window.startPayment =
  startPayment;

window.generateCertificate =
  generateCertificate;

window.verifyCertificate =
  verifyCertificate;

window.logout =
  logout;

window.getCurrentUser =
  getCurrentUser;