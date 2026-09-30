document.addEventListener("DOMContentLoaded", () => {

  /* ================= MOBILE MENU ================= */

  const menuButton = document.getElementById("menuButton");
  const mainNav = document.getElementById("mainNav");

  if (menuButton && mainNav) {
    menuButton.addEventListener("click", () => {
      mainNav.classList.toggle("open");
    });

    mainNav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
      });
    });
  }


  /* ================= JOB SEARCH ================= */

  const jobSearch = document.getElementById("jobSearch");
  const jobType = document.getElementById("jobType");
  const jobList = document.getElementById("jobList");

  function filterJobs() {

    if (!jobList) return;

    const searchValue =
      jobSearch?.value.trim().toLowerCase() || "";

    const typeValue =
      jobType?.value.trim().toLowerCase() || "";

    const jobs = jobList.querySelectorAll("article");

    jobs.forEach(job => {

      const role =
        job.getAttribute("data-role")?.toLowerCase() || "";

      const jobText =
        job.textContent.toLowerCase();

      const matchesSearch =
        !searchValue ||
        role.includes(searchValue) ||
        jobText.includes(searchValue);

      const matchesType =
        !typeValue ||
        role.includes(typeValue);

      job.style.display =
        matchesSearch && matchesType
          ? ""
          : "none";

    });
  }

  if (jobSearch) {
    jobSearch.addEventListener("input", filterJobs);
  }

  if (jobType) {
    jobType.addEventListener("change", filterJobs);
  }


  /* ================= JOB APPLICATION ================= */

  const selectedJob = document.getElementById("selectedJob");

  document.querySelectorAll("[data-job]").forEach(link => {

    link.addEventListener("click", () => {

      const jobName =
        link.getAttribute("data-job") || "";

      if (selectedJob) {
        selectedJob.value = jobName;
      }

    });

  });


  /* ================= SMOOTH SCROLL ================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* ================= AI NAVIGATION ================= */

  const aiToggle =
    document.getElementById("aiToggle");

  const aiPanel =
    document.getElementById("aiPanel");

  if (aiToggle && aiPanel) {

    aiToggle.addEventListener("click", () => {

      const isHidden =
        aiPanel.hasAttribute("hidden");

      if (isHidden) {
        aiPanel.removeAttribute("hidden");
      } else {
        aiPanel.setAttribute("hidden", "");
      }

    });

  }


  /* ================= AI NAVIGATION LINKS ================= */

  document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

      const targetId =
        button.getAttribute("data-go");

      const target =
        document.querySelector(targetId);

      if (target) {

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }

      if (aiPanel) {
        aiPanel.setAttribute("hidden", "");
      }

    });

  });


  /* ================= AI CHAT ================= */

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

  }


  function closeChat() {

    if (!chatBox) return;

    chatBox.setAttribute("hidden", "");

  }


  function addUserMessage(message) {

    if (!chatMessages) return;

    const div =
      document.createElement("div");

    div.className = "user-msg";

    div.textContent = message;

    chatMessages.appendChild(div);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  }


  function addBotMessage(message) {

    if (!chatMessages) return;

    const div =
      document.createElement("div");

    div.className = "bot-msg";

    div.textContent = message;

    chatMessages.appendChild(div);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;

  }


  function getAIResponse(question) {

    const q =
      question.toLowerCase().trim();


    if (
      q.includes("job") ||
      q.includes("jobs") ||
      q.includes("vacancy") ||
      q.includes("opening")
    ) {

      return "You can view current opportunities in the Jobs section. Select a position and click Apply to submit your profile and resume.";

    }


    if (
      q.includes("profile") ||
      q.includes("resume") ||
      q.includes("cv")
    ) {

      return "You can submit your professional profile from the Submit Your Profile section. Complete the form and upload your PDF, DOC or DOCX resume.";

    }


    if (
      q.includes("service") ||
      q.includes("services")
    ) {

      return "MountPeak Group provides IT Solutions, Cloud & Digital services, Software Solutions, Technology Consulting, Workforce Solutions and Professional Services.";

    }


    if (
      q.includes("join") ||
      q.includes("enroll") ||
      q.includes("candidate")
    ) {

      return "To join MountPeak Group, complete the candidate profile form and submit your professional details and resume. Our team can then review your information.";

    }


    if (
      q.includes("employer") ||
      q.includes("business") ||
      q.includes("hire")
    ) {

      return "Employers can contact MountPeak Group to discuss technology, talent, workforce and business requirements.";

    }


    if (
      q.includes("contact") ||
      q.includes("email")
    ) {

      return "You can contact the MountPeak Group team at hr@mountpeakgroup.com.";

    }


    return "I can help you navigate MountPeak Group. You can ask me about jobs, submitting your profile, services, employers or contacting our team.";

  }


  function sendChatMessage(message) {

    if (!message || !message.trim()) {
      return;
    }

    const cleanMessage =
      message.trim();

    addUserMessage(cleanMessage);

    const response =
      getAIResponse(cleanMessage);

    setTimeout(() => {
      addBotMessage(response);
    }, 300);

  }


  if (chatToggle) {
    chatToggle.addEventListener("click", openChat);
  }


  if (chatClose) {
    chatClose.addEventListener("click", closeChat);
  }


  if (chatSend && chatInput) {

    chatSend.addEventListener("click", () => {

      const message =
        chatInput.value;

      sendChatMessage(message);

      chatInput.value = "";

    });


    chatInput.addEventListener("keydown", event => {

      if (event.key === "Enter") {

        event.preventDefault();

        const message =
          chatInput.value;

        sendChatMessage(message);

        chatInput.value = "";

      }

    });

  }


  /* ================= CHAT SUGGESTIONS ================= */

  document.querySelectorAll("[data-chat]").forEach(button => {

    button.addEventListener("click", () => {

      const message =
        button.getAttribute("data-chat");

      openChat();

      sendChatMessage(message);

    });

  });


  /* ================= CANDIDATE FORM ================= */

  const candidateForm =
    document.getElementById("candidateForm");

  if (candidateForm) {

    candidateForm.addEventListener("submit", () => {

      const submitButton =
        candidateForm.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {

        submitButton.textContent =
          "Submitting Profile...";

        submitButton.disabled = true;

      }

    });

  }


  /* ================= CONTACT FORM ================= */

  document.querySelectorAll(
    'form[action*="formsubmit.co"]'
  ).forEach(form => {

    if (form.id === "candidateForm") {
      return;
    }

    form.addEventListener("submit", () => {

      const submitButton =
        form.querySelector(
          'button[type="submit"]'
        );

      if (submitButton) {

        submitButton.textContent =
          "Sending...";

        submitButton.disabled = true;

      }

    });

  });


  /* ================= JOB APPLY BUTTON ================= */

  document.querySelectorAll(
    '#jobList [data-job]'
  ).forEach(link => {

    link.addEventListener("click", () => {

      const jobName =
        link.getAttribute("data-job");

      if (selectedJob && jobName) {
        selectedJob.value = jobName;
      }

    });

  });


  /* ================= CLOSE AI PANELS ================= */

  document.addEventListener("click", event => {

    if (
      aiPanel &&
      aiToggle &&
      !aiPanel.contains(event.target) &&
      !aiToggle.contains(event.target)
    ) {

      aiPanel.setAttribute("hidden", "");

    }

  });


  /* ================= YEAR ================= */

  const yearElements =
    document.querySelectorAll(
      "[data-current-year]"
    );

  yearElements.forEach(element => {

    element.textContent =
      new Date().getFullYear();

  });

});
