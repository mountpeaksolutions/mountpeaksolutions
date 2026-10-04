document.addEventListener("DOMContentLoaded", () => {

  /* =========================================================
     MOUNTPEAK GROUP — SUPABASE
     ========================================================= */

  const SUPABASE_URL = "https://yuarhxkntaojgkecwprp.supabase.co";
  const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_WVtRsGn1bzVBRdKi8u3_Tg__ga54oRd";

  let db = null;

  if (window.supabase) {
    const { createClient } = window.supabase;
    db = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );
  }


  /* =========================================================
     MOBILE MENU
     ========================================================= */

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


  /* =========================================================
     JOB SEARCH
     ========================================================= */

  const jobSearch = document.getElementById("jobSearch");
  const jobType = document.getElementById("jobType");
  const jobList = document.getElementById("jobList");

  function filterJobs() {
    if (!jobList) return;

    const searchValue = jobSearch
      ? jobSearch.value.toLowerCase().trim()
      : "";

    const typeValue = jobType
      ? jobType.value.toLowerCase().trim()
      : "";

    const cards = jobList.querySelectorAll(".job-card");

    cards.forEach(card => {
      const text = card.innerText.toLowerCase();
      const type = (
        card.dataset.type ||
        card.querySelector(".job-meta")?.innerText ||
        ""
      ).toLowerCase();

      const matchesSearch =
        !searchValue || text.includes(searchValue);

      const matchesType =
        !typeValue || type.includes(typeValue);

      card.style.display =
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


  /* =========================================================
     JOB APPLICATION — SELECT JOB
     ========================================================= */

  const selectedJob = document.getElementById("selectedJob");

  document.querySelectorAll("[data-job]").forEach(button => {

    button.addEventListener("click", () => {

      const jobName = button.dataset.job || "";

      if (selectedJob) {
        selectedJob.value = jobName;
      }

      setTimeout(() => {
        const profileSection =
          document.getElementById("profile");

        if (profileSection) {
          profileSection.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }
      }, 100);

    });

  });


  /* =========================================================
     SMOOTH SCROLL
     ========================================================= */

  document.querySelectorAll('a[href^="#"]').forEach(link => {

    link.addEventListener("click", event => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") return;

      const target =
        document.querySelector(targetId);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });


  /* =========================================================
     AI NAVIGATION
     ========================================================= */

  const aiToggle =
    document.getElementById("aiToggle");

  const aiPanel =
    document.getElementById("aiPanel");

  if (aiToggle && aiPanel) {

    aiToggle.addEventListener("click", () => {
      aiPanel.classList.toggle("open");
    });

  }

  document.querySelectorAll("[data-go]").forEach(button => {

    button.addEventListener("click", () => {

      const targetId =
        button.dataset.go;

      const target =
        document.getElementById(targetId);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth"
        });
      }

      if (aiPanel) {
        aiPanel.classList.remove("open");
      }

    });

  });


  /* =========================================================
     AI CHAT
     ========================================================= */

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


  function addChatMessage(message, type = "bot") {

    if (!chatMessages) return;

    const div =
      document.createElement("div");

    div.className =
      `chat-message ${type}`;

    div.textContent = message;

    chatMessages.appendChild(div);

    chatMessages.scrollTop =
      chatMessages.scrollHeight;
  }


  function getAIResponse(message) {

    const text =
      message.toLowerCase();

    if (
      text.includes("job") ||
      text.includes("jobs") ||
      text.includes("vacancy") ||
      text.includes("career")
    ) {
      return "You can explore current opportunities in the Jobs section and apply directly through MountPeak Group.";
    }

    if (
      text.includes("resume") ||
      text.includes("profile") ||
      text.includes("apply")
    ) {
      return "To apply, choose a job and complete the candidate profile form with your resume.";
    }

    if (
      text.includes("join") ||
      text.includes("enroll")
    ) {
      return "You can join MountPeak Group by completing the candidate profile form. There is no payment required on the website.";
    }

    if (
      text.includes("service") ||
      text.includes("employer") ||
      text.includes("business")
    ) {
      return "MountPeak Group provides technology, talent and business solutions for candidates and employers.";
    }

    if (
      text.includes("contact") ||
      text.includes("email")
    ) {
      return "You can contact MountPeak Group at hr@mountpeakgroup.com.";
    }

    return "Welcome to MountPeak Group. I can help you with jobs, applications, candidate profiles, services and contact information.";
  }


  function sendChatMessage() {

    if (!chatInput) return;

    const message =
      chatInput.value.trim();

    if (!message) return;

    addChatMessage(message, "user");

    chatInput.value = "";

    setTimeout(() => {
      addChatMessage(
        getAIResponse(message),
        "bot"
      );
    }, 400);

  }


  if (chatToggle && chatBox) {

    chatToggle.addEventListener("click", () => {
      chatBox.classList.toggle("open");
    });

  }

  if (chatClose && chatBox) {

    chatClose.addEventListener("click", () => {
      chatBox.classList.remove("open");
    });

  }

  if (chatSend) {
    chatSend.addEventListener(
      "click",
      sendChatMessage
    );
  }

  if (chatInput) {

    chatInput.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {
          event.preventDefault();
          sendChatMessage();
        }

      }
    );

  }


  /* =========================================================
     CANDIDATE APPLICATION
     ========================================================= */

  const candidateForm =
    document.getElementById("candidateForm");

  if (candidateForm) {

    candidateForm.addEventListener(
      "submit",
      async event => {

        event.preventDefault();

        if (!db) {
          alert(
            "Database connection is unavailable. Please try again."
          );
          return;
        }


        const submitButton =
          candidateForm.querySelector(
            'button[type="submit"], input[type="submit"]'
          );

        const originalText =
          submitButton
            ? submitButton.textContent
            : "";


        if (submitButton) {
          submitButton.disabled = true;
          submitButton.textContent =
            "Submitting Profile...";
        }


        try {

          const formData =
            new FormData(candidateForm);


          /* ---------- BASIC DETAILS ---------- */

          const fullName =
            formData.get("Full Name") ||
            formData.get("full_name") ||
            formData.get("name") ||
            "";

          const email =
            formData.get("Email") ||
            formData.get("email") ||
            "";

          const phone =
            formData.get("Phone") ||
            formData.get("phone") ||
            formData.get("Contact") ||
            "";

          const alternativePhone =
            formData.get("Alternative Phone") ||
            formData.get("alternative_phone") ||
            "";

          const address =
            formData.get("Address") ||
            formData.get("address") ||
            "";

          const appliedJob =
            formData.get("Applied Job") ||
            selectedJob?.value ||
            "";

          const applicationType =
            formData.get("Application Type") ||
            "General Candidate Profile";


          /* ---------- RESUME ---------- */

          const resume =
            formData.get("Resume");


          let resumePath = "";
          let resumeUrl = "";


          if (
            resume &&
            resume instanceof File &&
            resume.size > 0
          ) {

            const safeName =
              resume.name
                .replace(/[^a-zA-Z0-9._-]/g, "_");

            const timestamp =
              Date.now();

            const random =
              Math.random()
                .toString(36)
                .substring(2, 8);

            resumePath =
              `${timestamp}_${random}_${safeName}`;


            const uploadResult =
              await db.storage
                .from("Resume")
                .upload(
                  resumePath,
                  resume,
                  {
                    cacheControl: "3600",
                    upsert: false,
                    contentType:
                      resume.type ||
                      "application/octet-stream"
                  }
                );


            if (uploadResult.error) {
              throw uploadResult.error;
            }


            /*
              Bucket is private.
              Store the path in database.
              Admin dashboard can later create
              secure signed download URLs.
            */

            resumeUrl = resumePath;
          }


          /* ---------- DATABASE RECORD ---------- */

          const applicationRecord = {

            full_name: fullName,

            email: email,

            phone: phone,

            alternative_phone:
              alternativePhone,

            address: address,

            applied_job:
              appliedJob,

            application_type:
              applicationType,

            resume_url:
              resumeUrl,

            resume_path:
              resumePath,

            status:
              "New",

            notes:
              "",

            created_at:
              new Date().toISOString()

          };


          const {
            error: insertError
          } = await db
            .from("applications")
            .insert([
              applicationRecord
            ]);


          if (insertError) {
            throw insertError;
          }


          /* ---------- SUCCESS ---------- */

          alert(
            "Application submitted successfully! Our team will review your profile."
          );


          candidateForm.reset();


          if (selectedJob) {
            selectedJob.value = "";
          }


        } catch (error) {

          console.error(
            "Application submission error:",
            error
          );

          alert(
            "Unable to submit your application right now. Please try again."
          );

        } finally {

          if (submitButton) {
            submitButton.disabled = false;

            submitButton.textContent =
              originalText ||
              "Submit Profile";
          }

        }

      }
    );

  }


  /* =========================================================
     CONTACT FORM
     ========================================================= */

  document.querySelectorAll(
    ".contact form"
  ).forEach(form => {

    form.addEventListener(
      "submit",
      () => {

        const button =
          form.querySelector(
            'button[type="submit"], input[type="submit"]'
          );

        if (button) {
          button.disabled = true;
          button.textContent =
            "Sending...";
        }

      }
    );

  });


  /* =========================================================
     CHAT SUGGESTIONS
     ========================================================= */

  document.querySelectorAll(
    "[data-chat]"
  ).forEach(button => {

    button.addEventListener(
      "click",
      () => {

        const message =
          button.dataset.chat;

        if (!message) return;

        if (chatInput) {
          chatInput.value =
            message;
        }

        sendChatMessage();

      }
    );

  });

});
