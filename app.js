document.addEventListener("DOMContentLoaded", function () {

  /* =========================================
     MOBILE MENU
  ========================================= */

  const menu = document.getElementById("menuButton");
  const nav = document.getElementById("mainNav");

  if (menu && nav) {

    menu.addEventListener("click", function (e) {
      e.stopPropagation();

      const open = nav.classList.toggle("mobile-open");

      menu.textContent = open ? "×" : "☰";
      menu.setAttribute("aria-expanded", open ? "true" : "false");
    });

    nav.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        nav.classList.remove("mobile-open");
        menu.textContent = "☰";
        menu.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", function (e) {
      if (
        window.innerWidth <= 900 &&
        !nav.contains(e.target) &&
        !menu.contains(e.target)
      ) {
        nav.classList.remove("mobile-open");
        menu.textContent = "☰";
      }
    });
  }


  /* =========================================
     ENROLL MODAL
  ========================================= */

  const enrollModal = document.getElementById("enrollModal");
  const enrollClose = document.getElementById("enrollClose");
  const enrollForm = document.getElementById("enrollForm");

  const enrollButtons = document.querySelectorAll("[data-enroll]");

  function openEnroll() {

    if (!enrollModal) return;

    enrollModal.classList.add("open");
    enrollModal.setAttribute("aria-hidden", "false");

    document.body.style.overflow = "hidden";
  }

  function closeEnroll() {

    if (!enrollModal) return;

    enrollModal.classList.remove("open");
    enrollModal.setAttribute("aria-hidden", "true");

    document.body.style.overflow = "";
  }

  enrollButtons.forEach(function (button) {

    button.addEventListener("click", function (e) {
      e.preventDefault();
      openEnroll();
    });

  });

  if (enrollClose) {
    enrollClose.addEventListener("click", closeEnroll);
  }

  if (enrollModal) {

    enrollModal.addEventListener("click", function (e) {

      if (e.target === enrollModal) {
        closeEnroll();
      }

    });
  }

  document.addEventListener("keydown", function (e) {

    if (e.key === "Escape") {
      closeEnroll();
    }

  });


  /* =========================================
     ENROLL FORM
  ========================================= */

  if (enrollForm) {

    enrollForm.addEventListener("submit", function (e) {

      e.preventDefault();

      const formData = new FormData(enrollForm);

      const amount = formData.get("amount");

      if (!amount || Number(amount) <= 0) {
        alert("Please enter the agreed enrollment amount in USD.");
        return;
      }

      const enrollment = {

        name: formData.get("enroll_name") || "",
        email: formData.get("enroll_email") || "",

        countryCode: formData.get("country_code") || "+1",

        phone: formData.get("enroll_phone") || "",

        alternativePhone:
          formData.get("alternative_phone") || "",

        street:
          formData.get("street_address") || "",

        apartment:
          formData.get("apt") || "",

        city:
          formData.get("city") || "",

        state:
          formData.get("state") || "",

        zip:
          formData.get("zip") || "",

        country:
          formData.get("country") || "",

        amount:
          Number(amount).toFixed(2),

        currency: "USD",

        createdAt:
          new Date().toISOString()
      };


      /*
        Save enrollment temporarily so the payment page
        can read the candidate information.
      */

      sessionStorage.setItem(
        "mountpeakEnrollment",
        JSON.stringify(enrollment)
      );


      /*
        Continue to the existing payment page.
      */

      window.location.href = "payment.html";

    });
  }


  /* =========================================
     JOB SEARCH
  ========================================= */

  const jobSearch = document.getElementById("jobSearch");
  const jobType = document.getElementById("jobType");
  const jobList = document.getElementById("jobList");

  function filterJobs() {

    if (!jobList) return;

    const searchValue =
      jobSearch
        ? jobSearch.value.toLowerCase().trim()
        : "";

    const typeValue =
      jobType
        ? jobType.value.toLowerCase().trim()
        : "";

    const jobs =
      jobList.querySelectorAll("article");


    jobs.forEach(function (job) {

      const role =
        (job.getAttribute("data-role") || "")
          .toLowerCase();

      const text =
        job.textContent.toLowerCase();

      const matchesSearch =
        !searchValue ||
        role.includes(searchValue) ||
        text.includes(searchValue);

      const matchesType =
        !typeValue ||
        role.includes(typeValue);

      job.style.display =
        matchesSearch && matchesType
          ? "flex"
          : "none";

    });
  }

  if (jobSearch) {
    jobSearch.addEventListener(
      "input",
      filterJobs
    );
  }

  if (jobType) {
    jobType.addEventListener(
      "change",
      filterJobs
    );
  }


  /* =========================================
     AI NAVIGATION
  ========================================= */

  const aiToggle =
    document.getElementById("aiToggle");

  const aiPanel =
    document.getElementById("aiPanel");


  if (aiToggle && aiPanel) {

    aiToggle.addEventListener("click", function (e) {

      e.stopPropagation();

      const opening =
        aiPanel.hasAttribute("hidden");

      if (opening) {

        aiPanel.removeAttribute("hidden");

        aiToggle.setAttribute(
          "aria-expanded",
          "true"
        );

      } else {

        aiPanel.setAttribute(
          "hidden",
          ""
        );

        aiToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    });


    document.querySelectorAll(
      ".ai-links [data-go]"
    ).forEach(function (button) {

      button.addEventListener(
        "click",
        function () {

          const target =
            button.getAttribute("data-go");

          aiPanel.setAttribute(
            "hidden",
            ""
          );

          aiToggle.setAttribute(
            "aria-expanded",
            "false"
          );

          if (target) {

            const section =
              document.querySelector(target);

            if (section) {

              section.scrollIntoView({
                behavior: "smooth",
                block: "start"
              });

            }

          }

        }
      );

    });
  }


  /* =========================================
     AI PANEL ENROLL BUTTONS
  ========================================= */

  document.querySelectorAll(
    ".ai-links [data-enroll]"
  ).forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        if (aiPanel) {
          aiPanel.setAttribute(
            "hidden",
            ""
          );
        }

        openEnroll();

      }
    );

  });


  /* =========================================
     AI CHAT
  ========================================= */

  const chatToggle =
    document.getElementById("chatToggle");

  const chatBox =
    document.getElementById("chatBox");

  const chatClose =
    document.getElementById("chatClose");

  const chatInput =
    document.getElementById("chatInput");

  const chatSend =
    document.getElementById("chatSend");

  const chatMessages =
    document.getElementById("chatMessages");


  function openChat() {

    if (!chatBox) return;

    chatBox.removeAttribute("hidden");

    if (chatToggle) {
      chatToggle.setAttribute(
        "aria-expanded",
        "true"
      );
    }

    setTimeout(function () {

      if (chatInput) {
        chatInput.focus();
      }

    }, 100);
  }


  function closeChat() {

    if (!chatBox) return;

    chatBox.setAttribute(
      "hidden",
      ""
    );

    if (chatToggle) {
      chatToggle.setAttribute(
        "aria-expanded",
        "false"
      );
    }
  }


  if (chatToggle) {

    chatToggle.addEventListener(
      "click",
      function (e) {

        e.stopPropagation();

        if (
          chatBox &&
          chatBox.hasAttribute("hidden")
        ) {
          openChat();
        } else {
          closeChat();
        }

      }
    );
  }


  if (chatClose) {

    chatClose.addEventListener(
      "click",
      closeChat
    );

  }


  /* =========================================
     AI CHAT RESPONSES
  ========================================= */

  function addMessage(text, type) {

    if (!chatMessages) return;

    const message =
      document.createElement("div");

    message.textContent = text;


    if (type === "user") {

      message.style.width = "max-content";
      message.style.maxWidth = "88%";
      message.style.margin =
        "0 0 8px auto";

      message.style.padding =
        "9px 11px";

      message.style.border =
        "1px solid rgba(230,205,248,.14)";

      message.style.borderRadius =
        "10px";

      message.style.color =
        "#eee7f0";

      message.style.background =
        "rgba(145,76,191,.18)";

      message.style.fontSize =
        "10px";

    } else {

      message.className =
        "bot-msg";

      message.style.marginBottom =
        "8px";
    }


    chatMessages.appendChild(
      message
    );

    chatMessages.scrollTop =
      chatMessages.scrollHeight;
  }


  function getAIResponse(question) {

    const q =
      question.toLowerCase();


    if (
      q.includes("enroll") ||
      q.includes("enrollment")
    ) {

      return "You can enroll with MountPeak Group by clicking the Enroll button. Enter your details and agreed amount in USD, then continue to payment.";

    }


    if (
      q.includes("profile") ||
      q.includes("submit") ||
      q.includes("resume") ||
      q.includes("apply")
    ) {

      return "Go to Submit Your Profile, complete your professional details and upload your resume.";

    }


    if (
      q.includes("job") ||
      q.includes("jobs") ||
      q.includes("career") ||
      q.includes("opening")
    ) {

      return "Visit the Jobs section to search available opportunities by role or skill and apply.";

    }


    if (
      q.includes("service") ||
      q.includes("solution") ||
      q.includes("technology") ||
      q.includes("it ")
    ) {

      return "MountPeak Group provides IT Solutions, Cloud & Digital, Software Solutions, Technology Consulting, Workforce Solutions and Professional Services.";

    }


    if (
      q.includes("payment") ||
      q.includes("pay") ||
      q.includes("card") ||
      q.includes("paypal")
    ) {

      return "After completing enrollment, you can continue to the secure Payment Center and select an available payment method.";

    }


    if (
      q.includes("contact") ||
      q.includes("email") ||
      q.includes("team")
    ) {

      return "You can contact the MountPeak Group team through the Contact section.";

    }


    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {

      return "Hi! Welcome to MountPeak Group. I can help you with Jobs, Services, Profile Submission, Enrollment and Contact.";

    }


    return "I can help you with Jobs, Services, Submit Profile, Enrollment, Payment and Contact. What would you like to know?";
  }


  function sendChat() {

    if (!chatInput) return;

    const text =
      chatInput.value.trim();

    if (!text) return;


    addMessage(
      text,
      "user"
    );

    chatInput.value = "";


    setTimeout(function () {

      addMessage(
        getAIResponse(text),
        "bot"
      );

    }, 350);
  }


  if (chatSend) {

    chatSend.addEventListener(
      "click",
      sendChat
    );

  }


  if (chatInput) {

    chatInput.addEventListener(
      "keydown",
      function (e) {

        if (e.key === "Enter") {

          e.preventDefault();

          sendChat();

        }

      }
    );

  }


  /* =========================================
     CHAT SUGGESTIONS
  ========================================= */

  document.querySelectorAll(
    ".chat-suggestions button"
  ).forEach(function (button) {

    button.addEventListener(
      "click",
      function () {

        const question =
          button.getAttribute("data-chat");

        if (!question) return;

        openChat();

        if (chatInput) {
          chatInput.value =
            question;
        }

        sendChat();

      }
    );

  });


  /* =========================================
     CLOSE AI ON OUTSIDE CLICK
  ========================================= */

  document.addEventListener(
    "click",
    function (e) {

      if (
        aiPanel &&
        aiToggle &&
        !aiPanel.contains(e.target) &&
        !aiToggle.contains(e.target)
      ) {

        aiPanel.setAttribute(
          "hidden",
          ""
        );

        aiToggle.setAttribute(
          "aria-expanded",
          "false"
        );

      }

    }
  );


  /* =========================================
     SMOOTH ANCHOR NAVIGATION
  ========================================= */

  document.querySelectorAll(
    'a[href^="#"]'
  ).forEach(function (link) {

    link.addEventListener(
      "click",
      function (e) {

        const target =
          link.getAttribute("href");

        if (
          !target ||
          target === "#"
        ) return;

        const element =
          document.querySelector(target);

        if (!element) return;

        e.preventDefault();

        element.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });

});
